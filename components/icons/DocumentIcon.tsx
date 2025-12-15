import React from "react";

interface DocumentIconProps extends React.SVGProps<SVGSVGElement> {
  /** Size of the icon (width and height) */
  size?: number | string;
  /** Primary color for the outline and background fill */
  color?: string;
  /** Background fill for the foreground document (usually white) */
  paperColor?: string;
}

export const DocumentIcon: React.FC<DocumentIconProps> = ({
  size = 48, // Default size
  color = "#002884", // Default deep blue matching the image
  paperColor = "#FFFFFF",
  style,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ minWidth: size, minHeight: size, ...style }}
      {...props}
    >
      {/* 1. Background Document (Solid Blue)
         Positioned slightly to the left and bottom
      */}
      <rect
        x="3"
        y="5"
        width="14"
        height="18"
        rx="2"
        fill={color}
      />

      {/* 2. Foreground Document (White with Blue Border)
         Positioned slightly to the right and top.
         The path draws the main shape including the diagonal cut for the fold.
      */}
      <path
        d="M8 1H17.5L22 5.5V21C22 22.1046 21.1046 23 20 23H8C6.89543 23 6 22.1046 6 21V3C6 1.89543 6.89543 1 8 1Z"
        fill={paperColor}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* 3. The "Dog-ear" Fold
         Corner triangle at the top right
      */}
      <path
        d="M17.5 1V5.5H22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* 4. Text Lines
         5 lines total. The last one is shorter.
      */}
      <g stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <line x1="10" y1="8" x2="18" y2="8" />
        <line x1="10" y1="11" x2="18" y2="11" />
        <line x1="10" y1="14" x2="18" y2="14" />
        <line x1="10" y1="17" x2="18" y2="17" />
        <line x1="10" y1="20" x2="15" y2="20" />
      </g>
    </svg>
  );
};

export default DocumentIcon;