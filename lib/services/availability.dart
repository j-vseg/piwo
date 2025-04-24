import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:piwo/models/availability.dart';

class AvailabilityService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  Future<String?> changeAvailability(
    Availability newAvailability,
    String activityId,
    DateTime date,
  ) async {
    try {
      final String accountId = newAvailability.account.id;
      final String formattedDate = Availability.formatDateTime(date);
      final String docId = '${activityId}_${accountId}_$formattedDate';

      final DocumentReference availabilityDoc =
          _firestore.collection('availabilities').doc(docId);

      await availabilityDoc.set({
        'account': newAvailability.account,
        'status': newAvailability.status.name,
      });

      debugPrint('Availability successfully created/updated');
      return availabilityDoc.id;
    } catch (e) {
      debugPrint('Error changing availability: $e');
      return null;
    }
  }

  Future<void> addAvailabilityToActivity(
    String activityId,
    Map<DateTime, List<DocumentReference>> newAvailabilities,
  ) async {
    try {
      final DocumentReference activityDoc =
          _firestore.collection('activities').doc(activityId);

      // Step 1: Read existing availabilities
      final snapshot = await activityDoc.get();
      Map<String, dynamic> data =
          snapshot.data() as Map<String, dynamic>? ?? {};
      Map<String, dynamic> currentAvailabilities = data['availabilities'] ?? {};

      // Step 2: Merge new availabilities
      newAvailabilities.forEach((date, refs) {
        final dateKey = date.toIso8601String().split('T').first;

        List existingRefs = currentAvailabilities[dateKey] ?? [];
        Set<String> existingIds = {
          for (var ref in existingRefs) (ref as DocumentReference).id
        };

        for (var ref in refs) {
          if (!existingIds.contains(ref.id)) {
            existingRefs.add(ref);
          }
        }

        currentAvailabilities[dateKey] = existingRefs;
      });

      // Step 3: Update Firestore (merge mode)
      await activityDoc.set({
        'availabilities': currentAvailabilities,
      }, SetOptions(merge: true));

      debugPrint('Availability successfully added.');
    } catch (e) {
      debugPrint('Error adding availability: $e');
    }
  }

  Future<Availability?> getAvailability(
    String availabilityId,
  ) async {
    try {
      DocumentReference availabilityDoc =
          _firestore.collection('availabilities').doc(availabilityId);

      DocumentSnapshot snapshot = await availabilityDoc.get();

      if (snapshot.exists && snapshot.data() != null) {
        return await Availability.fromJson(
          snapshot.data() as Map<String, dynamic>,
        );
      } else {
        return null;
      }
    } catch (e) {
      debugPrint('Error getting availability: $e');
      return null;
    }
  }

  // Get all availabilities for an activity on a specific date
  Future<List<DocumentReference>> getAvailabilitiesByDate(
    String activityId,
    DateTime date,
  ) async {
    try {
      DocumentReference availabilityDoc =
          _firestore.collection('activities').doc(activityId);

      DocumentSnapshot snapshot = await availabilityDoc.get();

      if (snapshot.exists && snapshot.data() != null) {
        Map<String, dynamic> data =
            (snapshot.data() as Map<String, dynamic>)['availabilities'] ?? {};

        // Convert DateTime to string key format
        String dateKey = date.toIso8601String().split('T')[0]; // 'YYYY-MM-DD'

        if (data.containsKey(dateKey)) {
          List<dynamic> refs = data[dateKey];
          return refs.cast<DocumentReference>();
        }
      }

      return [];
    } catch (e) {
      debugPrint("Error fetching availabilities: $e");
      return [];
    }
  }
}
