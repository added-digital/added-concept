// Tiny shared store updated imperatively (no React re-renders) so the WebGL
// frame loop can read scroll + pointer without thrashing the component tree.

export const scroll = {
  progress: 0, // 0..1 down the current page
  velocity: 0, // smoothed scroll velocity
};

export const pointer = {
  x: 0, // -1..1
  y: 0, // -1..1
};
