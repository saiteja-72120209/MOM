import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Thermometer,
  Cpu,
  Radio,
  Settings2,
  Code,
  Copy,
  Check,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export default function CalibrationPanel({
  telemetry,
  history,
  onCalibrate,
  onResetCalibration,
  onSimulateHeat,
  onUpdateSettings,
  isCalibrating
}) {
  // Local form states
  const [refTempInput, setRefTempInput] = useState('25.00');
  const [measTempInput, setMeasTempInput] = useState(
    telemetry ? telemetry.rawTemperature.toFixed(2) : '24.50'
  );
  const [manualOffsetInput, setManualOffsetInput] = useState(
    telemetry ? telemetry.calibrationOffset.toFixed(2) : '0.00'
  );
  const [limitInput, setLimitInput] = useState(
    telemetry ? telemetry.highTempLimit.toString() : '75.0'
  );
  const [simSliderValue, setSimSliderValue] = useState(
    telemetry ? telemetry.simulatedTargetTemp || 24.5 : 24.5
  );

  const [activeTab, setActiveTab] = useState('two-point'); // 'two-point' | 'direct-offset'
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }
  const [showEspModal, setShowEspModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Synchronize measured input with current reading when user clicks "Capture Reading"
  const handleCaptureCurrent = () => {
    if (telemetry) {
      setMeasTempInput(telemetry.rawTemperature.toFixed(2));
      setFeedback({
        type: 'info',
        message: `Captured current sensor raw reading: ${telemetry.rawTemperature.toFixed(2)}°C`
      });
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // Submit calibration
  const handleSubmitCalibration = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (activeTab === 'two-point') {
      const ref = parseFloat(refTempInput);
      const meas = parseFloat(measTempInput);

      if (isNaN(ref) || isNaN(meas)) {
        setFeedback({
          type: 'error',
          message: 'Validation Error: Both reference and measured temperatures must be valid numerical values.'
        });
        return;
      }

      if (ref < -50 || ref > 300) {
        setFeedback({
          type: 'error',
          message: 'Reference temperature outside standard experimental limits (-50°C to 300°C).'
        });
        return;
      }

      const calculatedOffset = (ref - meas).toFixed(3);
      const res = await onCalibrate({ referenceTemperature: ref, measuredTemperature: meas });

      if (res.success) {
        setManualOffsetInput(calculatedOffset);
        setFeedback({
          type: 'success',
          message: `Sensor calibrated successfully. Calculated offset: ${calculatedOffset > 0 ? '+' : ''}${calculatedOffset}°C`
        });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Calibration failed.' });
      }
    } else {
      const off = parseFloat(manualOffsetInput);
      if (isNaN(off)) {
        setFeedback({
          type: 'error',
          message: 'Validation Error: Offset must be a valid numerical value.'
        });
        return;
      }

      const res = await onCalibrate({ offset: off });
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Manual offset applied: ${off > 0 ? '+' : ''}${off}°C`
        });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Calibration failed.' });
      }
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  // Reset calibration
  const handleReset = async () => {
    const res = await onResetCalibration();
    if (res.success) {
      setManualOffsetInput('0.00');
      setFeedback({
        type: 'success',
        message: 'Calibration offset successfully reset to 0.00°C.'
      });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Slider change for simulated thermal test
  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setSimSliderValue(val);
    onSimulateHeat(val);
  };

  // Update limit
  const handleLimitUpdate = () => {
    const val = parseFloat(limitInput);
    if (!isNaN(val) && val > 0) {
      onUpdateSettings({ highTempLimit: val });
      setFeedback({
        type: 'info',
        message: `High-temperature threshold updated to ${val}°C`
      });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const correctedTemp = telemetry?.correctedTemperature ?? 24.5;
  const rawTemp = telemetry?.rawTemperature ?? 24.5;
  const offset = telemetry?.calibrationOffset ?? 0.0;
  const highLimit = telemetry?.highTempLimit ?? 75.0;
  const isExceeded = telemetry?.thresholdExceeded ?? (correctedTemp >= highLimit);
  const sensorStatus = telemetry?.sensorStatus ?? 'Simulated';

  // ESP32 Microcontroller sample firmware code
  const esp32CodeSnippet = `// SMA Telemetry Ingest Firmware for ESP32 + MAX6675 Thermocouple
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "max6675.h"

const char* ssid = "YOUR_LAB_WIFI";
const char* password = "WIFI_PASSWORD";
const char* serverUrl = "http://YOUR_SERVER_IP:5000/api/sensor/reading";

// MAX6675 SPI Pins
int thermoDO = 19;
int thermoCS = 23;
int thermoCLK = 5;
MAX6675 thermocouple(thermoCLK, thermoCS, thermoDO);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    float celsius = thermocouple.readCelsius();
    StaticJsonDocument<200> doc;
    doc["sensorId"] = "ESP32-K-Type-01";
    doc["temperature"] = celsius;

    String jsonString;
    serializeJson(doc, jsonString);
    int httpResponseCode = http.POST(jsonString);
    http.end();
  }
  delay(1200); // 1.2s telemetry rate
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(esp32CodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* High Temperature Limit Alert Banner */}
      {isExceeded && (
        <div
          style={{
            background: 'var(--accent-alert-bg)',
            border: '1px solid var(--accent-alert-border)',
            borderRadius: '8px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            color: '#ff4757',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={22} />
            <div>
              <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                CRITICAL WARNING: EXPERIMENTAL TEMPERATURE THRESHOLD EXCEEDED
              </div>
              <div style={{ fontSize: '0.78rem', color: '#ff8a93' }}>
                Calibrated temperature ({correctedTemp.toFixed(2)}°C) exceeds safety limit ({highLimit}°C). Risk of SMA plastic deformation or lattice dislocation.
              </div>
            </div>
          </div>
          <span
            className="font-mono"
            style={{
              padding: '4px 10px',
              border: '1px solid #ff4757',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            ! HIGH TEMP
          </span>
        </div>
      )}

      {/* Main Grid: Left Telemetry Readout & Gauge / Right Calibration Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
        }}
      >
        {/* ========================================================
            CARD 1: Live Temperature Sensor Telemetry Readout
            ======================================================== */}
        <div className="engineering-card tech-corner" style={{ padding: '28px 24px' }}>
          {/* Card Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '14px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Thermometer size={18} color="#ffffff" />
              <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.06em' }}>
                TEMPERATURE TELEMETRY
              </span>
            </div>

            {/* Sensor Status Badge */}
            <div
              className={`badge-status ${
                sensorStatus === 'Connected'
                  ? 'badge-connected'
                  : sensorStatus === 'Simulated'
                  ? 'badge-simulated'
                  : 'badge-disconnected'
              }`}
            >
              <span
                className={
                  sensorStatus === 'Connected'
                    ? 'pulse-dot'
                    : sensorStatus === 'Simulated'
                    ? 'pulse-dot-orange'
                    : 'pulse-dot-red'
                }
              />
              <span>SENSOR: {sensorStatus.toUpperCase()}</span>
            </div>
          </div>

          {/* Prominent Corrected Temperature Display */}
          <div
            style={{
              textAlign: 'center',
              padding: '24px 16px',
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              className="font-mono"
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Corrected Calibration Reading
            </div>

            <div
              className="font-display"
              style={{
                fontSize: '4.2rem',
                fontWeight: 700,
                color: isExceeded ? '#ff4757' : '#ffffff',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                textShadow: isExceeded
                  ? '0 0 20px rgba(255, 71, 87, 0.5)'
                  : '0 0 30px rgba(255, 255, 255, 0.15)',
              }}
            >
              {correctedTemp.toFixed(2)}
              <span style={{ fontSize: '2.2rem', fontWeight: 400, marginLeft: '6px' }}>°C</span>
            </div>

            {/* Phase pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                padding: '4px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-medium)',
                borderRadius: '16px',
              }}
            >
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                CURRENT ALLOY PHASE:
              </span>
              <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>
                {telemetry?.specimenPhase || 'Martensite'}
              </span>
            </div>
          </div>

          {/* Three-part Diagnostic Split: Raw, Offset, Corrected */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '12px 10px',
                textAlign: 'center',
              }}
            >
              <div className="font-mono" style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
                RAW SENSOR
              </div>
              <div className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#d4d4d4', marginTop: '4px' }}>
                {rawTemp.toFixed(2)}°C
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '12px 10px',
                textAlign: 'center',
              }}
            >
              <div className="font-mono" style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
                CALIB. OFFSET
              </div>
              <div
                className="font-mono"
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: offset !== 0 ? '#ffffff' : 'var(--text-muted)',
                  marginTop: '4px',
                }}
              >
                {offset > 0 ? `+${offset.toFixed(2)}` : offset.toFixed(2)}°C
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-medium)',
                borderRadius: '6px',
                padding: '12px 10px',
                textAlign: 'center',
              }}
            >
              <div className="font-mono" style={{ fontSize: '0.64rem', color: '#ffffff' }}>
                CORRECTED
              </div>
              <div className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                {correctedTemp.toFixed(2)}°C
              </div>
            </div>
          </div>

          {/* Minimalist Linear Temperature Scale Gauge */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                THERMAL PHASE SPECTRUM (0°C — 100°C)
              </span>
              <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                LIMIT: {highLimit}°C
              </span>
            </div>

            <div
              style={{
                width: '100%',
                height: '8px',
                background: '#141414',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'visible',
              }}
            >
              {/* Martensite to Austenite zone (35°C to 58°C) */}
              <div
                style={{
                  position: 'absolute',
                  left: '35%',
                  width: '23%',
                  top: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderLeft: '1px dashed rgba(255, 255, 255, 0.3)',
                  borderRight: '1px dashed rgba(255, 255, 255, 0.3)',
                }}
                title="SME Active Transformation Zone (As = 35°C, Af = 58°C)"
              />

              {/* High limit marker line */}
              <div
                style={{
                  position: 'absolute',
                  left: `${Math.min(100, Math.max(0, highLimit))}%`,
                  top: '-4px',
                  bottom: '-4px',
                  width: '2px',
                  background: '#ff4757',
                  zIndex: 2,
                }}
                title={`High Temperature Limit: ${highLimit}°C`}
              />

              {/* Current reading position pill */}
              <div
                style={{
                  position: 'absolute',
                  left: `${Math.min(100, Math.max(0, correctedTemp))}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '14px',
                  height: '14px',
                  background: isExceeded ? '#ff4757' : '#ffffff',
                  border: '2px solid #000000',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                  transition: 'left 0.3s ease',
                  zIndex: 3,
                }}
              />
            </div>

            {/* Scale markers */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px',
                fontSize: '0.62rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span>0°C [M]</span>
              <span>35°C [As]</span>
              <span>58°C [Af]</span>
              <span style={{ color: '#ff4757' }}>{highLimit}°C [ALERT]</span>
              <span>100°C</span>
            </div>
          </div>

          {/* Simulated Mode Transparency Disclaimer */}
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={14} color="var(--text-secondary)" />
              <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                MODE: {sensorStatus === 'Connected' ? 'REAL HARDWARE (ESP32)' : 'SIMULATED TELEMETRY ACTIVE'}
              </span>
            </div>

            <button
              onClick={() => setShowEspModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              ESP32 Setup Guide →
            </button>
          </div>
        </div>

        {/* ========================================================
            CARD 2: Calibration Controls & Interactive Adjustments
            ======================================================== */}
        <div className="engineering-card tech-corner" style={{ padding: '28px 24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '14px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sliders size={18} color="#ffffff" />
              <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.06em' }}>
                CALIBRATION ENGINE
              </span>
            </div>

            {/* Mode Tabs */}
            <div
              style={{
                display: 'inline-flex',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '3px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('two-point')}
                style={{
                  background: activeTab === 'two-point' ? '#ffffff' : 'transparent',
                  color: activeTab === 'two-point' ? '#000000' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Ref / Measured
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('direct-offset')}
                style={{
                  background: activeTab === 'direct-offset' ? '#ffffff' : 'transparent',
                  color: activeTab === 'direct-offset' ? '#000000' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Direct Offset
              </button>
            </div>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor:
                  feedback.type === 'success'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : feedback.type === 'error'
                    ? 'var(--accent-alert-bg)'
                    : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${
                  feedback.type === 'success'
                    ? 'var(--border-bright)'
                    : feedback.type === 'error'
                    ? 'var(--accent-alert-border)'
                    : 'var(--border-subtle)'
                }`,
                color: feedback.type === 'error' ? '#ff6b6b' : '#ffffff',
              }}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmitCalibration} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {activeTab === 'two-point' ? (
              <>
                {/* Reference Temperature */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      REFERENCE TEMPERATURE (T_REF)
                    </label>
                    <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      Standard Ice-Bath / Certified Source
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      step="0.01"
                      value={refTempInput}
                      onChange={(e) => setRefTempInput(e.target.value)}
                      placeholder="e.g. 25.00"
                      className="input-field"
                      required
                    />
                    <span
                      className="font-mono"
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        fontSize: '0.82rem',
                      }}
                    >
                      °C
                    </span>
                  </div>
                </div>

                {/* Measured Temperature */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      SENSOR MEASURED TEMPERATURE (T_MEAS)
                    </label>
                    <button
                      type="button"
                      onClick={handleCaptureCurrent}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ffffff',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Sync with Raw ({rawTemp.toFixed(2)}°C)
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      step="0.01"
                      value={measTempInput}
                      onChange={(e) => setMeasTempInput(e.target.value)}
                      placeholder="e.g. 24.50"
                      className="input-field"
                      required
                    />
                    <span
                      className="font-mono"
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        fontSize: '0.82rem',
                      }}
                    >
                      °C
                    </span>
                  </div>
                </div>

                {/* Formula Preview Box */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    FORMULA: ΔT = T_ref − T_meas
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: '#ffffff', fontWeight: 600 }}>
                    ΔT = {((parseFloat(refTempInput) || 0) - (parseFloat(measTempInput) || 0)).toFixed(2)}°C
                  </span>
                </div>
              </>
            ) : (
              /* Direct Offset Input */
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    MANUAL CALIBRATION OFFSET (ΔT)
                  </label>
                  <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Added Directly to Raw Reading
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    step="0.01"
                    value={manualOffsetInput}
                    onChange={(e) => setManualOffsetInput(e.target.value)}
                    placeholder="0.00"
                    className="input-field"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setManualOffsetInput((prev) => (parseFloat(prev || 0) - 0.5).toFixed(2))}
                    className="btn-secondary"
                    style={{ padding: '0 12px' }}
                    title="Nudge -0.5°C"
                  >
                    -0.5
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualOffsetInput((prev) => (parseFloat(prev || 0) + 0.5).toFixed(2))}
                    className="btn-secondary"
                    style={{ padding: '0 12px' }}
                    title="Nudge +0.5°C"
                  >
                    +0.5
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Simulation / Ambient Heat Control Slider */}
            <div
              style={{
                marginTop: '6px',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flame size={13} />
                  SPECIMEN THERMAL HEATER / AMBIENT SLIDER
                </span>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: 600 }}>
                  {simSliderValue.toFixed(1)}°C
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="95"
                step="0.5"
                value={simSliderValue}
                onChange={handleSliderChange}
                className="tech-slider"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>15°C [Cold Martensite]</span>
                <span>45°C [Phase Transition]</span>
                <span>95°C [Full Austenite]</span>
              </div>
            </div>

            {/* Action Buttons: Calibrate Sensor & Reset Calibration */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button
                type="submit"
                disabled={isCalibrating}
                className="btn-primary"
                style={{ flex: 2 }}
              >
                <CheckCircle2 size={15} />
                <span>{isCalibrating ? 'CALIBRATING...' : 'CALIBRATE SENSOR'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary"
                style={{ flex: 1 }}
                title="Reset calibration offset to 0.00°C"
              >
                <RotateCcw size={14} />
                <span>RESET</span>
              </button>
            </div>
          </form>

          {/* Experimental High-Temperature Limit Settings Drawer */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings2 size={15} color="var(--text-muted)" />
              <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                HIGH TEMP SAFETY THRESHOLD:
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                style={{
                  width: '68px',
                  background: '#111111',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  textAlign: 'right',
                }}
              />
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                °C
              </span>
              <button
                type="button"
                onClick={handleLimitUpdate}
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.68rem' }}
              >
                Set
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FULL-WIDTH CARD 3: Live Temperature History Graph
          ======================================================== */}
      <div className="engineering-card tech-corner" style={{ padding: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={18} color="#ffffff" />
            <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.06em' }}>
              LIVE THERMAL TELEMETRY & CALIBRATION HISTORY
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '2px', background: '#ffffff', display: 'inline-block' }} />
              <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                Corrected (°C)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '2px', background: '#666666', display: 'inline-block' }} />
              <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Raw Sensor (°C)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '2px', background: '#ff4757', display: 'inline-block', borderTop: '1px dashed' }} />
              <span className="font-mono" style={{ fontSize: '0.68rem', color: '#ff4757' }}>
                Threshold Limit ({highLimit}°C)
              </span>
            </div>
          </div>
        </div>

        {/* Recharts Live Chart Container */}
        <div style={{ width: '100%', height: '280px', marginTop: '12px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
              <XAxis
                dataKey="timeLabel"
                stroke="#444444"
                tick={{ fill: '#666666', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#444444"
                domain={['auto', 'auto']}
                tick={{ fill: '#666666', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                unit="°C"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#ffffff',
                }}
              />
              <ReferenceLine
                y={highLimit}
                stroke="#ff4757"
                strokeDasharray="4 4"
                label={{
                  value: `Limit: ${highLimit}°C`,
                  fill: '#ff4757',
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  position: 'insideTopRight',
                }}
              />
              <Line
                type="monotone"
                dataKey="raw"
                name="Raw Sensor"
                stroke="#666666"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="corrected"
                name="Corrected Reading"
                stroke="#ffffff"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '12px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            DATA SAMPLES: {history.length} POINTS • REFRESH RATE: 1200ms
          </span>
          <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            AUTONOMOUS CALIBRATION OFFSET ENGINE ACTIVE
          </span>
        </div>
      </div>

      {/* ========================================================
          MODAL: ESP32 / Hardware Sensor Deployment Guide
          ======================================================== */}
      {showEspModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowEspModal(false)}
        >
          <div
            className="engineering-card tech-corner"
            style={{
              width: '100%',
              maxWidth: '720px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '30px',
              background: '#0a0a0a',
              border: '1px solid var(--border-bright)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu size={20} color="#ffffff" />
                <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                  ESP32 Microcontroller Telemetry Integration
                </h3>
              </div>
              <button
                onClick={() => setShowEspModal(false)}
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                ✕ Close
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
              The SMA platform is architected for seamless transition between simulated testing and live laboratory hardware. To connect a physical K-Type thermocouple or RTD sensor, flash an ESP32 microcontroller with the code below to stream live readings directly into the Express backend API.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: '#141414',
                borderRadius: '6px 6px 0 0',
                border: '1px solid var(--border-medium)',
                borderBottom: 'none',
              }}
            >
              <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                ESP32_SMA_TELEMETRY.ino
              </span>
              <button
                onClick={copyToClipboard}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                }}
              >
                {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre
              style={{
                backgroundColor: '#050505',
                border: '1px solid var(--border-medium)',
                borderRadius: '0 0 6px 6px',
                padding: '16px',
                color: '#e0e0e0',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                overflowX: 'auto',
                lineHeight: 1.5,
                marginBottom: '20px',
              }}
            >
              {esp32CodeSnippet}
            </pre>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '12px 16px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
              }}
            >
              <strong style={{ color: '#ffffff' }}>Target Endpoint:</strong> <code>POST http://&lt;HOST&gt;:5000/api/sensor/reading</code><br />
              <strong style={{ color: '#ffffff' }}>Payload Format:</strong> <code>&#123; "sensorId": "ESP32-K-Type-01", "temperature": 25.4 &#125;</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
