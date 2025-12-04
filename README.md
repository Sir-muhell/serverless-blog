# 🚀 Blog Platform - Fullstack Monorepo

A modern, high-performance blog platform built with the MERN stack principles adapted for a Serverless-First architecture on AWS.

## Category

**Status**

**Frontend:** React, TypeScript, Vite, Tailwind CSS  
**Backend:** AWS Lambda (Node.js/Express), API Gateway  
**Database:** MongoDB Atlas  
**API Base URL:** https://4meu2ql7zc.execute-api.us-east-1.amazonaws.com  
**Repository:** https://github.com/yourusername/blog-platform

## 🏗️ Architecture Overview

The platform adopts a decoupled, serverless microservices approach, providing infinite horizontal scaling and operational simplicity.

The system design leverages cloud-native services to abstract infrastructure management, allowing developers to focus purely on application logic.

```
Client (Browser)
┌─────────────────────────────┐
│ React + TypeScript Frontend │
│ • Vite Build Tool           │
│ • Tailwind CSS              │
│ • React Query               │
└─────────────────────────────┘
          │ HTTPS / WSS
          ▼
  AWS API Gateway (HTTP API v2)
│ • Auth/Authorization        │
│ • Request Routing           │
│ • CORS Management           │
          │ Invocation
          ▼
  AWS Lambda (Node.js 20.x)
│ • Express.js Application    │
│ • REST API Controllers      │
│ • JWT Auth Middleware       │
│ • Mongoose Data Layer       │
          │ Connection Pool
          ▼
  MongoDB Atlas Cluster
│ • Fully Managed Service      │
│ • Automatic Backups & Scaling│
│ • Geographically Distributed │
```

## 📋 Features

- **Serverless Backend:** Auto-scaling with AWS Lambda and API Gateway.
- **Modern Frontend:** React, TypeScript, Vite.
- **Secure Authentication:** Stateless JWT with role-based permissions.
- **Beautiful UI:** Tailwind CSS responsive design.
- **Optimized Performance:** React Query for caching and server state management.

## 🛠️ Setup Instructions

### Prerequisites

- Node.js: 20.x or higher
- pnpm: 8.x or higher (`npm install -g pnpm`)
- AWS CLI: Configured with credentials
- AWS CDK/Serverless Framework: (`npm install -g aws-cdk` or `npm install -g serverless`)
- MongoDB Atlas account and cluster

### Step 1: Clone and Install

```bash
git clone https://github.com/yourusername/blog-platform.git
cd blog-platform
pnpm install
npm install -g aws-cdk
```

### Step 2: Configure Backend (server/)

```bash
cd server
cp serverless.env.yml.example serverless.env.yml
nano serverless.env.yml
```

Example `serverless.env.yml`:

```yaml
dev:
  MONGODB_URI: "mongodb+srv://username:password@cluster.mongodb.net/blog?retryWrites=true&w=majority"
  JWT_SECRET: "your-super-secret-jwt-key-minimum-32-characters"
  DB_NAME: "blog-platform"
  JWT_EXPIRY: "7d"
```

### Step 3: Configure Frontend (frontend/)

```bash
cd ../frontend
cp .env.example .env
nano .env
```

Example `.env`:

```env
VITE_API_BASE_URL=url
VITE_APP_NAME=Blog Platform
```

### Step 4: Development

Run services concurrently or individually:

```bash
# From project root

pnpm dev:frontend
pnpm dev:server
```

## 📁 Project Structure

```
blog-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── types/
│   └── package.json
├── server/
│   ├── src/
│   │   ├── handlers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── utils/
│   │   └── types/
│   ├── serverless.yml
│   └── package.json
├── packages/
│   └── shared-types/
├── package.json
└── pnpm-workspace.yaml
```

## 🔧 API Endpoints

**Authentication**

| Method | Path           | Description                       |
| ------ | -------------- | --------------------------------- |
| POST   | /auth/register | Register a new user               |
| POST   | /auth/login    | Authenticate and get JWT          |
| GET    | /auth/profile  | Get profile of authenticated user |

**Blog Posts**

| Method | Path          | Description                    | Access       |
| ------ | ------------- | ------------------------------ | ------------ |
| GET    | /posts        | Get all published posts        | Public       |
| GET    | /posts/{id}   | Get specific post              | Public/Auth  |
| POST   | /posts        | Create a new post              | Author/Admin |
| PUT    | /posts/{id}   | Update an existing post        | Author/Admin |
| DELETE | /posts/{id}   | Delete a post                  | Admin        |
| GET    | /posts/drafts | Get all drafts by current user | Author       |

## 🏗️ Key Design Decisions

- **Serverless-First:** AWS Lambda + API Gateway for scalability and cost efficiency.
- **Monorepo (pnpm):** Centralized tooling, type-safe shared interfaces.
- **TypeScript Everywhere:** Strict mode for code quality.
- **JWT Authentication:** Stateless and serverless friendly.
- **MongoDB Atlas:** Managed, globally distributed NoSQL database.

## 🚀 Deployment

**Backend (AWS Lambda)**

```bash
cd server
sls deploy --stage dev
```

**Frontend (Vercel/Netlify/S3)**

## 🔒 Security Considerations

- Secrets: Use AWS Parameter Store or Secrets Manager
- API Security: Rate limiting and CORS
- Frontend Security: Content Security Policy (CSP)

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make changes & ensure tests pass (`pnpm test`)
4. Submit a pull request with clear description
