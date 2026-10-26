import React, { useState } from 'react';
import {
  Atom,
  Flame,
  Snowflake,
  Rocket,
  Bot,
  HeartPulse,
  Car,
  Gauge,
  ArrowRight
} from 'lucide-react';

export default function SmaInfoSection() {
  const [selectedPhase, setSelectedPhase] = useState('martensite'); // 'martensite' | 'austenite'

  const applications = [
    {
      icon: Bot,
      title: 'Robotics',
      desc: 'Silent artificial muscles that contract like human tendons when heated.',
    },
    {
      icon: Rocket,
      title: 'Aerospace',
      desc: 'Hinges that deploy satellite solar panels smoothly without explosive charges.',
    },
    {
      icon: HeartPulse,
      title: 'Biomedical',
      desc: 'Cardiovascular stents that self-expand at human body temperature (37°C).',
    },
    {
      icon: Car,
      title: 'Automotive',
      desc: 'Thermostatic safety valves that automatically open if the engine gets hot.',
    },
  ];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          className="font-mono"
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          [WORKING PRINCIPLE // SIMPLIFIED]
        </div>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        >
          How Shape Memory Alloys Work
        </h2>
        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '10px auto 0',
            lineHeight: 1.5,
          }}
        >
          Smart metals that can be deformed when cold and instantly return to their original, rigid shape when heated.
        </p>
      </div>

      {/* 1. Core Visual: The Two Crystal Phases */}
      <div
        className="engineering-card tech-corner"
        style={{
          padding: '24px',
          marginBottom: '24px',
          background: 'rgba(10, 10, 10, 0.75)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '18px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              CRYSTAL LATTICE SHIFT //
            </span>
            <h3 className="font-display" style={{ fontSize: '1.05rem', color: '#ffffff', marginTop: '2px' }}>
              Martensite (Cold) vs. Austenite (Heated)
            </h3>
          </div>

          {/* Toggle buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSelectedPhase('martensite')}
              className={selectedPhase === 'martensite' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '0.75rem', gap: '6px' }}
            >
              <Snowflake size={13} />
              <span>Cold (Martensite)</span>
            </button>
            <button
              onClick={() => setSelectedPhase('austenite')}
              className={selectedPhase === 'austenite' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '0.75rem', gap: '6px' }}
            >
              <Flame size={13} />
              <span>Heated (Austenite)</span>
            </button>
          </div>
        </div>

        {/* Visual & Short Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          {/* SVG Lattice Schematic */}
          <div
            style={{
              background: '#040404',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              {selectedPhase === 'martensite' ? (
                /* Deformed Sheared Lattice */
                <g stroke="#ffffff" strokeWidth="1.5">
                  <polygon points="40,115 80,45 155,45 115,115" fill="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <line x1="40" y1="115" x2="80" y2="45" stroke="#999" strokeWidth="2" />
                  <line x1="80" y1="45" x2="155" y2="45" stroke="#999" strokeWidth="2" />
                  <line x1="155" y1="45" x2="115" y2="115" stroke="#999" strokeWidth="2" />
                  <line x1="115" y1="115" x2="40" y2="115" stroke="#999" strokeWidth="2" />
                  
                  {/* Internal twins */}
                  <line x1="60" y1="80" x2="135" y2="80" stroke="#fff" strokeWidth="1.2" />

                  {/* Atoms */}
                  <circle cx="40" cy="115" r="5" fill="#fff" />
                  <circle cx="80" cy="45" r="5" fill="#fff" />
                  <circle cx="155" cy="45" r="5" fill="#fff" />
                  <circle cx="115" cy="115" r="5" fill="#fff" />
                  <circle cx="98" cy="80" r="4.5" fill="#aaa" />

                  <text x="110" y="140" fill="#aaa" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    Monoclinic (Flexible / Deformed)
                  </text>
                </g>
              ) : (
                /* Rigid Cubic Lattice */
                <g stroke="#ffffff" strokeWidth="1.5">
                  <rect x="55" y="35" width="80" height="80" fill="rgba(255,255,255,0.06)" stroke="#ffffff" strokeWidth="2" />
                  <rect x="80" y="20" width="80" height="80" fill="none" stroke="#555" strokeDasharray="3 3" />
                  <line x1="55" y1="35" x2="80" y2="20" stroke="#888" />
                  <line x1="135" y1="35" x2="160" y2="20" stroke="#888" />
                  <line x1="55" y1="115" x2="80" y2="100" stroke="#888" />
                  <line x1="135" y1="115" x2="160" y2="100" stroke="#888" />

                  {/* Atoms */}
                  <circle cx="55" cy="35" r="5" fill="#fff" />
                  <circle cx="135" cy="35" r="5" fill="#fff" />
                  <circle cx="55" cy="115" r="5" fill="#fff" />
                  <circle cx="135" cy="115" r="5" fill="#fff" />
                  <circle cx="107" cy="67" r="5" fill="#fff" stroke="#000" strokeWidth="1.5" />

                  <text x="110" y="140" fill="#ffffff" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    Cubic (Rigid / Memory Restored)
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Easy-to-understand Explanation */}
          <div>
            <div className="badge-status badge-connected" style={{ marginBottom: '8px' }}>
              <span>{selectedPhase === 'martensite' ? 'PHASE: COLD MARTENSITE' : 'PHASE: HEATED AUSTENITE'}</span>
            </div>

            <h4 className="font-display" style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '8px' }}>
              {selectedPhase === 'martensite'
                ? 'Soft & Bendable (Low Temp < 35°C)'
                : 'Hard & Restored (High Temp > 58°C)'}
            </h4>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {selectedPhase === 'martensite' ? (
                <>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ color: '#fff' }}>•</span>
                    <span><strong>Easy to deform:</strong> Atoms can tilt and bend under gentle mechanical force without breaking.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ color: '#fff' }}>•</span>
                    <span><strong>Holds deformed shape:</strong> It stays bent as long as it remains below its transition temperature.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ color: '#fff' }}>•</span>
                    <span><strong>Elasticity:</strong> Relatively low stiffness (28–40 GPa), ready to be triggered by heat.</span>
                  </li>
                </>
              ) : (
                <>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ color: '#fff' }}>•</span>
                    <span><strong>Powerful recovery:</strong> Heating drives atoms back into a rigid, highly symmetrical cubic cube.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ color: '#fff' }}>•</span>
                    <span><strong>Tremendous force:</strong> The alloy can lift heavy loads or pull mechanisms as it straightens.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ color: '#fff' }}>•</span>
                    <span><strong>Stiffness jump:</strong> Rigidity more than doubles (75–83 GPa).</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Three Simple Explanatory Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '18px',
          marginBottom: '24px',
        }}
      >
        {/* Card 1: What is SMA? */}
        <div className="engineering-card tech-corner" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Atom size={16} color="#ffffff" />
            <h4 className="font-display" style={{ fontSize: '0.95rem', color: '#ffffff' }}>
              What is Shape Memory Alloy?
            </h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            Shape Memory Alloys (most commonly <strong>Nitinol</strong>, a blend of Nickel and Titanium) are smart metals. Unlike normal wire that stays permanently bent, an SMA wire "remembers" its trained shape and snaps right back when exposed to heat.
          </p>
        </div>

        {/* Card 2: Temperature Milestones */}
        <div className="engineering-card tech-corner" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Flame size={16} color="#ffffff" />
            <h4 className="font-display" style={{ fontSize: '0.95rem', color: '#ffffff' }}>
              Key Temperature Milestones
            </h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '8px' }}>
            The recovery follows a clear thermal window:
          </p>
          <div className="font-mono" style={{ fontSize: '0.74rem', color: '#ffffff', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>• <strong>As (~35°C):</strong> Shape recovery begins</div>
            <div>• <strong>Af (~58°C):</strong> 100% full recovery complete</div>
            <div>• <strong>Cooling:</strong> Returns to pliable martensite</div>
          </div>
        </div>

        {/* Card 3: Why Calibration Matters */}
        <div className="engineering-card tech-corner" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Gauge size={16} color="#ffffff" />
            <h4 className="font-display" style={{ fontSize: '0.95rem', color: '#ffffff' }}>
              Why Temperature Calibration Matters
            </h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            Because the transformation occurs within a narrow band (35°C–58°C), a sensor error of just 1°C can cause premature triggering or risk overheating above safe limits (&gt;75°C). Calibrating sensors ensures predictable, safe actuation.
          </p>
        </div>
      </div>

      {/* 3. Real-World Applications Grid (Quick to skim) */}
      <div
        className="engineering-card"
        style={{
          padding: '20px 24px',
          background: 'rgba(255, 255, 255, 0.02)',
        }}
      >
        <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          COMMON APPLICATIONS //
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {applications.map((app, idx) => {
            const Icon = app.icon;
            return (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} color="#ffffff" />
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                    {app.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                    {app.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
