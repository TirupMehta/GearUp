# RevGenie AI - MVP Architecture & Roadmap

## Overview
**RevGenie AI** is an Intelligent GenAI B2B Sales & Revenue Operations platform. 
It is a single-page React-based web application that operates entirely on the client side, manipulating uploaded CRM data and providing AI-driven pipeline insights via LLM integration.

### Core Architecture & Constraints
- [x] **Frontend Framework**: Modern React (Hooks, Context API for state management)
- [x] **Styling**: Tailwind CSS (Theme: Dark mode default with electric blue and neon green accents)
- [x] **Data Visualization**: Recharts for smooth, animated, responsive graphs
- [x] **Data Source**: CSV File Upload (using PapaParse) or "Load Sample Data"
- [x] **Backend**: Express + MongoDB for persisting state
- [x] **AI Integration**: Direct API calls to Gemini AI, passing processed CRM data as context.

---

## The 4 Core Pillars (Dashboard Views)

### Pillar 1: Pipeline Intelligence
*Goal: Process historical deal data to forecast revenue dynamically.*
- [ ] **Action**: Parse CSV to extract SaaS deal metrics.
- [ ] **Display - Demand Chart**: Time-Based Revenue Forecasting Chart.
- [ ] **Display - Deal Split**: Data Table categorizing deals into "High-Velocity" and "Stalled".
- [ ] **Display - Alerts**: "Pipeline Coverage Warning" alert cards triggered by forecasted misses.

### Pillar 2: Deal Simulator
*Goal: Interactive negotiation simulator to maximize ACV and protect margins.*
- [ ] **Action**: Provide interactive sliders for deal size and discount adjustments.
- [ ] **Display - Inputs**: Entry fields for "List Price" and "Target Discount %".
- [ ] **Display - Simulator**: A "Scenario-Based Profit Simulation" slider with instant animations.
- [ ] **Display - Bundles**: Automated discount bundling suggestions specifically targeting stalled pipeline.

### Pillar 3: AI Sequence Generator
*Goal: Turn stalled deals into cash through hyper-personalized, AI-generated outbound cadences.*
- [ ] **Action**: Generate email/LinkedIn content using Gemini.
- [ ] **Display - Grid**: A visual grid of the user's stalled prospects.
- [ ] **Display - Generator**: A "Generate Sequence" button mapping deal value to the outreach tone.
- [ ] **Display - Output**: Formatted outbound emails and follow-ups.
- [ ] **Display - Translation Toggle**: A button to instantly translate sequences into regional languages.

### Pillar 4: Revenue Dashboard
*Goal: Macro view of pipeline survival and risk detection.*
- [ ] **Action**: Evaluate overall business trajectory and rep performance.
- [ ] **Display - Growth Chart**: Month-over-Month pipeline growth charts.
- [ ] **Display - Risk Score**: A gauge chart visualizing a risk score (calculated via algorithmic weighting of slipped deals vs closed-won ratios).

---

## 🏆 Hackathon Winning Features (The Reasoning Layer)

These features demonstrate true GenAI capabilities, moving beyond a standard dashboard to an active reasoning engine.

- [ ] **Feature A: The Deal Strategist (Context-Aware SalesBuddy)**
  - A persistent right-side "SalesBuddy" chat panel.
  - SalesBuddy has contextual awareness of the pipeline state.
  - *Interaction Detail*: If a user clicks a revenue dip on the chart, SalesBuddy automatically generates an explanation: *"I see a 12% drop in pipeline coverage here. This correlates with two Enterprise deals stalling in legal."*

- [ ] **Feature B: One-Click Strategy Execution (Weekly Battleplan)**
  - A global button titled "Generate Weekly Battleplan".
  - *Interaction Detail*: Triggers Gemini to read the summaries of all 4 pillars and output a highly structured, 3-step actionable list written for the rep to execute today.

- [ ] **Feature C: Voice-to-Action Simulation**
  - A microphone icon in the UI.
  - *Interaction Detail*: Simulates transcription showing the user saying: *"What happens if I give Acme Corp a 15% discount?"* The system then visually routes this query to the Deal Simulator.

---

## Implementation Workflow 

- [x] **Phase 1: Project Setup & Theming**
- [x] **Phase 2: Data Handling & Mocks**
- [x] **Phase 3: Building The 4 Pillars**
- [x] **Phase 4: LLM Integration (The Brains)**
- [x] **Phase 5: The Winning Features (Hackathon Polish)**