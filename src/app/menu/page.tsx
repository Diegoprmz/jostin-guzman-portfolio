import { LogoMark } from "@/components/common/LogoMark";

export default function MenuPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <LogoMark className="h-20 w-20" stroke="#f0ece2" accent="#3b6fe0" />
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
        Showroom
      </span>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Menú — próximamente
      </h1>
      <p className="max-w-md text-muted">
        Aquí vivirá el retrato de Jostin y las salas de proyecto (Step 5).
      </p>
    </main>
  );
}
