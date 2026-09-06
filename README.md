# 🚀 VloxAI | AI-Powered Blog & Vlog Content Studio (v2)

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Clerk_Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk Auth" />
  <img src="https://img.shields.io/badge/Google_Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

<p align="center">
  <b>The Next-Generation MERN Stack Cinematic Content Studio</b><br/>
  Featuring Reactive 3D WebGL Backgrounds, Dual AI Personas (Quill & Nova), Desktop Multi-Track Vlog Timeline Video Editing, Edit Decision List (EDL) Engine, Clerk Auth Sync, Google Gemini API Integration, and 1-Click Multi-Platform Broadcasting.
</p>

---

## 🌟 Overview

**VloxAI** is a full-featured, cinematic **MERN Stack** content studio built with **MongoDB**, **Express**, **React 19**, **Node.js**, **Vite**, **Clerk Authentication**, **Google Gemini API**, **Three.js**, and **Tailwind CSS v4**.

It bridges text blogging and video vlog production by offering Clerk auth profile sync, route-reactive 3D WebGL particle scenes, two specialized AI Copilot personas ("Quill" senior editor & "Nova" vlog director), desktop multi-track video timeline editing with non-destructive EDL support, render status polling, private media vaults, and creator analytics.

---

## ✨ Key Features & Capability Matrix

### 🎨 1. Route-Reactive 3D WebGL Background (`ThemeContext.jsx` & `Background3D.jsx`)
* **Dynamic Route Palettes**: `ThemeContext.jsx` automatically shifts WebGL fog, lighting, and particle hues based on the active page:
  * **Home (`/`)**: Violet & Indigo (`#6366f1` / `#8b5cf6` / `#ec4899`)
  * **Blog Editor (`/create-blog`)**: Cool Blue (`#3b82f6` / `#06b6d4` / `#6366f1`)
  * **Vlog Studio (`/vlog-editor`)**: Magenta & Cyan (`#ec4899` / `#06b6d4` / `#a855f7`)
  * **Dashboard (`/dashboard`)**: Teal & Emerald (`#0d9488` / `#10b981` / `#06b6d4`)
* **Depth-of-Field Parallax**: Mousemove and device orientation (gyroscope) delta camera offset capped at 4-6% max offset to prevent nausea.
* **Ambient Light Breathing Pulse**: Slow sine wave (~8s loop) for ambient lighting.
* **Performance Floor**: Auto-detects `prefers-reduced-motion` and low-spec hardware (`navigator.hardwareConcurrency < 4`) to drop particle count from ~2000 to ~400 and disable parallax.

### 🤖 2. Dual AI Personas — Quill (Blog) & Nova (Vlog) (`aiController.js`)
* **"Quill" — Blog AI Copilot (`QuillBlogCopilot.jsx`)**:
  * **Personality**: Editorial, precise, magazine senior editor.
  * **Voice DNA Continuity Checker (`POST /api/ai/voice-dna`)**: Analyzes creator drafts against average sentence length, vocabulary complexity, and tone markers, surfacing inline diff callouts for tone drift.
  * **Cross-Format Repurposing Pipeline**: 1-click "Turn Blog into Vlog Script" (reusing `/api/ai/vlog-script`) with direct launch into Vlog Studio.
  * **Headline A/B Generator (`POST /api/ai/headline-ab`)**: Crafts 3 headline variants with predicted CTR reasoning & 1-click title application.
  * **Fact-Check Flag Scan (`POST /api/ai/fact-check`)**: Scans article draft for unverified statistical/scientific claims with advisory chips.
  * **Outline Generator (`POST /api/ai/outline`)** & **Prose Polish (`POST /api/ai/polish`)**.
* **"Nova" — Vlog AI Director (`NovaVlogDirector.jsx`)**:
  * **Personality**: Energetic, visual, director-on-set energy.
  * **Cross-Format Repurposing Pipeline**: 1-click "Turn Vlog into Blog Article" (reusing `/api/ai/outline`) with direct launch into Blog Author Studio.
  * **Scene-by-Scene Shot List (`POST /api/ai/shot-list`)**: Breaks scripts into timestamped beats mapped to presenter gestures and visual framing.
  * **Auto-Caption Generator (`POST /api/ai/auto-captions`)**: Generates synchronized kinetic subtitle tracks mapped to estimated speech pacing (~150 wpm).
  * **B-Roll & Transition Suggester (`POST /api/ai/b-roll`)**: Recommends visual cutaways and transition presets with 1-click timeline insertion.
* **Audience Persona Simulator (`AudienceSimulator.jsx` & `POST /api/ai/audience-simulator`)**:
  * Simulates 3 diverse reader/viewer personas (*Skeptical Expert* 🧪, *Fast Skimmer* ⚡, *Superfan* 🚀) reacting to drafts with predicted drop-off risks and objection callouts.
* **Server Rate Limiting & Token Counter**: Rate-limited Gemini requests with credit usage breakdown tooltip in [`AiChatbot.jsx`](file:///d:/Everything/Library/Desktop/blogeditor/client/src/components/AiChatbot.jsx).

### 🎬 3. Full Vlog Video Editor & EDL Engine (`TimelineEditor.jsx` & `VlogEditor.jsx`)
* **Edit Decision List (EDL) Mongoose Schema**: `edl` sub-schema in `Vlog.js` storing tracks, clips, in/out points, trackStart, speed, filters, transitions, text overlays, and **collaborative timestamp comments**.
* **Retention Heatmap Prediction Overlay**: Calculates predicted attention curves based on video clip timing, pacing, and B-roll density; renders a neon SVG line overlay above the timeline ruler with toggle control.
* **Collaborative EDL Comments**: Timestamp-pinned interactive comment markers on the timeline ruler supporting resolve/unresolve states and playhead comment creation.
* **Multi-Track Timeline Engine**:
  * **Tracks**: Video, Audio, Captions, Text Overlays.
  * **Scrubber Ruler & Playhead**: Seek timecode synced to live preview; timeline zoom slider (1x - 4x); clip snapping (1s threshold).
  * **Cut / Split (`S` key)**: Splits clip at playhead into independent segments.
  * **Trim**: Drag handle edges to adjust in-point / out-point.
  * **Delete / Ripple Delete**: Removes clip; optional ripple mode closes gaps.
  * **Undo / Redo Stack (`Ctrl+Z` / `Ctrl+Y`)**: Reversible history stack.
  * **Speed Multiplier**: Per-clip speed (0.25x to 4x) with pitch correction option.
  * **Transitions & Filters**: Presets (Crossfade, Wipe, Slide, Zoom-Blur) and cinematic filter styles (Cyberpunk, Neon Matrix, Warm Vintage, Cinematic Dark, HDR Boost).
  * **Multi-Select (`Shift+Click`)** & **Debounced Auto-Save (~10s)**.
* **Export Render Queue & Status Polling**: `POST /api/vlogs/:id/render` and polling `GET /api/vlogs/:id/render-status` modal.

---

## 🛠️ Tech Architecture & Stack

| Layer | Technology | Purpose & Description |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) | Modern functional components, hooks, and React Context API |
| **Theme & 3D Scene** | [Three.js](https://threejs.org/) + `ThemeContext` | Route-aware 3D particle cloud, lighting pulse & parallax |
| **Authentication** | [@clerk/clerk-react](https://clerk.com/) & [@clerk/express](https://clerk.com/) | Authentication, user sign-in/up modals, and profile sync |
| **Build Engine** | [Vite 8](https://vitejs.dev/) | Lightning fast HMR, dev server, and production bundling |
| **Styling & Tokens** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS engine, luminous glass backdrop filters, tinted `#181824` base |
| **Animations** | [Framer Motion](https://motion.dev/) | Dynamic layout transitions, modal overlays, entrance FX |
| **Backend Server** | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | RESTful API backend running on port 5000 |
| **Database** | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Persistent document models for Users, Blogs, and Vlogs with EDL |
| **AI Integration** | [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) | Google SDK for Gemini models (`gemini-3.6-flash` by default) |

---

## 📁 Project Directory Structure

```text
blogeditor/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/           # Seed datasets & static assets
│   │   ├── components/       # Reusable UI & Visual components
│   │   │   ├── AiChatbot.jsx        # Persona switcher chatbot & credit breakdown
│   │   │   ├── AudienceSimulator.jsx # Persona testing card panel
│   │   │   ├── Background3D.jsx     # Route-aware Three.js WebGL background
│   │   │   ├── Blogcard.jsx         # 3D Tilt card component
│   │   │   ├── Bloglist.jsx         # Filterable article grid
│   │   │   ├── EmptyState.jsx       # Styled glassmorphic empty state card
│   │   │   ├── ErrorBoundary.jsx    # React error boundary recovery component
│   │   │   ├── Footer.jsx           # Footer with social links
│   │   │   ├── Header.jsx           # Hero banner & live search
│   │   │   ├── Navbar.jsx           # Header nav, Clerk Auth & credit counter
│   │   │   ├── NovaVlogDirector.jsx # Nova Vlog AI Director panel & repurposing
│   │   │   ├── QuillBlogCopilot.jsx # Quill Blog AI Senior Editor & Voice DNA
│   │   │   ├── SkeletonLoader.jsx   # Content pulse loading skeletons
│   │   │   ├── SocialIcons.jsx      # SVG brand icons
│   │   │   ├── Tilt3DCard.jsx       # Parallax hover tilt wrapper
│   │   │   ├── TimelineEditor.jsx   # Desktop multi-track video timeline engine & retention heatmap
│   │   │   ├── Toast.jsx            # Global floating notifications
│   │   │   └── UserProfileSync.jsx  # Clerk 1st-time registration & profile sync
│   │   ├── context/
│   │   │   ├── BlogContext.jsx   # Central state manager & user profile state
│   │   │   └── ThemeContext.jsx  # Route-aware 3D color palette state
│   │   ├── pages/
│   │   │   ├── Blog.jsx          # Reading view with claps & comments
│   │   │   ├── BlogEditor.jsx    # AI Blog authoring studio with Quill Copilot
│   │   │   ├── Dashboard.jsx     # Creator analytics, user profile card & media hub
│   │   │   ├── Home.jsx          # App landing page
│   │   │   ├── MyPublished.jsx   # Media vault & private/public toggles
│   │   │   └── VlogEditor.jsx    # AI Vlog Studio, Timeline & Nova Director
│   │   ├── services/
│   │   │   └── api.js            # Client HTTP API wrapper with all AI methods
│   │   ├── App.jsx               # App shell, ErrorBoundary & routing
│   │   ├── index.css             # Luminous glassmorphism & custom utility tokens
│   │   └── main.jsx              # React DOM entry point with ThemeProvider
│   ├── .env                      # Client environment variables
│   ├── package.json
│   └── vite.config.js            # Vite proxy for /api -> http://localhost:5000
├── server/
│   ├── config/
│   │   └── db.js                 # Mongoose MongoDB connection
│   ├── controllers/
│   │   ├── aiController.js       # Gemini API controllers with Quill, Nova, Voice DNA & Audience Simulator
│   │   ├── blogController.js     # MongoDB Blog CRUD & claps logic
│   │   └── vlogController.js     # MongoDB Vlog CRUD & render queue status
│   ├── models/
│   │   ├── Blog.js               # Mongoose Blog schema
│   │   ├── User.js               # Mongoose User schema for Clerk profile sync
│   │   └── Vlog.js               # Mongoose Vlog schema with EDL & renderStatus
│   ├── routes/
│   │   ├── aiRoutes.js           # Express /api/ai endpoints
│   │   ├── blogRoutes.js         # Express /api/blogs endpoints
│   │   ├── userRoutes.js         # Express /api/users endpoints
│   │   └── vlogRoutes.js         # Express /api/vlogs & render endpoints
│   ├── .env.example
│   ├── .env                      # Local environment configuration
│   ├── package.json
│   └── server.js                 # Express application entry point
├── package.json                  # Root package for concurrent execution
└── README.md
```

---

## 📡 API Routes Reference

### 1. User Auth & Sync Routes (`/api/users`)

| Route | Method | Payload / Params | Description |
| :--- | :--- | :--- | :--- |
| `/api/users/sync` | `POST` | `{ clerkId, email, name, avatar }` | Syncs user on login; creates new MongoDB profile on 1st time registration |
| `/api/users/profile/:clerkId` | `GET` | `clerkId` | Fetches user profile from MongoDB |
| `/api/users/profile/:clerkId` | `PUT` | `{ bio, name, avatar }` | Updates user profile bio & metadata in MongoDB |

### 2. Google Gemini AI Routes (`/api/ai`)

| Route | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/api/ai/outline` | `POST` | `{ title, subTitle, category }` | Generates a structured HTML article outline |
| `/api/ai/polish` | `POST` | `{ contentHtml, tone }` | Refines and polishes prose readability & tone |
| `/api/ai/seo` | `POST` | `{ title, category, contentHtml }` | Generates 5 SEO keywords & meta description |
| `/api/ai/headline-ab` | `POST` | `{ title, category }` | Quill Tool: Generates 3 headline A/B options + CTR reasoning |
| `/api/ai/fact-check` | `POST` | `{ contentHtml }` | Quill Tool: Scans draft for unverified claims with citation flags |
| `/api/ai/voice-dna` | `POST` | `{ contentHtml }` | Quill Tool: Analyzes brand voice fingerprint & flags tone drift |
| `/api/ai/audience-simulator` | `POST` | `{ title, contentHtml, script }` | Simulates 3 reader/viewer personas with drop-off risk & objections |
| `/api/ai/chat` | `POST` | `{ prompt, persona, actionType }` | AI Copilot assistant chat (personas: `quill` \| `nova` \| `assistant`) |
| `/api/ai/vlog-script` | `POST` | `{ title, avatarName, avatarVoice }` | Nova Tool: Generates speech script & timeline clips |
| `/api/ai/shot-list` | `POST` | `{ script, title }` | Nova Tool: Breaks script into timestamped gesture beats |
| `/api/ai/auto-captions` | `POST` | `{ script }` | Nova Tool: Generates synchronized caption clips (~150 wpm) |
| `/api/ai/b-roll` | `POST` | `{ script }` | Nova Tool: Recommends B-roll visual cutaways & transitions |

### 3. Vlog & Render Queue Routes (`/api/vlogs`)

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/vlogs` | `GET` | Fetch all vlog projects |
| `/api/vlogs/:id` | `GET` | Fetch single vlog project |
| `/api/vlogs` | `POST` | Save or update vlog project with EDL |
| `/api/vlogs/:id/render` | `POST` | Start export render job |
| `/api/vlogs/:id/render-status` | `GET` | Check render progress status |
| `/api/vlogs/:id/toggle-visibility` | `PATCH` | Toggle vlog privacy status |
| `/api/vlogs/:id` | `DELETE` | Remove vlog project |

---

## 🚦 Getting Started

### Quick Start Guide

1. **Clone & Install Dependencies**:
   ```bash
   cd blogeditor
   npm run install:all
   ```

2. **Configure Environment Variables**:
   - `client/.env`: `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...`
   - `server/.env`: `PORT=5000`, `MONGODB_URI=...`, `GEMINI_API_KEY=...`, optional `GEMINI_MODEL=gemini-3.6-flash`

3. **Launch Concurrent Servers**:
   ```bash
   npm run dev
   ```
   - **Vite Frontend**: `http://localhost:5173`
   - **Express Server**: `http://localhost:5000`

---

## 📄 License

This project is open-source and available under the **MIT License**.
