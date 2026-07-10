interface LogoMarkProps {
  className?: string;
  /** Stroke color of the concentric arcs. */
  stroke?: string;
  /** Color of the outline accent square. */
  accent?: string;
  title?: string;
}

/**
 * Brand mark: three concentric arcs forming an open "C" (opening toward the
 * upper-right) with an outline accent square nested in the opening. Colors are
 * parameterized so the same mark renders dark (on the light cover) or light
 * (on the dark showroom).
 */
export function LogoMark({
  className,
  stroke = "#2b2b2b",
  accent = "#1e50c8",
  title = "Jostin Guzmán",
}: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <g transform="translate(47 0)">
        <g fill="none" stroke={stroke} strokeWidth={22} strokeLinecap="butt">
          <path d="M 175 45 A 155 155 0 1 0 274.6 318.7" />
          <path d="M 175 80 A 120 120 0 1 0 252.1 291.9" />
          <path d="M 175 115 A 85 85 0 1 0 229.6 265.1" />
        </g>
        <rect
          x="178"
          y="85"
          width="112"
          height="112"
          fill="none"
          stroke={accent}
          strokeWidth={13}
        />
      </g>
    </svg>
  );
}
