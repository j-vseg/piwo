const colors = {
  button: {
    primaryActiveBG: "#E75100",
    secondaryActiveBG: "#3B061A",
    tertiaryDefaultBG: "#3B061A",
    tertiaryActiveBG: "#E75100",
  },
  dark: {
    black: "#000000",
    black_4: "#4B13280A",
    black_10: "#4B13281A",
    black_30: "#4B13284D",
    greyDark: "#270B01",
    greyLight: "#F1E8DC",
    greyMedium: "#270B0199",
    greyMedium_60: "#270B0160",
  },
  light: {
    offWhite: "#FFFEFC",
    white: "#FFFFFF",
    white_40: "#FFFFFF66",
  },
  primitives: {
    primary: "#E75100",
    primary_AA: "#E75100",
    quaternary_48: "#FFDEC5",
    quaternary: "#FEE9D6",
    quinaryDarker: "#F1E8DC",
    quinary: "#F7F2EB",
    secondary: "#AD2831",
    secondary_AA: "#3B061A",
    secondary_AA_40: "#3B061A40",
    secondaryLight: "#F5D8D8",
    senary: "#F1E8DC",
    tertiary: "#FEE9D6",
  },
  transparent: "#FFFFFF00",
  category: {
    group: "#FFBA86",
    weekend: "#B5D6E8",
    camp: "#CDBCE6",
    action: "#bdecb6",
  },
  warnings: {
    negative: "#FEE9D6",
    neutral: "#DAEBF3",
    positive: "#D8F3D9",
    positiveActive: "#63A13A",

    error: "#f44336",
    errorDark: "#c62828",
    errorShadow: "#b71a1a66",
    warning: "#ff9800",
    warningDark: "#e65100",
    warningShadow: "#bf360c66",
    success: "#4caf50",
    successDark: "#2e7d32",
    successShadow: "#1b5e2066",
  },
  chip: {
    selected: "#5E7886",
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
  niramit: {
    semibold: {
      fontFamily: "Niramit",
      fontWeight: fontWeight.semiBold,
    },
  },
  googleSansFlex: {
    regular: {
      fontFamily: "Google Sans Flex",
      fontWeight: fontWeight.light,
    },
    medium: {
      fontFamily: "Google Sans Flex",
      fontWeight: fontWeight.medium,
    },
    bold: {
      fontFamily: "Google Sans Flex",
      fontWeight: fontWeight.bold,
    },
  },
} as const;

const text = {
  text: {
    color: colors.dark["black"],
    textBreakStrategy: "balanced",
    // Android otherwise pads the text box with the font's larger win ascent and descent, which
    // throws off the capsize trims.
    includeFontPadding: false,
  },
  h1: {
    fontFamily: font.niramit.semibold.fontFamily,
    fontWeight: font.niramit.semibold.fontWeight,
    fontSize: 48 as const,
    lineHeight: 62 as const,
    letterSpacing: -1 as const,
    color: colors.primitives["secondary_AA"],
  },
  h2: {
    fontFamily: font.niramit.semibold.fontFamily,
    fontWeight: font.niramit.semibold.fontWeight,
    fontSize: 32 as const,
    lineHeight: 42 as const,
    letterSpacing: -0.5 as const,
    color: colors.primitives["secondary_AA"],
  },
  h3: {
    fontFamily: font.niramit.semibold.fontFamily,
    fontWeight: font.niramit.semibold.fontWeight,
    fontSize: 20 as const,
    lineHeight: 26 as const,
    letterSpacing: -0.5 as const,
    color: colors.primitives["secondary_AA"],
  },
  h4: {
    fontFamily: font.niramit.semibold.fontFamily,
    fontWeight: font.niramit.semibold.fontWeight,
    fontSize: 18 as const,
    lineHeight: 23 as const,
    letterSpacing: -0.5 as const,
    color: colors.primitives["secondary_AA"],
  },
  h5: {
    fontFamily: font.niramit.semibold.fontFamily,
    fontWeight: font.niramit.semibold.fontWeight,
    fontSize: 16 as const,
    lineHeight: 21 as const,
    letterSpacing: -0.5 as const,
    color: colors.primitives["secondary_AA"],
  },
  bodyLargest: {
    fontFamily: font.googleSansFlex.medium.fontFamily,
    fontWeight: font.googleSansFlex.medium.fontWeight,
    fontSize: 40 as const,
    lineHeight: 50 as const,
  },
  bodyLarge: {
    fontFamily: font.googleSansFlex.medium.fontFamily,
    fontWeight: font.googleSansFlex.medium.fontWeight,
    fontSize: 18 as const,
    lineHeight: 29 as const,
  },
  bodyMedium: {
    fontFamily: font.googleSansFlex.regular.fontFamily,
    fontWeight: font.googleSansFlex.regular.fontWeight,
    fontSize: 16 as const,
    lineHeight: 20 as const,
  },
  bodySmall: {
    fontFamily: font.googleSansFlex.regular.fontFamily,
    fontWeight: font.googleSansFlex.regular.fontWeight,
    fontSize: 14 as const,
    lineHeight: 20 as const,
  },
  bodySmaller: {
    fontFamily: font.googleSansFlex.regular.fontFamily,
    fontWeight: font.googleSansFlex.regular.fontWeight,
    fontSize: 12 as const,
    lineHeight: 15 as const,
  },
  tag: {
    fontFamily: font.googleSansFlex.bold.fontFamily,
    fontWeight: font.googleSansFlex.bold.fontWeight,
    fontSize: 11 as const,
    lineHeight: 14 as const,
    letterSpacing: 0.7 as const,
  },
  menu: {
    fontFamily: font.googleSansFlex.regular.fontFamily,
    fontWeight: font.googleSansFlex.regular.fontWeight,
    fontSize: 11 as const,
    lineHeight: 18 as const,
  },
  button: {
    fontFamily: font.googleSansFlex.medium.fontFamily,
    fontWeight: font.googleSansFlex.medium.fontWeight,
    fontSize: 16 as const,
    lineHeight: 20 as const,
  },
  span: {
    fontFamily: font.googleSansFlex.regular.fontFamily,
    fontWeight: font.googleSansFlex.regular.fontWeight,
    fontSize: 32 as const,
    lineHeight: 40 as const,
  },
  tabButtonLabel: {
    fontSize: 14 as const,
    fontFamily: font.googleSansFlex.bold.fontFamily,
    fontWeight: font.googleSansFlex.bold.fontWeight,
    lineHeight: 20 as const,
  },
} as const;

export const lightTheme = {
  colors,
  font,
  fontWeight,
  text,
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 18,
    xl: 24,
    xxl: 32,
    full: 80,
  },
  tabBar: {
    inactiveTintColor: colors.dark["black"],
    activeTintColor: colors.primitives["primary"],
    backgroundColor: colors.light["white"],
    shadow: "0px -0.33px 0px rgba(0, 0, 0, 0.1)",
  },
  screen: {
    default: {
      backgroundColor: colors.primitives["quinary"],
      headerTintColor: colors.dark["black"],
    },
    modal: {
      backgroundColor: colors.light["offWhite"],
      headerTintColor: colors.primitives["secondary_AA"],
    },
  },
  button: {
    primary: {
      default: {
        backgroundColor: colors.primitives["secondary"],
        borderColor: colors.primitives["secondary"],
        iconColor: colors.light["white"],
        textColor: colors.light["white"],
        innerShadow: {
          color: "#8B1A2266",
          x: 0,
          y: -4,
          blur: 0,
          spread: 0,
        },
      },
      active: {
        backgroundColor: colors.primitives["primary"],
        borderColor: colors.primitives["primary"],
        iconColor: colors.light["white"],
        textColor: colors.light["white"],
        innerShadow: {
          color: "#8B1A2266",
          x: 0,
          y: -4,
          blur: 0,
          spread: 0,
        },
      },
      disabled: {
        backgroundColor: colors.dark["greyLight"],
        borderColor: colors.dark["greyLight"],
        iconColor: colors.dark["greyMedium_60"],
        textColor: colors.dark["greyMedium_60"],
      },
    },
    secondary: {
      default: {
        backgroundColor: colors.primitives["quinaryDarker"],
        borderColor: colors.primitives["quinaryDarker"],
        iconColor: colors.primitives["secondary_AA"],
        textColor: colors.primitives["secondary_AA"],
        innerShadow: {
          color: "#4B132866",
          x: 0,
          y: -4,
          blur: 0,
          spread: 0,
        },
      },
      active: {
        backgroundColor: colors.primitives["secondary_AA"],
        borderColor: colors.primitives["secondary_AA"],
        iconColor: colors.light["offWhite"],
        textColor: colors.light["offWhite"],
        innerShadow: {
          color: colors.dark["black"],
          x: 0,
          y: -4,
          blur: 0,
          spread: 0,
        },
      },
      disabled: {
        backgroundColor: colors.dark["greyLight"],
        borderColor: colors.dark["greyLight"],
        iconColor: colors.primitives["secondary_AA_40"],
        textColor: colors.primitives["secondary_AA_40"],
      },
    },
    tertiary: {
      default: {
        backgroundColor: colors.primitives["secondary_AA"],
        borderColor: colors.primitives["secondary_AA"],
        iconColor: colors.light["offWhite"],
        textColor: colors.light["offWhite"],
        innerShadow: {
          color: colors.dark["black"],
          x: 0,
          y: -4,
          blur: 0,
          spread: 0,
        },
      },
      active: {
        backgroundColor: colors.primitives["primary_AA"],
        borderColor: colors.primitives["primary_AA"],
        iconColor: colors.primitives["secondary_AA"],
        textColor: colors.primitives["secondary_AA"],
        innerShadow: {
          color: "#3B061A66",
          x: 0,
          y: -4,
          blur: 0,
          spread: 0,
        },
      },
      disabled: {
        backgroundColor: colors.dark["greyLight"],
        borderColor: colors.dark["greyLight"],
        iconColor: colors.dark["greyMedium_60"],
        textColor: colors.dark["greyMedium_60"],
      },
    },
    error: {
      default: {
        backgroundColor: colors.warnings["error"],
        borderColor: colors.warnings["error"],
        iconColor: colors.light["offWhite"],
        textColor: colors.light["offWhite"],
        innerShadow: {
          color: colors.warnings["errorShadow"],
          x: 0,
          y: -4,
          blur: 0,
          spread: 0,
        },
      },
      active: {
        backgroundColor: colors.warnings["errorDark"],
        borderColor: colors.warnings["errorDark"],
        iconColor: colors.light["offWhite"],
        textColor: colors.light["offWhite"],
        innerShadow: {
          color: colors.warnings["errorShadow"],
          x: 0,
          y: -4,
          blur: 0,
          spread: 0,
        },
      },
      disabled: {
        backgroundColor: colors.dark["greyLight"],
        borderColor: colors.dark["greyLight"],
        iconColor: colors.dark["greyMedium_60"],
        textColor: colors.dark["greyMedium_60"],
      },
    },
    warning: {
      default: {
        backgroundColor: colors.warnings["warning"],
        borderColor: colors.warnings["warning"],
        iconColor: colors.light["offWhite"],
        textColor: colors.light["offWhite"],
        innerShadow: {
          color: colors.warnings["warningShadow"],
          x: 0,
          y: -4,
          blur: 0,
          spread: 0,
        },
      },
      active: {
        backgroundColor: colors.warnings["warningDark"],
        borderColor: colors.warnings["warningDark"],
        iconColor: colors.light["offWhite"],
        textColor: colors.light["offWhite"],
        innerShadow: {
          color: colors.warnings["warningShadow"],
          x: 0,
          y: -4,
          blur: 0,
          spread: 0,
        },
      },
      disabled: {
        backgroundColor: colors.dark["greyLight"],
        borderColor: colors.dark["greyLight"],
        iconColor: colors.dark["greyMedium_60"],
        textColor: colors.dark["greyMedium_60"],
      },
    },
    success: {
      default: {
        backgroundColor: colors.warnings["success"],
        borderColor: colors.warnings["success"],
        iconColor: colors.light["offWhite"],
        textColor: colors.light["offWhite"],
        innerShadow: {
          color: colors.warnings["successShadow"],
          x: 0,
          y: -4,
          blur: 0,
          spread: 0,
        },
      },
      active: {
        backgroundColor: colors.warnings["successDark"],
        borderColor: colors.warnings["successDark"],
        iconColor: colors.light["offWhite"],
        textColor: colors.light["offWhite"],
        innerShadow: {
          color: colors.warnings["successShadow"],
          x: 0,
          y: -4,
          blur: 0,
          spread: 0,
        },
      },
      disabled: {
        backgroundColor: colors.dark["greyLight"],
        borderColor: colors.dark["greyLight"],
        iconColor: colors.dark["greyMedium_60"],
        textColor: colors.dark["greyMedium_60"],
      },
    },
    categoryGroup: {
      default: {
        backgroundColor: colors.category["group"],
        borderColor: colors.category["group"],
        iconColor: colors.primitives["secondary_AA"],
        textColor: colors.primitives["secondary_AA"],
      },
      active: {
        backgroundColor: colors.primitives["secondary_AA"],
        borderColor: colors.primitives["secondary_AA"],
        iconColor: colors.light["offWhite"],
        textColor: colors.light["offWhite"],
      },
      disabled: {
        backgroundColor: colors.category["group"],
        borderColor: colors.category["group"],
        iconColor: colors.primitives["secondary_AA_40"],
        textColor: colors.primitives["secondary_AA_40"],
      },
    },
    categoryWeekend: {
      default: {
        backgroundColor: colors.category["weekend"],
        borderColor: colors.category["weekend"],
        iconColor: colors.primitives["secondary_AA"],
        textColor: colors.primitives["secondary_AA"],
      },
      active: {
        backgroundColor: colors.primitives["secondary_AA"],
        borderColor: colors.primitives["secondary_AA"],
        iconColor: colors.light["offWhite"],
        textColor: colors.light["offWhite"],
      },
      disabled: {
        backgroundColor: colors.category["weekend"],
        borderColor: colors.category["weekend"],
        iconColor: colors.primitives["secondary_AA_40"],
        textColor: colors.primitives["secondary_AA_40"],
      },
    },
    categoryCamp: {
      default: {
        backgroundColor: colors.category["camp"],
        borderColor: colors.category["camp"],
        iconColor: colors.primitives["secondary_AA"],
        textColor: colors.primitives["secondary_AA"],
      },
      active: {
        backgroundColor: colors.primitives["secondary_AA"],
        borderColor: colors.primitives["secondary_AA"],
        iconColor: colors.light["offWhite"],
        textColor: colors.light["offWhite"],
      },
      disabled: {
        backgroundColor: colors.category["camp"],
        borderColor: colors.category["camp"],
        iconColor: colors.primitives["secondary_AA_40"],
        textColor: colors.primitives["secondary_AA_40"],
      },
    },
    categoryAction: {
      default: {
        backgroundColor: colors.category["action"],
        borderColor: colors.category["action"],
        iconColor: colors.primitives["secondary_AA"],
        textColor: colors.primitives["secondary_AA"],
      },
      active: {
        backgroundColor: colors.primitives["secondary_AA"],
        borderColor: colors.primitives["secondary_AA"],
        iconColor: colors.light["offWhite"],
        textColor: colors.light["offWhite"],
      },
      disabled: {
        backgroundColor: colors.category["action"],
        borderColor: colors.category["action"],
        iconColor: colors.primitives["secondary_AA_40"],
        textColor: colors.primitives["secondary_AA_40"],
      },
    },
  },
  sections: {
    home: {
      headerBackgroundColor: colors.primitives["quaternary"],
      headerTintColor: colors.dark["black"],
    },
    insight: {
      headerBackgroundColor: colors.primitives["quaternary"],
      headerTintColor: colors.dark["black"],
    },
  },
  insight: {
    chart: {
      legend: {
        backgroundColor: colors.light.white,
        tintColor: colors.dark.black,
      },
    },
  },
  shadow: {
    boxShadow: "0px 0px 19px 0px #A95D0114",
  },
  spacing: (v: number) => v * 4,
};

export type ThemeSection = keyof typeof lightTheme.sections;
