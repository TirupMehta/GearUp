# 🧞 ShopGenie AI

> **Intelligent GenAI Business Copilot for MSME Retailers**

ShopGenie AI is a full-stack, AI-powered dashboard designed specifically for MSMEs (Micro, Small, and Medium Enterprises) in the retail sector. It helps store owners manage inventory, optimize pricing, generate marketing campaigns, and assess overall business health — all powered by Google's Generative AI.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [License](#license)

---

## 🔍 Overview

ShopGenie AI is a **React + Vite** single-page application with an **Express.js + MongoDB** backend. Users can upload retail transaction data (CSV) or load a built-in sample dataset. The app processes this data client-side and leverages **Google Gemini AI** to deliver context-aware insights, actionable recommendations, and AI-generated marketing content — all from a sleek, dark-themed dashboard.

### Why ShopGenie AI?

| Problem | ShopGenie Solution |
|---|---|
| Store owners struggle with inventory tracking | **Inventory Intelligence** auto-categorizes stock as Fast-Moving or Dead Weight |
| Pricing decisions are guesswork | **Intelligent Price Engine** simulates profit scenarios in real-time |
| Marketing is time-consuming and expensive | **AI Marketing Generator** creates WhatsApp blasts & social posts in seconds |
| No visibility into business trends | **Business Health Dashboard** surfaces anomalies and calculates risk scores |

---

## ✨ Features

### 🏛️ The 4 Core Pillars

#### 1. 📦 Inventory Manager
- Real-time stock tracking synced with MongoDB Atlas
- Add/remove stock with instant database updates
- Visual stock level indicators with low-stock warnings

#### 2. 📊 Inventory Intelligence
- **Demand Forecasting**: 4-week moving average demand chart computed in-browser
- **Stock Classification**: Auto-categorizes items into **Fast Moving** and **Dead Weight**
- **Low Stock Alerts**: Smart alert cards triggered when forecasted demand exceeds current stock

#### 3. 💰 Intelligent Price Engine
- Interactive sliders for cost, margin, and pricing adjustments
- **Scenario-Based Profit Simulation**: Drag sliders to instantly see projected monthly profit animate in real-time
- **Bundle Suggestions**: Automated discount bundling recommendations targeting slow-moving inventory

#### 4. 📢 AI Marketing Generator
- Visual grid of slow-moving products with pricing data
- **One-Click Campaign Generation**: Generates WhatsApp promotional blasts and social media captions using Gemini AI
- **Multi-Language Translation**: Instantly translate generated campaigns into regional languages (Hindi, Spanish, etc.)

### 🏆 Advanced GenAI Capabilities

- **🤖 Context-Aware Copilot**: A persistent chat panel that observes your dashboard state. Click a revenue dip and the Copilot explains: *"I see a 12% drop in revenue here. This correlates with a stockout of your top 3 fast-moving items."*
- **📋 Weekly Battleplan**: One-click generation of a structured, 3-step actionable strategy for the week, written in plain language for store owners.
- **🎙️ Voice-to-Action Simulation**: Demonstrates voice-driven UI commands — simulates a user saying *"What should I price my milk at today?"* and routes it to the Price Engine.

### 🔐 Authentication
- Firebase-powered email/password authentication
- Animated splash screen on app launch
- Persistent session management

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                   │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────────┐ │
│  │  Sidebar  │  │  Main View │  │   Copilot (AI Chat)  │ │
│  │   (Nav)   │  │  (Pillars) │  │  Context-Aware Panel │ │
│  └──────────┘  └────────────┘  └──────────────────────┘ │
│        │              │                    │             │
│        └──────────────┼────────────────────┘             │
│                       │                                  │
│              ┌────────┴────────┐                         │
│              │ DashboardContext │  ← CSV parsed via      │
│              │   (React State)  │    PapaParse            │
│              └────────┬────────┘                         │
│                       │                                  │
│         ┌─────────────┼─────────────┐                    │
│         │             │             │                    │
│    ┌────┴────┐  ┌─────┴─────┐ ┌────┴──────┐             │
│    │ Firebase │  │ Gemini AI │ │  Backend  │             │
│    │  Auth    │  │   SDK     │ │  REST API │             │
│    └─────────┘  └───────────┘ └─────┬─────┘             │
└─────────────────────────────────────┼───────────────────┘
                                      │
                              ┌───────┴───────┐
                              │  Express.js   │
                              │   Server      │
                              └───────┬───────┘
                                      │
                              ┌───────┴───────┐
                              │  MongoDB      │
                              │   Atlas       │
                              └───────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework with Hooks & Context API |
| **TypeScript** | Type-safe development |
| **Vite 5** | Lightning-fast build tool & dev server |
| **Tailwind CSS 3** | Utility-first styling (dark theme with electric blue & neon green accents) |
| **Recharts** | Interactive, responsive data visualizations |
| **PapaParse** | Robust CSV ingestion and parsing |
| **Lucide React** | Modern icon library |
| **React Markdown** | Render AI-generated markdown responses |
| **@google/generative-ai** | Google Gemini AI SDK for copilot & content generation |
| **Firebase** | Authentication (email/password) |

### Backend
| Technology | Purpose |
|---|---|
| **Express.js 5** | REST API server |
| **Mongoose 9** | MongoDB ODM for inventory persistence |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **dotenv** | Environment variable management |
| **CORS** | Cross-origin resource sharing middleware |

---

## 📁 Project Structure

```
GearUp/
├── backend/                    # Express.js API server
│   ├── models/
│   │   └── Item.js             # Mongoose schema for inventory items
│   ├── server.js               # API routes & MongoDB connection
│   └── package.json            # Backend dependencies
│
├── src/                        # React frontend source
│   ├── components/
│   │   ├── pillars/            # Core dashboard modules
│   │   │   ├── InventoryIntelligence.tsx   # Demand forecasting & stock analysis
│   │   │   ├── InventoryManager.tsx        # Real-time stock management
│   │   │   ├── PriceEngine.tsx             # Pricing simulator
│   │   │   ├── MarketingGenerator.tsx      # AI campaign generator
│   │   │   └── BusinessHealth.tsx          # Growth charts & risk scoring
│   │   ├── Copilot.tsx         # AI-powered context-aware chat panel
│   │   ├── LoginScreen.tsx     # Firebase auth login/signup UI
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── SplashScreen.tsx    # Animated launch screen
│   │   └── UploadScreen.tsx    # CSV upload & sample data loader
│   ├── context/
│   │   ├── AuthContext.tsx      # Firebase auth state provider
│   │   └── DashboardContext.tsx # Global data & dashboard state
│   ├── lib/
│   │   └── firebase.ts         # Firebase configuration & initialization
│   ├── utils/
│   │   └── dataEngine.ts       # CSV processing & analytics logic
│   ├── App.tsx                 # Root component with routing logic
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles
│
├── dummy_data.csv              # Sample retail transaction dataset
├── test_transactions.csv       # Test dataset for development
├── index.html                  # HTML entry point
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
└── package.json                # Frontend dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm**, **yarn**, or **pnpm**
- **MongoDB Atlas** account (for backend persistence)
- **Firebase** project (for authentication)
- **Google AI Studio** API key (for Gemini AI features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TirupMehta/GearUp.git
   cd GearUp
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables** (see [Environment Variables](#environment-variables) below).

5. **Start the backend server:**
   ```bash
   cd backend
   node server.js
   ```

6. **Start the frontend dev server** (in a separate terminal):
   ```bash
   npm run dev
   ```

7. Open your browser and navigate to **`http://localhost:5173`**.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
PORT=5000
```

### Frontend

Firebase and Google AI configurations are set in:
- `src/lib/firebase.ts` — Firebase project credentials
- Gemini API key is passed to the `@google/generative-ai` SDK at runtime

> **⚠️ Note:** Never commit API keys or secrets to version control. Use `.env` files and ensure they are listed in `.gitignore`.

---

## 📡 API Endpoints

The backend server exposes the following REST endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/inventory` | Fetch all inventory items from MongoDB |
| `POST` | `/api/inventory/stock` | Update stock for a specific product |
| `POST` | `/api/sync` | Sync parsed frontend CSV data into the database |

### Request Examples

**Update Stock:**
```json
POST /api/inventory/stock
{
  "productName": "Milk",
  "change": -5
}
```

**Sync Inventory:**
```json
POST /api/sync
{
  "inventory": [
    {
      "ProductName": "Milk",
      "TotalSold": 150,
      "TotalRevenue": 7500,
      "TotalCost": 5000,
      "Status": "Fast Moving",
      "Margin": 33.3,
      "Cost": 33,
      "CurrentPrice": 50
    }
  ]
}
```

---

## 📖 Usage Guide

### 1. Sign Up / Log In
Create an account or log in with your email and password via Firebase authentication.

### 2. Load Your Data
Choose one of two options:
- **📂 Upload CSV** — Upload your own retail transaction data
- **📊 Load Sample Data** — Use the built-in `dummy_data.csv` to explore instantly

### 3. Explore the Dashboard
Navigate between the five modules using the sidebar:
- **Inventory Manager** → Track and update stock levels
- **Inventory Intelligence** → View demand forecasts and stock classifications
- **Price Engine** → Simulate pricing scenarios for maximum profit
- **Marketing Generator** → Generate AI-powered promotional content
- **Business Health** → Monitor growth trends and risk indicators

### 4. Chat with the Copilot
Use the AI Copilot panel on the right side for contextual insights. It automatically understands what you're looking at and provides relevant explanations and recommendations.

### CSV Format

Your CSV should include columns like:

| Column | Description | Example |
|---|---|---|
| `Date` | Transaction date | `2024-01-15` |
| `ProductName` | Name of the product | `Milk` |
| `Quantity` | Units sold | `5` |
| `UnitPrice` | Price per unit | `50` |
| `Cost` | Cost per unit | `33` |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check & build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

---

## 👥 Team

Built with ❤️ during the **Unstop Hackathon**.

---

## 📄 License

This project was built during the Unstop Hackathon.
