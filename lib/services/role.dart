import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/enums/role.dart';

class RoleService {
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  // Adds a role to the account's role list
  Future<bool> addRole(
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

      String newRoleString = newRole == Role.admin
          ? 'admin'
          : newRole == Role.beheerder
              ? 'beheerder'
              : newRole == Role.penningmeester
                  ? 'penningmeester'
                  : 'user';
      if (!roles.contains(newRoleString)) {
        roles.add(newRoleString);
      }

      await rolesRef.set(roles);

      debugPrint('Account role added successfully.');
      return true;
    } catch (e) {
      debugPrint('Error adding account role: $e');
      return false;
    }
  }

  Future<bool> removeRole(
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

      String roleString = role == Role.admin
          ? 'admin'
          : role == Role.beheerder
              ? 'beheerder'
              : role == Role.penningmeester
                  ? 'penningmeester'
                  : 'user';
      roles.remove(roleString);

      await rolesRef.set(roles);

      debugPrint('Account role removed successfully.');
      return true;
    } catch (e) {
      debugPrint('Error removing account role: $e');
      return false;
    }
  }
}
