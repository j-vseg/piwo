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

  Future<bool> updateAccountCredentials({
    required String accountId,
    String? newEmail,
    String? newPassword,
    String? newFirstName,
    String? newLastName,
    Role? newRole,
    String? oldPassword,
  }) async {
    User? user = _auth.currentUser;

    try {
      if (user != null) {
        String? userEmail = user.email;
        if (oldPassword == '') {
          throw Exception("Password is required for reauthentication.");
        }

        await AuthService().reauthenticateUser(userEmail!, oldPassword!);
      }

      if (newEmail != null && newEmail.isNotEmpty) {
        await user!.verifyBeforeUpdateEmail(newEmail);
        await user.reload();
        user = _auth.currentUser;
      }

      if (newPassword != null && newPassword.isNotEmpty) {
        await user!.updatePassword(newPassword);
      }

      if (newPassword != null &&
          newPassword.isNotEmpty &&
          newLastName != null &&
          newLastName.isNotEmpty &&
          newRole != null) {
        await _database.child('accounts/$accountId').update({
          'firstName': newFirstName,
          'lastName': newLastName,
          'role': newRole.name,
        });
      }

      debugPrint('Account credentials updated successfully.');
      return true;
    } on FirebaseAuthException catch (e) {
      debugPrint('Error updating account credentials: ${e.message}');
      return false;
    } catch (e) {
      debugPrint('Error: $e');
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
}
