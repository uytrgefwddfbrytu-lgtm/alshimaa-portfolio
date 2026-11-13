export default function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-charcoal/70 backdrop-blur">
      <span className="h-2 w-2 rounded-full bg-teal" />
      {text}
    </span>
  );
}