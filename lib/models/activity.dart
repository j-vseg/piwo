import 'dart:ui';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart' hide Category;
import 'package:piwo/models/availability.dart';
import 'package:piwo/models/enums/category.dart';
import 'package:piwo/models/enums/month.dart';
import 'package:piwo/models/enums/recurrance.dart';
import 'package:piwo/services/availability.dart';

class Activity {
  String id;
  String name;
  String? location;
  Color color;
  Recurrence recurrence;
  Category category;
  DateTime startDate;
  DateTime endDate;
  Map<DateTime, List<DocumentReference>>? availabilities;
  List<DateTime>? exceptions;

  Activity({
    required this.id,
    required this.name,
    this.location,
    required this.color,
    required this.recurrence,
    required this.category,
    required this.startDate,
    required this.endDate,
    this.availabilities,
    this.exceptions,
  });

  static Future<Activity> fromJson(Map<String, dynamic> json) async {
    Map<DateTime, List<DocumentReference>> availabilities = {};

    if (json['availabilities'] != null) {
      final availabilitiesData =
          Map<String, dynamic>.from(json['availabilities']);

      for (var entry in availabilitiesData.entries) {
        DateTime date = Availability.parseFormattedDateTime(entry.key);
        List<dynamic> refs = entry.value;

        availabilities[date] =
            refs.map((ref) => ref as DocumentReference<Object?>).toList();
      }
    }

    Recurrence recurrence = Recurrence.geen;
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

    Category category = Category.groepsavond;
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
      id: json['id'] ?? '',
      name: json['name'],
      location: json['location'],
      color: Color(int.parse(json['color'])),
      recurrence: recurrence,
      category: category,
      startDate: json['startDate'] != null
          ? DateTime.tryParse(json['startDate'])!.toUtc()
          : DateTime.now(),
      endDate: json['endDate'] != null
          ? DateTime.tryParse(json['endDate'])!.toUtc()
          : DateTime.now(),
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

    data['id'] = id;
    data['name'] = name;
    if (location != null) data['location'] = location;
    data['color'] = "0x${color.value.toRadixString(16).toUpperCase()}";
    data['recurrence'] = recurrence.toString().split('.').last;
    data['category'] = category.toString().split('.').last;
    data['startDate'] = startDate.toIso8601String();
    data['endDate'] = endDate.toIso8601String();
    if (availabilities != null) {
      data['availabilities'] = availabilities?.map((date, availList) =>
          MapEntry(Availability.formatDateTime(date),
              availList.map((e) => e).toList()));
    }
    if (exceptions != null) {
      data['exceptions'] =
          exceptions?.map((date) => date.toIso8601String()).toList();
    }

    return data;
  }

  DateTime get getStartDate {
    return DateTime(startDate.year, startDate.month, startDate.day);
  }

  DateTime get getEndDateTimes {
    return DateTime(
        endDate.year, endDate.month, endDate.day, endDate.hour, endDate.minute);
  }

  String get getFullDate {
    return doesActivitySpanMultipleDays(this)
        ? "${startDate.toLocal().day} ${Month.values[endDate.toLocal().month - 1].name} ${startDate.toLocal().hour <= 9 ? "0${startDate.toLocal().hour}" : startDate.toLocal().hour}:${startDate.toLocal().minute <= 9 ? "0${startDate.toLocal().minute}" : startDate.toLocal().minute} - ${endDate.toLocal().day} ${Month.values[endDate.toLocal().month - 1].name} ${endDate.toLocal().hour <= 9 ? "0${endDate.toLocal().hour}" : endDate.toLocal().hour}:${endDate.toLocal().minute <= 9 ? "0${endDate.toLocal().minute}" : endDate.toLocal().minute}"
        : "${startDate.toLocal().day} ${Month.values[endDate.toLocal().month - 1].name} ${startDate.toLocal().hour <= 9 ? "0${startDate.toLocal().hour}" : startDate.toLocal().hour}:${startDate.toLocal().minute <= 9 ? "0${startDate.toLocal().minute}" : startDate.toLocal().minute} - ${endDate.toLocal().hour <= 9 ? "0${endDate.toLocal().hour}" : endDate.toLocal().hour}:${endDate.toLocal().minute <= 9 ? "0${endDate.toLocal().minute}" : endDate.toLocal().minute}";
  }

  String get getTimes {
    return doesActivitySpanMultipleDays(this)
        ? " Start om ${startDate.toLocal().hour <= 9 ? "0${startDate.toLocal().hour}" : startDate.toLocal().hour}:${startDate.toLocal().minute <= 9 ? "0${startDate.toLocal().minute}" : startDate.toLocal().minute} - Eindigd op ${endDate.toLocal().day} ${Month.values[endDate.toLocal().month - 1].name} ${endDate.toLocal().hour <= 9 ? "0${endDate.toLocal().hour}" : endDate.toLocal().hour}:${endDate.toLocal().minute <= 9 ? "0${endDate.toLocal().minute}" : endDate.toLocal().minute}"
        : "${startDate.toLocal().hour <= 9 ? "0${startDate.toLocal().hour}" : startDate.toLocal().hour}:${startDate.toLocal().minute <= 9 ? "0${startDate.toLocal().minute}" : startDate.toLocal().minute} - ${endDate.toLocal().hour <= 9 ? "0${endDate.toLocal().hour}" : endDate.toLocal().hour}:${endDate.toLocal().minute <= 9 ? "0${endDate.toLocal().minute}" : endDate.toLocal().minute}";
  }

  Future<Availability?> getYourAvailability(
      DateTime date, String accountId) async {
    if (availabilities != null && availabilities!.containsKey(date)) {
      List<DocumentReference>? availabilityList = availabilities![date];

      if (availabilityList != null) {
        for (var availabilityRef in availabilityList) {
          var availability =
              await AvailabilityService().getAvailability(availabilityRef.id);
          if (availability != null) {
            if (availability.account.id == accountId) {
              return availability;
            }
          }
        }
      }
      return null; // Return null if no matching availability is found
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
