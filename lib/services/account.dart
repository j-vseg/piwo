import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/error_handling/result.dart';
import 'package:piwo/services/auth.dart';

class AccountService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  Future<Result<void>> createAccountInDatabase(
      User firebaseUser, Account account) async {
    try {
      await _database
          .child('accounts')
          .child(firebaseUser.uid)
          .set(account.toJson());
      return Result.success(null);
    } catch (e) {
      debugPrint("Error saving account in Firebase Realtime Database: $e");
      return Result.failure("Error saving account: ${e.toString()}");
    }
  }

  Future<Result<Account>> getAccountById(String accountId) async {
    try {
      DatabaseReference accountRef =
          _database.child('accounts').child(accountId);
      DataSnapshot snapshot = await accountRef.get();

      if (snapshot.exists) {
        Map<String, dynamic> accountData =
            Map<String, dynamic>.from(snapshot.value as Map);
        Account account = Account.fromJson(accountData)..id = accountId;
        return Result.success(account);
      } else {
        return Result.failure("No account found for this user.");
      }
    } catch (e) {
      debugPrint("Error fetching account: $e");
      return Result.failure("Error fetching account: ${e.toString()}");
    }
  }

  Future<Result<Account>> getMyAccount() async {
    try {
      User? user = _auth.currentUser;
      if (user == null) {
        return Result.failure("No user is logged in.");
      }

      DatabaseReference accountRef =
          _database.child('accounts').child(user.uid);
      DataSnapshot snapshot = await accountRef.get();

      if (snapshot.exists) {
        Map<String, dynamic> accountData =
            Map<String, dynamic>.from(snapshot.value as Map);
        Account account = Account.fromJson(accountData)
          ..email = user.email
          ..id = user.uid;
        return Result.success(account);
      } else {
        return Result.failure("No account found for this user.");
      }
    } catch (e) {
      debugPrint("Error fetching account: $e");
      return Result.failure("Error fetching account: ${e.toString()}");
    }
  }

  Future<Result<bool>> updateEmail(String email, String oldPassword) async {
    User? user = _auth.currentUser;
    try {
      if (user == null) {
        return Result.failure("No user is currently signed in.");
      }

      String? userEmail = user.email;
      if (oldPassword.isEmpty) {
        return Result.failure("Password is required for reauthentication.");
      }

      await AuthService().reauthenticateUser(userEmail!, oldPassword);

      if (email.isNotEmpty && email != user.email) {
        await user.verifyBeforeUpdateEmail(email);
        debugPrint('Verification email sent. Please verify the new email.');
        return Result.success(true);
      } else {
        return Result.failure("Email is not valid or has not changed.");
      }
    } catch (e) {
      debugPrint("Error updating email: $e");
      return Result.failure("Error updating email: ${e.toString()}");
    }
  }

  Future<Result<bool>> updatePassword(
      String newPassword, String oldPassword) async {
    User? user = _auth.currentUser;

    try {
      if (user == null) {
        return Result.failure("No user is currently signed in.");
      }

      String? userEmail = user.email;
      if (oldPassword.isEmpty) {
        return Result.failure("Password is required for reauthentication.");
      }

      await AuthService().reauthenticateUser(userEmail!, oldPassword);

      if (newPassword.isNotEmpty && newPassword != oldPassword) {
        await user.updatePassword(newPassword);
        debugPrint('Password updated successfully.');
        return Result.success(true);
      }

      return Result.failure(
          "New password is invalid or matches the old password.");
    } catch (e) {
      debugPrint("Error updating password: $e");
      return Result.failure("Error updating password: ${e.toString()}");
    }
  }

  Future<Result<bool>> updateAccountCredentials(
      String firstName, String lastName, String oldPassword) async {
    User? user = _auth.currentUser;

    try {
      if (user == null) {
        return Result.failure("No user is currently signed in.");
      }

      String? userEmail = user.email;
      if (oldPassword.isEmpty) {
        return Result.failure("Password is required for reauthentication.");
      }

      await AuthService().reauthenticateUser(userEmail!, oldPassword);

      if (firstName.isNotEmpty && lastName.isNotEmpty) {
        await _database.child('accounts/${user.uid}').update({
          'firstName': firstName,
          'lastName': lastName,
        });
        debugPrint('Account credentials updated successfully.');
        return Result.success(true);
      } else {
        return Result.failure("First or last name is invalid.");
      }
    } catch (e) {
      debugPrint("Error updating account credentials: $e");
      return Result.failure("Error updating credentials: ${e.toString()}");
    }
  }

  Future<Result<List<Account>>> getAllAccounts() async {
    try {
      DatabaseReference accountsRef = _database.child('accounts');
      DataSnapshot snapshot = await accountsRef.get();

      if (snapshot.exists) {
        Map<String, dynamic> accountsData =
            Map<String, dynamic>.from(snapshot.value as Map);
        List<Account> accounts = accountsData.entries.map((entry) {
          Map<String, dynamic> accountData =
              Map<String, dynamic>.from(entry.value as Map);
          accountData['id'] = entry.key;
          return Account.fromJson(accountData);
        }).toList();
        return Result.success(accounts);
      } else {
        return Result.failure("No accounts found.");
      }
    } catch (e) {
      debugPrint("Error fetching accounts: $e");
      return Result.failure("Error fetching accounts: ${e.toString()}");
    }
  }

  Future<Result<bool>> deleteAccount(String password) async {
    try {
      User? user = FirebaseAuth.instance.currentUser;
      if (user != null && user.email != null) {
        await AuthService().reauthenticateUser(user.email!, password);
        await _database.child('accounts').child(user.uid).remove();
        await user.delete();
        debugPrint('Account deleted successfully.');
        return Result.success(true);
      }
      return Result.failure(
          "Error deleting account from Firebase: User is null");
    } catch (e) {
      debugPrint("Error deleting account from Firebase: $e");
      return Result.failure(e.toString());
    }
  }

  Future<Result<void>> resetPassword(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
      debugPrint('Reset password successful');
      return Result.success(null);
    } catch (e) {
      debugPrint("Reset password failed: $e");
      return Result.failure("Error resetting password: ${e.toString()}");
    }
  }
}
