/** Decorative fixed backdrop: soft brand glows + faint grid, masked toward the edges. */
export function BackgroundOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-48 right-[-10rem] size-[30rem] rounded-full bg-chart-2/10 blur-3xl" />
      <div className="bg-grid-overlay absolute inset-0 opacity-60" />
    </div>
  );
}
