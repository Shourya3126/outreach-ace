

# OutreachAI — AI-Powered Cold Outreach Tool

## Overview
A premium, dark-mode React frontend for an AI-powered cold outreach platform. The app connects to a Python FastAPI backend to scrape LinkedIn profiles, analyze them with an LLM, and generate hyper-personalized messages across 5 channels (Email, LinkedIn, WhatsApp, SMS, Instagram).

---

## Design & Aesthetic
- **Dark mode by default** with deep blue → purple gradient accents
- **Glassmorphism cards** with subtle backdrop blur and border glow
- **Inter font**, smooth animations, loading skeletons, and toast feedback everywhere
- Fully responsive for desktop and tablet

---

## Global Layout
- **Collapsible sidebar** with logo ("OutreachAI"), nav links (Dashboard, Single Profile, Batch Processing, Knowledge Base, Settings), and a live API connection status indicator (green/red dot)
- **Top bar** with page title and breadcrumb navigation

---

## Page 1: Dashboard (`/`)
- Welcome hero section with app description
- Quick stats cards: total profiles processed, success rate, recent activity
- Quick action buttons linking to "Analyze a Profile" and "Start Batch Processing"

## Page 2: Single Profile (`/profile`)
- **Three input modes** via tab selector: LinkedIn URL, Upload Resume (file dropzone), Paste Text
- Each mode has an input field + "Analyze" button → calls `POST /api/analyze`
- **Results in two-column layout:**
  - **Left:** Profile Analysis card (name, company, role, industry, seniority, education, certifications, key insights, psychological profile, communication style)
  - **Right:** Tabbed message interface (Email | LinkedIn | WhatsApp | SMS | Instagram)
    - Each tab shows an editable textarea with a one-click "Copy to Clipboard" button + toast
    - Email tab shows Subject + Body separately
    - Personalization Score badge
    - "Generate A/B Variant" button for alternate versions

## Page 3: Batch Processing (`/batch`) — ⭐ Key Feature
- **CSV upload dropzone** with preview table (first 5 rows) and auto-detected URL column
- Offering text input (pre-filled from Settings)
- "Process All Profiles" button → calls `POST /api/batch`
- **Live progress:** progress bar, status text ("Processing profile 3/10…"), cards appearing in real-time
- **Results as expandable profile cards:**
  - Header: initials avatar + name + company + role + status badge (Success/Partial/Failed)
  - Expanded: 5-channel message tabs, each with copy button and toast feedback
  - Email shows subject + body with individual copy buttons
- **Bulk actions bar:** Expand All/Collapse All, Download CSV, summary stats, search/filter by name/company/status

## Page 4: Knowledge Base (`/knowledge`)
- Table of saved prospects (name, company, industry, date saved)
- Delete action per row
- Connects to `GET /api/knowledge` and `DELETE /api/knowledge/:id`

## Page 5: Settings (`/settings`)
- Backend API URL input (default: `http://localhost:8000`)
- "Your Offering" textarea for describing what the user sells
- "Test Connection" button → pings `GET /health` with success/error toast
- All settings saved to localStorage

---

## Technical Approach
- **Axios client** configured with `VITE_API_URL` env variable and CORS support
- **TypeScript interfaces** for all API request/response shapes
- **Custom hooks:** `useClipboard` (copy + toast), API connection status
- **Loading skeletons** for all async states, empty state illustrations for no-data scenarios
- **Status badges** with color coding throughout (green/yellow/red)
- `.env.example` file included for setup

