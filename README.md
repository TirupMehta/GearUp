# ShopGenie AI

**ShopGenie AI** is an Intelligent GenAI Business Copilot designed specifically for MSMEs (Micro, Small, and Medium Enterprises) in the retail sector. It acts as an intelligent dashboard to assist store owners in managing inventory, optimizing pricing, generating marketing campaigns, and assessing overall business health.

## Overview

ShopGenie AI is a single-page React-based web application. It operates entirely on the client side, processing uploaded data (CSV format) and providing AI-driven insights directly in the browser. It integrates with an LLM (Large Language Model) to provide powerful, context-aware suggestions without the need for a complex backend database.

## Features

The application is structured into four core pillars:

1. **Inventory Intelligence**: Process historical sales data to manage stock effectively, including demand forecasting and alerts for low or slow-moving stock.
2. **Intelligent Price Engine**: An interactive pricing simulator to test different price points and margins to maximize profit, particularly on slow-moving inventory.
3. **AI Marketing Generator**: Generate promotional content (like WhatsApp blasts or social media posts) directly from product data to help clear out dead inventory. Supports multi-language translation.
4. **Business Health Dashboard**: A macro view of the business, highlighting month-over-month growth, anomaly detection in sales, and an overall calculated risk score.

### 🏆 Advanced GenAI Capabilities

- **Context-Aware Copilot**: A persistent chat panel that observes your data and provides contextual explanations (e.g., explaining why a revenue drop occurred based on inventory data).
- **Weekly Battleplan**: One-click generation of a highly actionable, 3-step strategy guide for the week, written in plain language.
- **Voice-to-Action Simulation**: Demonstrate UI commands through simulated voice queries, seamlessly interacting with the dashboard.

## Tech Stack

This project is built using modern web technologies:

- **Frontend**: React (18), Typescript, Vite
- **Styling**: Tailwind CSS (Dark theme with electric blue and neon green accents), Lucide React (Icons)
- **Data Visualization**: Recharts
- **Data Processing**: PapaParse (CSV Parsing)
- **AI Integration**: `@google/generative-ai` SDK
- **Backend/Platform**: Firebase (for hosting/services if applicable, though primarily client-side state)

## Getting Started

### Prerequisites

Ensure you have Node.js and npm (or yarn/pnpm) installed on your system.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd GearUp
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local server URL provided (typically `http://localhost:5173`).

### Usage

Upon loading the application, you can:
- **Load Sample Data**: Use the built-in dataset to explore the dashboard immediately.
- **Upload CSV**: Upload your own retail transaction data to analyze your actual inventory status.
- Interact with the dashboard modules to forecast demand, simulate pricing, and generate AI-driven marketing campaigns.

## License

This project was built during the Unstop Hackathon.
