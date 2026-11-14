const colors = {
  button: {
    primaryActiveBG: "#C43038",
    secondaryActiveBG: "#2A1F18",
    tertiaryDefaultBG: "#2A1F18",
    tertiaryActiveBG: "#C43038",
  },
  dark: {
    black: "#FFFFFF",
    black_4: "#FFFFFF0A",
    black_10: "#FFFFFF1A",
    black_30: "#FFFFFF4D",
    greyDark: "#E8DDD4",
    greyLight: "#2A2320",
    greyMedium: "#A8968E",
    greyMedium_60: "#A8968E60",
  },
  light: {
    offWhite: "#1A1A1C",
    white: "#121214",
    white_40: "#00000066",
  },
  primitives: {
    primary: "#C43038",
    primary_AA: "#C43038",
    quaternary_48: "#3A2A22",
    quaternary: "#2A1F18",
    quinaryDarker: "#2A2320",
    quinary: "#1C1714",
    secondary: "#AD3535",
    secondary_AA: "#D09878",
    secondary_AA_40: "#D0987840",
    secondaryLight: "#3D2E26",
    senary: "#2A2320",
    tertiary: "#3A2A22",
  },
  transparent: "#00000000",
  category: {
    group: "#8C5A2E",
    groupLight: "#F0C890",
    group_60: "#8C5A2E60",
    weekend: "#3A5A6B",
    weekendLight: "#A8D4E8",
    weekend_60: "#3A5A6B60",
    camp: "#5A4A70",
    campLight: "#C8B0E0",
    camp_60: "#5A4A7060",
    action: "#5A8B40",
    actionLight: "#B8E898",
    action_60: "#5A8B4060",
  },
  warnings: {
    negative: "#3A1A18",
    neutral: "#1A2F40",
    positive: "#1B3A1E",
    positiveActive: "#388E3C",

    error: "#d32f2f",
    errorLight: "#FFCDD2",
    errorDark: "#ef5350",
    errorShadow: "#b71a1a66",
    error_60: "#d32f2f60",
    warning: "#ff9800",
    warningLight: "#FFF3E0",
    warningDark: "#ffa726",
    warningShadow: "#e6510066",
    warning_60: "#ff980060",
    success: "#388e3c",
    successLight: "#C8E6C9",
    success_60: "#388e3c60",
    successDark: "#66bb6a",
    successShadow: "#1b5e2066",
  },
  chip: {
    selected: "#3A5A6B",
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

export const darkTheme = {
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
    shadow: "0px -0.33px 0px rgba(255, 255, 255, 0.1)",
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
        iconColor: colors.dark["black"],
        textColor: colors.dark["black"],
        innerShadow: {
          color: "#6B1A2266",
          x: 0,
          y: -4,
          blur: 0,
          spread: 0,
        },
      },
      active: {
        backgroundColor: colors.primitives["primary"],
        borderColor: colors.primitives["primary"],
        iconColor: colors.dark["black"],
        textColor: colors.dark["black"],
        innerShadow: {
          color: "#6B1A2266",
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
          color: "#00000066",
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
          color: "#00000066",
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
        iconColor: colors.warnings["errorLight"],
        textColor: colors.warnings["errorLight"],
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
        iconColor: colors.warnings["errorLight"],
        textColor: colors.warnings["errorLight"],
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
        iconColor: colors.warnings["error_60"],
        textColor: colors.warnings["error_60"],
      },
    },
    warning: {
      default: {
        backgroundColor: colors.warnings["warning"],
        borderColor: colors.warnings["warning"],
        iconColor: colors.warnings["warningLight"],
        textColor: colors.warnings["warningLight"],
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
        iconColor: colors.warnings["warningLight"],
        textColor: colors.warnings["warningLight"],
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
        iconColor: colors.warnings["warning_60"],
        textColor: colors.warnings["warning_60"],
      },
    },
    success: {
      default: {
        backgroundColor: colors.warnings["success"],
        borderColor: colors.warnings["success"],
        iconColor: colors.warnings["successLight"],
        textColor: colors.warnings["successLight"],
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
        iconColor: colors.warnings["successLight"],
        textColor: colors.warnings["successLight"],
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
        iconColor: colors.warnings["success_60"],
        textColor: colors.warnings["success_60"],
      },
    },
    categoryGroup: {
      default: {
        backgroundColor: colors.category["group"],
        borderColor: colors.category["group"],
        iconColor: colors.category["groupLight"],
        textColor: colors.category["groupLight"],
      },
      active: {
        backgroundColor: colors.primitives["secondary_AA"],
        borderColor: colors.primitives["secondary_AA"],
        iconColor: colors.category["group"],
        textColor: colors.category["group"],
      },
      disabled: {
        backgroundColor: colors.category["group"],
        borderColor: colors.category["group"],
        iconColor: colors.category["group_60"],
        textColor: colors.category["group_60"],
      },
    },
    categoryWeekend: {
      default: {
        backgroundColor: colors.category["weekend"],
        borderColor: colors.category["weekend"],
        iconColor: colors.category["weekendLight"],
        textColor: colors.category["weekendLight"],
      },
      active: {
        backgroundColor: colors.primitives["secondary_AA"],
        borderColor: colors.primitives["secondary_AA"],
        iconColor: colors.category["weekend"],
        textColor: colors.category["weekend"],
      },
      disabled: {
        backgroundColor: colors.category["weekend"],
        borderColor: colors.category["weekend"],
        iconColor: colors.category["weekend_60"],
        textColor: colors.category["weekend_60"],
      },
    },
    categoryCamp: {
      default: {
        backgroundColor: colors.category["camp"],
        borderColor: colors.category["camp"],
        iconColor: colors.category["campLight"],
        textColor: colors.category["campLight"],
      },
      active: {
        backgroundColor: colors.primitives["secondary_AA"],
        borderColor: colors.primitives["secondary_AA"],
        iconColor: colors.category["camp"],
        textColor: colors.category["camp"],
      },
      disabled: {
        backgroundColor: colors.category["camp"],
        borderColor: colors.category["camp"],
        iconColor: colors.category["camp_60"],
        textColor: colors.category["camp_60"],
      },
    },
    categoryAction: {
      default: {
        backgroundColor: colors.category["action"],
        borderColor: colors.category["action"],
        iconColor: colors.category["actionLight"],
        textColor: colors.category["actionLight"],
      },
      active: {
        backgroundColor: colors.primitives["secondary_AA"],
        borderColor: colors.primitives["secondary_AA"],
        iconColor: colors.category["action"],
        textColor: colors.category["action"],
      },
      disabled: {
        backgroundColor: colors.category["action"],
        borderColor: colors.category["action"],
        iconColor: colors.category["action_60"],
        textColor: colors.category["action_60"],
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
    boxShadow: "0px 0px 19px 0px #FFFFFF0A",
  },
  spacing: (v: number) => v * 4,
};

export type ThemeSection = keyof typeof darkTheme.sections;
