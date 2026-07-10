interface LogoMarkProps {
  className?: string;
  /** Stroke color of the concentric arcs. */
  stroke?: string;
  /** Fill color of the accent square. */
  accent?: string;
  title?: string;
}

/**
 * Brand mark: three concentric arcs forming an open "C" with an accent
 * square at the top-right. Colors are parameterized so the same mark can
 * render dark (menu) or illuminated (loading screen).
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
      <g fill="none" stroke={stroke} strokeWidth={26} strokeLinecap="butt">
        <path d="M276 323 A150 150 0 1 1 276 77" />
        <path d="M254 292 A112 112 0 1 1 254 108" />
        <path d="M232 261 A74 74 0 1 1 232 139" />
      </g>
      <rect x="262" y="44" width="80" height="80" fill={accent} />
    </svg>
  );
}
