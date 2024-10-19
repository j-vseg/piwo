import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/foundation.dart';
import 'package:piwo/models/activity.dart';

class ActivityService {
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  Future<List<Activity>> getAllActivitiesFromDatabase() async {
    try {
      DataSnapshot snapshot = await _database.child('activities').get();

      if (snapshot.exists) {
        List<Activity> activities = [];

        Map<String, dynamic> activityMap =
            Map<String, dynamic>.from(snapshot.value as Map);

        // Await the fromJson call
        for (var value in activityMap.values) {
          Activity activity =
              await Activity.fromJson(Map<String, dynamic>.from(value));
          activities.add(activity);
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

  Future<void> createActivity(Map<String, dynamic> activityData) async {
    try {
      final DatabaseReference activityRef =
          _database.child('activities').push();

      activityData['id'] = activityRef.key;

      await activityRef.set(activityData);

      debugPrint('Activity created successfully with ID: ${activityRef.key}');
    } catch (e) {
      debugPrint('Failed to create activity: $e');
    }
  }

  // Future<bool> signUpForActivity(String activityId, String accountId) async {
  //   try {
  //     final DatabaseReference activityRef =
  //         _database.child('activities/$activityId');

  //     DataSnapshot snapshot = await activityRef.get();

  //     if (snapshot.exists) {
  //       Map<String, dynamic> activityData =
  //           Map<String, dynamic>.from(snapshot.value as Map);
  //       Activity activity = await Activity.fromJson(activityData);

  //       if (Activity().alreadySignedUp(accountId)) {
  //         debugPrint("Account already signed up for this activity.");
  //         return false;
  //       }

  //       List<String> begeleiders = [];
  //       if (activity.begeleiders != null) {
  //         for (var i = 0; i < activity.begeleiders!.length; i++) {
  //           begeleiders.add(activity.begeleiders![i].getId);
  //         }
  //       }
  //       begeleiders.add(accountId);

  //       final newActivity = {
  //         'id': activity.id,
  //         'name': activity.name,
  //         'color': "0x${activity.color!.value.toRadixString(16).toUpperCase()}",
  //         'startDate': activity.startDate!.toIso8601String(),
  //         'endDate': activity.endDate!.toIso8601String(),
  //         'amountOfPeople': activity.amountOfPeople,
  //         'begeleiders': begeleiders,
  //         'naastenVan': activity.naastenVan != null
  //             ? activity.naastenVan!.map((e) => e.toJson()).toList()
  //             : [],
  //       };

  //       // Update the activity in the database
  //       await activityRef.set(newActivity);

  //       debugPrint("Account signed up for activity successfully.");
  //       return true;
  //     } else {
  //       debugPrint("Activity with ID $activityId not found.");
  //       return false;
  //     }
  //   } catch (e) {
  //     debugPrint("Failed to sign up for activity: $e");
  //     return false;
  //   }
  // }

  // Future<bool> signOffFromActivity(String activityId, String accountId) async {
  //   try {
  //     final DatabaseReference activityRef =
  //         _database.child('activities/$activityId');

  //     DataSnapshot snapshot = await activityRef.get();

  //     if (snapshot.exists) {
  //       Map<String, dynamic> activityData =
  //           Map<String, dynamic>.from(snapshot.value as Map);
  //       Activity activity = await Activity.fromJson(activityData);

  //       if (!Activity.alreadySignedUp(activity.begeleiders!, accountId)) {
  //         debugPrint("Account is not signed up for this activity.");
  //         return false;
  //       }

  //       List<String> begeleiders = [];
  //       if (activity.begeleiders != null) {
  //         for (var i = 0; i < activity.begeleiders!.length; i++) {
  //           begeleiders.add(activity.begeleiders![i].getId);
  //         }
  //       }
  //       begeleiders.remove(accountId);

  //       final updatedActivity = {
  //         'id': activity.id,
  //         'name': activity.name,
  //         'color': "0x${activity.color!.value.toRadixString(16).toUpperCase()}",
  //         'startDate': activity.startDate!.toIso8601String(),
  //         'endDate': activity.endDate!.toIso8601String(),
  //         'amountOfPeople': activity.amountOfPeople,
  //         'begeleiders': begeleiders,
  //         'naastenVan': activity.naastenVan != null
  //             ? activity.naastenVan!.map((e) => e.toJson()).toList()
  //             : [],
  //       };

  //       await activityRef.set(updatedActivity);

  //       debugPrint("Account signed off from activity successfully.");
  //       return true;
  //     } else {
  //       debugPrint("Activity with ID $activityId not found.");
  //       return false;
  //     }
  //   } catch (e) {
  //     debugPrint("Failed to sign off from activity: $e");
  //     return false;
  //   }
  // }

  // Future<bool> signOffFromActivity(String activityId, String accountId) async {
  //   try {
  //     final DatabaseReference begeleidersRef =
  //         _database.child('activities/$activityId/begeleiders');

  //     DataSnapshot snapshot = await begeleidersRef.get();

  //     if (snapshot.exists) {
  //       List<String> oldBegeleiders = List.from(snapshot.value as Iterable);

  //       if (!oldBegeleiders.contains(accountId)) {
  //         debugPrint("Account is not signed up for this activity.");
  //         return false;
  //       }

  //       List<String> updatedBegeleiders = [];
  //       for (var i = 0; i < oldBegeleiders.length; i++) {
  //         updatedBegeleiders.add(oldBegeleiders[i]);
  //       }
  //       updatedBegeleiders.remove(accountId);

  //       final updatedBegeleidersMap = {"begeleiders": updatedBegeleiders};
  //       await begeleidersRef.update(updatedBegeleidersMap);

  //       debugPrint("Account signed off from activity successfully.");
  //       return true;
  //     } else {
  //       debugPrint("Activity with ID $activityId not found.");
  //       return false;
  //     }
  //   } catch (e) {
  //     debugPrint("Failed to sign off from activity: $e");
  //     return false;
  //   }
  // }

  Future<void> updateActivity(
      String activityId, Map<String, dynamic> updatedData) async {
    try {
      final DatabaseReference activityRef =
          _database.child('activities/$activityId');

      DataSnapshot snapshot = await activityRef.get();
      if (!snapshot.exists) {
        debugPrint('Activity with ID $activityId not found.');
        throw Exception('Activity with ID $activityId not found');
      }

      await activityRef.update(updatedData);

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
