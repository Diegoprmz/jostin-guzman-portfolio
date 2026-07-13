import Image from "next/image";

interface LogoMarkProps {
  className?: string;
  /** "light" = white mark (dark backgrounds), "dark" = charcoal mark (light). */
  variant?: "light" | "dark";
  title?: string;
}

/**
 * Brand mark — the real artwork: concentric arcs with the accent square in the
 * upper-right quadrant. Light (white) variant for dark surfaces, dark
 * (charcoal) variant for light ones.
 */
export function LogoMark({
  className,
  variant = "light",
  title = "Jostin Guzmán",
}: LogoMarkProps) {
  return (
    <Image
      src={variant === "light" ? "/images/ui/logo-light.png" : "/images/ui/logo-dark.png"}
      alt={title}
      width={80}
      height={80}
      className={className}
      priority
    />
  );
}
