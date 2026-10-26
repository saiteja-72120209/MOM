import React from 'react';
import { Terminal, Server, Cpu, Check, Layers, ExternalLink, Code2 } from 'lucide-react';

export default function AboutSection() {
  const apiEndpoints = [
    { method: 'GET', path: '/api/temperature', desc: 'Fetches raw temperature, calibration offset, corrected temperature, phase state, and alert status.' },
    { method: 'POST', path: '/api/calibrate', desc: 'Accepts referenceTemperature & measuredTemperature or direct offset; computes offset and recalibrates stream.' },
    { method: 'POST', path: '/api/calibrate/reset', desc: 'Resets calibration offset to 0.00°C back to raw sensor telemetry.' },
    { method: 'GET', path: '/api/temperature/history', desc: 'Returns rolling history buffer of recent time-stamped thermal telemetry samples.' },
    { method: 'POST', path: '/api/sensor/reading', desc: 'Ingestion endpoint for physical microcontrollers (ESP32 / Arduino / RTD).' },
    { method: 'POST', path: '/api/sensor/simulate-heat', desc: 'Adjusts virtual heat source and ambient target for simulated experiments.' }
  ];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          className="font-mono"
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          [SYSTEM ARCHITECTURE & LABORATORY SPECIFICATIONS]
        </div>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        >
          About the SMA Platform
        </h2>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '12px auto 0',
            lineHeight: 1.6,
          }}
        >
          Engineered for precision materials science research, thermal hysteresis tracking, and physical microcontroller telemetry streaming.
        </p>
      </div>

      {/* 3-Column Architecture Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '36px',
        }}
      >
        {/* Col 1 */}
        <div className="engineering-card tech-corner" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Layers size={18} color="#ffffff" />
            <h3 className="font-display" style={{ fontSize: '1.05rem', color: '#ffffff' }}>
              Frontend Visualization
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
            Built with React.js and Vite. Features a realistic 3D SMA-actuated thermal ventilation window assembly rendered in WebGL via Three.js with precision CAD geometry, graphite frames, and interactive hover actuation. Real-time telemetry visualized via Recharts.
          </p>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span className="badge-status">React 19</span>
            <span className="badge-status">Three.js</span>
            <span className="badge-status">Recharts</span>
            <span className="badge-status">Canvas Particles</span>
          </div>
        </div>

        {/* Col 2 */}
        <div className="engineering-card tech-corner" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Server size={18} color="#ffffff" />
            <h3 className="font-display" style={{ fontSize: '1.05rem', color: '#ffffff' }}>
              Backend Calibration Engine
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
            Powered by Node.js and Express. Implements deterministic offset calibration logic (ΔT = T_ref − T_meas), real-time rolling telemetry buffers, simulated thermal inertia models, and validation routines with robust error diagnostics.
          </p>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span className="badge-status">Node.js</span>
            <span className="badge-status">Express.js</span>
            <span className="badge-status">CORS Enabled</span>
            <span className="badge-status">In-Memory Store</span>
          </div>
        </div>

        {/* Col 3 */}
        <div className="engineering-card tech-corner" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Cpu size={18} color="#ffffff" />
            <h3 className="font-display" style={{ fontSize: '1.05rem', color: '#ffffff' }}>
              Hardware Sensor Integration
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
            Pre-configured for physical sensor deployment. Microcontrollers like the ESP32 with K-type thermocouples or Pt100 RTDs stream HTTP POST requests to the backend ingest route, automatically overriding simulated readings upon connection.
          </p>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span className="badge-status">ESP32 Ready</span>
            <span className="badge-status">K-Type Thermocouple</span>
            <span className="badge-status">MAX6675</span>
            <span className="badge-status">JSON REST</span>
          </div>
        </div>
      </div>

      {/* Backend REST API Reference Table */}
      <div className="engineering-card tech-corner" style={{ padding: '28px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <Code2 size={18} color="#ffffff" />
          <h3 className="font-display" style={{ fontSize: '1.15rem', color: '#ffffff' }}>
            Backend REST API Specification
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)' }}>
                <th className="font-mono" style={{ padding: '10px 14px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>METHOD</th>
                <th className="font-mono" style={{ padding: '10px 14px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>ENDPOINT</th>
                <th className="font-mono" style={{ padding: '10px 14px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>FUNCTIONALITY</th>
              </tr>
            </thead>
            <tbody>
              {apiEndpoints.map((ep, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.2s',
                  }}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      className="font-mono"
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: ep.method === 'GET' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)',
                        color: '#ffffff',
                      }}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td className="font-mono" style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#ffffff' }}>
                    {ep.path}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {ep.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lab Verification & Calibration Protocol Card */}
      <div
        className="engineering-card"
        style={{
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed var(--border-medium)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div>
          <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            LABORATORY COMPLIANCE
          </div>
          <div className="font-display" style={{ fontSize: '1.05rem', color: '#ffffff', marginTop: '2px' }}>
            ASTM F2004 Standard Test Method for Transformation Temperature of Nitinol
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Differential Scanning Calorimetry (DSC) and active thermocouple calibration verified for hysteresis fidelity.
          </div>
        </div>

        <div className="badge-status badge-connected" style={{ padding: '6px 14px' }}>
          <Check size={14} />
          <span>CALIBRATION PROTOCOL ACTIVE</span>
        </div>
      </div>

      {/* Creator Credits Card */}
      <div
        className="engineering-card tech-corner"
        style={{
          marginTop: '20px',
          padding: '20px 24px',
          background: 'rgba(10, 10, 10, 0.75)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Code2 size={18} color="#ffffff" />
          <div>
            <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              DEVELOPMENT & ARCHITECTURE CREDITS
            </div>
            <div className="font-display" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>
              Made by Gutti Saiteja
            </div>
          </div>
        </div>
        <div className="badge-status badge-connected" style={{ padding: '6px 14px' }}>
          <span>LEAD DEVELOPER // GUTTI SAITEJA</span>
        </div>
      </div>
    </div>
  );
}
