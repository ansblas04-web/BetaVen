import React from 'react';

const NoMatches = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M90 80 C10 30, 90 30, 90 80 C90 130, 40 180, 90 180"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M110 80 C190 30, 110 30, 110 80 C110 130, 160 180, 110 180"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <line x1="80" y1="100" x2="120" y2="100" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default NoMatches;
