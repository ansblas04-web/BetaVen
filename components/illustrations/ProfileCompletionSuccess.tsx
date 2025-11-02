import React from 'react';

const ProfileCompletionSuccess = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M60 60 C60 40, 140 40, 140 60 L140 80 C140 100, 60 100, 60 80 Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect x="90" y="100" width="20" height="40" stroke="currentColor" strokeWidth="2" />
    <rect x="80" y="140" width="40" height="10" stroke="currentColor" strokeWidth="2" />
    <path d="M80 80 C70 80, 70 70, 80 70" stroke="currentColor" strokeWidth="2" />
    <path d="M120 80 C130 80, 130 70, 120 70" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default ProfileCompletionSuccess;
