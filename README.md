# 🧞 RevGenie AI

> **The AI-native RevOps platform that accelerates deal velocity, neutralizes pipeline risks, and turns every rep into your top performer.**

RevGenie AI is a full-stack, AI-powered sales execution dashboard designed specifically for B2B Sales & Revenue Operations. It helps sales teams manage their pipeline, optimize deal velocity, generate personalized outreach sequences, and assess overall pipeline health — all powered by Google's Generative AI.

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

RevGenie AI is a **React + Vite** single-page application with an **Express.js + MongoDB** backend. Users can upload sales CRM transaction data (CSV) or load a built-in sample dataset. The app processes this data client-side and leverages **Google Gemini AI** to deliver context-aware deal insights, actionable recommendations, and AI-generated outbound content — all from a sleek, dark-themed dashboard.

### Why RevGenie AI?

| Problem | RevGenie Solution |
|---|---|
| Reps struggle with pipeline visibility | **Pipeline Intelligence** auto-categorizes active deals by velocity and risk |
| Discounting erodes profit margins | **Deal Simulator** simulates profit/commission scenarios in real-time |
| Following up is time-consuming | **Sequence Generator** creates personalized LinkedIn & email touches instantly |
| Sales leaders lack deal insight | **Revenue Dashboard** surfaces pipeline anomalies and calculates risk scores |

---

## ✨ Features

### 🏛️ The 4 Core Pillars

#### 1. 📦 Pipeline Manager
- Real-time active deal tracking synced with MongoDB Atlas
- Update stages and volumes with instant database updates
- Visual pipeline alerts for stalled coverage

#### 2. 📊 Pipeline Intelligence
- **Revenue Forecasting**: 4-week moving average demand chart computed in-browser
- **Deal Classification**: Auto-categorizes deals into **High-Velocity** and **Stalled/At-Risk**
- **Coverage Alerts**: Smart alert cards triggered when forecasted revenue drops below target

#### 3. 💰 Deal Simulator
- Interactive sliders for deal size, discounting, and commission adjustments
- **Scenario-Based Profit Simulation**: Drag sliders to instantly see projected ACV animate in real-time
- **Negotiation Recommendations**: Automated strategies to protect margin 

#### 4. 📢 AI Sequence Generator
- Visual grid of stalled deals and target accounts
- **One-Click Campaign Generation**: Generates hyper-personalized outreach sequences using Gemini AI
- **Multi-Language Translation**: Instantly translate outbound copy into regional languages

### 🏆 Advanced GenAI Capabilities

- **🤖 Context-Aware SalesBuddy**: A persistent chat panel that observes your dashboard state. Click a pipeline dip and SalesBuddy explains: *"I see a 12% drop in revenue here. This correlates with two Enterprise deals stalling in legal."*
- **📋 Weekly Battleplan**: One-click generation of a structured, 3-step actionable strategy for the week, written in plain language for sales reps.
- **🎙️ Voice-to-Action Simulation**: Demonstrates voice-driven UI commands routing directly to the Deal Simulator.

### 🔐 Authentication
- Firebase-powered email/password authentication
- Persistent session management

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                   │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────────┐ │
│  │  Sidebar  │  │  Main View │  │ SalesBuddy (AI Chat) │ │
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
100: └─────────────────────────────────────┼───────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework with Hooks & Context API |
| **Vite 5** | Lightning-fast build tool & dev server |
| **Tailwind CSS 3** | Utility-first styling (dark theme) |
| **Recharts** | Interactive, responsive data visualizations |
| **PapaParse** | Robust CSV ingestion and parsing |
| **@google/generative-ai** | Google Gemini AI SDK for SalesBuddy |
| **Firebase** | Authentication (email/password) |

### Backend
| Technology | Purpose |
|---|---|
| **Express.js 5** | REST API server |
| **Mongoose 9** | MongoDB ODM for data persistence |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |

---

## 📁 Project Structure

```
GearUp/
├── backend/                    # Express.js API server
├── src/                        # React frontend source
│   ├── components/
│   │   ├── pillars/            
│   │   │   ├── InventoryIntelligence.tsx   # Pipeline analysis
│   │   │   ├── InventoryManager.tsx        # Deal volume tracker
│   │   │   ├── PriceEngine.tsx             # Deal simulator
│   │   │   ├── MarketingGenerator.tsx      # AI sequence generator
│   │   │   └── BusinessHealth.tsx          # Growth charts
│   │   ├── Copilot.tsx         # AI SalesBuddy
│   │   ├── LoginScreen.tsx     
│   │   ├── Sidebar.tsx         
│   │   ├── SplashScreen.tsx    
│   │   └── UploadScreen.tsx    
│   ├── context/
│   ├── lib/
│   ├── utils/
│   ├── App.tsx                 
│   ├── main.tsx                
│   └── index.css               
├── dummy_data.csv              # Sample CRM dataset
├── test_transactions.csv       
├── index.html                  
├── tailwind.config.js          
├── tsconfig.json               
├── vite.config.ts              
└── package.json                
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
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

4. **Start the backend server:**
   ```bash
   cd backend
   node server.js
   ```

5. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```

---

## 📖 Usage Guide

### 1. Sign Up / Log In
Create an account or log in with your email and password via Firebase authentication.

### 2. Load Your Data
Choose one of two options:
- **📂 Upload CSV** — Upload your own CRM export
- **📊 Load Sample Data** — Use the built-in `dummy_data.csv` to explore instantly

### 3. Chat with SalesBuddy
Use the AI SalesBuddy panel on the right side for contextual insights. It automatically understands the pipeline you're viewing and provides relevant strategy recommendations.

---

## 👥 Team

Built with ❤️  during the **ET Gen AI Hackathon**.

---

## 📄 License

This project was built during the ET Gen AI Hackathon.
