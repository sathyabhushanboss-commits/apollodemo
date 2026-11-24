import { Sparkles, Smile, Crown, Baby, HeartPulse, Scissors, Zap, ShieldCheck, Layers, type LucideProps } from "lucide-react";

type P = React.SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 24, props: P) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, ...props,
});

export function ToothIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M7.2 3C4.9 3 3 4.9 3 7.4c0 2.4 1.1 3.8 1.7 6.3.6 2.7.9 7.3 2.7 7.3 1.7 0 1.7-4.7 3.1-4.7h3c1.4 0 1.4 4.7 3.1 4.7 1.8 0 2.1-4.6 2.7-7.3.6-2.5 1.7-3.9 1.7-6.3C21 4.9 19.1 3 16.8 3c-2 0-3 1.1-4.8 1.1S9.2 3 7.2 3Z" />
    </svg>
  );
}
export function ImplantIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M7 2.5c-2 0-3.5 1.5-3.5 3.6 0 1.6.8 2.6 1.3 3.9h14.4c.5-1.3 1.3-2.3 1.3-3.9 0-2.1-1.5-3.6-3.5-3.6-1.8 0-2.6.9-5 .9s-3.2-.9-5-.9Z" />
      <path d="M9 10v2h6v-2M9.5 12h5l-.5 9h-4l-.5-9ZM8.5 14.5h7M8.8 17h6.4M9.2 19.5h5.6" />
    </svg>
  );
}
export function BracesIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <rect x="2.5" y="8" width="5" height="8" rx="1.5" />
      <rect x="9.5" y="8" width="5" height="8" rx="1.5" />
      <rect x="16.5" y="8" width="5" height="8" rx="1.5" />
      <path d="M1.5 12h21" />
    </svg>
  );
}

const MAP: Record<string, React.ComponentType<P> | React.ComponentType<LucideProps>> = {
  implant: ImplantIcon,
  rootcanal: ToothIcon,
  braces: BracesIcon,
  aligner: Layers,
  sparkle: Sparkles,
  smile: Smile,
  crown: Crown,
  kids: Baby,
  gum: HeartPulse,
  surgery: Scissors,
  denture: ImplantIcon,
  laser: Zap,
  clean: ShieldCheck,
};

export function ServiceIcon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const I = (MAP[name] || ToothIcon) as React.ComponentType<{ size?: number; className?: string }>;
  return <I size={size} className={className} />;
}

// Brand icons (lucide no longer ships these)
const brand = (d: string) =>
  function BrandIcon({ size = 18 }: { size?: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d={d} /></svg>;
  };
export const Facebook = brand("M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z");
export const Instagram = brand("M12 7.4A4.6 4.6 0 1 0 12 16.6 4.6 4.6 0 0 0 12 7.4Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.8-8.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM21 8.3c-.1-1.5-.4-2.8-1.5-3.8S17.2 3.1 15.7 3c-1.5-.1-5.9-.1-7.4 0-1.5.1-2.8.4-3.8 1.5S3.1 6.8 3 8.3c-.1 1.5-.1 5.9 0 7.4.1 1.5.4 2.8 1.5 3.8s2.3 1.4 3.8 1.5c1.5.1 5.9.1 7.4 0 1.5-.1 2.8-.4 3.8-1.5s1.4-2.3 1.5-3.8c.1-1.5.1-5.9 0-7.4Zm-2 9.2a3 3 0 0 1-1.7 1.7c-1.2.5-3.9.4-5.3.4s-4.1.1-5.3-.4a3 3 0 0 1-1.7-1.7c-.5-1.2-.4-3.9-.4-5.3s-.1-4.1.4-5.3A3 3 0 0 1 6.7 5c1.2-.5 3.9-.4 5.3-.4s4.1-.1 5.3.4A3 3 0 0 1 19 6.7c.5 1.2.4 3.9.4 5.3s.1 4.1-.4 5.3Z");
export const Youtube = brand("M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3-5.2 3Z");
export const Linkedin = brand("M6.9 8.8H3.6V20h3.3V8.8ZM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.4 13.6c0-3-.6-5.1-4.1-5.1-1.7 0-2.8.9-3.2 1.8h-.1V8.8H9.8V20h3.3v-5.5c0-1.5.3-2.9 2.1-2.9s1.8 1.7 1.8 3V20h3.4v-6.4Z");
