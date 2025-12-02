# PinterestMini

A Pinterest-inspired image sharing platform built with ASP.NET Core and React.

## Features

- **Pin Management** - Upload and organize images
- **Boards** - Create collections to organize your pins
- **Social** - Like, comment, and follow other users
- **Discovery** - Search and explore content by tags
- **Feed** - See pins from people you follow
- **Tags** - Organize and find content with hashtags
- **Multi-Board Saves** - Save pins to multiple boards
- **Cloud Storage** - Image uploads via AWS S3
- **Authentication** - JWT-based auth with ASP.NET Identity

## Tech Stack

**Frontend:**
- React 19, React Router 7
- Redux Toolkit
- Bootstrap 5
- Framer Motion
- Masonry layout

**Backend:**
- ASP.NET Core 8.0 Web API
- Entity Framework Core with PostgreSQL
- ASP.NET Identity & JWT
- AutoMapper, FluentValidation
- AWS S3
- Repository + Unit of Work pattern

## Demo

*https://nak1ro.github.io/PinterestMini/*

## Setup

```bash
# Clone
git clone https://github.com/nak1ro/PinterestMini.git
cd PinterestMini

# Backend
cd backend/PinterestMini.API
dotnet restore
# Configure appsettings.json with database, JWT, AWS, and CORS settings
dotnet ef database update
dotnet run

# Frontend
cd frontend
npm install
# Set REACT_APP_API_URL in .env
npm start
```

Visit `https://nak1ro.github.io/PinterestMini/`

## Configuration

**Backend** (`appsettings.json`):
- PostgreSQL connection string
- JWT settings (Issuer, Audience, SigningKey)
- AWS S3 credentials (Region, BucketName, AccessKey, SecretKey)
- CORS origins

**Frontend** (`.env`):
- `REACT_APP_API_URL` - Backend API endpoint

## Implementation Highlights

### Backend

**Repository Pattern** - Layered architecture with Unit of Work for transaction management and dependency injection for loose coupling.

**Entity Relationships** - Many-to-many relationships between Pins, Boards, Tags, and Users with automatic cleanup of related data (comments, likes) and tag usage tracking.

**Data Access** - Pagination, filtering, and optimized queries with eager loading. Feed system fetches content from followed users efficiently.

### Frontend

**Custom Hooks** - `useAsync` for async operations with cleanup and `createCrudHook` factory for CRUD operations. Reduces boilerplate and provides consistent loading/error states.

**State Management** - Redux for global state (auth with localStorage, search) and custom hooks for feature-specific data. Minimizes prop drilling.

**Masonry Layout** - Responsive grid with dynamic columns that adapt to screen size. Uses `imagesLoaded` to prevent layout shifts.

**Auth Interceptors** - Axios interceptors automatically attach JWT tokens from localStorage to requests.

**Protected Routes** - Route protection with conditional layouts and redirect handling.

**File Uploads** - Drag-and-drop image uploads with React Dropzone, progress indicators, and preview.

