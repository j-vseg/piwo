import 'dart:ui';

import 'package:flutter/foundation.dart' hide Category;
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/availability.dart';
import 'package:piwo/models/enums/status.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/models/enums/category.dart';

class Activity {
  String? id;
  String? name;
  String? location;
  Color color;
  Category? category;
  DateTime? startDate;
  DateTime? endDate;
  List<Availability> availabilities;

  Activity({
    this.id,
    this.name,
    this.location,
    this.color = CustomColors.themePrimary,
    this.category,
    this.startDate,
    this.endDate,
    this.availabilities = const [],
  });

  static Future<Activity> fromJson(Map<String, dynamic> json) async {
    List<Availability> availabilities = [];

    if (json['availabilities'] != null) {
      for (var e in (json['availabilities'] as List<dynamic>)) {
        String accountId = e['accountId'];
        Status? status;

        if (e['status'] != null) {
          status = Status.values.firstWhere(
            (s) =>
                s.toString().split('.').last.toLowerCase() ==
                e['status'].toString().toLowerCase(),
          );
        }

        Account account = await AccountService().getAccountById(accountId);

        if (status != null) {
          availabilities.add(Availability(account: account, status: status));
          debugPrint(
              'Could not create availability for accountId: $accountId. Account or Status is null.');
        }
      }
    }

    Category? category;

    if (json['category'] != null) {
      try {
        category = Category.values.firstWhere(
          (cat) =>
              cat.toString().split('.').last.toLowerCase() ==
              json['category'].toString().toLowerCase(),
          orElse: () => Category.groepsavond, // Default value
        );
      } catch (e) {
        debugPrint('Unknown category: ${json['category']}');
      }
    }

    return Activity(
      id: json['id'],
      name: json['name'],
      location: json['location'],
      color: Color(int.parse(json['color'])),
      category: category,
      startDate: json['startDate'] != null
          ? DateTime.tryParse(json['startDate'])
          : null,
      endDate:
          json['endDate'] != null ? DateTime.tryParse(json['endDate']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'location': location,
      'color': "0x${color.value.toRadixString(16).toUpperCase()}",
      'category': category.toString(),
      'startDate': startDate!.toIso8601String(),
      'endDate': endDate!.toIso8601String(),
    };
  }

  String get getFullName {
    return "$name | ${startDate!.year}-${startDate!.month}-${startDate!.day} ${startDate!.hour}:${startDate!.minute <= 9 ? "0${startDate!.minute}" : startDate!.minute}";
  }

  DateTime get getStartDate {
    return DateTime(startDate!.year, startDate!.month, startDate!.day);
  }

  DateTime get endStartDate {
    return DateTime(endDate!.year, endDate!.month, endDate!.day);
  }

  String get getFullDate {
    return startDate != null && endDate != null
        ? "${startDate!.day}-${startDate!.month}-${startDate!.year} ${startDate!.hour <= 9 ? "0${startDate!.hour}" : startDate!.hour}:${startDate!.minute <= 9 ? "0${startDate!.minute}" : startDate!.minute} - ${endDate!.hour <= 9 ? "0${endDate!.hour}" : endDate!.hour}:${endDate!.minute <= 9 ? "0${endDate!.minute}" : endDate!.minute}"
        : "No Date";
  }

  Availability? didSubmitAvailibilty(String accountId) {
    for (var i = 0; i < availabilities.length; i++) {
      if (availabilities[i].account != null) {
        if (availabilities[i].account!.id == accountId) {
          return availabilities[i];
        }
      }
    }
    return null;
  }
}
