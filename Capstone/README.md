# Capstone Project

## What this project is

This Capstone project is a cloud-ready AI platform that lets users sign in, create sandboxed projects, and run AI-powered frontend tools in isolated Kubernetes environments. It is built as a set of cooperating services, each handling one part of the system:

- user authentication
- notification delivery
- AI orchestration
- sandbox lifecycle management
- frontend interface
- Kubernetes deployment and routing

## Main parts of the project

### 1. Frontend

The `frontend/` folder contains a React + Vite app. It is the user interface for the platform and is built to connect to the backend APIs.

### 2. Auth service

The `auth/` service handles user login with Google OAuth and JWT-based authentication. It stores user data in MongoDB and emits login events to a queue.

### 3. Notification service

The `notification/` service listens for authentication events from RabbitMQ and sends email notifications when users log in.

### 4. AI orchestration service

The `ai-orchestration/` service uses LangChain and the Mistral AI model to run agent workflows. It exposes an API for invoking AI agents and returning streamed responses.

### 5. Sandbox environment

The `sandbox/` folder contains the sandbox system for creating temporary developer environments:

- `sandbox/server/` manages project creation, sandbox startup, and Kubernetes pod/service creation
- `sandbox/router/` acts as a reverse proxy and handles subdomain routing for sandbox preview and agent access
- `sandbox/agent/` includes authentication support and OAuth callbacks used by the sandbox
- `sandbox/sync-agent/` is used for synchronizing files and seeding sandbox workspaces
- `sandbox/template/` provides the starter workspace image used inside sandbox pods

### 6. Kubernetes support

The `k8s/` folder contains Kubernetes manifests for deploying the services as Pods, Deployments, Services, and Ingress rules. This includes:

- `auth`, `notification`, `ai`, `router`, and `sandbox` deployments
- service definitions for internal communication
- ingress rules to route API and preview requests
- secrets and RBAC configuration

## How the system works

1. A user opens the frontend and signs in with Google.
2. The auth service validates the user and creates a session token.
3. When a new project is created, the sandbox server provisions a sandbox pod and service on Kubernetes.
4. The router forwards browser traffic to the correct sandbox preview or agent endpoint based on subdomain.
5. The AI orchestration service accepts user messages and runs AI agents with LangChain.
6. When authentication happens, the auth service publishes a message to RabbitMQ and the notification service sends an email.

## Why it matters

This project brings together several modern cloud and AI concepts:

- microservice architecture with multiple backend services
- Kubernetes-based sandbox provisioning
- AI agent orchestration with LangChain and Mistral
- Google authentication and secure session handling
- event-driven notifications with RabbitMQ
- React-based frontend interface

## Useful files

- `k8s/` – Kubernetes deployment and service configuration
- `skaffold.yml` – local or cluster deployment automation
- `skaffold-eks.yaml` – AWS EKS deployment settings
- `frontend/` – user-facing React application
- `auth/` – authentication and user management service
- `notification/` – email notification service
- `ai-orchestration/` – AI agent orchestration service
- `sandbox/` – sandbox lifecycle, routing, and sync components

## Getting started

There is not a single install script in this repository, but the project is designed to run as separate Node.js services and Kubernetes workloads. The main steps are:

1. Install dependencies in each service folder.
2. Configure environment variables for each service.
3. Deploy the services with Kubernetes using the manifests in `k8s/`.
4. Run the React frontend and point it to the backend API.

---

This README describes the Capstone project structure and how the pieces work together. It is intended for anyone who wants to understand the application and the roles of each service.