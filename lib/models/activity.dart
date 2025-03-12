import 'dart:ui';

import 'package:cloud_firestore/cloud_firestore.dart';
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

  static Future<Activity> fromFirestore(DocumentSnapshot doc) async {
    final data = doc.data() as Map<String, dynamic>;

    Map<DateTime, List<Availability>> availabilities = {};

    if (data['availabilities'] != null) {
      final availabilitiesData = data['availabilities'] as Map<String, dynamic>;

      for (var entry in availabilitiesData.entries) {
        DateTime date = Availability.parseFormattedDateTime(entry.key);
        List<Availability> availabilityList = [];

        if (entry.value is List) {
          for (var availabilityJson in entry.value as List) {
            final availabilityMap = Map<String, dynamic>.from(availabilityJson);
            final newAvailability =
                await Availability.fromJson(availabilityMap);
            availabilityList.add(newAvailability);
          }
        }

        availabilities[date] = availabilityList;
      }
    }

    // Parsing Recurrence
    Recurrence? recurrence;
    if (data['recurrence'] != null) {
      try {
        recurrence = Recurrence.values.firstWhere(
          (cat) =>
              cat.toString().split('.').last.toLowerCase() ==
              data['recurrence'].toString().toLowerCase(),
          orElse: () => Recurrence.geen,
        );
      } catch (e) {
        debugPrint('Unknown recurrence: ${data['recurrence']}');
      }
    }

    // Parsing Category
    Category? category;
    if (data['category'] != null) {
      try {
        category = Category.values.firstWhere(
          (cat) =>
              cat.toString().split('.').last.toLowerCase() ==
              data['category'].toString().toLowerCase(),
          orElse: () => Category.groepsavond,
        );
      } catch (e) {
        debugPrint('Unknown category: ${data['category']}');
      }
    }

    // Constructing the Activity object
    return Activity(
      id: data['id'],
      name: data['name'],
      location: data['location'],
      color: Color(int.parse(data['color'])),
      recurrence: recurrence,
      category: category,
      startDate: data['startDate'] != null
          ? DateTime.tryParse(data['startDate'])?.toUtc()
          : null,
      endDate: data['endDate'] != null
          ? DateTime.tryParse(data['endDate'])?.toUtc()
          : null,
      availabilities: availabilities,
      exceptions: (data['exceptions'] as List<dynamic>?)?.map((e) {
            if (e != null) {
              return DateTime.parse(e as String).toUtc();
            } else {
              throw Exception("Null exception value found");
            }
          }).toList() ??
          [],
    );
  }

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
    final Map<String, dynamic> data = {};

    // Add fields to the map only if they are not null
    if (id != null) data['id'] = id;
    if (name != null) data['name'] = name;
    if (location != null) data['location'] = location;
    data['color'] = "0x${color.value.toRadixString(16).toUpperCase()}";

    if (recurrence != null) {
      data['recurrence'] = recurrence?.toString().split('.').last;
    }
    if (category != null) {
      data['category'] = category?.toString().split('.').last;
    }
    if (startDate != null) data['startDate'] = startDate?.toIso8601String();
    if (endDate != null) data['endDate'] = endDate?.toIso8601String();
    if (availabilities != null) {
      data['availabilities'] = availabilities?.map((date, availList) =>
          MapEntry(Availability.formatDateTime(date),
              availList.map((e) => e.toJson()).toList()));
    }
    if (exceptions != null) {
      data['exceptions'] =
          exceptions?.map((date) => date.toIso8601String()).toList();
    }

    return data;
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
