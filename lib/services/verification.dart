import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:piwo/models/error_handling/result.dart';

class VerificationService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Method to update account approval status in Firestore
  Future<bool> updateAccountApproval(
    bool approved,
    String accountId,
  ) async {
    try {
      // Reference to the account document in Firestore
      DocumentReference accountRef =
          _firestore.collection('accounts').doc(accountId);

      // Update the account document with the approval and confirmation status
      await accountRef.update({
        'isApproved': approved,
        'isConfirmed': true,
      });

      debugPrint('Account approval updated successfully.');

      return true;
    } catch (e) {
      debugPrint('Error during account approval: $e');
      return false;
    }
  }

  // Method to update the 'isFirstLogin' status in Firestore
  Future<Result<bool>> updateFirstLogin(
    String accountId,
  ) async {
    try {
      // Reference to the account document in Firestore
      DocumentReference accountRef =
          _firestore.collection('accounts').doc(accountId);

      // Update the account document with 'isFirstLogin' set to false
      await accountRef.update({
        'isFirstLogin': false,
      });

      debugPrint('Account firstLogin updated successfully.');

      return Result.success(true);
    } catch (e) {
      debugPrint('Error during account firstLogin update: $e');
      return Result.failure(e.toString());
    }
  }
}
