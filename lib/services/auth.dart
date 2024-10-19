import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/enums/role.dart';
import 'package:piwo/services/account.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final AccountService _accountService = AccountService();

  Future<Account?> signUp(String email, String password, Role role,
      String firstName, String lastName) async {
    try {
      UserCredential result = await _auth.createUserWithEmailAndPassword(
          email: email, password: password);
      User? firebaseUser = result.user;

      if (firebaseUser != null) {
        Account? account = await _accountService.createAccountInDatabase(
          firebaseUser,
          role,
          firstName,
          lastName,
        );

        if (account != null) {
          return account;
        }
      }
      return null;
    } catch (e) {
      debugPrint("Error during sign-up: $e");
      return null;
    }
  }

  Future<Account?> signIn(String email, String password) async {
    try {
      UserCredential result = await _auth.signInWithEmailAndPassword(
          email: email, password: password);
      User? firebaseUser = result.user;

      if (firebaseUser != null) {
        Account? account =
            await _accountService.getAccountById(firebaseUser.uid);

        return account;
      }
      return null;
    } catch (e) {
      debugPrint("Error during sign-in: $e");
      return null;
    }
  }

  Future<String?> getUserUID() async {
    if (_auth.currentUser != null) {
      return _auth.currentUser!.uid;
    }
    return null;
  }

  Future<void> signOut() async {
    try {
      await _auth.signOut();
      debugPrint("User signed out successfully.");
    } catch (e) {
      debugPrint("Error during sign out: $e");
      throw Exception('Failed to sign out');
    }
  }

  Future<void> reauthenticateUser(String email, String password) async {
    User? user = _auth.currentUser;
    if (user != null) {
      AuthCredential credential = EmailAuthProvider.credential(
        email: email,
        password: password,
      );
      await user.reauthenticateWithCredential(credential);
    }
  }
}
