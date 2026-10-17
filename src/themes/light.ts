const colors = {
  button: {
    primaryActiveBG: "#880D1E",
  },
  dark: {
    black: "#000000",
    black_4: "#0000000A",
    black_10: "#0000001A",
    greyDark: "#333333",
    greyLight: "#EFF1F5",
    greyMedium: "#6F6B7A",
  },
  light: {
    offWhite: "#FFFEFC",
    white: "#FFFFFF",
    white_40: "#FFFFFF66",
  },
  primitives: {
    primary: "#ffd9ad",
    secondary: "#acb58d",
    tertairy: "#9e2a2b",
    quinary: "#FCF8EC",
  },
  transparent: "#FFFFFF00",
  category: {
    group: "#FFBA86",
    weekend: "#B5D6E8",
    camp: "#CDBCE6",
    action: "#bdecb6",
  },
  warnings: {
    negative: "#f44336",
    warning: "#ff9800",
    positive: "#4caf50",

    background: {
      neutral: "#E6F3FF",
      success: "#d3f7d1",
      error: "#fdd9d7",
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

export const lightTheme = {
  colors,
  font,
  fontWeight,
  text,
  tabBar: {
    inactiveTintColor: colors.dark.black,
    activeTintColor: colors.primitives["primary"],
    backgroundColor: colors.light["white"],
    shadow: "0px -0.33px 0px rgba(0, 0, 0, 0.1)",
  },
  screen: {
    default: {
      backgroundColor: colors.primitives["primary"],
      headerTintColor: colors.dark["black"],
    },
  },
  button: {
    primary: {
      default: {
        backgroundColor: colors.primitives["tertairy"],
        borderColor: colors.primitives["tertairy"],
        iconColor: colors.light["white"],
        textColor: colors.light["white"],
      },
      active: {
        backgroundColor: colors.button["primaryActiveBG"],
        borderColor: colors.button["primaryActiveBG"],
        iconColor: colors.dark["black"],
        textColor: colors.dark["black"],
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
