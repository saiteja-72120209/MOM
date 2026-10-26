import React from 'react';

/**
 * SmaLogo: Kinetic sliced sphere brand mark with precision-tapered diagonal slats.
 * Rendered in monochrome white on dark transparent background.
 */
export default function SmaLogo({ size = 32, className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
      aria-label="SMA Logo"
    >
      <g transform="translate(50, 50) rotate(-23.5)">
        <ellipse cx="0" cy="-43.8" rx="14.06" ry="1.16" fill="#ffffff" />
        <ellipse cx="0" cy="-39.4" rx="23.74" ry="1.39" fill="#ffffff" />
        <ellipse cx="0" cy="-35.0" rx="29.85" ry="1.50" fill="#ffffff" />
        <ellipse cx="0" cy="-30.6" rx="34.35" ry="1.58" fill="#ffffff" />
        <ellipse cx="0" cy="-26.2" rx="37.81" ry="1.63" fill="#ffffff" />
        <ellipse cx="0" cy="-21.8" rx="40.51" ry="1.67" fill="#ffffff" />
        <ellipse cx="0" cy="-17.4" rx="42.58" ry="1.70" fill="#ffffff" />
        <ellipse cx="0" cy="-13.0" rx="44.12" ry="1.72" fill="#ffffff" />
        <ellipse cx="0" cy="-8.6" rx="45.19" ry="1.74" fill="#ffffff" />
        <ellipse cx="0" cy="-4.2" rx="45.81" ry="1.75" fill="#ffffff" />
        <ellipse cx="0" cy="0.2" rx="46.00" ry="1.75" fill="#ffffff" />
        <ellipse cx="0" cy="4.6" rx="45.77" ry="1.75" fill="#ffffff" />
        <ellipse cx="0" cy="9.0" rx="45.11" ry="1.74" fill="#ffffff" />
        <ellipse cx="0" cy="13.4" rx="44.00" ry="1.72" fill="#ffffff" />
        <ellipse cx="0" cy="17.8" rx="42.42" ry="1.70" fill="#ffffff" />
        <ellipse cx="0" cy="22.2" rx="40.29" ry="1.67" fill="#ffffff" />
        <ellipse cx="0" cy="26.6" rx="37.53" ry="1.63" fill="#ffffff" />
        <ellipse cx="0" cy="31.0" rx="33.99" ry="1.57" fill="#ffffff" />
        <ellipse cx="0" cy="35.4" rx="29.37" ry="1.50" fill="#ffffff" />
        <ellipse cx="0" cy="39.8" rx="23.06" ry="1.37" fill="#ffffff" />
        <ellipse cx="0" cy="44.2" rx="12.74" ry="1.12" fill="#ffffff" />
      </g>
    </svg>
  );
}
