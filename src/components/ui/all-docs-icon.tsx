import * as React from "react";

interface KnoLibIconProps {
  className?: string;
  size?: number;
}

/**
 * Custom KnoLib Logo Icon - Minimalist Excellence
 *
 * A refined logo that embodies modern design principles:
 * - Abstract book/knowledge representation
 * - Clean lines with purposeful negative space
 * - Distinctive silhouette for instant recognition
 * - Timeless design that scales beautifully
 *
 * Design philosophy: True elegance lies in thoughtful simplicity.
 */
export const KnoLibIcon: React.FC<KnoLibIconProps> = ({
  className = "h-6 w-6",
  size = 24
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="KnoLib Knowledge Library Logo"
    suppressHydrationWarning
  >
    {/* Main knowledge container */}
    <path
      d="M6 4 C6 4 6 4 6 4 L18 4 C19.1 4 20 4.9 20 6 L20 18 C20 19.1 19.1 20 18 20 L6 20 C4.9 20 4 19.1 4 18 L4 6 C4 4.9 4.9 4 6 4 Z"
      fill="currentColor"
      fillOpacity="0.1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Knowledge growth indicator */}
    <path
      d="M9 12 L12 9 L15 12"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Knowledge foundation */}
    <circle
      cx="12"
      cy="15"
      r="2"
      fill="currentColor"
    />
  </svg>
);

// Legacy export for backward compatibility
export const AllDocsIcon = KnoLibIcon;

export default KnoLibIcon;
