import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/foundation.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/availability.dart';
import 'package:piwo/models/error_handling/result.dart';

class ActivityService {
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  Future<Result<List<Activity>>> getAllActivities() async {
    try {
      DataSnapshot snapshot = await _database.child('activities').get();

      if (snapshot.exists && snapshot.value != null) {
        List<Activity> activities = [];
        Map<String, dynamic> activityMap =
            (snapshot.value as Map).cast<String, dynamic>();

        for (var entry in activityMap.entries) {
          var key = entry.key;
          var value = entry.value;
          if (value is Map) {
            Activity activity =
                await Activity.fromJson(Map<String, dynamic>.from(value));
            activity.id = key;
            activities.add(activity);
          } else {
            debugPrint('Activity data is not in the expected format.');
          }
        }

        return Result.success(activities);
      } else {
        debugPrint('No activities found.');
        return Result.success([]);
      }
    } catch (e) {
      debugPrint('Error fetching activities from Firebase: $e');
      return Result.failure(e.toString());
    }
  }

  Future<Result<Activity>> getActivityById(String activityId) async {
    try {
      final DatabaseReference activityRef =
          _database.child('activities/$activityId');
      DataSnapshot snapshot = await activityRef.get();

      if (snapshot.exists) {
        Map<String, dynamic> activityData =
            Map<String, dynamic>.from(snapshot.value as Map);
        Activity activity = await Activity.fromJson(activityData);

        return Result.success(activity);
      } else {
        debugPrint("Activity with ID $activityId not found.");
        return Result.failure("Activity with ID $activityId not found.");
      }
    } catch (e) {
      debugPrint("Failed to get activity by ID: $e");
      return Result.failure(e.toString());
    }
  }

  Future<Result<String>> createActivity(Activity activity) async {
    try {
      final DatabaseReference activityRef =
          _database.child('activities').push();
      activity.color = CustomColors.getActivityColor(activity.category!);
      await activityRef.set(activity.toJson());

      debugPrint('Activity created successfully with ID: ${activityRef.key}');
      return Result.success(activityRef.key ?? "");
    } catch (e) {
      debugPrint('Failed to create activity: $e');
      return Result.failure(e.toString());
    }
  }

  Future<Result<void>> updateActivity(
      String activityId, Activity newActivity) async {
    try {
      final DatabaseReference activityRef =
          _database.child('activities/$activityId');
      DataSnapshot snapshot = await activityRef.get();

      if (!snapshot.exists) {
        debugPrint('Activity with ID $activityId not found.');
        return Result.failure('Activity with ID $activityId not found');
      }

      await activityRef.update(newActivity.toJson());
      debugPrint('Activity updated successfully.');
      return Result.success(null);
    } catch (e) {
      debugPrint('Failed to update activity: $e');
      return Result.failure(e.toString());
    }
  }

  Future<Result<void>> deleteActivity(String activityId) async {
    try {
      final DatabaseReference activityRef =
          _database.child('activities/$activityId');
      DataSnapshot snapshot = await activityRef.get();

      if (!snapshot.exists) {
        debugPrint('Activity with ID $activityId not found.');
        return Result.failure('Activity with ID $activityId not found');
      }

      await activityRef.remove();
      debugPrint('Activity deleted successfully.');
      return Result.success(null);
    } catch (e) {
      debugPrint('Failed to delete activity: $e');
      return Result.failure(e.toString());
    }
  }

  Future<Result<void>> updateAvailability(
    String activityId,
    DateTime date,
    List<Availability> availabilities,
  ) async {
    try {
      final DatabaseReference availabilityRef = _database.child(
          'activities/$activityId/availabilities/${date.toIso8601String()}');
      List<Map<String, dynamic>> availabilitiesJson =
          availabilities.map((availability) => availability.toJson()).toList();
      await availabilityRef.set(availabilitiesJson);

      debugPrint(
          'Availability updated for activity ID: $activityId on date: $date');
      return Result.success(null);
    } catch (e) {
      debugPrint('Error updating availability: $e');
      return Result.failure(e.toString());
    }
  }

  Future<Result<List<Availability>>> getAvailabilities(
      String activityId, DateTime date) async {
    try {
      final DatabaseReference availabilityRef = _database.child(
          'activities/$activityId/availabilities/${date.toIso8601String()}');
      DataSnapshot snapshot = await availabilityRef.get();

      if (snapshot.exists && snapshot.value != null) {
        List<Availability> availabilityList = [];
        List<dynamic> availabilitiesData = snapshot.value as List;

        for (var availabilityJson in availabilitiesData) {
          availabilityList.add(await Availability.fromJson(
              Map<String, dynamic>.from(availabilityJson)));
        }

        return Result.success(availabilityList);
      } else {
        debugPrint(
            "No availabilities found for activity ID: $activityId on date: $date.");
        return Result.success([]);
      }
    } catch (e) {
      debugPrint("Failed to get availabilities: $e");
      return Result.failure(e.toString());
    }
  }

  Future<Result<void>> createExceptions(
      String activityId, DateTime date) async {
    try {
      final DatabaseReference activityRef =
          _database.child('activities/$activityId/exceptions');
      DataSnapshot snapshot = await activityRef.get();

      List<String> exceptions = [];
      if (snapshot.exists) {
        Map<dynamic, dynamic>? currentData = snapshot.value as Map?;
        if (currentData != null) {
          exceptions = List<String>.from(currentData.values);
        }
      }

      exceptions.add(date.toUtc().toIso8601String());
      await activityRef.set(exceptions);

      debugPrint('Date added to exceptions successfully.');
      return Result.success(null);
    } catch (e) {
      debugPrint('Failed to update exceptions: $e');
      return Result.failure(e.toString());
    }
  }
}
