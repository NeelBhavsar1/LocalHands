# LocalHands Frontend

A Next.js 16 application for connecting local service providers with customers. Built with React 19, Leaflet maps, and i18n internationalization.

## Features

- **User Authentication** - Login, signup, and forgot password with PIN verification
- **Service Listings** - Create, edit, delete service listings with photo uploads
- **Location Picker** - Interactive Leaflet map for setting service locations
- **Internationalization** - Multi-language support (EN, FR, ES, DE)
- **Responsive Design** - Mobile-first CSS modules

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **UI:** React 19, Framer Motion, Lucide React
- **Maps:** Leaflet + React-Leaflet
- **HTTP:** Axios
- **i18n:** i18next + react-i18next
- **Theming:** next-themes

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running (see `../localhands-backend`)

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` in the root directory:

**For Local Development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_IMAGE_URL=http://localhost:8080
```

**For Production:**
```env
NEXT_PUBLIC_API_URL={your own hosted backend URL}
NEXT_PUBLIC_IMAGE_URL={your own Amazon S3 Bucket URL} 
```

**Environment Variable Details:**
- `NEXT_PUBLIC_API_URL` - Used for API calls and WebSocket connections
- `NEXT_PUBLIC_IMAGE_URL` - Used for serving images and media files

Make sure your backend is running on the specified port (default: 8080) before starting the frontend development server.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── api/           # API client functions (axios)
├── app/           # Next.js App Router pages
├── components/    # React components
├── configs/       # i18n locales and config
└── utils/         # Helper utilities
```

### Key Utilities

- `listingUtils.js` - Form handlers for listing CRUD operations
- `settingsUtils.js` - User settings form handlers
- `validateForgotPassword.js` - Forgot password validation
- `validateSignup.js` - Signup form validation
- `validateLogin.js` - Login form validation

## API Integration

The frontend communicates with a Spring Boot backend at `NEXT_PUBLIC_BACKEND_URL`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with webpack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm install` | Install dependencies |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Leaflet](https://react-leaflet.js.org/)
- [i18next](https://www.i18next.com/)
