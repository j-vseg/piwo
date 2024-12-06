import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:piwo/models/error_handling/result.dart';

class VerificationService {
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  Future<bool> updateAccountApproval(
    bool approved,
    String accountId,
  ) async {
    try {
      await _database.child('accounts/$accountId').update({
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

  Future<Result<bool>> updateFirstLogin(
    String accountId,
  ) async {
    try {
      await _database.child('accounts/$accountId').update({
        'isFirstLogin': false,
      });
      debugPrint('Account firstLogin updated successfully.');

      return Result.success(true);
    } catch (e) {
      debugPrint('Error during account approval: $e');
      return Result.failure(e.toString());
    }
  }
}
