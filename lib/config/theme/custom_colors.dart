import 'package:flutter/material.dart';
import 'package:piwo/models/enums/category.dart';
import 'package:piwo/models/enums/status.dart';

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
  static const light700 = Color(0xFFF2F2F2);
  static const light600 = Color(0xFFC5C5C5);
  static const light500 = Color(0xFFD8D8D8);
  static const light400 = Color(0xFFEBEBEB);
  static const light300 = Color(0xFFF7F7F7);
  static const light250 = Color(0xFFF2F1F4); // light alt
  static const light200 = Color(0xFFF3F3F3); // light
  static const light100 = Color(0xFFFCFCFC); // white

  // Menu bar
  static const menuBackground = Color(0xFFFAF9F9);
  static const selectedMenuColor = Color(0xFFFFC176);
  static const unselectedMenuColor = Color(0xFFA2A5A9);

  static const themePrimary = Color(0xFFFFC176);
  static const themeBackground = Color(
      0xFFFFD9AD); // Current theme background: const Color.fromARGB(255, 242, 223, 205)
  static const background100 = Color(0xFFFFF5EB);
  static const background200 = Color(0xFFFFE1C2);

  static const greyYellow = Color(0xFFCDC0B4);

  // Activities
  static const activityAction = Color(0xFFFF4D4D);
  static const activityKamp = Color(0xFF9C27B0);
  static const actionWeekend = Color(0xFF2196F3);

  static Color getActivityColor(Category category) {
    if (category == Category.groepsavond) {
      return CustomColors.themePrimary;
    } else if (category == Category.weekend) {
      return CustomColors.actionWeekend;
    } else if (category == Category.actie) {
      return CustomColors.activityAction;
    } else {
      return CustomColors.activityKamp;
    }
  }

  static Color getAvailabilityColor(Status? status) {
    if (status != null) {
      if (status == Status.aanwezig) {
        return Colors.green;
      } else if (status == Status.misschien) {
        return Colors.orange;
      } else if (status == Status.afwezig) {
        return Colors.red;
      } else {
        return CustomColors.themePrimary;
      }
    } else {
      return CustomColors.themePrimary;
    }
  }
}
