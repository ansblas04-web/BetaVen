import React from 'react';

const EmptyFeed = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="40" y="60" width="120" height="100" rx="10" stroke="currentColor" strokeWidth="2" />
    <rect x="50" y="50" width="100" height="90" rx="10" stroke="currentColor" strokeWidth="2" />
    <rect x="60" y="40" width="80" height="80" rx="10" stroke="currentColor" strokeWidth="2" />
    <circle cx="90" cy="80" r="5" fill="currentColor" />
    <circle cx="110" cy="80" r="5" fill="currentColor" />
    <path d="M90 100 C95 90, 105 90, 110 100" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default EmptyFeed;
