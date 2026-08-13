export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      {/* Base radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 0%, #161f3a 0%, #0a0c12 55%, #06070b 100%)',
        }}
      />

      {/* Aurora blobs */}
      <div
        className="absolute -top-40 left-1/2 h-[55rem] w-[55rem] -translate-x-1/2 rounded-full opacity-50 blur-[140px]"
        style={{
          background:
            'radial-gradient(circle at center, rgba(37,83,235,0.55), transparent 62%)',
        }}
      />
      <div
        className="absolute top-1/4 -right-40 h-[42rem] w-[42rem] rounded-full opacity-35 blur-[150px]"
        style={{
          background:
            'radial-gradient(circle at center, rgba(34,211,238,0.45), transparent 62%)',
        }}
      />
      <div
        className="absolute bottom-0 -left-40 h-[38rem] w-[38rem] rounded-full opacity-30 blur-[150px]"
        style={{
          background:
            'radial-gradient(circle at center, rgba(124,92,255,0.4), transparent 62%)',
        }}
      />

      {/* Subtle noise / grid texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Top + bottom gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950/85" />
    </div>
  );
}
