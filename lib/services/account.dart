import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/foundation.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/enums/role.dart';
import 'package:piwo/services/auth.dart';

class AccountService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  Future<Account?> createAccountInDatabase(
      User firebaseUser, Role role, String firstName, String lastName) async {
    try {
      Map<String, dynamic> accountData = {
        'firstName': firstName,
        'lastName': lastName,
        'amountOfCoins': 0,
        'role': role == Role.admin ? 'admin' : 'user',
        'isApproved': false,
        'isConfirmed': false,
      };

      await _database
          .child('accounts')
          .child(firebaseUser.uid)
          .set(accountData);

      return Account.fromJson(accountData);
    } catch (e) {
      debugPrint("Error saving account in Firebase Realtime Database: $e");
      return null;
    }
  }

  Future<Account> getAccountById(String accountId) async {
    try {
      DatabaseReference accountRef =
          _database.child('accounts').child(accountId);

      DataSnapshot snapshot = await accountRef.get();

      if (snapshot.exists) {
        Map<String, dynamic> accountData =
            Map<String, dynamic>.from(snapshot.value as Map);
        Account account = Account.fromJson(accountData);
        account.id = accountId;

        return account;
      } else {
        debugPrint(
            "No account found for the user in Firebase Realtime Database.");
        throw ("No account found for the user in Firebase Realtime Database.");
      }
    } catch (e) {
      debugPrint("Error fetching account from Firebase Realtime Database: $e");
      throw ("Error fetching account from Firebase Realtime Database: $e");
    }
  }

  Future<Account> getMyAccount() async {
    try {
      User? user = _auth.currentUser;
      if (user != null) {
        DatabaseReference accountRef =
            _database.child('accounts').child(user.uid);

        DataSnapshot snapshot = await accountRef.get();

        if (snapshot.exists) {
          Map<String, dynamic> accountData =
              Map<String, dynamic>.from(snapshot.value as Map);

          Account account = Account.fromJson(accountData);
          account.email = user.email;
          account.id = user.uid;

          return account;
        } else {
          debugPrint(
              "No account found for the user in Firebase Realtime Database.");
          throw ("No account found for the user in Firebase Realtime Database.");
        }
      } else {
        debugPrint("No user logged in");
        throw ("No user logged in");
      }
    } catch (e) {
      debugPrint("Error fetching account from Firebase Realtime Database: $e");
      throw ("Error fetching account from Firebase Realtime Database: $e");
    }
  }

  Future<bool> updateEmail(String email, String oldPassword) async {
    User? user = _auth.currentUser;
    try {
      if (user == null) {
        throw Exception("No user is currently signed in.");
      }

      String? userEmail = user.email;
      if (oldPassword.isEmpty) {
        throw Exception("Password is required for reauthentication.");
      }

      await AuthService().reauthenticateUser(userEmail!, oldPassword);

      if (email.isNotEmpty && email != user.email) {
        await user.verifyBeforeUpdateEmail(email);
        debugPrint('Verification email sent. Please verify the new email.');
        return true;
      } else {
        debugPrint('Email is not valid or has not changed.');
        return false;
      }
    } catch (e) {
      debugPrint('Error during updating email: $e');
      return false;
    }
  }

  Future<bool> updatePassword(String newPassword, String oldPassword) async {
    User? user = _auth.currentUser;

    try {
      if (user == null) {
        throw Exception("No user is currently signed in.");
      }

      String? userEmail = user.email;
      if (oldPassword.isEmpty) {
        throw Exception("Password is required for reauthentication.");
      }

      await AuthService().reauthenticateUser(userEmail!, oldPassword);

      if (newPassword.isNotEmpty && newPassword != oldPassword) {
        await user.updatePassword(newPassword);
        debugPrint('Password updated successfully.');
        return true;
      }

      return false;
    } catch (e) {
      debugPrint('General error updating password: $e');
      return false;
    }
  }

  Future<bool> updateAccountCredentials(
    String firstName,
    String lastName,
    String oldPassword,
  ) async {
    User? user = _auth.currentUser;

    try {
      if (user == null) {
        throw Exception("No user is currently signed in.");
      }

      String? userEmail = user.email;
      if (oldPassword.isEmpty) {
        throw Exception("Password is required for reauthentication.");
      }

      await AuthService().reauthenticateUser(userEmail!, oldPassword);

      if (firstName.isNotEmpty && lastName.isNotEmpty) {
        await _database.child('accounts/${user.uid}').update({
          'firstName': firstName,
          'lastName': lastName,
        });
        debugPrint('First name updated successfully.');
      }

      debugPrint('Account credentials updated successfully.');
      return true;
    } catch (e) {
      debugPrint('General error updating account credentials: $e');
      return false;
    }
  }

  Future<List<Account>> getAllAccounts() async {
    try {
      DatabaseReference accountsRef = _database.child('accounts');
      DataSnapshot snapshot = await accountsRef.get();

      if (snapshot.exists) {
        List<Account> accounts = [];
        Map<String, dynamic> accountsData =
            Map<String, dynamic>.from(snapshot.value as Map);

        accountsData.forEach((key, value) {
          Role role = value['role'] == 'admin' ? Role.admin : Role.user;
          accounts.add(Account(
            id: key,
            firstName: value['firstName'],
            lastName: value['lastName'],
            email: value['email'],
            role: role,
            amountOfCoins: value['amountOfCoins'],
            isApproved: value['isApproved'],
            isConfirmed: value['isConfirmed'],
          ));
        });
        return accounts;
      } else {
        debugPrint("No accounts found.");
        return [];
      }
    } catch (e) {
      debugPrint("Error fetching all accounts from Firebase: $e");
      throw ("Error fetching all accounts from Firebase: $e");
    }
  }

  Future<bool> deleteAccount() async {
    try {
      User? user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        await _database.child('accounts').child(user.uid).remove();
        await user.delete();
        debugPrint('Account deleted successfully.');
        return true;
      }
      return false;
    } catch (e) {
      debugPrint("Error deleting account from Firebase: $e");
      return false;
    }
  }

  Future<bool> updateAccountRole({
    required String accountId,
    required Role newRole,
  }) async {
    try {
      Map<String, dynamic> updateData = {
        'role': newRole == Role.admin ? 'admin' : 'user',
      };
      await _database.child('accounts/$accountId').update(updateData);

      debugPrint('Account role updated successfully.');
      return true;
    } catch (e) {
      debugPrint('Error updating account role: $e');
      return false;
    }
  }

  Future<void> resetPassword(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
      debugPrint('Reset password successful');
    } catch (e) {
      throw ("Reset password failed: $e");
    }
  }
}
