import 'package:flutter/material.dart';
import 'package:piwo/models/availability.dart';
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
  static const themeBackground = Color(0xFFFFD9AD);
  static const background100 = Color(0xFFFFF5EB);
  static const background200 = Color(0xFFFFE1C2);

  static const greyYellow = Color(0xFFCDC0B4);

  // Activities
  static const activityAction = Color(0xFFFF4D4D);
  static const activityKamp = Color(0xFF9C27B0);
  static const actionWeekend = Color(0xFF2196F3);

  // Activities background
  static const activityActionBackground = Color(0xFFFFEBEB);
  static const activityKampBackground = Color(0xFFf9EEFB);
  static const actionWeekendBackground = Color(0xFFECF6FE);

  // Activities button
  static const activityActionButton = Color(0xFFFFD6D6);
  static const activityKampButton = Color(0xFFF4DEF8);
  static const actionWeekendButton = Color(0xFFD8ECFD);

  static final activityActionButtonDisabled =
      const Color(0xFF7b5b5b).withOpacity(0.4);
  static final activityKampBButtonDisabled =
      const Color(0xFF6C5171).withOpacity(0.4);
  static final actionWeekendButtonDisabled =
      const Color(0xFF475865).withOpacity(0.4);

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

  static Color getActivityBackgroundColor(Category category) {
    if (category == Category.groepsavond) {
      return CustomColors.background100;
    } else if (category == Category.weekend) {
      return CustomColors.actionWeekendBackground;
    } else if (category == Category.actie) {
      return CustomColors.activityActionBackground;
    } else {
      return CustomColors.activityKampBackground;
    }
  }

  static Color getActivityButtonColor(
    Status buttonStatus, // The status this button represents
    Availability? yourAvailability,
    bool activityHasBeen,
    Category category,
  ) {
    if (activityHasBeen) {
      if (yourAvailability?.status == buttonStatus) {
        // Return disabled colors for past activities
        return _getDisabledColorForCategory(category);
      }
    }

    if (yourAvailability?.status == buttonStatus) {
      // Highlight the button with the specific availability color
      return getAvailabilityColor(buttonStatus, category);
    }

    // Default category button color for other buttons
    return getButtonColorForCategory(category);
  }

  static Color getButtonColorForCategory(Category category) {
    switch (category) {
      case Category.groepsavond:
        return CustomColors.background200;
      case Category.weekend:
        return CustomColors.actionWeekendButton;
      case Category.actie:
        return CustomColors.activityActionButton;
      case Category.kamp:
        return CustomColors.activityKampButton;
    }
  }

  static Color _getDisabledColorForCategory(Category category) {
    switch (category) {
      case Category.groepsavond:
        return CustomColors.greyYellow;
      case Category.weekend:
        return CustomColors.actionWeekendButtonDisabled;
      case Category.actie:
        return CustomColors.activityActionButtonDisabled;
      case Category.kamp:
        return CustomColors.activityKampBButtonDisabled;
      default:
        return CustomColors.themeBackground;
    }
  }

  static Color getAvailabilityColor(Status? status, Category category) {
    if (status != null) {
      switch (status) {
        case Status.aanwezig:
          return Colors.green;
        case Status.misschien:
          return Colors.orange;
        case Status.afwezig:
          return Colors.red;
      }
    }
    return getActivityColor(category);
  }
}
