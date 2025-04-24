import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/enums/recurrance.dart';
import 'package:piwo/services/availability.dart';

class OccurrenceManager {
  Future<List<Activity>> generateOccurrences(List<Activity> activities) async {
    List<Activity> occurrencesToAdd = [];

    List<Activity> activitiesToProcess = List.from(activities);

    for (var activity in activitiesToProcess) {
      if (activity.recurrence == Recurrence.dagelijks) {
        List<Activity> occurrences = await _generateDailyOccurrences(
          activity,
          activity.startDate,
          activity.endDate,
        );
        occurrencesToAdd.addAll(occurrences);
      } else if (activity.recurrence == Recurrence.wekelijks) {
        List<Activity> occurrences = await _generateWeeklyOccurrences(
          activity,
          activity.startDate,
          activity.endDate,
        );
        occurrencesToAdd.addAll(occurrences);
      } else if (activity.recurrence == Recurrence.maandelijks) {
        List<Activity> occurrences = await _generateMonthlyOccurrences(
          activity,
          activity.startDate,
          activity.endDate,
        );
        occurrencesToAdd.addAll(occurrences);
      } else if (activity.recurrence == Recurrence.jaarlijks) {
        List<Activity> occurrences = await _generateYearlyOccurrences(
          activity,
          activity.startDate,
          activity.endDate,
        );
        occurrencesToAdd.addAll(occurrences);
      }
    }

    return occurrencesToAdd;
  }

  Future<List<Activity>> _generateDailyOccurrences(
    Activity activity,
    DateTime startDate,
    DateTime endDate,
  ) async {
    int days = _calculateDaysBetween(startDate) + 175;
    List<Activity> occurrences = [];
    DateTime recurrenceStart = startDate;
    Duration duration = endDate.difference(startDate);

    for (int i = 1; i < days; i++) {
      DateTime occurrenceDate = recurrenceStart.add(Duration(days: i));

      if (occurrenceDate != startDate) {
        Activity? generateActivity = await _createActivity(
          occurrenceDate,
          startDate,
          activity,
          duration,
        );
        if (generateActivity != null) {
          occurrences.add(generateActivity);
        }
      }
    }

    return occurrences;
  }

  Future<List<Activity>> _generateWeeklyOccurrences(
    Activity activity,
    DateTime startDate,
    DateTime endDate,
  ) async {
    int weeks = _calculateWeeksBetween(startDate) + 26;
    List<Activity> occurrences = [];
    DateTime recurrenceStart = startDate;
    Duration duration = endDate.difference(startDate);

    for (int i = 1; i < weeks; i++) {
      DateTime occurrenceDate = recurrenceStart.add(Duration(days: i * 7));

      if (occurrenceDate != startDate) {
        Activity? generateActivity = await _createActivity(
          occurrenceDate,
          startDate,
          activity,
          duration,
        );
        if (generateActivity != null) {
          occurrences.add(generateActivity);
        }
      }
    }

    return occurrences;
  }

  Future<List<Activity>> _generateMonthlyOccurrences(
    Activity activity,
    DateTime startDate,
    DateTime endDate,
  ) async {
    int months = _calculateMonthsBetween(startDate) + 12;
    List<Activity> occurrences = [];
    DateTime recurrenceStart = startDate;
    Duration duration = endDate.difference(startDate);

    for (int i = 1; i < months; i++) {
      DateTime occurrenceDate = DateTime(
        recurrenceStart.year,
        recurrenceStart.month + i,
        recurrenceStart.day,
        recurrenceStart.hour,
        recurrenceStart.minute,
      );

      if (occurrenceDate != startDate) {
        Activity? generateActivity = await _createActivity(
          occurrenceDate,
          startDate,
          activity,
          duration,
        );
        if (generateActivity != null) {
          occurrences.add(generateActivity);
        }
      }
    }

    return occurrences;
  }

  Future<List<Activity>> _generateYearlyOccurrences(
    Activity activity,
    DateTime startDate,
    DateTime endDate,
  ) async {
    int years = _calculateYearsBetween(startDate) + 5;
    List<Activity> occurrences = [];
    DateTime recurrenceStart = startDate;
    Duration duration = endDate.difference(startDate);

    for (int i = 1; i < years; i++) {
      DateTime occurrenceDate = DateTime(
        recurrenceStart.year + i,
        recurrenceStart.month,
        recurrenceStart.day,
        recurrenceStart.hour,
        recurrenceStart.minute,
      );

      if (occurrenceDate.year != startDate.year) {
        Activity? generateActivity = await _createActivity(
          occurrenceDate,
          startDate,
          activity,
          duration,
        );
        if (generateActivity != null) {
          occurrences.add(generateActivity);
        }
      }
    }

    return occurrences;
  }

  int _calculateWeeksBetween(DateTime startDate) {
    DateTime now = DateTime.now();
    Duration difference = now.difference(startDate);
    return (difference.inDays / 7).floor();
  }

  int _calculateDaysBetween(DateTime startDate) {
    DateTime now = DateTime.now();
    Duration difference = now.difference(startDate);
    return (difference.inDays).floor();
  }

  int _calculateMonthsBetween(DateTime startDate) {
    DateTime now = DateTime.now();

    int yearsDifference = now.year - startDate.year;
    int monthsDifference = now.month - startDate.month;
    int totalMonths = (yearsDifference * 12) + monthsDifference;
    if (now.day < startDate.day) {
      totalMonths -= 1;
    }
    return totalMonths;
  }

  int _calculateYearsBetween(DateTime startDate) {
    DateTime now = DateTime.now();
    int yearsDifference = now.year - startDate.year;
    if (now.month < startDate.month ||
        (now.month == startDate.month && now.day < startDate.day)) {
      yearsDifference -= 1;
    }

    return yearsDifference;
  }

  Future<Activity?> _createActivity(
    DateTime occurrenceDate,
    DateTime startDate,
    Activity activity,
    Duration duration,
  ) async {
    // Check if the activity occurrence is not in exceptions
    if (activity.exceptions != null &&
        !activity.exceptions!.contains(DateTime(
          occurrenceDate.year,
          occurrenceDate.month,
          occurrenceDate.day,
        ))) {
      Map<DateTime, List<DocumentReference>> availabilities = {};

      // Fetch availabilities using the newly implemented method
      List<DocumentReference> availabilityReferences =
          await AvailabilityService().getAvailabilitiesByDate(
        activity.id,
        DateTime(occurrenceDate.year, occurrenceDate.month, occurrenceDate.day),
      );

      // Add the fetched availabilities to the map
      availabilities[DateTime(
        occurrenceDate.year,
        occurrenceDate.month,
        occurrenceDate.day,
      )] = availabilityReferences;

      // Generate and return the new activity with the updated date and availabilities
      return Activity(
        id: activity.id,
        name: activity.name,
        location: activity.location,
        color: activity.color,
        recurrence: activity.recurrence,
        category: activity.category,
        startDate: occurrenceDate,
        endDate: occurrenceDate.add(duration),
        availabilities: availabilities,
        exceptions: activity.exceptions,
      );
    }
    return null;
  }
}
