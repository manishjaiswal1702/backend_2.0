import express from 'express';
import morgan from 'morgan';
import { createProxyMiddleware } from "http-proxy-middleware";
import http from 'http';
import { createProxyServer } from 'httpxy';

const app = express();
app.use(morgan('combined'));

app.get('/api/status/healthz', (req, res) => {
    res.status(200).json({ status: 'ok' });
})

app.get('/api/status/readyz', (req, res) => {
    res.status(200).json({ status: 'ready' });
})

const proxies = {}
const agentProxies = {}

function getProxy(sandboxId) {
    const target = `http://sandbox-service-${sandboxId}`;
    if (!proxies[sandboxId]) {
        proxies[sandboxId] = createProxyMiddleware({
            target,
            changeOrigin: true,
        });
    }
    return proxies[sandboxId];
}

function getAgentProxy(sandboxId) {
    const target = `http://sandbox-service-${sandboxId}:3000`;
    if (!agentProxies[sandboxId]) {
        agentProxies[sandboxId] = createProxyMiddleware({
            target,
            changeOrigin: true,
        });
    }
    return agentProxies[sandboxId];
}

// Single httpxy proxy server for all WebSocket upgrades
const wsProxy = createProxyServer({ changeOrigin: true });
wsProxy.on('error', (err, req, socket) => {
    console.error('WS proxy error:', err.message);
    socket?.destroy();
});

function parseHostHeader(hostHeader) {
    if (!hostHeader) return null;
    return hostHeader.split(':')[0];
}

function parsePathRoute(url) {
    const parts = url?.split('/') || [];
    if (parts[1] === 'agent' && parts[2]) {
        const sandboxId = parts[2];
        const newPath = url.replace(`/agent/${sandboxId}`, '') || '/';
        return { type: 'agent', sandboxId, path: newPath };
    }
    if (parts[1] === 'preview' && parts[2]) {
        const sandboxId = parts[2];
        const newPath = url.replace(`/preview/${sandboxId}`, '') || '/';
        return { type: 'preview', sandboxId, path: newPath };
    }
    return null;
}

app.use((req, res, next) => {
    const host = parseHostHeader(req.headers.host);
    const pathRoute = parsePathRoute(req.url);

    if (pathRoute) {
        req.url = pathRoute.path;
        if (pathRoute.type === 'agent') {
            return getAgentProxy(pathRoute.sandboxId)(req, res, next);
        }
        if (pathRoute.type === 'preview') {
            return getProxy(pathRoute.sandboxId)(req, res, next);
        }
    }

    if (!host) {
        return res.status(400).send('Missing host header');
    }

    const hostParts = host.split('.')
    if (hostParts[1] === 'agent') {
        return getAgentProxy(hostParts[0])(req, res, next);
    } else if (hostParts[1] === 'preview') {
        return getProxy(hostParts[0])(req, res, next);
    }

    return res.status(404).send('Route not found');
});

// Create the HTTP server explicitly
const server = http.createServer(app);

server.on('upgrade', (req, socket, head) => {
    const host = parseHostHeader(req.headers.host);
    const pathRoute = parsePathRoute(req.url);

    socket.on('error', () => socket.destroy());

    if (pathRoute) {
        req.url = pathRoute.path;
        if (pathRoute.type === 'agent') {
            return wsProxy.ws(req, socket, { target: `http://sandbox-service-${pathRoute.sandboxId}:3000` }, head)
                .catch(() => socket.destroy());
        }
        if (pathRoute.type === 'preview') {
            return wsProxy.ws(req, socket, { target: `http://sandbox-service-${pathRoute.sandboxId}` }, head)
                .catch(() => socket.destroy());
        }
    }

    if (!host) { socket.destroy(); return; }

    const hostParts = host.split('.');
    const sandboxId = hostParts[0];
    const type = hostParts[1];

    console.log(`WS upgrade request: ${req.url}, ${host}, sandboxId: ${sandboxId}, type: ${type}`);

    if (type === 'agent') {
        wsProxy.ws(req, socket, { target: `http://sandbox-service-${sandboxId}:3000` }, head)
            .catch(() => socket.destroy());
    } else if (type === 'preview') {
        wsProxy.ws(req, socket, { target: `http://sandbox-service-${sandboxId}` }, head)
            .catch(() => socket.destroy());
    } else {
        socket.destroy();
    }
});

export default server; // export server, not app