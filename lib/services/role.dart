import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/enums/role.dart';
import 'package:piwo/models/error_handling/result.dart';

class RoleService {
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  Future<Result<bool>> addRole(
    Account account,
    Role newRole,
  ) async {
    try {
      DatabaseReference rolesRef =
          _database.child('accounts/${account.id}/roles');
      DataSnapshot snapshot = await rolesRef.get();

      List<String> roles = [];
      if (snapshot.exists) {
        roles = List<String>.from(snapshot.value as List<dynamic>);
      }

      String newRoleString = newRole.name;
      if (!roles.contains(newRoleString)) {
        roles.add(newRoleString);
      }

      await rolesRef.set(roles);

      debugPrint('Account role added successfully.');
      return Result.success(true);
    } catch (e) {
      debugPrint('Error adding account role: $e');
      return Result.failure(e.toString());
    }
  }

  Future<Result<bool>> removeRole(
    String accountId,
    Role role,
  ) async {
    try {
      DatabaseReference rolesRef = _database.child('accounts/$accountId/roles');
      DataSnapshot snapshot = await rolesRef.get();

      List<String> roles = [];
      if (snapshot.exists) {
        roles = List<String>.from(snapshot.value as List<dynamic>);
      }

      String roleString = role.name;
      roles.remove(roleString);

      await rolesRef.set(roles);

      debugPrint('Account role removed successfully.');
      return Result.success(true);
    } catch (e) {
      debugPrint('Error removing account role: $e');
      return Result.failure(e.toString());
    }
  }
}
