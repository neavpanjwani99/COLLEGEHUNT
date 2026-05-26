# CollegeHunt.

CollegeHunt is a premium college discovery and career outcome planning platform for Indian students. It focuses on the **Decision Layer** (smart comparison, personalized prioritization scoring, admission probability, and placement trend clarity) to help students move from confusion to a confident choice without cognitive overload.

Developed strictly in accordance with Airbnb, TripAdvisor, and NerdWallet design guidelines.

## 🚀 Live Demo
Vercel URL: **[https://collegehunt.vercel.app](https://collegehunt.vercel.app)** *(replace with Vercel deployment URL if customized)*

---

## 🎨 Design Philosophy & Architectural Rules
* **Minimalist Grayscale Palette**: Backgrounds are strictly white (`#FFFFFF`) or soft light gray (`#F9FAFB`) with standard text contrast. Zero dark panels, zero gradient hero blocks.
* **Accent Color**: Single brand accent (`#006AFF`) used exclusively for action buttons, links, active states, and slider accents.
* **Layout Grid**: Generous spacing (60-80px section padding) with clean horizontal scanner grids on desktop and responsive vertical stack cards on mobile viewports.
* **No Animation Latency**: Zero page transition lags, zero hover zooms, and zero parallax delays for a fast, responsive feeling.
* **TypeScript Integrity**: `100%` static typing with no `any` casts or type assertions.

---

## 🌟 Key Product Features

### 🔍 1. College Search & Discovery
* **Instant Client-Side Search**: Debounced search by college name or city without full-page reloads.
* **Multi-Select Filters**: Chained selection by stream (Engineering, Medical, Commerce, Law), city, fees range, and ownership type (Govt/Private/Deemed).
* **Smart Onboarding Flow**: Multi-step onboarding that filters exams dynamically and automatically sorts the home directory by the user's priority (Placement, Low Fees, or Location).
* **Persistent Shortlist State**: Shortlist selections stored in `localStorage` to persist across page reloads.

### ⚖️ 2. Smart Comparison Engine
* **Floating Tray**: Quick-action tray at the bottom when 2+ colleges are shortlisted, enabling rapid comparison triggers.
* **Compare Layout**: Smart comparison table highlighting the **winner in green** with a custom `Award` badge (lowest fees, lowest NIRF rank, highest placement values).
* **Live Priority Sliders**: Sliders allowing users to assign custom weight percentages (Placement / Fees / Location) with real-time score updates out of 100.
* **Highlight Differences Only**: Filter toggle that hides all rows where compared values are identical to clear cognitive noise.
* **Radar Chart Visualizer**: Interactive Recharts Radar Chart mapping colleges across 5 key structural axes at a glance.
* **Comparison Limit Enforcement**: Restricts comparison to a maximum of 3 colleges to maintain visual scanner integrity, showing a clean toast notice if a 4th is added.
* **Shareable URL Mapping**: Compares state (college selections + weights) serialized directly inside query parameters to allow instant sharing of comparison graphs.

### 🎓 3. Detail Page & Admission Predictor
* **Tabs-Based Profile**: Profile tabs covering Overview, Courses & Fees, Placements, Reviews, and Admissions.
* **Placements Trend Chart**: Client-safe Recharts Bar Chart plotting average and maximum placement trends (LPA) over three years.
* **Admission Predictor Widget**: High-fidelity client calculator comparing user exam percentiles against historical cutoffs, with smart evaluation parsing (rank-based for JEE/NEET vs percentile-based for CAT/CUET).

---

## 🛠️ Getting Started

### Prerequisites
* Node.js v18.x or above
* npm or yarn

### Installation & Run
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd COLLEGEHUNT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4. Build for production:
   ```bash
   npm run build
   npm run start
   ```
