import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:piwo/models/availability.dart';

class AvailabilityService {
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  Future<void> changeAvailability(
    String activityId,
    Map<DateTime, List<Availability>> availabilities,
    DateTime date,
    Availability availability,
  ) async {
    try {
      final DatabaseReference availabilityRef = _database.child(
          'activities/$activityId/availabilities/${Availability.formatDateTime(date)}');

      DataSnapshot snapshot = await availabilityRef.get();

      List<Availability> availabilityList = availabilities[date] ?? [];

      bool found = false;

      if (snapshot.exists) {
        for (int i = 0; i < availabilityList.length; i++) {
          if (availabilityList[i].account!.id == availability.account!.id) {
            found = true;
            if (availability.status != null &&
                availabilityList[i].status != availability.status) {
              availabilityList[i] = availability;
            } else if (availability.status == null) {
              availabilityList.removeAt(i);
            }
            break;
          }
        }

        if (!found && availability.status != null) {
          availabilityList.add(availability);
        }

        availabilities[date] = availabilityList;

        List<Map<String, dynamic>> availabilitiesJson = availabilityList
            .map((availability) => availability.toJson())
            .toList();
        await availabilityRef.set(availabilitiesJson);

        debugPrint('Availability successfully updated');
      } else {
        if (availability.status != null) {
          await createAvailability(
              activityId, availabilities, date, availability);
        }
      }
    } catch (e) {
      debugPrint('Error updating availability: $e');
    }
  }

  Future<void> createAvailability(
    String activityId,
    Map<DateTime, List<Availability>> availabilities,
    DateTime date,
    Availability availability,
  ) async {
    try {
      final DatabaseReference availabilityRef = _database.child(
          'activities/$activityId/availabilities/${Availability.formatDateTime(date)}');

      List<Availability> availabilityList = availabilities[date] ?? [];

      availabilityList.add(availability);

      availabilities[date] = availabilityList;

      List<Map<String, dynamic>> availabilitiesJson = availabilityList
          .map((availability) => availability.toJson())
          .toList();
      await availabilityRef.set(availabilitiesJson);

      debugPrint('Availability successfully created');
    } catch (e) {
      debugPrint('Error creating availability: $e');
    }
  }

  Future<List<Availability>> getAvailabilitiesByDate(
    String activityId,
    DateTime date,
  ) async {
    try {
      final DatabaseReference availabilityRef = _database.child(
        'activities/$activityId/availabilities/${Availability.formatDateTime(date)}',
      );

      DataSnapshot snapshot = await availabilityRef.get();
      if (snapshot.exists && snapshot.value != null) {
        List<Availability> availabilityList = [];

        final availabilityData = snapshot.value as List<Object?>;

        for (var availabilityJson in availabilityData) {
          final availabilityMap = Map<String, dynamic>.from(
              availabilityJson as Map<Object?, Object?>);
          final availability = await Availability.fromJson(availabilityMap);
          availabilityList.add(availability);
        }

        return availabilityList;
      } else {
        return [];
      }
    } catch (e) {
      debugPrint("Error fetching availabilities: $e");
      throw Exception("Failed to get availabilities: $e");
    }
  }
}
