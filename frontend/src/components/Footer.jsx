import React from 'react';
import { ArrowUp, Terminal, Shield, Cpu, Activity } from 'lucide-react';
import SmaLogo from './SmaLogo';

export default function Footer({ onNavigate, telemetry }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: '#000000',
        padding: '60px 0 40px 0',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <SmaLogo size={28} />
              <span className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                SMA
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '300px' }}>
              Shape Memory Alloy precision thermal calibration and crystallographic phase monitoring platform.
            </p>
            <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Made by <span style={{ color: '#ffffff', fontWeight: 600 }}>Gutti Saiteja</span>
            </div>
            <div style={{ marginTop: '16px' }} className="badge-status badge-connected">
              <span className="pulse-dot" />
              <span>SYSTEM ONLINE // VER 2.4</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              NAVIGATION //
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Home', 'Technology', 'Temperature Calibration', 'About'].map((item) => {
                const idMap = {
                  Home: 'home',
                  Technology: 'technology',
                  'Temperature Calibration': 'calibration',
                  About: 'about',
                };
                return (
                  <li key={item}>
                    <button
                      onClick={() => onNavigate(idMap[item])}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                      {item}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Laboratory Coordinates */}
          <div>
            <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              TELEMETRY BUS //
            </div>
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>HOST: localhost:5000</div>
              <div>PROTOCOL: HTTP / JSON REST</div>
              <div>POLL INTERVAL: 1200ms</div>
              <div>SPECIMEN: Nitinol-60 Shape Memory Core</div>
            </div>
          </div>

          {/* Back to top & Disclaimer */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              SYSTEM STATUS //
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Simulated telemetry active when physical microcontroller is offline. Real sensor connection supported via ESP32 endpoint.
            </p>
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={scrollToTop}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.75rem' }}
              >
                <ArrowUp size={14} />
                <span>BACK TO TOP</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div>© {new Date().getFullYear()} SMA — Shape Memory Alloy Platform.</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>MADE BY</span>
            <span
              style={{
                color: '#ffffff',
                fontWeight: 600,
                letterSpacing: '0.06em',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-medium)',
                padding: '4px 12px',
                borderRadius: '6px',
              }}
            >
              GUTTI SAITEJA
            </span>
          </div>
          <div>MINIMALIST MONOCHROME SPECIFICATION // MIT LICENSE</div>
        </div>

        <div
          style={{
            width: '100%',
            marginTop: '18px',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>CREDITS</span>
          <span style={{ color: '#ffffff', fontWeight: 700, marginLeft: '8px' }}>MADE BY GUTTI SAITEJA</span>
        </div>
      </div>
    </footer>
  );
}
