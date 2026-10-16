export const darkColors = {
  brand: {
    primary: "#c44d5c",
    primaryLight: "#2e1216",
    secondary: "#ffd9ad",
    secondaryLight: "#2e2418",
    accent: "#acb58d",
    accentLight: "#252820",
  },
  semantic: {
    success: "#66bb6a",
    successBg: "#1b2e1b",
    error: "#ef5350",
    errorBg: "#2e1b1b",
    warning: "#ffa726",
    info: "#1a2a3a",
  },
  surface: {
    base: "#0e0c0c",
    elevated: "#1c1a1a",
    selected: "#2a2727",
    muted: "#3a3632",
  },
  content: {
    primary: "#f5f3f3",
    secondary: "#9e9e9e",
    inverse: "#0e0c0c",
  },
} as const;

export const darkShadow = {
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;
