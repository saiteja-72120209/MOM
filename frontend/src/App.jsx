import React, { useState, useEffect, useCallback, useRef } from 'react';
import GeometricBackground from './components/GeometricBackground';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SmaSpecimenBlock from './components/SmaSpecimenBlock';
import CalibrationPanel from './components/CalibrationPanel';
import SmaInfoSection from './components/SmaInfoSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';

/* ==========================================================================
   Monochrome Editorial Illustrations Inspired by Reference Artwork
   Adapted for Shape Memory Alloy & Precision Thermal Calibration Engineering
   ========================================================================== */

/**
 * 1. Globe with Coding Pill & Hand Rising from Cosmic Starry Portal
 * Editorial pen-and-ink linework with wireframe sphere, code capsule, and starry portal.
 */
function GlobePortalSvg() {
  return (
    <svg viewBox="0 0 180 220" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sparkles */}
      <path d="M 28 20 Q 28 26 34 26 Q 28 26 28 32 Q 28 26 22 26 Q 28 26 28 20 Z" fill="#ffffff" />
      <path d="M 152 45 Q 152 50 157 50 Q 152 50 152 55 Q 152 50 147 50 Q 152 50 152 45 Z" fill="#ffffff" />
      <circle cx="160" cy="24" r="1.5" fill="#ffffff" />
      <circle cx="20" cy="52" r="1.2" fill="#ffffff" />

      {/* Wireframe Globe Sphere */}
      <g transform="translate(90, 48)">
        <circle cx="0" cy="0" r="38" stroke="#ffffff" strokeWidth="1.8" fill="#08080a" />
        <ellipse cx="0" cy="0" rx="20" ry="38" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />
        <ellipse cx="0" cy="0" rx="35" ry="38" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="0" y1="-38" x2="0" y2="38" stroke="#ffffff" strokeWidth="1.4" />
        <line x1="-38" y1="0" x2="38" y2="0" stroke="#ffffff" strokeWidth="1.4" />
        <ellipse cx="0" cy="-16" rx="34" ry="11" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.7" />
        <ellipse cx="0" cy="16" rx="34" ry="11" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.7" />
      </g>

      {/* Floating Code Pill */}
      <g transform="translate(90, 108)">
        <rect x="-65" y="-14" width="130" height="28" rx="14" fill="#050507" stroke="#ffffff" strokeWidth="2" />
        <rect x="-62" y="-11" width="124" height="22" rx="11" fill="#0d0e12" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.4" />
        <text x="0" y="5" fill="#ffffff" fontSize="13" fontFamily="var(--font-mono, monospace)" fontWeight="700" textAnchor="middle" letterSpacing="2">
          {'</>'}
        </text>
      </g>

      {/* Hand Rising from Cosmic Starry Portal */}
      <g transform="translate(90, 158)">
        <ellipse cx="0" cy="30" rx="55" ry="16" fill="#040405" stroke="#ffffff" strokeWidth="1.8" />
        <ellipse cx="0" cy="30" rx="46" ry="11" fill="#000000" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 3" />
        <circle cx="-25" cy="28" r="1.2" fill="#ffffff" />
        <circle cx="28" cy="31" r="1.5" fill="#ffffff" />
        <circle cx="6" cy="34" r="1" fill="#ffffff" />
        <path d="M -10 26 Q -10 29 -7 29 Q -10 29 -10 32 Q -10 29 -13 29 Q -10 29 -10 26 Z" fill="#ffffff" />

        <path
          d="M -22 30 C -22 16 -20 3 -18 -7 C -17 -15 -12 -27 -12 -37 C -12 -41 -8 -41 -7 -37 C -6 -31 -6 -23 -6 -17 C -5 -27 -2 -41 0 -43 C 2 -44 5 -41 5 -35 C 5 -27 5 -17 6 -11 C 7 -21 10 -33 13 -33 C 16 -33 17 -27 16 -17 C 16 -9 15 -3 18 -9 C 20 -13 24 -13 24 -7 C 24 5 20 19 18 30 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <line x1="-12" y1="14" x2="10" y2="14" stroke="#999999" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="-10" y1="20" x2="12" y2="20" stroke="#999999" strokeWidth="1" strokeDasharray="2 2" />
      </g>
    </svg>
  );
}

/**
 * 2. Analytical Chart with Upward Trend & Binocular Vision
 * CAD transform bounding box with corner handles, recovery curve, and precision optics.
 */
function AnalyticalOpticsSvg() {
  return (
    <svg viewBox="0 0 200 180" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 180 15 Q 180 20 185 20 Q 180 20 180 25 Q 180 20 175 20 Q 180 20 180 15 Z" fill="#ffffff" />
      <circle cx="20" cy="18" r="1.5" fill="#ffffff" />

      {/* CAD Bounding Box with transform anchors */}
      <g transform="translate(10, 10)">
        <rect x="25" y="15" width="140" height="85" fill="#060608" stroke="#ffffff" strokeWidth="1.6" />
        <rect x="22" y="12" width="6" height="6" fill="#ffffff" />
        <rect x="162" y="12" width="6" height="6" fill="#ffffff" />
        <rect x="22" y="97" width="6" height="6" fill="#ffffff" />
        <rect x="162" y="97" width="6" height="6" fill="#ffffff" />

        {/* Bar chart pillars */}
        <rect x="85" y="60" width="16" height="35" fill="#ffffff" stroke="#ffffff" strokeWidth="1" />
        <rect x="110" y="42" width="16" height="53" fill="#141418" stroke="#ffffff" strokeWidth="1.2" />
        <line x1="110" y1="52" x2="126" y2="52" stroke="#ffffff" strokeWidth="1" />
        <line x1="110" y1="62" x2="126" y2="62" stroke="#ffffff" strokeWidth="1" />
        <line x1="110" y1="72" x2="126" y2="72" stroke="#ffffff" strokeWidth="1" />
        <line x1="110" y1="82" x2="126" y2="82" stroke="#ffffff" strokeWidth="1" />
        <rect x="135" y="30" width="16" height="65" fill="#ffffff" stroke="#ffffff" strokeWidth="1" />

        {/* Upward Hysteresis Trend curve */}
        <path d="M 35 80 Q 75 75 105 45 T 155 18" stroke="#ffffff" strokeWidth="2.4" fill="none" />
        <path d="M 145 15 L 158 17 L 153 28 Z" fill="#ffffff" />
        <line x1="25" y1="95" x2="165" y2="95" stroke="#ffffff" strokeWidth="1.4" />
      </g>

      {/* Modern Binoculars / Optics Below */}
      <g transform="translate(100, 135)">
        <g transform="translate(-40, 0)">
          <ellipse cx="0" cy="0" rx="26" ry="18" fill="#ffffff" stroke="#000000" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx="18" ry="12" fill="#0a0a0d" stroke="#ffffff" strokeWidth="1.4" />
          <circle cx="0" cy="0" r="7" fill="#ffffff" />
          <circle cx="3" cy="-3" r="2.5" fill="#ffffff" />
          <path d="M -18 0 C -18 -8 -26 -16 -32 -26" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <rect x="-18" y="-6" width="36" height="12" rx="4" fill="#18181c" stroke="#ffffff" strokeWidth="1.4" />
        <circle cx="0" cy="0" r="3" fill="#ffffff" />
        <g transform="translate(40, 0)">
          <ellipse cx="0" cy="0" rx="26" ry="18" fill="#ffffff" stroke="#000000" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx="18" ry="12" fill="#0a0a0d" stroke="#ffffff" strokeWidth="1.4" />
          <circle cx="0" cy="0" r="7" fill="#ffffff" />
          <circle cx="3" cy="-3" r="2.5" fill="#ffffff" />
          <path d="M 18 0 C 18 -8 26 -16 32 -26" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

/**
 * 3. Technical Gear & Interface Panel Emerging from a Cloud
 * Mechanical actuator cogwheel atop a terminal console and soft cloud base.
 */
function GearPanelCloudSvg() {
  return (
    <svg viewBox="0 0 190 220" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 25 30 Q 25 35 30 35 Q 25 35 25 40 Q 25 35 20 35 Q 25 35 25 30 Z" fill="#ffffff" />
      <circle cx="165" cy="40" r="1.5" fill="#ffffff" />

      {/* Actuator Gear atop */}
      <g transform="translate(95, 45)">
        <circle cx="0" cy="0" r="28" fill="#ffffff" stroke="#000000" strokeWidth="2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <rect
            key={i}
            x="-5"
            y="-35"
            width="10"
            height="9"
            rx="2"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.6"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle cx="0" cy="0" r="14" fill="#0c0d10" stroke="#ffffff" strokeWidth="1.6" />
        <circle cx="0" cy="0" r="6" fill="#ffffff" />
      </g>

      {/* Terminal window panel */}
      <g transform="translate(95, 115)">
        <rect x="-65" y="-45" width="130" height="85" rx="8" fill="#08080a" stroke="#ffffff" strokeWidth="2" />
        <line x1="-65" y1="-28" x2="65" y2="-28" stroke="#ffffff" strokeWidth="1.4" />
        <circle cx="-52" cy="-36.5" r="3" fill="#ffffff" />
        <circle cx="-42" cy="-36.5" r="3" stroke="#ffffff" strokeWidth="1" fill="none" />
        <circle cx="-32" cy="-36.5" r="3" stroke="#ffffff" strokeWidth="1" fill="none" />
        <line x1="-50" y1="-14" x2="15" y2="-14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="-50" y1="-3" x2="-10" y2="-3" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="-50" y1="8" x2="35" y2="8" stroke="#888888" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M -50 24 Q -35 14 -20 24 T 10 24 T 40 24" stroke="#ffffff" strokeWidth="1.6" strokeDasharray="3 2" fill="none" />
      </g>

      {/* Cloud Base */}
      <g transform="translate(95, 168)">
        <path
          d="M -75 18 C -78 6 -66 -8 -52 -8 C -46 -22 -22 -26 -10 -15 C 5 -30 35 -28 48 -12 C 64 -14 78 -2 78 12 C 78 28 -75 28 -75 18 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M -42 6 C -38 -2 -24 -2 -18 4" stroke="#666666" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 8 -2 C 16 -10 32 -8 38 2" stroke="#666666" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

/**
 * 4. Abstract Topographic Mountain Peak with Flag & Trail
 * Contoured thermal transformation elevation with summit indicator.
 */
function TopographicMountainSvg() {
  return (
    <svg viewBox="0 0 210 210" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 40 35 Q 40 40 45 40 Q 40 40 40 45 Q 40 40 35 40 Q 40 40 40 35 Z" fill="#ffffff" />
      <circle cx="185" cy="55" r="1.5" fill="#ffffff" />

      <g transform="translate(105, 110)">
        {/* Right dark cosmic slope */}
        <path
          d="M 5 -75 Q 15 -35 25 -10 Q 55 10 95 65 L 5 65 Z"
          fill="#040406"
          stroke="#ffffff"
          strokeWidth="1.6"
        />
        <circle cx="45" cy="40" r="1.5" fill="#ffffff" />
        <circle cx="70" cy="55" r="1.2" fill="#ffffff" />
        <path d="M 50 20 Q 50 23 53 23 Q 50 23 50 26 Q 50 23 47 23 Q 50 23 50 20 Z" fill="#ffffff" />

        {/* Mountain Silhouette */}
        <path
          d="M 5 -75 Q -10 -50 -25 -20 Q -50 -5 -70 15 Q -85 35 -95 65 L 95 65 Q 65 20 30 -5 Q 15 -35 5 -75 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Topographic Contour lines */}
        <path d="M -75 45 C -45 35 -15 48 10 40 C 25 35 45 45 60 48" stroke="#333333" strokeWidth="1.4" fill="none" />
        <path d="M -55 20 C -35 10 -10 22 15 15 C 28 10 38 18 48 18" stroke="#333333" strokeWidth="1.4" fill="none" />
        <path d="M -30 -10 C -15 -18 0 -8 18 -15" stroke="#333333" strokeWidth="1.4" fill="none" />
        <path d="M -15 -42 C -8 -48 2 -40 10 -46" stroke="#333333" strokeWidth="1.4" fill="none" />

        {/* Dashed trail */}
        <path
          d="M -90 55 Q -60 45 -45 50 Q -25 55 -35 30 Q -45 10 -15 5 Q 0 0 -10 -20 Q -15 -40 5 -75"
          stroke="#000000"
          strokeWidth="2"
          strokeDasharray="4 3"
          fill="none"
        />

        {/* Summit flag */}
        <line x1="5" y1="-75" x2="5" y2="-96" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
        <path d="M 5 -96 L 26 -88 L 5 -80 Z" fill="#ffffff" stroke="#000000" strokeWidth="1.8" />
        <circle cx="5" cy="-97" r="2" fill="#000000" />
      </g>
    </svg>
  );
}

/**
 * 5. Floating Geometric Isometric Cube with Technical Diagrams
 * Isometric B2 cubic crystal lattice with starry top face, floating UI plane, and data lines.
 */
function GeometricCubeSvg() {
  return (
    <svg viewBox="0 0 200 220" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 175 40 Q 175 45 180 45 Q 175 45 175 50 Q 175 45 170 45 Q 175 45 175 40 Z" fill="#ffffff" />
      <circle cx="25" cy="50" r="1.5" fill="#ffffff" />

      {/* Floating Interface Plane Above Isometric Cube */}
      <g transform="translate(100, 52)">
        <polygon points="0,-24 55,-4 0,16 -55,-4" fill="#0a0a0e" stroke="#ffffff" strokeWidth="1.6" />
        <rect x="-3" y="-27" width="6" height="6" fill="#ffffff" />
        <rect x="52" y="-7" width="6" height="6" fill="#ffffff" />
        <rect x="-3" y="13" width="6" height="6" fill="#ffffff" />
        <rect x="-58" y="-7" width="6" height="6" fill="#ffffff" />

        <polygon points="0,-16 38,-2 0,12 -38,-2" fill="#14161a" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="-22" y1="-2" x2="15" y2="-2" stroke="#ffffff" strokeWidth="1.4" />
        <line x1="-15" y1="4" x2="8" y2="4" stroke="#ffffff" strokeWidth="1.4" />

        <g transform="translate(54, -4)">
          <polygon points="0,0 4,14 8,10 14,12 16,8 10,6 14,0" fill="#ffffff" stroke="#000000" strokeWidth="1.2" />
        </g>
      </g>

      {/* Main Isometric Cube (B2 Unit Cell) */}
      <g transform="translate(100, 130)">
        <polygon points="0,-48 64,-16 0,16 -64,-16" fill="#050508" stroke="#ffffff" strokeWidth="2.2" />
        <circle cx="-25" cy="-15" r="1.5" fill="#ffffff" />
        <circle cx="28" cy="-12" r="1.2" fill="#ffffff" />
        <circle cx="0" cy="-28" r="1.8" fill="#ffffff" />
        <circle cx="5" cy="-5" r="1" fill="#ffffff" />
        <path d="M -10 -22 Q -10 -18 -7 -18 Q -10 -18 -10 -14 Q -10 -18 -13 -18 Q -10 -18 -10 -22 Z" fill="#ffffff" />

        {/* Left Face with UI Window */}
        <polygon points="-64,-16 0,16 0,76 -64,44" fill="#ffffff" stroke="#000000" strokeWidth="2.2" strokeLinejoin="round" />
        <g transform="translate(-32, 30) skewY(26.5)">
          <rect x="-24" y="-18" width="48" height="36" rx="4" fill="#08080a" stroke="#000000" strokeWidth="1.6" />
          <line x1="-24" y1="-8" x2="24" y2="-8" stroke="#000000" strokeWidth="1" />
          <line x1="-18" y1="2" x2="10" y2="2" stroke="#ffffff" strokeWidth="1.4" />
          <line x1="-18" y1="9" x2="0" y2="9" stroke="#ffffff" strokeWidth="1.4" />
        </g>

        {/* Right Face with UI Window */}
        <polygon points="0,16 64,-16 64,44 0,76" fill="#ffffff" stroke="#000000" strokeWidth="2.2" strokeLinejoin="round" />
        <g transform="translate(32, 30) skewY(-26.5)">
          <rect x="-24" y="-18" width="48" height="36" rx="4" fill="#08080a" stroke="#000000" strokeWidth="1.6" />
          <line x1="-24" y1="-8" x2="24" y2="-8" stroke="#000000" strokeWidth="1" />
          <line x1="-18" y1="2" x2="14" y2="2" stroke="#ffffff" strokeWidth="1.4" />
          <line x1="-18" y1="9" x2="6" y2="9" stroke="#ffffff" strokeWidth="1.4" />
        </g>

        <path d="M 38 -32 C 75 -20 85 0 64 25" stroke="#ffffff" strokeWidth="1.4" strokeDasharray="3 3" fill="none" />
      </g>
    </svg>
  );
}

/**
 * 6. Dark Arched Doorway with Keyhole, Key & Checkmark Badge
 * Gate portal to validated temperature threshold state.
 */
function GatewayDoorwaySvg() {
  return (
    <svg viewBox="0 0 190 220" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 160 25 Q 160 30 165 30 Q 160 30 160 35 Q 160 30 155 30 Q 160 30 160 25 Z" fill="#ffffff" />
      <circle cx="30" cy="40" r="1.5" fill="#ffffff" />

      <g transform="translate(105, 110)">
        <path
          d="M -48 70 L -48 -10 C -48 -45 -25 -70 12 -70 C 49 -70 72 -45 72 -10 L 72 70 Z"
          fill="#0c0d10"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M -38 70 L -38 -10 C -38 -38 -18 -58 12 -58 C 42 -58 62 -38 62 -10 L 62 70 Z"
          fill="#020204"
          stroke="#ffffff"
          strokeWidth="1.4"
        />

        <circle cx="0" cy="-35" r="1.6" fill="#ffffff" />
        <circle cx="35" cy="-20" r="1.2" fill="#ffffff" />
        <circle cx="-15" cy="15" r="1.4" fill="#ffffff" />
        <circle cx="40" cy="45" r="1.6" fill="#ffffff" />
        <path d="M 20 -40 Q 20 -37 23 -37 Q 20 -37 20 -34 Q 20 -37 17 -37 Q 20 -37 20 -40 Z" fill="#ffffff" />

        {/* Keyhole */}
        <g transform="translate(12, 12)">
          <circle cx="0" cy="-8" r="6.5" fill="#ffffff" />
          <polygon points="-4,-4 4,-4 6,10 -6,10" fill="#ffffff" />
        </g>

        {[-40, -25, -10, 5, 20, 35, 50].map((y, i) => (
          <line key={i} x1="-48" y1={y} x2="-38" y2={y - 4} stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4" />
        ))}

        {/* Vintage Key Entering Doorway */}
        <g transform="translate(-52, 10)">
          <circle cx="-24" cy="0" r="14" fill="#ffffff" stroke="#000000" strokeWidth="2" />
          <circle cx="-24" cy="0" r="7" fill="#000000" />
          <rect x="-10" y="-3.5" width="46" height="7" rx="2" fill="#ffffff" stroke="#000000" strokeWidth="1.8" />
          <rect x="22" y="3.5" width="6" height="10" rx="1" fill="#ffffff" stroke="#000000" strokeWidth="1.4" />
          <rect x="12" y="3.5" width="5" height="7" rx="1" fill="#ffffff" stroke="#000000" strokeWidth="1.4" />
          <circle cx="36" cy="0" r="2.5" fill="#ffffff" />
        </g>

        {/* Verified Badge with Checkmark */}
        <g transform="translate(68, -48)">
          <circle cx="0" cy="0" r="17" fill="#ffffff" stroke="#000000" strokeWidth="2.2" />
          <circle cx="0" cy="0" r="14" fill="#08080a" stroke="#ffffff" strokeWidth="1" />
          <path d="M -6 -1 L -1 5 L 8 -5" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </g>
    </svg>
  );
}

/**
 * 7. 4-Point Editorial Sparkle Star Accent
 */
function SparkleStarSvg() {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 16 0 Q 16 16 32 16 Q 16 16 16 32 Q 16 16 0 16 Q 16 16 16 0 Z" fill="#ffffff" />
      <circle cx="16" cy="16" r="3" fill="#000000" />
    </svg>
  );
}

/**
 * 8. Engineering CAD Reticle Accent
 */
function ReticleCadSvg() {
  return (
    <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="12" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="18" cy="18" r="4" stroke="#ffffff" strokeWidth="1" />
      <line x1="18" y1="2" x2="18" y2="34" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="2" y1="18" x2="34" y2="18" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  );
}

// Configuration of floating parallax decorative elements across document height
const illustrationItems = [
  // 1. Globe with coding pill & cosmic hand (Hero section right flank)
  {
    id: 'hero-globe',
    component: GlobePortalSvg,
    style: { top: '130px', right: '3.5%', width: '170px' },
    depth: 0.045,
    scrollFactor: -0.06,
    rotFactor: 4.5,
    floatClass: 'parallax-float-inner-1',
    opacity: 0.16,
  },
  // 2. Analytical chart with upward trend & binoculars (Hero section lower-left)
  {
    id: 'hero-chart',
    component: AnalyticalOpticsSvg,
    style: { top: '510px', left: '3.5%', width: '185px' },
    depth: -0.05,
    scrollFactor: 0.05,
    rotFactor: -5.0,
    floatClass: 'parallax-float-inner-2',
    opacity: 0.15,
  },
  // 3. Technical gear & interface panel cloud (Technology section right)
  {
    id: 'tech-gear',
    component: GearPanelCloudSvg,
    style: { top: '1080px', right: '3.5%', width: '175px' },
    depth: 0.055,
    scrollFactor: -0.05,
    rotFactor: 4.0,
    floatClass: 'parallax-float-inner-3',
    opacity: 0.15,
  },
  // 4. Abstract topographic mountain (Technology lower left / pre-calibration)
  {
    id: 'tech-mountain',
    component: TopographicMountainSvg,
    style: { top: '1540px', left: '3%', width: '195px' },
    depth: -0.045,
    scrollFactor: 0.07,
    rotFactor: -4.0,
    floatClass: 'parallax-float-inner-4',
    opacity: 0.15,
  },
  // 5. Floating geometric cube with diagrams (Flanking Calibration section)
  {
    id: 'calib-cube',
    component: GeometricCubeSvg,
    style: { top: '2150px', right: '3.5%', width: '180px' },
    depth: 0.05,
    scrollFactor: -0.06,
    rotFactor: 4.5,
    floatClass: 'parallax-float-inner-5',
    opacity: 0.16,
  },
  // 6. Dark doorway with keyhole and checkmark (About section left)
  {
    id: 'about-portal',
    component: GatewayDoorwaySvg,
    style: { top: '3050px', left: '3.5%', width: '170px' },
    depth: -0.055,
    scrollFactor: 0.06,
    rotFactor: -5.0,
    floatClass: 'parallax-float-inner-6',
    opacity: 0.16,
  },
  // Secondary technical accents (sparkles & CAD reticles)
  {
    id: 'accent-star-1',
    component: SparkleStarSvg,
    style: { top: '90px', left: '16%', width: '22px' },
    depth: 0.025,
    scrollFactor: -0.03,
    rotFactor: 8.0,
    floatClass: 'parallax-sparkle',
    opacity: 0.35,
  },
  {
    id: 'accent-reticle-1',
    component: ReticleCadSvg,
    style: { top: '410px', right: '22%', width: '28px' },
    depth: -0.035,
    scrollFactor: 0.04,
    rotFactor: -6.0,
    floatClass: 'parallax-float-inner-3',
    opacity: 0.30,
    className: 'parallax-hide-mobile',
  },
  {
    id: 'accent-star-2',
    component: SparkleStarSvg,
    style: { top: '1280px', left: '20%', width: '26px' },
    depth: 0.03,
    scrollFactor: -0.04,
    rotFactor: 12.0,
    floatClass: 'parallax-sparkle',
    opacity: 0.35,
  },
  {
    id: 'accent-reticle-2',
    component: ReticleCadSvg,
    style: { top: '2450px', left: '4%', width: '26px' },
    depth: -0.04,
    scrollFactor: 0.05,
    rotFactor: -8.0,
    floatClass: 'parallax-float-inner-1',
    opacity: 0.28,
  },
  {
    id: 'accent-star-3',
    component: SparkleStarSvg,
    style: { top: '3250px', right: '7%', width: '24px' },
    depth: 0.035,
    scrollFactor: -0.03,
    rotFactor: 10.0,
    floatClass: 'parallax-sparkle',
    opacity: 0.35,
  },
];

/**
 * FloatingParallaxIllustrations Component
 * Manages high-performance mouse & scroll parallax updates with zero unnecessary React re-renders.
 */
function FloatingParallaxIllustrations() {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  const mouse = useRef({ currX: 0, currY: 0, targX: 0, targY: 0 });
  const scroll = useRef({ currY: 0, targY: 0 });
  const animFrame = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleMouseMove = (e) => {
      if (prefersReducedMotion) return;
      mouse.current.targX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.targY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      scroll.current.targY = window.scrollY;
    };

    scroll.current.targY = window.scrollY;
    scroll.current.currY = window.scrollY;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 60-120 FPS hardware-accelerated transform loop
    const loop = () => {
      if (!prefersReducedMotion) {
        mouse.current.currX += (mouse.current.targX - mouse.current.currX) * 0.075;
        mouse.current.currY += (mouse.current.targY - mouse.current.currY) * 0.075;
        scroll.current.currY += (scroll.current.targY - scroll.current.currY) * 0.085;

        const currX = mouse.current.currX;
        const currY = mouse.current.currY;
        const currScroll = scroll.current.currY;

        illustrationItems.forEach((item, idx) => {
          const el = itemsRef.current[idx];
          if (!el) return;

          const transX = currX * item.depth * 130;
          const transY = currY * item.depth * 80 + currScroll * item.scrollFactor;
          const rot = currX * item.rotFactor;

          el.style.transform = `translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
        });
      }

      animFrame.current = requestAnimationFrame(loop);
    };

    animFrame.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  return (
    <div className="parallax-illustrations-wrapper" ref={containerRef} aria-hidden="true">
      {illustrationItems.map((item, idx) => {
        const SvgComponent = item.component;
        return (
          <div
            key={item.id}
            ref={(node) => (itemsRef.current[idx] = node)}
            className={`parallax-item ${item.className || ''}`}
            style={{
              ...item.style,
              opacity: item.opacity,
            }}
          >
            <div className={item.floatClass}>
              <SvgComponent />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [telemetry, setTelemetry] = useState({
    rawTemperature: 24.5,
    calibrationOffset: 0.0,
    correctedTemperature: 24.5,
    sensorStatus: 'Simulated',
    mode: 'simulated',
    unit: '°C',
    timestamp: Date.now(),
    referenceTemperature: 25.0,
    lastMeasuredAtCalibration: 25.0,
    highTempLimit: 75.0,
    thresholdExceeded: false,
    specimenPhase: 'Martensite (Twinned)',
    phaseCode: 'M',
    recoveryPct: 0,
    simulatedTargetTemp: 24.5,
  });

  const [history, setHistory] = useState([]);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);

  // Smooth scroll handler
  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Section observer to update active navigation link on scroll
  useEffect(() => {
    const sections = ['home', 'technology', 'calibration', 'about'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch telemetry from backend API
  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await fetch('/api/temperature');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setTelemetry(json.data);
          setBackendAvailable(true);
        }
      }
    } catch (err) {
      // Backend may be starting or offline; local simulation fallback keeps UI dynamic
      setBackendAvailable(false);
    }
  }, []);

  // Fetch telemetry history
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/temperature/history');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.history) {
          setHistory(json.history);
        }
      }
    } catch (err) {
      // Ignore network errors in history polling
    }
  }, []);

  // Polling loop
  useEffect(() => {
    fetchTelemetry();
    fetchHistory();
    const interval = setInterval(() => {
      fetchTelemetry();
      fetchHistory();
    }, 1200);

    return () => clearInterval(interval);
  }, [fetchTelemetry, fetchHistory]);

  // Handle Calibrate API call
  const handleCalibrate = async (payload) => {
    setIsCalibrating(true);
    try {
      const res = await fetch('/api/calibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTelemetry(data.data);
        fetchHistory();
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Calibration failed' };
      }
    } catch (err) {
      // Fallback local calibration calculation if backend is disconnected
      let offset = 0;
      if (payload.offset !== undefined) {
        offset = payload.offset;
      } else if (payload.referenceTemperature !== undefined && payload.measuredTemperature !== undefined) {
        offset = Number((payload.referenceTemperature - payload.measuredTemperature).toFixed(3));
      }
      setTelemetry((prev) => {
        const corrected = Number((prev.rawTemperature + offset).toFixed(2));
        return {
          ...prev,
          calibrationOffset: offset,
          correctedTemperature: corrected,
          thresholdExceeded: corrected >= prev.highTempLimit,
        };
      });
      return { success: true, message: `Local offset applied: ${offset > 0 ? '+' : ''}${offset}°C` };
    } finally {
      setIsCalibrating(false);
    }
  };

  // Handle Reset Calibration API call
  const handleResetCalibration = async () => {
    try {
      const res = await fetch('/api/calibrate/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTelemetry(data.data);
        fetchHistory();
        return { success: true };
      }
    } catch (err) {
      // Fallback
      setTelemetry((prev) => ({
        ...prev,
        calibrationOffset: 0.0,
        correctedTemperature: prev.rawTemperature,
        thresholdExceeded: prev.rawTemperature >= prev.highTempLimit,
      }));
      return { success: true };
    }
    return { success: false };
  };

  // Handle Simulate Heat (slider) API call
  const handleSimulateHeat = async (targetTemp) => {
    try {
      const res = await fetch('/api/sensor/simulate-heat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetTemperature: targetTemp }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTelemetry(data.data);
      }
    } catch (err) {
      // Fallback
      setTelemetry((prev) => {
        const raw = targetTemp;
        const corrected = Number((raw + prev.calibrationOffset).toFixed(2));
        return {
          ...prev,
          rawTemperature: raw,
          correctedTemperature: corrected,
          simulatedTargetTemp: targetTemp,
          thresholdExceeded: corrected >= prev.highTempLimit,
        };
      });
    }
  };

  // Handle Settings Update (e.g. highTempLimit)
  const handleUpdateSettings = async (settings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTelemetry(data.data);
      }
    } catch (err) {
      if (settings.highTempLimit) {
        setTelemetry((prev) => ({
          ...prev,
          highTempLimit: settings.highTempLimit,
          thresholdExceeded: prev.correctedTemperature >= settings.highTempLimit,
        }));
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* 1. Animated Geometric Interactive Background */}
      <GeometricBackground />

      {/* 2. Monochrome Floating Parallax Editorial Illustrations */}
      <FloatingParallaxIllustrations />

      {/* 3. Interactive Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        telemetry={telemetry}
      />

      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* Section 1: Home / Hero */}
        <HeroSection
          onNavigate={handleNavigate}
          telemetry={telemetry}
        />

        {/* Section 2: Technology / Physics & Applications */}
        <section
          id="technology"
          style={{
            paddingTop: '90px',
            paddingBottom: '90px',
            borderTop: '1px solid var(--border-subtle)',
            position: 'relative',
          }}
        >
          <div className="container">
            <SmaInfoSection />
          </div>
        </section>

        {/* Section 3: Temperature Calibration & Central Specimen Feature */}
        <section
          id="calibration"
          style={{
            paddingTop: '90px',
            paddingBottom: '100px',
            borderTop: '1px solid var(--border-medium)',
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(10,10,10,0.8) 50%, rgba(0,0,0,0) 100%)',
            position: 'relative',
          }}
        >
          <div className="container">
            {/* Calibration Section Title */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
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
                [PRIMARY INTERACTION // CALIBRATION ENGINE & SMA THERMAL VENT]
              </div>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                }}
              >
                Interactive Temperature Calibration
              </h2>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  maxWidth: '700px',
                  margin: '12px auto 0',
                  lineHeight: 1.6,
                }}
              >
                Observe and calibrate sensor readings against known reference standards. The central mechanical window assembly showcases an SMA-actuated thermal ventilation panel with precision kinematics, realistic graphite frames, and interactive hover actuation.
              </p>
            </div>

            {/* Central Feature: EXACTLY ONE 3D SMA Mechanical Window Assembly */}
            <div style={{ marginBottom: '40px' }}>
              <SmaSpecimenBlock
                temperature={telemetry.correctedTemperature}
                phase={telemetry.specimenPhase}
                recoveryPct={telemetry.recoveryPct}
                isSimulated={telemetry.sensorStatus === 'Simulated'}
              />
            </div>

            {/* Interactive Calibration Dashboard & History Graph */}
            <CalibrationPanel
              telemetry={telemetry}
              history={history}
              onCalibrate={handleCalibrate}
              onResetCalibration={handleResetCalibration}
              onSimulateHeat={handleSimulateHeat}
              onUpdateSettings={handleUpdateSettings}
              isCalibrating={isCalibrating}
            />
          </div>
        </section>

        {/* Section 4: About Section */}
        <section
          id="about"
          style={{
            paddingTop: '90px',
            paddingBottom: '100px',
            borderTop: '1px solid var(--border-subtle)',
            position: 'relative',
          }}
        >
          <div className="container">
            <AboutSection />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} telemetry={telemetry} />
    </div>
  );
}
