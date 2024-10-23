import 'dart:ui';

import 'package:flutter/foundation.dart' hide Category;
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/availability.dart';
import 'package:piwo/models/enums/category.dart';
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
  List<Availability>? availabilities;

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
  });

  static Future<Activity> fromJson(Map<String, dynamic> json) async {
    List<Availability> availabilities = [];

    if (json['availabilities'] is List) {
      for (var availability in (json['availabilities'] as List<dynamic>)) {
        if (availability is Map) {
          final availabilityMap = Map<String, dynamic>.from(availability);
          final newAvailability = await Availability.fromJson(availabilityMap);

          availabilities.add(newAvailability);
        } else {
          debugPrint(
              'Availability is not in the expected Map format: $availability');
        }
      }
    } else {
      debugPrint('availabilities is not a List or is null.');
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
          ? DateTime.tryParse(json['startDate'])
          : null,
      endDate:
          json['endDate'] != null ? DateTime.tryParse(json['endDate']) : null,
      availabilities: availabilities,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'location': location,
      'color': "0x${color.value.toRadixString(16).toUpperCase()}",
      'recurrence': recurrence.toString(),
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
        : "Geen datum beschikbaar";
  }

  String get getTimes {
    return startDate != null && endDate != null
        ? "${startDate!.hour <= 9 ? "0${startDate!.hour}" : startDate!.hour}:${startDate!.minute <= 9 ? "0${startDate!.minute}" : startDate!.minute} - ${endDate!.hour <= 9 ? "0${endDate!.hour}" : endDate!.hour}:${endDate!.minute <= 9 ? "0${endDate!.minute}" : endDate!.minute}"
        : "Geen tijd beschikbaar";
  }

  Availability? getYourAvailibilty(String accountId) {
    if (availabilities != null) {
      for (var i = 0; i < availabilities!.length; i++) {
        if (availabilities![i].account != null) {
          if (availabilities![i].account!.id == accountId) {
            return availabilities![i];
          }
        }
      }
    }
    return null;
  }
}
