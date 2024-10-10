import 'package:flutter/material.dart';

class CustomColors {
  // Main Colors
  static const primary = primary600;
  static const secondary = secondary500;

  static const dark = dark900;
  static const light = light100;

  static const success = Color(0xFF497E20);
  static const error = Color(0xFFCC0000);
  static const danger = Color(0xFFdc3546);

  // Primary Colors
  static const primary600 = Color(0xFF201545);
  static const primary500 = Color(0xFFAEA1BF);

  // Secondary Colors
  static const secondary500 = Color(0xFFD73E0F);

  // Dark Colors
  static const dark900 = Color(0xFF0A0A0A);
  static const dark800 = Color(0xFF222222);
  static const dark700 = Color(0xFF2E2E2E);
  static const dark500 = Color(0xFF545454);

  // Light Colors
  static const light600 = Color(0xFFC5C5C5);
  static const light500 = Color(0xFFD8D8D8);
  static const light400 = Color(0xFFEBEBEB);
  static const light300 = Color(0xFFF7F7F7);
  static const light250 = Color(0xFFF2F1F4); // light alt
  static const light200 = Color(0xFFF3F3F3); // light
  static const light100 = Color(0xFFFCFCFC); // white

  // Menu bar
  static const menuBackground = Color(0xFFFAF9F9);
  static const selectedMenuColor = Color(0xFFFD7649);
  static const unselectedMenuColor = Color(0xFFA2A5A9);

  // Activities
  static const activityPrimairyColorBlue = Color(0xFF8F98FD);
  static const activitySecondaryColorBlue = Color(0xFF182B87);
  static const activityPrimairyColorOrange = Color(0xFFFD7649);
  static const activitySecondaryColorOrange = Color(0xFFFFC176);
  static const activityPrimairyColorGreen = Color(0xFF4CC490);
  static const activitySecondaryColorGreen = Color(0xFF00664F);

  // Background colors
  static const primaryBackgroundColor = Color(0xFF00664F);
  static const secondaryBackgroundColor = Color(0xFF16755F);

  static String getActivityColor(index) {
    if (index % 3 == 0)
      return '0xFF8F98FD';
    else if (index % 3 == 1)
      return '0xFFFD7649';
    else
      return '0xFF4CC490';
  }
}
