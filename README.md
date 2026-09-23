# Ghost TV 🎬

**Ghost TV** is a sleek, modern, and high-performance Web Streaming Platform built with **React 19**, **TypeScript**, **Vite**, and **FastAPI**. Designed with a premium dark-themed UI, fluid micro-interactions, responsive touch/drag navigation, and comprehensive movie metadata.

---

## ✨ Features

- 🍿 **Curated Catalog:** Browse trending movies, TV series, single movies, animations, and anime.
- 🔍 **Real-Time Search & Filtering:** Filter content by release year, genre, and country with instant API responses.
- 🕒 **Continue Watching (Watch History):** LocalStorage-backed watch history tracking episode progress and last watched timestamp.
- 🖱️ **Touch & Drag-to-Scroll:** Smooth horizontal scrolling with mouse drag support for desktop and native touch gestures for mobile devices.
- 📺 **Dynamic 16:9 Video Player:** Embedded HLS/MP4 video player with comprehensive movie metadata (director, cast, genres, duration, quality, episodes).
- 🛡️ **BFF / Proxy Backend Support:** Built-in FastAPI scraper backend using Playwright for stream link extraction and caching.
- 🚀 **Vercel & PWA Ready:** Single Page Application (SPA) routing configuration, mobile-first responsive viewport, and PWA manifest support.

---

## 🛠️ Tech Stack

### Frontend
- **Core Framework:** React 19, TypeScript, Vite
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Iconography & Styling:** Lucide React, Custom CSS Design System
- **Deployment Target:** Vercel

### Backend
- **Framework:** FastAPI (Python 3.12)
- **Web Automation / Scraper:** Playwright
- **Caching:** Cachetools (`TTLCache`)
- **Configuration Management:** Pydantic Settings, Python Dotenv
- **ASGI Server:** Uvicorn

---

## 📁 Project Structure

```text
ghost-tv/
├── frontend/                   # React + Vite Frontend Application
│   ├── public/                 # Static assets (favicons, icons)
│   ├── src/
│   │   ├── components/         # Reusable UI components (PageHeader, MovieCard, TVSidebar)
│   │   ├── hooks/              # Custom React hooks (useDraggableScroll)
│   │   ├── pages/              # Screen components (HomeScreen, PlayerScreen, CategoryDetail)
│   │   ├── services/           # API clients & LocalStorage history service
│   │   └── styles/             # Theme tokens and global CSS
│   ├── index.html              # HTML entry point with SEO Open Graph tags
│   └── vercel.json             # SPA routing rewrite configuration for Vercel
│
└── backend/                    # Python FastAPI Proxy Backend
    ├── app/
    │   ├── api/                # Stream and media endpoints
    │   ├── core/               # Configuration settings (config.py)
    │   ├── services/           # Scraper service (Playwright automation)
    │   └── main.py             # FastAPI entry point
    └── requirements.txt        # Backend dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.x or higher)
- **Python** (v3.10 or higher)
- **npm** or **pnpm** / **yarn**

---

### 1. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment template and configure
cp .env.example .env

# Start the Vite development server
npm run dev
```

The frontend will run locally at `http://localhost:5173`.

#### Frontend Environment Variables (`.env`)
```env
VITE_INTERNAL_API_URL=
VITE_CONTENT_API_URL=
VITE_API_TIMEOUT=
VITE_APP_NAME=
```

---

### 2. Backend Setup (Optional Proxy & Scraper)

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browser binaries
playwright install chromium

# Copy environment template
cp .env.example .env

# Start the FastAPI backend server
uvicorn app.main:app --reload --port 8000
```

The API docs will be available at `http://localhost:8000/docs`.

---

## 📦 Production Build & Deployment

### Build Frontend Static Bundle
```bash
cd frontend
npm run build
```

The compiled production assets will be generated in `frontend/dist`.

### Deploying to Vercel

1. Push your code to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `frontend`.
4. Configure Environment Variables:
   - `VITE_CONTENT_API_URL` =
5. Click **Deploy**.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
