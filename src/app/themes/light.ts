export const lightColors = {
  brand: {
    primary: "#880D1E",
    secondary: "#ffd9ad",
    accent: "#acb58d",
  },
  semantic: {
    success: "#4caf50",
    successBg: "#d3f7d1",
    error: "#f44336",
    errorBg: "#fdd9d7",
    warning: "#ff9800",
    info: "#E6F3FF",
  },
  surface: {
    base: "#fcfbfb",
    elevated: "#f3f1f1",
    selected: "#e6e3e3",
    muted: "#CDC0B4",
  },
  content: {
    primary: "#080606",
    secondary: "#60646C",
    inverse: "#fcfbfb",
  },
} as const;

export const lightShadow = {
  sm: {
    shadowColor: "#080606",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#080606",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: "#080606",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;
