# 🚀 Express TypeScript API

![CI](https://github.com/HakimBe/typer/actions/workflows/ci.yml/badge.svg)
![Lint](https://img.shields.io/badge/code%20style-eslint-blue?logo=eslint)

A modern, secure, and testable Node.js REST API using:

- ✅ TypeScript
- ✅ Express
- ✅ MongoDB with Mongoose
- ✅ JWT Authentication
- ✅ Role-based access (`admin` / `regular`)
- ✅ Jest + Supertest for full testing
- ✅ ESLint for static analysis
- ✅ GitHub Actions for CI
- ✅ Docker support

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- MongoDB 8 (locally or via Docker)

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Runs with `ts-node-dev`, watches for file changes.

---

## 🔐 Authentication & Roles

The app uses JWT-based authentication and supports two user roles:

| Role      | Permissions                            |
| --------- | -------------------------------------- |
| `admin`   | Access all users, full CRUD            |
| `regular` | Access only their own user information |

---

## 🧪 Testing

```bash
npm test              # Run tests
npm run test:coverage # Run tests with coverage report
```

Uses:

- `jest`
- `supertest`
- `mongodb-memory-server` (in-memory MongoDB for test isolation)

---

## 🧼 Code Style & Linting

```bash
npm run lint       # Check for lint errors
npm run lint:fix   # Automatically fix errors
```

Linting uses:

- `ESLint`
- `@typescript-eslint`

---

## 🐳 Docker Support

### Build the Docker Image

```bash
docker build -t express-api .
```

### Run the Container

```bash
docker run -p 3000:3000 express-api
```

### Optional: Use Docker Compose

If you want to run MongoDB and your app together:

```yaml
# docker-compose.yml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mongo
    environment:
      - MONGO_URI=mongodb://mongo:27017/express-ts-api
      - JWT_SECRET=supersecret

  mongo:
    image: mongo:8
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Run it with:

```bash
docker-compose up --build
```

---

## 🗂 Folder Structure

```
src/
├── config/           # MongoDB connection
├── controllers/      # Route logic
├── middleware/       # Auth, role-based access
├── models/           # Mongoose schemas
├── routes/           # Express routers
├── tests/            # Setup and utils
└── index.ts          # App entry point
```

---

## ⚙️ GitHub Actions CI

CI is configured to:

- ✅ Install dependencies
- ✅ Lint code
- ✅ Run tests
- ✅ Generate coverage report
- ✅ Upload coverage as artifact

Badge:  
![CI](https://github.com/HakimBe/typer/actions/workflows/ci.yml/badge.svg)

> Optional: integrate with Codecov or Coveralls to get a coverage badge.

---

## ✅ TODO

- [x] JWT auth
- [x] Role-based access
- [x] GitHub Actions CI
- [x] ESLint & Code Style
- [x] In-memory MongoDB testing
- [ ] Coverage badge (Codecov)
- [ ] Deployment workflow (Docker/Kubernetes/Vercel/etc.)

---

## 📄 License

MIT
