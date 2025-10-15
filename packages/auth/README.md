# @workspace/auth

A comprehensive authentication package built on top of [Better Auth](https://www.better-auth.com/) for the build-elevate template. This package provides a complete authentication solution with support for email/password authentication and Google OAuth, seamlessly integrated with PostgreSQL and Prisma.

---

## Features

- 🔐 **Email & Password Authentication** - Secure credential-based authentication
- ✉️ **Email Verification** - Required email verification for new accounts
- 🌐 **Google OAuth Integration** - One-click social login
- 🔐 **Two-Factor Authentication (2FA)** - Additional security layer for user accounts
- 🗄️ **PostgreSQL Database** - Persistent session storage via Prisma
- ⚡ **Better Auth Integration** - Modern, type-safe authentication library
- 🎯 **TypeScript Support** - Full type safety throughout
- 🔄 **Next.js Integration** - Ready-to-use API handlers and middleware

---

## Installation

This package is part of the workspace and is automatically available to other packages:

```json
{
  "dependencies": {
    "@workspace/auth": "workspace:*"
  }
}
```

---

## Environment Variables

The following environment variables are required in [apps/web/.env](../../apps/web/.env.example):

```bash
# Required for Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Base URL for your application (used by auth client)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database connection (inherited from @workspace/db)
DATABASE_URL=postgresql://username:password@localhost:5432/database

# Email configuration (inherited from @workspace/email)
RESEND_TOKEN=your-resend-api-token
RESEND_EMAIL_FROM=noreply@yourdomain.com
```

---
