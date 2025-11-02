import React from 'react';

const NoMessages = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M40 40 C20 40, 20 60, 40 60 L160 60 C180 60, 180 40, 160 40 Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M40 60 L40 140 C40 160, 20 160, 20 140 L20 60"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M160 60 L160 140 C160 160, 180 160, 180 140 L180 60"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M40 140 L80 140 L100 160 L120 140 L160 140"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="90" cy="100" r="5" fill="currentColor" />
    <circle cx="110" cy="100" r="5" fill="currentColor" />
    <path d="M90 120 C95 110, 105 110, 110 120" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default NoMessages;
