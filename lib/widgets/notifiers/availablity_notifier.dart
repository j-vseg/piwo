import 'package:flutter/material.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/availability.dart';
import 'package:piwo/services/activity.dart';

class ActivityProvider with ChangeNotifier {
  List<Activity> _activities = [];

  List<Activity> get activities => _activities;

  Future<void> fetchActivities() async {
    _activities = await ActivityService().getAllActivities();
    notifyListeners();
  }

  Future<Activity?> fetchActivity(String activityId) async {
    final activityIndex =
        _activities.indexWhere((activity) => activity.id == activityId);
    if (activityIndex != -1) {
      _activities[activityIndex] =
          await ActivityService().getActivityById(activityId);
      return _activities[activityIndex];
    }
    notifyListeners();

    return null;
  }

  void updateAvailability(
      String activityId, List<Availability> newAvailabilities) {
    final activityIndex =
        _activities.indexWhere((activity) => activity.id == activityId);
    if (activityIndex != -1) {
      _activities[activityIndex].availabilities = newAvailabilities;
      notifyListeners();
    }
  }

  Future<void> updateActivity(String activityId, Activity newActivity) async {
    final activityIndex =
        _activities.indexWhere((activity) => activity.id == activityId);
    if (activityIndex >= 0) {
      newActivity.id = activityId;
      _activities[activityIndex] = newActivity;
    }
    // Notify listeners after updating the state
    notifyListeners();
  }

  Future<void> changeAvailability(
      String activityId, Availability newAvailability) async {
    final activityIndex =
        _activities.indexWhere((activity) => activity.id == activityId);
    if (activityIndex >= 0) {
      final activity = _activities[activityIndex];
      final existingAvailabilityIndex = activity.availabilities!.indexWhere(
          (availability) =>
              availability.account!.id == newAvailability.account!.id);

      if (existingAvailabilityIndex >= 0) {
        // Update existing availability
        if (newAvailability.status != null) {
          activity.availabilities![existingAvailabilityIndex] = newAvailability;
        } else {
          // Remove the availability if status is null
          activity.availabilities!.removeAt(existingAvailabilityIndex);
        }
      } else {
        // Add new availability
        if (newAvailability.status != null) {
          activity.availabilities!.add(newAvailability);
        }
      }

      _activities[activityIndex] = activity;

      // Notify listeners after updating the state
      notifyListeners();
    }
  }
}
