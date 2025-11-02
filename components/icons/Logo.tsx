import React from 'react';

const Logo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="512"
    height="512"
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M256 512C256 512 128 416 128 256C128 96 256 0 256 0C256 0 384 96 384 256C384 416 256 512 256 512Z"
      fill="#FF6B6B"
    />
    <path
      d="M256 384C256 384 192 320 192 224C192 128 256 96 256 96C256 96 320 128 320 224C320 320 256 384 256 384Z"
      fill="#FFD166"
    />
  </svg>
);

export default Logo;
