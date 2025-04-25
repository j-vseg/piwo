import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/enums/role.dart';
import 'package:piwo/models/error_handling/result.dart';

class RoleService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Method to add a new role to an account
  Future<Result<bool>> addRole(
    Account account,
    Role newRole,
  ) async {
    try {
      // Reference to the account's roles in Firestore
      DocumentReference accountRef =
          _firestore.collection('accounts').doc(account.id);
      DocumentSnapshot accountSnapshot = await accountRef.get();

      if (!accountSnapshot.exists) {
        return Result.failure("Account does not exist.");
      }

      // Get the current roles list from the account document
      List<dynamic> roles = accountSnapshot.get('roles') ?? [];

      // Convert roles list to a list of strings and add the new role if not present
      List<String> roleStrings = List<String>.from(roles);
      String newRoleString = newRole.name;

      if (!roleStrings.contains(newRoleString)) {
        roleStrings.add(newRoleString);
      }

      // Update the account's roles field
      await accountRef.update({'roles': roleStrings});

      debugPrint('Account role added successfully.');
      return Result.success(true);
    } catch (e) {
      debugPrint('Error adding account role: $e');
      return Result.failure(e.toString());
    }
  }

  // Method to remove a role from an account
  Future<Result<bool>> removeRole(
    String accountId,
    Role role,
  ) async {
    try {
      // Reference to the account's roles in Firestore
      DocumentReference accountRef =
          _firestore.collection('accounts').doc(accountId);
      DocumentSnapshot accountSnapshot = await accountRef.get();

      if (!accountSnapshot.exists) {
        return Result.failure("Account does not exist.");
      }

      // Get the current roles list from the account document
      List<dynamic> roles = accountSnapshot.get('roles') ?? [];

      // Convert roles list to a list of strings and remove the specified role
      List<String> roleStrings = List<String>.from(roles);
      String roleString = role.name;
      roleStrings.remove(roleString);

      // Update the account's roles field
      await accountRef.update({'roles': roleStrings});

      debugPrint('Account role removed successfully.');
      return Result.success(true);
    } catch (e) {
      debugPrint('Error removing account role: $e');
      return Result.failure(e.toString());
    }
  }
}
