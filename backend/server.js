const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server and general web access
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// In-memory telemetry & calibration state
const state = {
  mode: 'simulated', // 'simulated' | 'hardware'
  sensorStatus: 'Simulated', // 'Connected' | 'Simulated' | 'Disconnected'
  rawTemperature: 24.5, // Base temperature in °C
  calibrationOffset: 0.0, // T_ref - T_meas
  referenceTemperature: 25.0,
  lastMeasuredAtCalibration: 25.0,
  highTempLimit: 75.0, // Alert threshold in °C
  simulatedTargetTemp: 24.5,
  heaterActive: false,
  hardwareLastSeen: null,
  history: []
};

// Phase thresholds for standard Nitinol (Shape Memory Alloy)
// Martensite (low temp) -> R-Phase -> Austenite (high temp recovery)
function calculatePhase(temp) {
  if (temp < 32.0) return { name: 'Martensite (Twinned)', code: 'M', recoveryPct: 0 };
  if (temp < 45.0) return { name: 'Martensite-Austenite Transition (As)', code: 'M-A', recoveryPct: Math.round(((temp - 32) / 25) * 100) };
  if (temp < 58.0) return { name: 'R-Phase / Partial Austenite', code: 'R/A', recoveryPct: Math.round(((temp - 32) / 26) * 100) };
  return { name: 'Austenite (Full Recovery Shape)', code: 'A', recoveryPct: 100 };
}

// Initialize history buffer with recent timestamps
const now = Date.now();
for (let i = 25; i >= 0; i--) {
  const t = new Date(now - i * 1500);
  const baseT = 24.2 + Math.sin(i * 0.3) * 0.4;
  state.history.push({
    timestamp: t.getTime(),
    timeLabel: t.toLocaleTimeString(),
    raw: Number(baseT.toFixed(2)),
    offset: 0.0,
    corrected: Number(baseT.toFixed(2))
  });
}

// Background simulation ticker for realistic sensor noise and thermal inertia
setInterval(() => {
  if (state.mode === 'simulated') {
    // Thermal approach towards simulatedTargetTemp with gentle thermal inertia + micro noise
    const diff = state.simulatedTargetTemp - state.rawTemperature;
    const step = diff * 0.15; // Thermal conductivity rate
    const microJitter = (Math.random() - 0.5) * 0.12; // Natural thermocouple noise
    
    state.rawTemperature = Number((state.rawTemperature + step + microJitter).toFixed(2));
    state.sensorStatus = 'Simulated';
  } else if (state.mode === 'hardware') {
    // If hardware mode, check watchdog timeout (5s)
    if (state.hardwareLastSeen && Date.now() - state.hardwareLastSeen > 6000) {
      state.sensorStatus = 'Disconnected';
    } else {
      state.sensorStatus = 'Connected';
    }
  }

  const corrected = Number((state.rawTemperature + state.calibrationOffset).toFixed(2));
  const time = new Date();
  
  state.history.push({
    timestamp: time.getTime(),
    timeLabel: time.toLocaleTimeString(),
    raw: state.rawTemperature,
    offset: Number(state.calibrationOffset.toFixed(2)),
    corrected: corrected
  });

  // Keep last 60 data points
  if (state.history.length > 60) {
    state.history.shift();
  }
}, 1200);

// Helper to bundle current status payload
function getTelemetryPayload() {
  const corrected = Number((state.rawTemperature + state.calibrationOffset).toFixed(2));
  const phase = calculatePhase(corrected);
  const thresholdExceeded = corrected >= state.highTempLimit;

  return {
    rawTemperature: state.rawTemperature,
    calibrationOffset: Number(state.calibrationOffset.toFixed(2)),
    correctedTemperature: corrected,
    sensorStatus: state.sensorStatus,
    mode: state.mode,
    unit: '°C',
    timestamp: Date.now(),
    referenceTemperature: state.referenceTemperature,
    lastMeasuredAtCalibration: state.lastMeasuredAtCalibration,
    highTempLimit: state.highTempLimit,
    thresholdExceeded,
    specimenPhase: phase.name,
    phaseCode: phase.code,
    recoveryPct: phase.recoveryPct,
    simulatedTargetTemp: state.simulatedTargetTemp
  };
}

// Routes
// 1. GET /api/temperature — Retrieve current raw and corrected readings
app.get('/api/temperature', (req, res) => {
  res.json({
    success: true,
    data: getTelemetryPayload()
  });
});

// 2. POST /api/calibrate — Apply calibration settings
// Formula: Calibration Offset = Reference Temperature − Measured Temperature
app.post('/api/calibrate', (req, res) => {
  const { referenceTemperature, measuredTemperature, offset } = req.body;

  let calculatedOffset = 0;

  if (offset !== undefined && offset !== null && !isNaN(Number(offset))) {
    calculatedOffset = Number(offset);
    state.calibrationOffset = calculatedOffset;
  } else if (referenceTemperature !== undefined && measuredTemperature !== undefined) {
    const ref = Number(referenceTemperature);
    const meas = Number(measuredTemperature);

    if (isNaN(ref) || isNaN(meas)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid numerical inputs for calibration. Reference and Measured must be valid numbers.'
      });
    }

    if (ref < -100 || ref > 500) {
      return res.status(400).json({
        success: false,
        message: 'Reference temperature outside experimental bounds (-100°C to 500°C).'
      });
    }

    calculatedOffset = Number((ref - meas).toFixed(3));
    state.calibrationOffset = calculatedOffset;
    state.referenceTemperature = ref;
    state.lastMeasuredAtCalibration = meas;
  } else {
    return res.status(400).json({
      success: false,
      message: 'Missing calibration parameters. Provide referenceTemperature & measuredTemperature, or offset.'
    });
  }

  // Update recent history item with new offset
  if (state.history.length > 0) {
    const latest = state.history[state.history.length - 1];
    latest.offset = state.calibrationOffset;
    latest.corrected = Number((latest.raw + state.calibrationOffset).toFixed(2));
  }

  return res.json({
    success: true,
    message: `Calibration offset applied: ${calculatedOffset > 0 ? '+' : ''}${calculatedOffset}°C`,
    data: getTelemetryPayload()
  });
});

// 3. POST /api/calibrate/reset — Reset the calibration offset to 0
app.post('/api/calibrate/reset', (req, res) => {
  state.calibrationOffset = 0.0;
  
  if (state.history.length > 0) {
    const latest = state.history[state.history.length - 1];
    latest.offset = 0.0;
    latest.corrected = latest.raw;
  }

  res.json({
    success: true,
    message: 'Calibration offset successfully reset to 0.00°C',
    data: getTelemetryPayload()
  });
});

// 4. GET /api/temperature/history — Retrieve temperature history
app.get('/api/temperature/history', (req, res) => {
  res.json({
    success: true,
    history: state.history,
    count: state.history.length
  });
});

// 5. POST /api/sensor/simulate-heat — Adjust simulated heat source
app.post('/api/sensor/simulate-heat', (req, res) => {
  const { targetTemperature } = req.body;
  const target = Number(targetTemperature);
  
  if (isNaN(target) || target < -20 || target > 150) {
    return res.status(400).json({
      success: false,
      message: 'Target temperature must be between -20°C and 150°C'
    });
  }

  state.simulatedTargetTemp = target;
  if (state.mode !== 'simulated') {
    state.mode = 'simulated';
    state.sensorStatus = 'Simulated';
  }

  res.json({
    success: true,
    message: `Simulated ambient target set to ${target}°C`,
    data: getTelemetryPayload()
  });
});

// 6. POST /api/sensor/reading — Endpoint for ESP32 / Arduino / physical hardware
app.post('/api/sensor/reading', (req, res) => {
  const { temperature, sensorId, deviceToken } = req.body;
  const tempVal = Number(temperature);

  if (isNaN(tempVal)) {
    return res.status(400).json({
      success: false,
      message: 'Temperature must be a valid number'
    });
  }

  state.mode = 'hardware';
  state.sensorStatus = 'Connected';
  state.rawTemperature = Number(tempVal.toFixed(2));
  state.hardwareLastSeen = Date.now();

  res.json({
    success: true,
    message: `Hardware telemetry received from ${sensorId || 'ESP32-Thermocouple'}`,
    data: getTelemetryPayload()
  });
});

// 7. POST /api/settings — Update sensor modes or thresholds
app.post('/api/settings', (req, res) => {
  const { highTempLimit, mode, sensorStatus } = req.body;

  if (highTempLimit !== undefined && !isNaN(Number(highTempLimit))) {
    state.highTempLimit = Number(highTempLimit);
  }

  if (mode && ['simulated', 'hardware'].includes(mode)) {
    state.mode = mode;
    state.sensorStatus = mode === 'simulated' ? 'Simulated' : (state.hardwareLastSeen ? 'Connected' : 'Disconnected');
  }

  if (sensorStatus && ['Connected', 'Simulated', 'Disconnected'].includes(sensorStatus)) {
    state.sensorStatus = sensorStatus;
  }

  res.json({
    success: true,
    message: 'System settings updated',
    data: getTelemetryPayload()
  });
});

// Root API information
app.get('/api', (req, res) => {
  res.json({
    title: 'SMA — Shape Memory Alloy Calibration REST API',
    version: '1.0.0',
    endpoints: [
      'GET /api/temperature',
      'POST /api/calibrate',
      'POST /api/calibrate/reset',
      'GET /api/temperature/history',
      'POST /api/sensor/simulate-heat',
      'POST /api/sensor/reading (ESP32 / Microcontroller Ingestion)',
      'POST /api/settings'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`SMA Telemetry & Calibration Server running on http://localhost:${PORT}`);
});
