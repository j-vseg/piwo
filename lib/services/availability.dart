import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:piwo/models/availability.dart';

class AvailabilityService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<void> changeAvailability(
    String activityId,
    Map<DateTime, List<Availability>> availabilities,
    DateTime date,
    Availability availability,
  ) async {
    try {
      String formattedDate = Availability.formatDateTime(date);
      DocumentReference availabilityDoc = _firestore
          .collection('activities')
          .doc(activityId)
          .collection('availabilities')
          .doc(formattedDate);

      DocumentSnapshot snapshot = await availabilityDoc.get();

      List<Availability> availabilityList = availabilities[date] ?? [];

      bool found = false;

      if (snapshot.exists && snapshot.data() != null) {
        List<dynamic> data =
            (snapshot.data() as Map<String, dynamic>)['availabilities'] ?? [];
        availabilityList = await Future.wait(
          data.map((e) => Availability.fromJson(Map<String, dynamic>.from(e))),
        );

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
      }

      if (!found && availability.status != null) {
        availabilityList.add(availability);
      }

      availabilities[date] = availabilityList;

      await availabilityDoc.set({
        'availabilities': availabilityList.map((a) => a.toJson()).toList(),
      });

      debugPrint('Availability successfully updated');
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
      String formattedDate = Availability.formatDateTime(date);
      DocumentReference availabilityDoc = _firestore
          .collection('activities')
          .doc(activityId)
          .collection('availabilities')
          .doc(formattedDate);

      List<Availability> availabilityList = availabilities[date] ?? [];
      availabilityList.add(availability);
      availabilities[date] = availabilityList;

      await availabilityDoc.set({
        'availabilities': availabilityList.map((a) => a.toJson()).toList(),
      });

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
      String formattedDate = Availability.formatDateTime(date);
      DocumentReference availabilityDoc = _firestore
          .collection('activities')
          .doc(activityId)
          .collection('availabilities')
          .doc(formattedDate);

      DocumentSnapshot snapshot = await availabilityDoc.get();

      if (snapshot.exists && snapshot.data() != null) {
        List<dynamic> data =
            (snapshot.data() as Map<String, dynamic>)['availabilities'] ?? [];

        List<Availability> availabilityList = await Future.wait(
          data.map((e) async =>
              await Availability.fromJson(Map<String, dynamic>.from(e))),
        );

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
