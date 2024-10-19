import 'package:flutter/foundation.dart' hide Category;
import 'package:piwo/models/account.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/models/enums/category.dart';

class Activity {
  String? id;
  String? name;
  String? location;
  Category? category;
  DateTime? startDate;
  DateTime? endDate;
  List<Account>? available;
  List<Account>? maybe;
  List<Account>? unavailable;

  Activity(
      {this.id,
      this.name,
      this.location,
      this.category,
      this.startDate,
      this.endDate,
      this.available,
      this.maybe,
      this.unavailable});

  static Future<Activity> fromJson(Map<String, dynamic> json) async {
    List<Account> available = [];
    List<Account> maybe = [];
    List<Account> unavailable = [];

    if (json['available'] != null) {
      for (var e in (json['available'] as List<dynamic>)) {
        Account account = await AccountService().getAccountById(e);
        available.add(account);
      }
    }

    if (json['maybe'] != null) {
      for (var e in (json['maybe'] as List<dynamic>)) {
        maybe.add(Account.fromJson(Map<String, dynamic>.from(e as Map)));
      }
    }

    if (json['unavailable'] != null) {
      for (var e in (json['unavailable'] as List<dynamic>)) {
        unavailable.add(Account.fromJson(Map<String, dynamic>.from(e as Map)));
      }
    }

    Category? category;

    if (json['category'] != null) {
      try {
        if (json['category'].toString().toLowerCase() == "actie") {
          category = Category.actie;
        } else if (json['category'].toString().toLowerCase() == "weekend") {
          category = Category.weekend;
        } else if (json['category'].toString().toLowerCase() == "kamp") {
          category = Category.kamp;
        } else {
          category = Category.groepsavond;
        }
      } catch (e) {
        debugPrint('Unknown category: ${json['category']}');
      }
    }

    return Activity(
      id: json['id'],
      name: json['name'],
      location: json['location'],
      category: category,
      startDate: json['startDate'] != null
          ? DateTime.tryParse(json['startDate'])
          : null,
      endDate:
          json['endDate'] != null ? DateTime.tryParse(json['endDate']) : null,
      available: unavailable,
      maybe: maybe,
      unavailable: unavailable,
    );
  }

  Map<String, dynamic> toJson() {
    String category = "";

    if (this.category == Category.kamp) {
      category = 'kamp';
    } else if (this.category == Category.weekend) {
      category = 'weekend';
    } else if (this.category == Category.actie) {
      category = 'actie';
    } else {
      category = 'groepsavond';
    }

    return {
      'id': id,
      'name': name,
      'location': location,
      'category': category,
      'startDate': startDate!.toIso8601String(),
      'endDate': endDate!.toIso8601String(),
      'available':
          available != null ? available!.map((e) => e.toJson()).toList() : [],
      'maybe': maybe != null ? maybe!.map((e) => e.toJson()).toList() : [],
      'unavailable': unavailable != null
          ? unavailable!.map((e) => e.toJson()).toList()
          : [],
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

  bool alreadySignedUp(String accountId) {
    if (available!.any((account) => account.id == accountId) ||
        maybe!.any((account) => account.id == accountId) ||
        unavailable!.any((account) => account.id == accountId)) {
      return true;
    }
    return false;
  }
}
