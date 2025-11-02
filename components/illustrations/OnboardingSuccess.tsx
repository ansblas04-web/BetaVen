import React from 'react';

const OnboardingSuccess = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M100 40 C100 40, 80 60, 80 80 L120 80 C120 60, 100 40, 100 40 Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect x="90" y="80" width="20" height="60" stroke="currentColor" strokeWidth="2" />
    <path
      d="M90 140 L80 160 L120 160 L110 140 Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line x1="100" y1="160" x2="100" y2="180" stroke="currentColor" strokeWidth="2" />
    <line x1="80" y1="180" x2="120" y2="180" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default OnboardingSuccess;
