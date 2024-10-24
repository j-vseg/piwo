import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/foundation.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/activity.dart';

class ActivityService {
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  Future<List<Activity>> getAllActivities() async {
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

        return activities;
      } else {
        debugPrint('No activities found.');
        return [];
      }
    } catch (e) {
      debugPrint('Error fetching activities from Firebase: $e');
      throw Exception('An error occurred while fetching activities.');
    }
  }

  Future<Activity> getActivityById(String activityId) async {
    try {
      final DatabaseReference activityRef =
          _database.child('activities/$activityId');

      DataSnapshot snapshot = await activityRef.get();

      if (snapshot.exists) {
        Map<String, dynamic> activityData =
            Map<String, dynamic>.from(snapshot.value as Map);

        Activity activity = await Activity.fromJson(activityData);

        return activity;
      } else {
        debugPrint("Activity with ID $activityId not found.");
        throw ("Activity with ID $activityId not found.");
      }
    } catch (e) {
      debugPrint("Failed to get activity by ID: $e");
      throw ("Failed to get activity by ID: $e");
    }
  }

  Future<String> createActivity(Activity activity) async {
    try {
      final DatabaseReference activityRef =
          _database.child('activities').push();

      activity.color = CustomColors.getActivityColor(activity.category!);

      await activityRef.set(activity.toJson());

      debugPrint('Activity created successfully with ID: ${activityRef.key}');
      return activityRef.key ?? "";
    } catch (e) {
      debugPrint('Failed to create activity: $e');
      throw ('Failed to create activity: $e');
    }
  }

  Future<void> updateActivity(String activityId, Activity newActivity) async {
    try {
      final DatabaseReference activityRef =
          _database.child('activities/$activityId');

      DataSnapshot snapshot = await activityRef.get();
      if (!snapshot.exists) {
        debugPrint('Activity with ID $activityId not found.');
        throw Exception('Activity with ID $activityId not found');
      }

      await activityRef.update(newActivity.toJson());

      debugPrint('Activity updated successfully.');
    } catch (e) {
      debugPrint('Failed to update activity: $e');
      throw Exception('Failed to update activity');
    }
  }

  Future<void> deleteActivity(String activityId) async {
    try {
      final DatabaseReference activityRef =
          _database.child('activities/$activityId');

      DataSnapshot snapshot = await activityRef.get();
      if (!snapshot.exists) {
        debugPrint('Activity with ID $activityId not found.');
        throw Exception('Activity with ID $activityId not found');
      }

      await activityRef.remove();

      debugPrint('Activity deleted successfully.');
    } catch (e) {
      debugPrint('Failed to delete activity: $e');
      throw Exception('Failed to delete activity');
    }
  }
}
