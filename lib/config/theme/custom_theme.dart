import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/config/theme/size_setter.dart';

class CustomTheme {
  BuildContext context;

  static const fontFamily = 'TitilliumWeb';

  CustomTheme(this.context);

  ThemeData get themeData {
    SizeSetter.construct(context);

    return ThemeData(
      useMaterial3: true,
      textTheme: TextTheme(
        // Display
        displayLarge: TextStyle(
          fontSize: SizeSetter.getDisplayLargeSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w700,
          height: 1,
          color: CustomColors.dark,
        ),
        displayMedium: TextStyle(
          fontSize: SizeSetter.getDisplayMediumSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w700,
          height: 1,
          color: CustomColors.dark,
        ),
        displaySmall: TextStyle(
          fontSize: SizeSetter.getDisplaySmallSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w700,
          height: 1,
          color: CustomColors.dark,
        ),

        // Headline -- 700
        headlineLarge: TextStyle(
          fontSize: SizeSetter.getHeadlineLargeSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w700,
          height: 1,
          color: CustomColors.primary,
        ),
        headlineMedium: TextStyle(
          fontSize: SizeSetter.getHeadlineMediumSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w600,
          height: 1,
          color: CustomColors.primary,
        ),
        headlineSmall: TextStyle(
          fontSize: SizeSetter.getHeadlineSmallSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w600,
          height: 1,
          color: CustomColors.primary,
        ),

        // Title -- 500
        titleLarge: TextStyle(
          fontSize: SizeSetter.getTitleLargeSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w700,
          height: 1,
          color: CustomColors.primary,
        ),
        titleMedium: TextStyle(
          fontSize: SizeSetter.getTitleMediumSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w600,
          height: 1,
          color: CustomColors.primary,
        ),
        titleSmall: TextStyle(
          fontSize: SizeSetter.getTitleSmallSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w500,
          height: 1,
          color: CustomColors.dark,
        ),

        // Label -- 900
        labelSmall: TextStyle(
          fontSize: SizeSetter.getLabelSmallSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w500,
          height: 1,
          color: CustomColors.dark,
        ),
        labelMedium: TextStyle(
          fontSize: SizeSetter.getLabelMediumSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w500,
          height: 1,
          color: CustomColors.dark,
        ),
        labelLarge: TextStyle(
          fontSize: SizeSetter.getLabelLargeSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w700,
          height: 1,
          color: CustomColors.dark,
        ),

        // Body -- 400
        bodyLarge: TextStyle(
          fontSize: SizeSetter.getBodyLargeSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w400,
          color: CustomColors.dark,
        ),
        bodyMedium: TextStyle(
          fontSize: SizeSetter.getBodyMediumSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w400,
          color: CustomColors.dark,
        ),
        bodySmall: TextStyle(
          fontSize: SizeSetter.getBodySmallSize(),
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w400,
          color: CustomColors.dark,
        ),
      ),
    );
  }
}
