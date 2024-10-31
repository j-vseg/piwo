import 'package:flutter/material.dart';
import 'package:piwo/managers/occurrence.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/availability.dart';
import 'package:piwo/services/activity.dart';

class ActivityProvider with ChangeNotifier {
  List<Activity> _activities = [];

  List<Activity> get activities => _activities;

  Future<void> fetchActivities() async {
    _activities = await ActivityService().getAllActivities();

    _activities
        .addAll(await OccurrenceManager().generateOccurrences(activities));

    notifyListeners();
  }

  Future<Activity?> fetchActivity(String activityId) async {
    final activityIndex =
        _activities.indexWhere((activity) => activity.id == activityId);

    if (activityIndex != -1) {
      _activities[activityIndex] =
          await ActivityService().getActivityById(activityId);
      notifyListeners();
      return _activities[activityIndex];
    }
    return null;
  }

  void updateAvailability(
      String activityId, DateTime date, List<Availability> newAvailabilities) {
    final activityIndex =
        _activities.indexWhere((activity) => activity.id == activityId);
    if (activityIndex != -1) {
      final activity = _activities[activityIndex];

      activity.availabilities ??= {};

      // Update availabilities for the given date
      activity.availabilities![date] = newAvailabilities;
      _activities[activityIndex] = activity;
      notifyListeners();
    }
  }

  Future<void> updateActivity(String activityId, Activity newActivity) async {
    final activityIndex =
        _activities.indexWhere((activity) => activity.id == activityId);
    if (activityIndex >= 0) {
      newActivity.id = activityId; // Ensure the ID is set correctly
      _activities[activityIndex] = newActivity;
      notifyListeners();
    }
  }

  Future<void> createActivity(String activityId, Activity newActivity) async {
    if (!_activities.any((activity) => activity.id == activityId)) {
      _activities.add(newActivity);
      notifyListeners();
    }
  }

  Future<void> changeAvailability(
      String activityId, DateTime date, Availability newAvailability) async {
    final activityIndex =
        _activities.indexWhere((activity) => activity.id == activityId);
    if (activityIndex >= 0) {
      final activity = _activities[activityIndex];
      activity.availabilities ??= {};

      final availabilityList = activity.availabilities![date] ?? [];
      final existingAvailabilityIndex = availabilityList.indexWhere(
        (availability) =>
            availability.account?.id == newAvailability.account?.id,
      );

      if (existingAvailabilityIndex >= 0) {
        if (newAvailability.status != null) {
          availabilityList[existingAvailabilityIndex] = newAvailability;
        } else {
          availabilityList.removeAt(existingAvailabilityIndex);
        }
      } else {
        if (newAvailability.status != null) {
          availabilityList.add(newAvailability);
        }
      }

      activity.availabilities![date] = availabilityList;
      _activities[activityIndex] = activity;
      notifyListeners();
    }
  }
}
