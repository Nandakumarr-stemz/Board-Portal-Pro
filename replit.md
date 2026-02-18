# Stemz BoardSync - Board Portal Management System

## Overview

Stemz BoardSync is a secure board meeting management platform designed for executives. The application enables organizations to manage board meetings, documents, action items, and board member information through a professional enterprise dashboard interface.

The system follows Microsoft Fluent Design principles with a focus on executive clarity, document-centric workflows, and trust signals appropriate for confidential board communications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Build Tool**: Vite with React plugin

The frontend follows a page-based structure with shared components. Key pages include Dashboard, Meetings, Documents, Members, Action Items, and Settings. The application supports light/dark theme toggling with localStorage persistence.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Server**: HTTP server with development HMR support via Vite middleware
- **API Pattern**: RESTful JSON APIs under `/api/*` prefix
- **Validation**: Zod schemas for request validation with drizzle-zod integration

The server uses a storage abstraction layer (`IStorage` interface) that separates data access logic from route handlers, enabling flexible database implementations.

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Drizzle Kit with `db:push` command for schema synchronization
- **Connection**: Node.js pg Pool with connection string from `DATABASE_URL` environment variable

Core entities: Users, BoardMembers, Meetings, Documents, ActionItems, AgendaItems

### Project Structure
```
client/           # React frontend application
  src/
    components/   # Reusable UI components
    pages/        # Route-based page components
    hooks/        # Custom React hooks
    lib/          # Utility functions and query client
server/           # Express backend
  routes.ts       # API route definitions
  storage.ts      # Data access layer
  db.ts           # Database connection
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schema and Zod types
```

### Design System
The application implements a custom design system based on Microsoft Fluent Design:
- Typography: Inter font family with defined scale (12px-32px)
- Spacing: Tailwind units (3, 4, 6, 8, 12, 16)
- Layout: 12-column grid with 280px fixed sidebar
- Components: shadcn/ui with new-york style variant and neutral base color

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage for PostgreSQL

### UI Libraries
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **Lucide React**: Icon library
- **embla-carousel-react**: Carousel functionality
- **react-day-picker**: Date picker component
- **cmdk**: Command menu component
- **vaul**: Drawer component

### Form Handling
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Zod resolver for form validation

### Data & Utilities
- **date-fns**: Date formatting and manipulation
- **class-variance-authority**: Component variant management
- **clsx/tailwind-merge**: Conditional class name utilities