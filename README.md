# SMA — Shape Memory Alloy Precision Web Application

A modern, futuristic web application engineered for Shape Memory Alloy (SMA) thermal actuation research, interactive temperature sensor calibration, and crystallographic phase monitoring.

Built with a minimalist black-and-white theme, geometric dot background interactions, Three.js 3D optical visualization, and a real-time Node.js/Express telemetry engine.

---

## 🌟 Key Features

### 1. Minimalist Monochrome Engineering Theme
- Pure black background (`#000000` / `#050505`) with white typography and subtle grey accents.
- Interactive HTML5 canvas background featuring animated geometric dots that smoothly react to cursor proximity and connect with dynamic thin lines.
- Technical typography utilizing **Space Grotesk** for headers, **JetBrains Mono** for numerical telemetry, and **Inter** for descriptions.

### 2. Interactive Navigation Bar
- Sticky navigation header with smooth blur backdrop.
- Links: **Home**, **Technology**, **Temperature Calibration**, **About**.
- Active link tracking with scroll position detection.
- Mobile animated hamburger drawer.
- Quick live telemetry pill displaying current calibrated temperature and sensor status.

### 3. Exactly ONE Central 3D SMA Mechanical Window Assembly
- Rendered using **Three.js** as a realistic, dark graphite mechanical thermal ventilation window assembly with precision CAD geometry:
  - Dark graphite rectangular outer frame with chamfered stiles, perimeter mounting flange, and gasket reveal.
  - Matching hinged inner sash frame with architectural smoked glass infill.
  - Top-hung precision mechanical hinges (knuckles, pivot pins, mounting leaves).
  - Dual kinematic SMA linear actuators extending polished titanium pistons dynamically as the panel opens.
  - Smooth continuous idle rotation around vertical axis when not hovered.
  - Interactive hover-actuation opening outward around the top hinge axis ($0^\circ$ to $60^\circ$).
  - Smooth closing and resumption of idle rotation upon cursor exit.
- Live technical HUD overlay displaying calibrated temperature, actuation status, and SMA phase kinetics.
- Interactive controls: Auto-rotation toggle, perspective reset, manual vent actuation toggle, and mouse click-and-drag 3D orbit.

### 4. Interactive Temperature Calibration Dashboard
- **Live Temperature Telemetry**: Large digital readout in $^\circ\text{C}$, raw temperature, calibration offset ($\Delta T$), and corrected temperature displayed distinctly.
- **Sensor Status**: Badged as `Simulated`, `Connected`, or `Disconnected` (clearly distinguishing simulated telemetry from physical hardware).
- **Calibration Engine**:
  - Reference temperature ($T_{\text{ref}}$) and Measured temperature ($T_{\text{meas}}$) numerical inputs.
  - One-click **Sync with Raw** button.
  - Formula calculation:
    $$\text{Calibration Offset } (\Delta T) = T_{\text{ref}} - T_{\text{meas}}$$
  - Direct manual offset adjustment with $\pm 0.5^\circ\text{C}$ fine-tuning.
  - **Calibrate Sensor** and **Reset Calibration** ($0.00^\circ\text{C}$) buttons.
- **Specimen Thermal Heater Slider**: Allows interactive simulated heating/cooling ($15^\circ\text{C} - 95^\circ\text{C}$) to observe phase transformation in real time.
- **Live Temperature History Chart**: Recharts live streaming graph showing Raw vs Corrected temperature with a configurable high-temperature alert threshold ($75^\circ\text{C}$).
- **ESP32 Hardware Readiness**: Includes copyable Arduino/C++ firmware snippet and documentation for direct POST integration with microcontrollers and K-Type thermocouples.

### 5. SMA Technical Dossier
- Concise engineering explanations of the Shape Memory Effect (SME) and superelasticity.
- Interactive crystallographic schematic comparing **Monoclinic Twinned Martensite ($B19'$)** to **Ordered Cubic Austenite ($B2$)**.
- Milestone explanations: $A_s$ (Austenite Start), $A_f$ (Austenite Finish), $M_s$ (Martensite Start), $M_f$ (Martensite Finish).
- Real-world applications across Aerospace, Robotics, Biomedical, and Automotive engineering.

---

## 🛠️ Architecture & Tech Stack

```
MOM/
├── backend/
│   ├── package.json
│   └── server.js            # Express REST API & telemetry simulation engine
├── frontend/
│   ├── package.json
│   ├── vite.config.js       # Vite dev server with proxy to port 5000
│   ├── index.html           # Font preloading & metadata
│   └── src/
│       ├── index.css        # Monochrome design system
│       ├── main.jsx
│       ├── App.jsx          # Main application orchestrator
│       └── components/
│           ├── GeometricBackground.jsx  # Canvas particle constellation
│           ├── Navbar.jsx               # Sticky navigation & status pill
│           ├── HeroSection.jsx          # Introduction & live stats strip
│           ├── SmaSpecimenBlock.jsx     # 3D SMA mechanical window assembly
│           ├── CalibrationPanel.jsx     # Calibration console & Recharts graph
│           ├── SmaInfoSection.jsx       # Phase diagrams & engineering cards
│           ├── AboutSection.jsx         # Architecture & API specifications
│           └── Footer.jsx               # System status & quick links
└── package.json             # Root orchestrator
```

---

## 🚀 Running the Application

### 1. Start the Backend Server (Port 5000)
```powershell
node backend/server.js
```
The server will start at `http://localhost:5000`.

### 2. Start the Frontend Dev Server (Port 5173)
```powershell
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 📡 Backend REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/temperature` | Retrieves raw temperature, offset, corrected reading, phase, and status |
| `POST` | `/api/calibrate` | Calculates and applies calibration offset ($\Delta T = T_{\text{ref}} - T_{\text{meas}}$) |
| `POST` | `/api/calibrate/reset` | Resets calibration offset to $0.00^\circ\text{C}$ |
| `GET` | `/api/temperature/history`| Retrieves recent rolling telemetry history points |
| `POST` | `/api/sensor/simulate-heat` | Adjusts virtual ambient/heater temperature ($15^\circ\text{C} - 95^\circ\text{C}$) |
| `POST` | `/api/sensor/reading` | Ingestion endpoint for ESP32 / Arduino / RTD hardware |
| `POST` | `/api/settings` | Updates system parameters (high temperature threshold, mode) |
