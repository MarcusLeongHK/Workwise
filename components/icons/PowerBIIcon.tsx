import React from 'react';

interface PowerBIIconProps {
  size?: number;
  className?: string;
}

const PowerBIIcon: React.FC<PowerBIIconProps> = ({
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
      <rect width="100" height="100" rx="20" fill="#F2C811" />
      <rect x="20" y="45" width="15" height="35" rx="2" fill="white" />
      <rect x="42" y="30" width="15" height="50" rx="2" fill="white" />
      <rect x="64" y="20" width="15" height="60" rx="2" fill="white" />
    </svg>
  );
};

export default PowerBIIcon;