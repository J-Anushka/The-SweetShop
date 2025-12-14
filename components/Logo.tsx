import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#593E33" floodOpacity="0.2"/>
      </filter>
    </defs>
    
    {/* Main Circle Background */}
    <circle cx="100" cy="100" r="95" fill="#F2E8D9" stroke="#A66D54" strokeWidth="4" />
    <circle cx="100" cy="100" r="85" fill="none" stroke="#A66D54" strokeWidth="1" strokeDasharray="4 4" />

    {/* Candy Icon Group */}
    <g transform="translate(45, 45) scale(0.55)" filter="url(#shadow)">
        {/* Left Wrapper */}
        <path d="M10 100 L50 60 V140 Z" fill="#A66D54" />
        {/* Right Wrapper */}
        <path d="M190 100 L150 60 V140 Z" fill="#A66D54" />
        {/* Candy Body */}
        <circle cx="100" cy="100" r="55" fill="#A66D54" stroke="#593E33" strokeWidth="2" />
        {/* Swirl Decoration */}
        <path d="M70 100 C70 80, 130 80, 130 100 S70 120, 70 100" stroke="#F2E8D9" strokeWidth="6" fill="none" strokeLinecap="round" />
    </g>

    {/* Brand Text */}
    <text x="100" y="155" fontFamily="Quicksand, sans-serif" fontSize="26" fontWeight="800" fill="#593E33" textAnchor="middle">The</text>
    <text x="100" y="180" fontFamily="Quicksand, sans-serif" fontSize="22" fontWeight="700" fill="#A66D54" textAnchor="middle" letterSpacing="1">SWEET SHOP</text>
  </svg>
);