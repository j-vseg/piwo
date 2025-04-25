import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import 'package:piwo/managers/occurrence.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/availability.dart';
import 'package:piwo/models/error_handling/result.dart';

class ActivityService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<Result<List<Activity>>> getAllActivities() async {
    try {
      QuerySnapshot snapshot = await _firestore.collection('activities').get();

      if (snapshot.docs.isNotEmpty) {
        List<Activity> activities = [];

        // Loop through all the documents in the snapshot
        for (var doc in snapshot.docs) {
          Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
          Activity activity = await Activity.fromJson(data);
          activity.id = doc.id; // Assign the Firestore document ID
          activities.add(activity);
        }

        activities
            .addAll(await OccurrenceManager().generateOccurrences(activities));

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
      // Step 1: Get reference to account
      final accountRef = _firestore.collection('accounts').doc(accountId);

      // Step 2: Get all availabilities that belong to this account
      final availabilitiesSnapshot = await _firestore
          .collection('availabilities')
          .where('account', isEqualTo: accountRef)
          .get();

      // Step 3: Collect all availability references (to remove from activities)
      final List<DocumentReference> availabilityRefsToDelete =
          availabilitiesSnapshot.docs.map((doc) => doc.reference).toList();
      final Set<String> deletedIds =
          availabilityRefsToDelete.map((ref) => ref.id).toSet();

      // Step 4: Delete those availability docs
      for (final doc in availabilitiesSnapshot.docs) {
        await doc.reference.delete();
      }

      // Step 5: Update each activity and clean up availabilities
      final activitiesSnapshot =
          await _firestore.collection('activities').get();

      for (final activityDoc in activitiesSnapshot.docs) {
        final data = activityDoc.data();

        if (data['availabilities'] == null) continue;

        final Map<String, dynamic> activityAvailabilities =
            Map<String, dynamic>.from(data['availabilities']);
        bool updated = false;

        final newAvailabilities = <String, dynamic>{};

        activityAvailabilities.forEach((date, refs) {
          if (refs is List) {
            final cleanedRefs = refs.where((item) {
              // Only keep refs that do NOT match deletedIds
              return !(item is DocumentReference &&
                  deletedIds.contains(item.id));
            }).toList();

            if (cleanedRefs.isNotEmpty) {
              newAvailabilities[date] = cleanedRefs;
            } else {
              updated =
                  true; // Entire date's list was emptied — remove the date
            }

            if (cleanedRefs.length != refs.length) {
              updated = true;
            }
          } else {
            // If somehow it's not a list, preserve it unchanged
            newAvailabilities[date] = refs;
          }
        });

        if (updated) {
          await activityDoc.reference
              .update({'availabilities': newAvailabilities});
          debugPrint("Updated activity ${activityDoc.id}");
        }
      }

      debugPrint(
          "Successfully removed all availabilities for account $accountId");
    } catch (e) {
      debugPrint("Failed to delete availabilities for account $accountId: $e");
    }
  }
}
