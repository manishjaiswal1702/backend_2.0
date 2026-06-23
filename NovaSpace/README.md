# 🌌 NovaSpace

**NovaSpace** is a cloud-native, microservices-based platform designed to provision dynamic, isolated developer sandboxes on-demand. Through a unified, beautiful Web IDE interface, users can create projects, browse workspace files, view real-time frontend previews, interact with a live containerized web terminal (PTY), and utilize an integrated AI Agent helper (powered by Mistral AI via LangGraph) to automatically build, write, and modify React code directly inside their workspaces.

All developer environments run inside isolated Kubernetes environments, supported by persistent file synchronization to AWS S3, message-queue notification delivery, and secure Google OAuth integration.

---

## 🏗️ System Architecture

The following diagram illustrates how the core microservices and infrastructure components of NovaSpace coordinate to securely manage and serve isolated developer sandboxes:

```mermaid
graph TD
    User([User Browser]) -->|UI / Interactions| FE[Frontend - React/Vite]
    User -->|Accesses Sandboxes| SR[Sandbox Router]
    
    %% API Requests
    FE -->|Google login & JWT Auth| Auth[Auth Service]
    FE -->|AI prompts & commands| AI[AI Orchestration Service]
    FE -->|Requests project sandboxes| SS[Sandbox Server]
    
    %% Backend Integrations
    Auth -->|Publish login event| MQ[(RabbitMQ)]
    Auth -->|User persistence| DB[(MongoDB)]
    MQ -->|Consume event| NS[Notification Service]
    NS -->|Send OAuth email| Email[Gmail API / SMTP]
    
    %% AI Orchestration Connections
    AI -->|Agent Tools list/read/write| SR
    AI -->|AI reasoning| Mistral[Mistral AI API]
    
    %% Sandbox Infrastructure
    SS -->|Dynamic Pod Provisioning| K8s[Kubernetes API]
    SS -->|Store active sessions| Redis[(Redis Cache)]
    
    %% Dynamic Sandbox Pod
    subgraph Sandbox Pod [Kubernetes Sandbox Pod]
        Init[Init Container - Seed Workspace]
        SC[Sandbox Container - Vite App dev server]
        AC[Agent Container - Express API & PTY server]
        SA[Sync-Agent - Chokidar file sync]
    end
    
    K8s -->|Spawns| Sandbox Pod
    SR -->|Route HTTP/WS Preview| SC
    SR -->|Route HTTP/WS Terminal & API| AC
    SA -->|Persist state| S3[(AWS S3 Bucket)]
    
    classDef service fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef storage fill:#efebe9,stroke:#3e2723,stroke-width:2px;
    classDef external fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef cluster fill:#f1f8e9,stroke:#33691e,stroke-width:2px;
    
    class FE,Auth,AI,SS,NS,SR service;
    class DB,Redis,MQ,S3 storage;
    class Mistral,Email external;
    class Sandbox Pod,Init,SC,AC,SA cluster;
```

---

## 🚀 Key Features

* **Dynamic Sandboxing on Kubernetes**: Every time a user opens a project, NovaSpace provisions a custom Kubernetes Pod and Service dynamically. Sandboxes are split into separate functional containers:
  * **Dev Server Container** (`template` image): Launches a React + Vite application development server on port 5173.
  * **Agent API Container** (`agent` image): Exposes endpoints for file management and hosts a secure websocket terminal on port 3000.
  * **S3 Sync Container** (`sync-agent` image): Monitors the `/workspace` directory via Chokidar and synchronizes code edits in real-time to Amazon S3 for persistent project history.
* **Intelligent AI Orchestration (FrontendForge)**: Integrated AI coding agent built with LangChain and LangGraph. The agent connects to Mistral AI (`mistral-large-latest`), reasons through user prompts, and uses custom filesystem tools (`list_files`, `read_files`, `update_files`) to read and modify codebase templates interactively.
* **Unified Web IDE**: A premium, responsive interface styled with glassmorphism, fluid animations, and custom typography:
  * **File Explorer**: Explore, view, edit, and create workspace files dynamically.
  * **Live Preview Frame**: A real-time nested preview panel displaying the active development site.
  * **PTY Terminal**: A fully interactive, low-latency web console linked directly to the sandbox shell via xterm.js and WebSockets.
  * **AI Chat Side-panel**: Chat directly with the coding agent, viewing live activity steps (e.g. "Reading files", "Updating files") as changes are made.
* **Secure Google OAuth2 Login**: Microservice-based JWT authentication utilizing Google OAuth 2.0 to authenticate developers and isolate their respective projects in MongoDB.
* **Event-Driven Messaging & Notifications**: Auth login events are published to RabbitMQ (`auth_notification_queue`) and consumed by a separate Notification service, sending confirmation emails using Nodemailer with secure Gmail OAuth2 parameters.
* **Cluster Deployment Orchestration**: Pre-configured Skaffold workflow (`skaffold.yml`) supporting hot-reloading code sync, build pipelines, and declarative deployment to local or remote Kubernetes clusters.

---

## 🛠️ Technology Stack

| Layer | Technologies & Frameworks | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, `@xterm/xterm`, Socket.io Client | Primary user interface & workspace environment. |
| **API Gateway / Router** | Express, `http-proxy-middleware`, `httpxy` (reverse proxy and WebSocket routing) | Resolves hostnames like `<id>.preview.localhost` and `<id>.agent.localhost` and routes them to correct sandbox endpoints. |
| **Auth & Notifications** | Passport.js, Google OAuth 2.0, JWT, Nodemailer, RabbitMQ (`amqplib`) | Handles Google OAuth login, issues JWT, publishes auth events, and delivers notification emails. |
| **AI Orchestration** | LangChain, LangGraph, Mistral AI SDK (`mistral-large-latest`), Axios | Orchestrates the agent workflow, invokes Mistral AI, and interfaces with the sandbox agent. |
| **Sandbox Runtime** | Kubernetes Client-Node SDK, node-pty, Chokidar, AWS SDK S3 client | Controls Pod creation on Kubernetes, runs interactive server-side terminal shell, watches for file changes, and synchronizes with S3. |
| **Databases & Cache** | MongoDB (Mongoose), Redis (ioredis cache database for TTL-based session routing) | Persists user metadata, project configurations, and updates access activity to clean up idle sandboxes. |
| **Infrastructure & CI/CD** | Docker, Kubernetes, Skaffold | Builds microservice images, configures secrets, and runs hot-reloading deployment pipelines. |

---

## 📂 Directory Structure & Services

* [**`frontend/`**](file:///c:/Users/manis/OneDrive/Desktop/backend-2.0/NovaSpace/frontend): React application serving as the primary IDE. Communicates with auth, sandbox, and AI API endpoints. Includes customizable dashboard panels.
* [**`auth/`**](file:///c:/Users/manis/OneDrive/Desktop/backend-2.0/NovaSpace/auth): The user authentication microservice. Handles login, MongoDB user records, JWT issuance, and dispatches message-queue events.
* [**`notification/`**](file:///c:/Users/manis/OneDrive/Desktop/backend-2.0/NovaSpace/notification): An event-driven mail notifier. Listens to RabbitMQ to dispatch secure verification/security login notifications to users.
* [**`ai-orchestration/`**](file:///c:/Users/manis/OneDrive/Desktop/backend-2.0/NovaSpace/ai-orchestration): Manages LangGraph workflows. Runs AI logic to translate natural language directions into automated React components inside the user's workspace.
* [**`sandbox/`**](file:///c:/Users/manis/OneDrive/Desktop/backend-2.0/NovaSpace/sandbox): Core orchestration for developer spaces:
  * [`sandbox/server/`](file:///c:/Users/manis/OneDrive/Desktop/backend-2.0/NovaSpace/sandbox/server): Creates Kubernetes resources (Pods, Services) for active projects and manages Redis sessions.
  * [`sandbox/router/`](file:///c:/Users/manis/OneDrive/Desktop/backend-2.0/NovaSpace/sandbox/router): Proxy router forwarding `<id>.preview.localhost` and `<id>.agent.localhost` requests.
  * [`sandbox/agent/`](file:///c:/Users/manis/OneDrive/Desktop/backend-2.0/NovaSpace/sandbox/agent): The daemon running inside the sandbox pod. Exposes local REST/WS endpoints for file system access and terminal commands.
  * [`sandbox/sync-agent/`](file:///c:/Users/manis/OneDrive/Desktop/backend-2.0/NovaSpace/sandbox/sync-agent): The background agent backing up developer workspaces continuously to S3.
  * [`sandbox/template/`](file:///c:/Users/manis/OneDrive/Desktop/backend-2.0/NovaSpace/sandbox/template): Boilerplate image structure loaded into every fresh developer sandbox.
* [**`k8s/`**](file:///c:/Users/manis/OneDrive/Desktop/backend-2.0/NovaSpace/k8s): Declarative Kubernetes configurations defining Deployments, ClusterIPs, Ingresses, Secrets, and RBAC rules.

---

## ⚙️ Environment Configuration

NovaSpace requires several environment configurations defined in Kubernetes Secrets. Below is a comprehensive reference to setup credentials (see details in [secrets.yml](file:///c:/Users/manis/OneDrive/Desktop/backend-2.0/NovaSpace/k8s/secrets.yml)):

### 1. Databases & Queue Credentials (`secrets.yml` -> `database`)
* `AUTH` / `SANDBOX` / `AI`: Connection strings for MongoDB clusters (handles user tables, sandbox projects, logs).
* `REDIS_URL`: Redis URI to track sandbox session routing timeouts.
* `RABBITMQ_URL`: AMQPS connection string for queuing auth notifications.

### 2. Authentication Secrets (`secrets.yml` -> `jwt` & `google`)
* `JWT_SECRET`: Signing token for user authentication.
* `GOOGLE_CLIENT_ID`: OAuth client id for Google login.
* `GOOGLE_CLIENT_SECRET`: Google developer application secret.
* `GOOGLE_REFRESH_TOKEN`: Gmail OAuth refresh token to enable Nodemailer emails.
* `EMAIL_USER`: Sender account (Gmail handle) sending safety alerts.

### 3. AI Orchestration (`secrets.yml` -> `ai-secret`)
* `MISTRAL_API_KEY`: API key for invoking Mistral Large model workflows.

### 4. AWS S3 Integration (`secrets.yml` -> `aws`)
* `AWS_REGION` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`: Credentials for syncing workspace file states to the persistent S3 bucket (`capstone-bucket-1802`).

---

## 🚀 Getting Started

### Prerequisites
* **Docker & Kubernetes**: Ensure Docker Desktop (with Kubernetes enabled) or Minikube is active.
* **Skaffold**: Install Skaffold CLI locally.
* **Hosts Entry**: Add the following routing rule to your local host configuration to support routing subdomains locally:
  * On Unix/macOS (typically `/etc/hosts`) or Windows (typically `C:\Windows\System32\drivers\etc\hosts`):
    ```text
    127.0.0.1 localhost *.preview.localhost *.agent.localhost
    ```

### Deploying via Skaffold
To run the entire system in hot-reload development mode:
```bash
skaffold dev
```
Skaffold will automatically build local Dockerfiles, configure resource permissions, deploy microservices, and mount real-time sync handlers.

Once running:
1. Open your browser to the local application host: `http://localhost:5173` (or the mapped Ingress host).
2. Login via Google to access your dashboard.
3. Create or load a project to provision a sandbox, launching your isolated workspace.