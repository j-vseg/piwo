import 'dart:ui';

import 'package:flutter/foundation.dart' hide Category;
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/availability.dart';
import 'package:piwo/models/enums/category.dart';
import 'package:piwo/models/enums/month.dart';
import 'package:piwo/models/enums/recurrance.dart';

class Activity {
  String? id;
  String? name;
  String? location;
  Color color;
  Recurrence? recurrence;
  Category? category;
  DateTime? startDate;
  DateTime? endDate;
  Map<DateTime, List<Availability>>? availabilities;
  List<DateTime>? exceptions;

  Activity({
    this.id,
    this.name,
    this.location,
    this.color = CustomColors.themePrimary,
    this.recurrence,
    this.category,
    this.startDate,
    this.endDate,
    this.availabilities,
    this.exceptions,
  });

  static Future<Activity> fromJson(Map<String, dynamic> json) async {
    Map<DateTime, List<Availability>> availabilities = {};

    if (json['availabilities'] != null) {
      final availabilitiesData =
          json['availabilities'] as Map<Object?, Object?>;

      for (var entry in availabilitiesData.entries) {
        if (entry.key is String) {
          DateTime date =
              Availability.parseFormattedDateTime(entry.key as String);
          List<Availability> availabilityList = [];

          if (entry.value is List) {
            for (var availabilityJson in entry.value as List) {
              final availabilityMap = Map<String, dynamic>.from(
                  availabilityJson as Map<Object?, Object?>);
              final newAvailability =
                  await Availability.fromJson(availabilityMap);
              availabilityList.add(newAvailability);
            }
          }

          availabilities[date] = availabilityList;
        }
      }
    }

    Recurrence? recurrence;
    if (json['recurrence'] != null) {
      try {
        recurrence = Recurrence.values.firstWhere(
          (cat) =>
              cat.toString().split('.').last.toLowerCase() ==
              json['recurrence'].toString().toLowerCase(),
          orElse: () => Recurrence.geen,
        );
      } catch (e) {
        debugPrint('Unknown recurrence: ${json['recurrence']}');
      }
    }

    Category? category;
    if (json['category'] != null) {
      try {
        category = Category.values.firstWhere(
          (cat) =>
              cat.toString().split('.').last.toLowerCase() ==
              json['category'].toString().toLowerCase(),
          orElse: () => Category.groepsavond,
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
      recurrence: recurrence,
      category: category,
      startDate: json['startDate'] != null
          ? DateTime.tryParse(json['startDate'])!.toUtc()
          : null,
      endDate: json['endDate'] != null
          ? DateTime.tryParse(json['endDate'])!.toUtc()
          : null,
      availabilities: availabilities,
      exceptions: (json['exceptions'] as List<dynamic>?)?.map((e) {
            if (e != null) {
              return DateTime.parse(e as String).toUtc();
            } else {
              throw Exception("Null exception value found");
            }
          }).toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'location': location,
      'color': "0x${color.value.toRadixString(16).toUpperCase()}",
      'recurrence': recurrence?.toString().split('.').last,
      'category': category?.toString().split('.').last,
      'startDate': startDate?.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'availabilities': availabilities?.map((date, availList) => MapEntry(
          Availability.formatDateTime(date),
          availList.map((e) => e.toJson()).toList())),
      'exceptions': exceptions?.map((date) => date.toIso8601String()).toList(),
    };
  }

  DateTime get getStartDate {
    return DateTime(startDate!.year, startDate!.month, startDate!.day);
  }

  DateTime get getEndDateTimes {
    return DateTime(endDate!.year, endDate!.month, endDate!.day, endDate!.hour,
        endDate!.minute);
  }

  String get getFullDate {
    return startDate != null && endDate != null
        ? doesActivitySpanMultipleDays(this)
            ? "${startDate!.toLocal().day} ${Month.values[endDate!.toLocal().month - 1].name} ${startDate!.toLocal().hour <= 9 ? "0${startDate!.toLocal().hour}" : startDate!.toLocal().hour}:${startDate!.toLocal().minute <= 9 ? "0${startDate!.toLocal().minute}" : startDate!.toLocal().minute} - ${endDate!.toLocal().day} ${Month.values[endDate!.toLocal().month - 1].name} ${endDate!.toLocal().hour <= 9 ? "0${endDate!.toLocal().hour}" : endDate!.toLocal().hour}:${endDate!.toLocal().minute <= 9 ? "0${endDate!.toLocal().minute}" : endDate!.toLocal().minute}"
            : "${startDate!.toLocal().day} ${Month.values[endDate!.toLocal().month - 1].name} ${startDate!.toLocal().hour <= 9 ? "0${startDate!.toLocal().hour}" : startDate!.toLocal().hour}:${startDate!.toLocal().minute <= 9 ? "0${startDate!.toLocal().minute}" : startDate!.toLocal().minute} - ${endDate!.toLocal().hour <= 9 ? "0${endDate!.toLocal().hour}" : endDate!.toLocal().hour}:${endDate!.toLocal().minute <= 9 ? "0${endDate!.toLocal().minute}" : endDate!.toLocal().minute}"
        : "Geen datum beschikbaar";
  }

  String get getTimes {
    return startDate != null && endDate != null
        ? doesActivitySpanMultipleDays(this)
            ? " Start om ${startDate!.toLocal().hour <= 9 ? "0${startDate!.toLocal().hour}" : startDate!.toLocal().hour}:${startDate!.toLocal().minute <= 9 ? "0${startDate!.toLocal().minute}" : startDate!.toLocal().minute} - Eindigd op ${endDate!.toLocal().day} ${Month.values[endDate!.toLocal().month - 1].name} ${endDate!.toLocal().hour <= 9 ? "0${endDate!.toLocal().hour}" : endDate!.toLocal().hour}:${endDate!.toLocal().minute <= 9 ? "0${endDate!.toLocal().minute}" : endDate!.toLocal().minute}"
            : "${startDate!.toLocal().hour <= 9 ? "0${startDate!.toLocal().hour}" : startDate!.toLocal().hour}:${startDate!.toLocal().minute <= 9 ? "0${startDate!.toLocal().minute}" : startDate!.toLocal().minute} - ${endDate!.toLocal().hour <= 9 ? "0${endDate!.toLocal().hour}" : endDate!.toLocal().hour}:${endDate!.toLocal().minute <= 9 ? "0${endDate!.toLocal().minute}" : endDate!.toLocal().minute}"
        : "Geen tijd beschikbaar";
  }

  Availability? getYourAvailability(DateTime date, String accountId) {
    if (availabilities != null && availabilities!.containsKey(date)) {
      List<Availability>? availabilityList = availabilities![date];

      if (availabilityList != null) {
        for (var availability in availabilityList) {
          if (availability.account?.id == accountId) {
            return availability;
          }
        }
      }
    }
    return null;
  }

  static bool doesActivitySpanMultipleDays(Activity activity) {
    DateTime startDate = DateTime(activity.getStartDate.year,
        activity.getStartDate.month, activity.getStartDate.day);
    DateTime endDate = DateTime(activity.getEndDateTimes.year,
        activity.getEndDateTimes.month, activity.getEndDateTimes.day);

    return endDate.isAfter(startDate);
  }
}
