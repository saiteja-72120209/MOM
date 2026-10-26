import React, { useState, useEffect } from 'react';
import { Menu, X, Sliders, Cpu, Info, Home as HomeIcon, Zap, ShieldCheck } from 'lucide-react';
import SmaLogo from './SmaLogo';

export default function Navbar({ activeSection, onNavigate, telemetry }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'technology', label: 'Technology', icon: Cpu },
    { id: 'calibration', label: 'Temperature Calibration', icon: Sliders },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleLinkClick = (id) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.88)' : 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${isScrolled ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)'}`,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'var(--header-height)',
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => handleLinkClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {/* Kinetic Sliced Sphere Logo Mark */}
          <SmaLogo size={32} />

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
              }}
            >
              <span
                className="font-display"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#ffffff',
                }}
              >
                SMA
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.06em',
                }}
              >
                LAB-01
              </span>
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.62rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: '-2px',
              }}
            >
              Shape Memory Alloy
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '32px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  padding: '8px 0',
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span>{link.label}</span>
                {/* Active Underline Indicator */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#ffffff',
                    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </button>
            );
          })}
        </nav>

        {/* Right CTA / Live Telemetry Pill */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '16px',
          }}
          className="desktop-actions"
        >
          {/* Live Sensor Quick Pill */}
          <div
            onClick={() => handleLinkClick('calibration')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
            title="Jump to Temperature Calibration Console"
          >
            <span
              className={
                telemetry?.thresholdExceeded
                  ? 'pulse-dot-red'
                  : telemetry?.sensorStatus === 'Connected'
                  ? 'pulse-dot'
                  : 'pulse-dot-orange'
              }
            />
            <span
              className="font-mono"
              style={{
                fontSize: '0.75rem',
                color: '#ffffff',
                fontWeight: 600,
              }}
            >
              {telemetry ? `${telemetry.correctedTemperature.toFixed(1)}°C` : '24.5°C'}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              {telemetry?.sensorStatus || 'SIMULATED'}
            </span>
          </div>

          <button
            onClick={() => handleLinkClick('calibration')}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.75rem' }}
          >
            <Sliders size={13} />
            <span>CALIBRATE</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-medium)',
            color: '#ffffff',
            padding: '8px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="mobile-hamburger-btn"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'rgba(5, 5, 5, 0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-medium)',
            padding: '20px 24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </button>
            );
          })}

          <div
            style={{
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div className="badge-status badge-simulated">
              <span className="pulse-dot-orange" />
              <span>SENSOR: {telemetry?.sensorStatus || 'SIMULATED'}</span>
            </div>
            <button
              onClick={() => handleLinkClick('calibration')}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.78rem' }}
            >
              Calibrate Now
            </button>
          </div>
        </div>
      )}

      {/* Responsive media query styles */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-hamburger-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
