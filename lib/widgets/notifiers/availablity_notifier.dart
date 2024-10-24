import 'package:flutter/material.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/availability.dart';
import 'package:piwo/models/enums/recurrance.dart';
import 'package:piwo/services/activity.dart';
import 'package:piwo/services/availability.dart';

class ActivityProvider with ChangeNotifier {
  List<Activity> _activities = [];

  List<Activity> get activities => _activities;

  Future<void> fetchActivities() async {
    _activities = await ActivityService().getAllActivities();

    List<Activity> occurrencesToAdd = [];

    for (var activity in _activities) {
      if (activity.recurrence == Recurrence.wekelijks) {
        List<Activity> occurrences = await _generateWeeklyOccurrences(
          activity,
          activity.startDate!,
          activity.endDate!,
          26,
        );

        occurrencesToAdd.addAll(occurrences);
      }
    }
    _activities.addAll(occurrencesToAdd);

    notifyListeners();
  }

  Future<List<Activity>> _generateWeeklyOccurrences(Activity activity,
      DateTime startDate, DateTime endDate, int weeks) async {
    List<Activity> occurrences = [];
    DateTime now = DateTime.now();

    int startDayOfWeek = startDate.weekday;

    DateTime firstUpcomingDay =
        now.add(Duration(days: (startDayOfWeek - now.weekday + 7) % 7));
    print(firstUpcomingDay);

    DateTime recurrenceStart =
        startDate.isAfter(now) ? startDate : firstUpcomingDay;

    Duration duration = endDate.difference(startDate);

    for (int i = 0; i < weeks; i++) {
      DateTime occurrenceDate = recurrenceStart.add(Duration(days: i * 7));

      Map<DateTime, List<Availability>> availabilities = {};
      List<Availability> availabilityList = await AvailabilityService()
          .getAvailabilitiesByDate(activity.id!, occurrenceDate);

      if (availabilityList.isNotEmpty) {
        availabilities[DateTime(
          occurrenceDate.year,
          occurrenceDate.month,
          occurrenceDate.day,
        )] = availabilityList;
      }

      occurrences.add(Activity(
        id: activity.id,
        name: activity.name,
        startDate: occurrenceDate,
        endDate: occurrenceDate.add(duration),
        color: activity.color,
        category: activity.category,
        recurrence: activity.recurrence,
        availabilities: availabilities,
      ));
    }

    return occurrences;
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
