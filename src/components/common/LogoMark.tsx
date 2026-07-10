interface LogoMarkProps {
  className?: string;
  /** Stroke color of the concentric arcs. */
  stroke?: string;
  /** Color of the outline accent square. */
  accent?: string;
  title?: string;
}

/**
 * Brand mark: three concentric arcs (opening in the upper-right quadrant) with
 * an outline accent square nested in that opening — the arc ends meet the
 * square's left edge (top) and bottom edge (right). Geometry measured from the
 * original artwork. Colors are parameterized for light/dark contexts.
 */
export function LogoMark({
  className,
  stroke = "#2b2b2b",
  accent = "#1e50c8",
  title = "Jostin Guzmán",
}: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 188 154"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <g transform="translate(-518 -261)">
        <g fill="none" stroke={stroke} strokeWidth={8} strokeLinecap="butt">
          <path d="M 661.4 339.9 A 66 66 0 1 1 592.0 271.7" />
          <path d="M 645.9 339.4 A 50.5 50.5 0 1 1 592.8 287.2" />
          <path d="M 630.9 338.8 A 35.5 35.5 0 1 1 593.5 302.2" />
        </g>
        <rect
          x="608"
          y="269"
          width="91"
          height="91"
          fill="none"
          stroke={accent}
          strokeWidth={5}
        />
      </g>
    </svg>
  );
}
