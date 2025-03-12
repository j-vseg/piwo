import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/availability.dart';
import 'package:piwo/models/error_handling/result.dart';

class ActivityService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<Result<List<Activity>>> getAllActivities() async {
    try {
      QuerySnapshot snapshot = await _firestore.collection('activities').get();

      List<Activity> activities =
          await Future.wait(snapshot.docs.map((doc) async {
        Activity activity = await Activity.fromFirestore(doc);
        activity.id = doc.id;
        return activity;
      }).toList());

      return Result.success(activities);
    } catch (e) {
      debugPrint('Error fetching activities from Firestore: $e');
      return Result.failure(e.toString());
    }
  }

  Future<Result<Activity>> getActivityById(String activityId) async {
    try {
      DocumentSnapshot snapshot =
          await _firestore.collection('activities').doc(activityId).get();

      if (snapshot.exists) {
        Map<String, dynamic> data = snapshot.data() as Map<String, dynamic>;
        Activity activity = Activity.fromJson(data) as Activity;
        return Result.success(activity);
      } else {
        return Result.failure("Activity with ID $activityId not found.");
      }
    } catch (e) {
      debugPrint("Failed to get activity by ID: $e");
      return Result.failure(e.toString());
    }
  }

  Future<Result<String>> createActivity(Activity activity) async {
    try {
      DocumentReference docRef =
          await _firestore.collection('activities').add(activity.toJson());
      return Result.success(docRef.id);
    } catch (e) {
      debugPrint('Failed to create activity: $e');
      return Result.failure(e.toString());
    }
  }

  Future<Result<void>> updateActivity(
      String activityId, Activity newActivity) async {
    try {
      await _firestore
          .collection('activities')
          .doc(activityId)
          .update(newActivity.toJson());
      return Result.success(null);
    } catch (e) {
      debugPrint('Failed to update activity: $e');
      return Result.failure(e.toString());
    }
  }

  Future<Result<void>> deleteActivity(String activityId) async {
    try {
      await _firestore.collection('activities').doc(activityId).delete();
      return Result.success(null);
    } catch (e) {
      debugPrint('Failed to delete activity: $e');
      return Result.failure(e.toString());
    }
  }

  Future<Result<void>> updateAvailability(String activityId, DateTime date,
      List<Availability> availabilities) async {
    try {
      List<Map<String, dynamic>> availabilitiesJson =
          availabilities.map((availability) => availability.toJson()).toList();

      await _firestore
          .collection('activities')
          .doc(activityId)
          .collection('availabilities')
          .doc(date.toIso8601String())
          .set({'availabilities': availabilitiesJson});

      return Result.success(null);
    } catch (e) {
      debugPrint('Error updating availability: $e');
      return Result.failure(e.toString());
    }
  }

  Future<Result<List<Availability>>> getAvailabilities(
      String activityId, DateTime date) async {
    try {
      DocumentSnapshot snapshot = await _firestore
          .collection('activities')
          .doc(activityId)
          .collection('availabilities')
          .doc(date.toIso8601String())
          .get();

      if (snapshot.exists) {
        List<dynamic> availabilitiesData = snapshot['availabilities'];
        List<Availability> availabilityList = availabilitiesData
            .map((availabilityJson) => Availability.fromJson(availabilityJson))
            .cast<Availability>()
            .toList();
        return Result.success(availabilityList);
      } else {
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
      DocumentReference exceptionsRef =
          _firestore.collection('activities').doc(activityId);

      DocumentSnapshot snapshot = await exceptionsRef.get();
      List<String> exceptions = [];
      if (snapshot.exists) {
        Map<String, dynamic> data = snapshot.data() as Map<String, dynamic>;
        if (data.containsKey('exceptions')) {
          exceptions = List<String>.from(data['exceptions']);
        }
      }

      exceptions.add(date.toUtc().toIso8601String());
      await exceptionsRef.update({'exceptions': exceptions});

      return Result.success(null);
    } catch (e) {
      debugPrint('Failed to update exceptions: $e');
      return Result.failure(e.toString());
    }
  }

  Future<void> deleteAllAvailabilitiesOfAccount(String accountId) async {
    try {
      QuerySnapshot activitiesSnapshot =
          await _firestore.collection('activities').get();

      for (var doc in activitiesSnapshot.docs) {
        DocumentReference activityRef =
            _firestore.collection('activities').doc(doc.id);
        QuerySnapshot availabilitiesSnapshot =
            await activityRef.collection('availabilities').get();

        for (var availabilityDoc in availabilitiesSnapshot.docs) {
          List<dynamic> availabilitiesData = availabilityDoc['availabilities'];
          availabilitiesData.removeWhere((availability) =>
              availability['account'] != null &&
              availability['account']['id'] == accountId);

          await availabilityDoc.reference
              .update({'availabilities': availabilitiesData});
        }
      }
    } catch (e) {
      debugPrint("Failed to delete availability from all activities: $e");
    }
  }
}
