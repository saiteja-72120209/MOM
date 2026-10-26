import React from 'react';
import { Sliders, ArrowDown, Cpu, ChevronRight, Activity, Terminal, Shield } from 'lucide-react';

export default function HeroSection({ onNavigate, telemetry }) {
  const currentTemp = telemetry?.correctedTemperature ?? 24.5;
  const phase = telemetry?.specimenPhase ?? 'Martensite';
  const recoveryPct = telemetry?.recoveryPct ?? 0;

  return (
    <section
      id="home"
      style={{
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: '120px',
        paddingBottom: '60px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div className="container">
        {/* Top Minimalist Tag */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <div className="badge-status badge-connected">
            <span className="pulse-dot" />
            <span>NITINOL RECOVERY SYSTEM // VER 2.4</span>
          </div>
          <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            LAB SPECIMEN [N60-TI]
          </span>
        </div>

        {/* Main Title */}
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(2.6rem, 6.5vw, 4.8rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            maxWidth: '1000px',
            marginBottom: '24px',
          }}
        >
          SMA — Shape Memory Alloy
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(1.4rem, 3.2vw, 2.4rem)',
              fontWeight: 400,
              color: 'var(--text-secondary)',
              letterSpacing: '-0.01em',
              marginTop: '8px',
            }}
          >
            Precision Temperature Calibration & Phase Kinetics
          </span>
        </h1>

        {/* Short Professional Introduction */}
        <p
          style={{
            fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
            color: 'var(--text-secondary)',
            maxWidth: '740px',
            lineHeight: 1.7,
            marginBottom: '36px',
          }}
        >
          Shape Memory Alloys (SMA) are functional metallic materials capable of recovering a predetermined geometric form upon thermal excitation. As temperature rises through the characteristic austenitic phase threshold, internal twinned monoclinic structures reconfigure into rigid cubic lattices. Accurate temperature sensor calibration is critical to map this non-linear hysteresis trajectory, measure recovery stroke force, and prevent thermal degradation in aerospace, soft robotics, and biomedical applications.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '48px',
          }}
        >
          <button
            onClick={() => onNavigate('calibration')}
            className="btn-primary"
            style={{ padding: '14px 28px', fontSize: '0.86rem' }}
          >
            <Sliders size={16} />
            <span>OPEN CALIBRATION CONSOLE</span>
          </button>

          <button
            onClick={() => onNavigate('technology')}
            className="btn-secondary"
            style={{ padding: '14px 28px', fontSize: '0.86rem' }}
          >
            <span>EXPLORE PHASE MECHANICS</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Live Lab Telemetry Quick Strip */}
        <div
          className="engineering-card tech-corner"
          style={{
            padding: '20px 24px',
            background: 'rgba(10, 10, 10, 0.75)',
            border: '1px solid var(--border-medium)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Metric 1 */}
            <div>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                CALIBRATED TEMPERATURE
              </div>
              <div
                className="font-mono"
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '6px',
                }}
              >
                {currentTemp.toFixed(2)}°C
                <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-secondary)' }}>
                  (±0.02°C)
                </span>
              </div>
            </div>

            {/* Metric 2 */}
            <div>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                ACTIVE SPECIMEN PHASE
              </div>
              <div
                className="font-mono"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginTop: '4px',
                }}
              >
                {phase}
              </div>
            </div>

            {/* Metric 3 */}
            <div>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                SHAPE RECOVERY RATIO
              </div>
              <div
                className="font-mono"
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginTop: '4px',
                }}
              >
                {recoveryPct}%
              </div>
            </div>

            {/* Metric 4 */}
            <div>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                HARDWARE INTERFACE
              </div>
              <div
                className="font-mono"
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span className="pulse-dot-orange" />
                <span>ESP32 READY // REST API</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
