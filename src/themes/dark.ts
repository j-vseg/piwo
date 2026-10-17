const colors = {
  button: {
    primaryActiveBG: "#A63A4A",
  },
  dark: {
    black: "#FFFFFF",
    black_4: "#FFFFFF0A",
    black_10: "#FFFFFF1A",
    greyDark: "#E0E0E0",
    greyLight: "#2A2A2E",
    greyMedium: "#9E9AAB",
  },
  light: {
    offWhite: "#1A1A1C",
    white: "#121214",
    white_40: "#00000066",
  },
  primitives: {
    primary: "#C4935A",
    secondary: "#7A8360",
    tertairy: "#8B2A2D",
    quinary: "#1E1D18",

    background: {
      primary: "#2A2117",
    },
  },
  transparent: "#00000000",
  category: {
    group: "#8C5A2E",
    weekend: "#3A5A6B",
    camp: "#5A4A70",
    action: "#3A6B34",
  },
  warnings: {
    negative: "#d32f2f",
    warning: "#e68a00",
    positive: "#388e3c",

    background: {
      neutral: "#1A2F40",
      success: "#1B3A1E",
      error: "#3A1A18",
    },
  },
};

const fontWeight = {
  extraLight: 200 as const,
  light: 400 as const,
  medium: 500 as const,
  semiBold: 600 as const,
  bold: 700 as const,
};

export const font = {
  crimsonPro: {
    semibold: {
      fontFamily: "Crimson Pro",
      fontWeight: fontWeight.semiBold,
    },
  },
  inter: {
    regular: {
      fontFamily: "Poppins",
      fontWeight: fontWeight.light,
    },
    regularLarge: {
      fontFamily: "Poppins",
      fontWeight: fontWeight.medium,
    },
    bold: {
      fontFamily: "Poppins",
      fontWeight: fontWeight.bold,
    },
  },
} as const;

const text = {
  text: {
    color: colors.dark["black"],
    textBreakStrategy: "balanced",
  },
  h1: {
    fontFamily: font.crimsonPro.semibold.fontFamily,
    fontWeight: font.crimsonPro.semibold.fontWeight,
    fontSize: 48 as const,
    letterSpacing: -0.5 as const,
  },
  h2: {
    fontFamily: font.crimsonPro.semibold.fontFamily,
    fontWeight: font.crimsonPro.semibold.fontWeight,
    fontSize: 32 as const,
    letterSpacing: -0.5 as const,
  },
  h3: {
    fontFamily: font.crimsonPro.semibold.fontFamily,
    fontWeight: font.crimsonPro.semibold.fontWeight,
    fontSize: 20 as const,
    letterSpacing: -0.5 as const,
  },
  h4: {
    fontFamily: font.crimsonPro.semibold.fontFamily,
    fontWeight: font.crimsonPro.semibold.fontWeight,
    fontSize: 18 as const,
    letterSpacing: -0.5 as const,
  },
  h5: {
    fontFamily: font.crimsonPro.semibold.fontFamily,
    fontWeight: font.crimsonPro.semibold.fontWeight,
    fontSize: 16 as const,
    letterSpacing: -0.5 as const,
  },
  bodyLargest: {
    fontFamily: font.inter.regularLarge.fontFamily,
    fontWeight: font.inter.regularLarge.fontWeight,
    fontSize: 40 as const,
  },
  bodyLarge: {
    fontFamily: font.inter.regularLarge.fontFamily,
    fontWeight: font.inter.regularLarge.fontWeight,
    fontSize: 18 as const,
  },
  bodyMedium: {
    fontFamily: font.inter.regular.fontFamily,
    fontWeight: font.inter.regular.fontWeight,
    fontSize: 16 as const,
  },
  bodySmall: {
    fontFamily: font.inter.regular.fontFamily,
    fontWeight: font.inter.regular.fontWeight,
    fontSize: 14 as const,
  },
  bodySmaller: {
    fontFamily: font.inter.regular.fontFamily,
    fontWeight: font.inter.regular.fontWeight,
    fontSize: 12 as const,
  },
  menu: {
    fontFamily: font.inter.bold.fontFamily,
    fontWeight: font.inter.bold.fontWeight,
    fontSize: 11 as const,
    letterSpacing: 0.2 as const,
  },
  button: {
    fontFamily: font.inter.bold.fontFamily,
    fontWeight: font.inter.bold.fontWeight,
    fontSize: 16 as const,
  },
  span: {
    fontFamily: font.inter.regular.fontFamily,
    fontWeight: font.inter.regular.fontWeight,
    fontSize: 32 as const,
  },
} as const;

export const darkTheme = {
  colors,
  font,
  fontWeight,
  text,
  tabBar: {
    inactiveTintColor: colors.dark.black,
    activeTintColor: colors.primitives["primary"],
    backgroundColor: colors.light["white"],
    shadow: "0px -0.33px 0px rgba(255, 255, 255, 0.1)",
  },
  screen: {
    default: {
      backgroundColor: colors.primitives.background["primary"],
      headerTintColor: colors.dark["black"],
    },
  },
  button: {
    primary: {
      default: {
        backgroundColor: colors.primitives["tertairy"],
        borderColor: colors.primitives["tertairy"],
        iconColor: colors.dark["black"],
        textColor: colors.dark["black"],
      },
      active: {
        backgroundColor: colors.button["primaryActiveBG"],
        borderColor: colors.button["primaryActiveBG"],
        iconColor: colors.light["white"],
        textColor: colors.light["white"],
      },
      disabled: {
        backgroundColor: colors.dark["greyLight"],
        borderColor: colors.dark["greyLight"],
        iconColor: colors.dark["greyMedium"],
        textColor: colors.dark["greyMedium"],
      },
    },
  },
  spacing: (v: number) => v * 4,
};
