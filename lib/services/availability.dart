import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:piwo/models/availability.dart';

class AvailabilityService {
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  Future<void> changeAvailability(
    String activityId,
    List<Availability> availabilities,
    Availability availability,
  ) async {
    try {
      final DatabaseReference availabilityRef =
          _database.child('activities/$activityId/availabilities/');
      DataSnapshot snapshot = await availabilityRef.get();

      if (snapshot.exists) {
        for (var i = 0; i < availabilities.length; i++) {
          if (availabilities[i].account!.id == availability.account!.id) {
            if (availability.status != null) {
              availabilities[i] = availability;
            } else {
              availabilities.removeAt(i);
            }
          }
        }

        List<Map<String, dynamic>> availabilitiesJson = availabilities
            .map((availability) => availability.toJson())
            .toList();
        await availabilityRef.set(availabilitiesJson);
        debugPrint('Availability successfully updated');
      } else {
        if (availability.status != null) {
          await createAvailability(activityId, availabilities, availability);
        }
      }
    } catch (e) {
      debugPrint('Error updating availability: $e');
    }
  }

  Future<void> createAvailability(
    String activityId,
    List<Availability> availabilities,
    Availability availability,
  ) async {
    try {
      final DatabaseReference availabilityRef =
          _database.child('activities/$activityId/availabilities');
      List<Availability> modifiableAvailabilities = List.from(availabilities);

      modifiableAvailabilities.add(availability);

      List<Map<String, dynamic>> availabilitiesJson = modifiableAvailabilities
          .map((availability) => availability.toJson())
          .toList();

      await availabilityRef.set(availabilitiesJson);
      debugPrint('Availability successfully created');
    } catch (e) {
      debugPrint('Error creating availability: $e');
    }
  }
}
