import React from 'react';

interface PhotoshopIconProps {
  size?: number;
  className?: string;
}

const PhotoshopIcon: React.FC<PhotoshopIconProps> = ({
  size = 100,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" rx="20" fill="#001E36" />
      <text
        x="50"
        y="65"
        fontSize="60"
        fontWeight="bold"
        fontFamily="sans-serif"
        fill="#31A8FF"
        textAnchor="middle"
      >
        Ps
      </text>
    </svg>
  );
};

export default PhotoshopIcon;