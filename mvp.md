# ShopGenie AI - MVP Architecture & Roadmap

## Overview
**ShopGenie AI** is an Intelligent GenAI Business Copilot designed for MSMEs (Micro, Small, and Medium Enterprises) in the retail sector. 
It is a single-page React-based web application that operates entirely on the client side, manipulating uploaded data and providing AI-driven insights via LLM integration.

### Core Architecture & Constraints
- [ ] **Frontend Framework**: Modern React (Hooks, Context API for state management)
- [ ] **Styling**: Tailwind CSS (Theme: Dark mode default with electric blue and neon green accents)
- [ ] **Data Visualization**: Recharts or Chart.js for smooth, animated, responsive graphs
- [ ] **Data Source**: CSV File Upload (using PapaParse) or a "Load Sample Data" button for immediate demos
- [ ] **Backend**: NO backend database, NO complex authentication. Purely state-driven via CSV upload.
- [ ] **AI Integration**: Direct API calls to an LLM, passing processed CSV data as context.

---

## The 4 Core Pillars (Dashboard Views)

### Pillar 1: Inventory Intelligence
*Goal: Process historical sales data to manage stock effectively.*
- [ ] **Action**: Parse CSV to extract daily retail transactions.
- [ ] **Display - Demand Chart**: Time-Based Demand Forecasting Chart (apply a basic 4-week moving average calculated in-browser).
- [ ] **Display - Inventory Split**: Data Table categorizing items into "Fast Moving" and "Dead Weight" (Slow Selling).
- [ ] **Display - Alerts**: "Low Stock Warning" alert cards triggered by the forecasted demand.

### Pillar 2: Intelligent Price Engine
*Goal: Interactive pricing simulator to maximize margins and move dead stock.*
- [ ] **Action**: Provide interactive sliders for pricing adjustments.
- [ ] **Display - Inputs**: Entry fields for "Product Cost" and "Target Margin".
- [ ] **Display - Simulator**: A "Scenario-Based Profit Simulation" slider. As the user drags the slider, the UI must instantly recalculate and animate the projected monthly profit.
- [ ] **Display - Bundles**: Automated discount bundling suggestions specifically targeting the "Dead Weight" inventory identified in Pillar 1.

### Pillar 3: AI Marketing Generator
*Goal: Turn dead inventory into cash through targeted, AI-generated campaigns.*
- [ ] **Action**: Generate promotional content using the LLM.
- [ ] **Display - Grid**: A visual grid of the user's slow-moving products.
- [ ] **Display - Generator**: A "Generate Campaign" button. When clicked, it takes the product name, current price, and generated discount from Pillar 2, passing them to the LLM.
- [ ] **Display - Output**: Formatted WhatsApp promotional blasts and Social Media captions.
- [ ] **Display - Translation Toggle**: A "Hackathon Flex" button to instantly translate the generated campaigns into regional languages (e.g., Hindi, Spanish) via the LLM.

### Pillar 4: Business Health Dashboard
*Goal: Macro view of business survival and anomaly detection.*
- [ ] **Action**: Evaluate overall business trajectory and risks.
- [ ] **Display - Growth Chart**: Month-over-Month growth charts.
- [ ] **Display - Anomalies**: Highlight specific days in the dataset with unnatural sales spikes or drops.
- [ ] **Display - Risk Score**: A gauge chart visualizing a risk score (calculated via algorithmic weighting of low stock vs. high expenses).

---

## 🏆 Hackathon Winning Features (The Reasoning Layer)

These features demonstrate true GenAI capabilities, moving beyond a standard dashboard to an active reasoning engine.

- [ ] **Feature A: The Conversational Translator (Context-Aware Copilot)**
  - A persistent right-side or floating "Copilot" chat panel.
  - The Copilot must have contextual awareness of the dashboard state, not just general knowledge.
  - *Interaction Detail*: If a user clicks a revenue dip on the chart, the Copilot automatically generates an explanation: *"I see a 12% drop in revenue here. This correlates with a stockout of your top 3 fast-moving items."*

- [ ] **Feature B: One-Click Strategy Execution (Weekly Battleplan)**
  - A global button titled "Generate Weekly Battleplan".
  - *Interaction Detail*: Triggers the LLM to read the summaries of all 4 pillars. It then outputs a highly structured, 3-step actionable list written in simple, non-technical language for the store owner.

- [ ] **Feature C: Voice-to-Action Simulation**
  - A microphone icon in the UI.
  - *Interaction Detail*: Simulates transcription showing the user saying: *"What should I price my milk at today?"* The system then visually routes this query to the Intelligent Price Engine to demonstrate voice-driven UI commands.

---

## Implementation Workflow (How we will build it)

- [ ] **Phase 1: Project Setup & Theming**
  - Scaffold project structure (Vite + React + Tailwind).
  - Define global CSS tokens for the dark theme, electric blue, and neon green accents.
  - Create the foundational App layout (Left Nav, Main Canvas, Right Copilot Panel).
- [ ] **Phase 2: Data Handling & Mocks**
  - Implement PapaParse for robust CSV ingestion.
  - Create a realistic local mock dataset ("Load Sample Data") for instant demo ability without a file.
  - Ensure all charts handle empty states gracefully before data is loaded.
- [ ] **Phase 3: Building The 4 Pillars**
  - Construct the UI and logic for Inventory Intelligence, Price Engine, Marketing Generator, and Health Dashboard.
  - Integrate Recharts/Chart.js to display data cleanly.
- [ ] **Phase 4: LLM Integration (The Brains)**
  - Wire up an LLM API (e.g., OpenAI, Gemini, or Claude) directly from the client.
  - Set up dynamic prompting systems that feed CSV context and UI states to the LLM.
- [ ] **Phase 5: The Winning Features (Polish)**
  - Implement the Context-Aware Copilot interactions (Feature A).
  - Add the One-Click Strategy execution (Feature B).
  - Wire the mock Voice-to-Action simulation (Feature C).