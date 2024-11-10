import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/error_handling/result.dart';
import 'package:piwo/services/account.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final AccountService _accountService = AccountService();

  Future<Result<void>> signUp(
      Account account, String email, String password) async {
    try {
      UserCredential result = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      User? firebaseUser = result.user;

      if (firebaseUser != null) {
        final createAccountResult =
            await _accountService.createAccountInDatabase(
          firebaseUser,
          account,
        );
        if (createAccountResult.isSuccess) {
          return Result.success(null);
        } else {
          return Result.failure(createAccountResult.error);
        }
      }
      return Result.failure("User creation failed.");
    } catch (e) {
      if (e is FirebaseAuthException) {
        debugPrint("Error during sign-up: ${e.message}");
        return Result.failure(e.message);
      } else {
        debugPrint("Unknown error during sign-up: $e");
        return Result.failure("An unknown error occurred: ${e.toString()}");
      }
    }
  }

  Future<Result<Account>> signIn(String email, String password) async {
    try {
      UserCredential result = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      User? firebaseUser = result.user;

      if (firebaseUser != null) {
        final accountResult =
            await _accountService.getAccountById(firebaseUser.uid);
        if (accountResult.isSuccess) {
          return Result.success(accountResult.data);
        } else {
          return Result.failure(accountResult.error);
        }
      }
      return Result.failure("Sign-in failed. No user found.");
    } catch (e) {
      if (e is FirebaseAuthException) {
        debugPrint("Error during sign-in: ${e.message}");
        return Result.failure(e.message);
      } else {
        debugPrint("Unknown error during sign-in: $e");
        return Result.failure("An unknown error occurred: ${e.toString()}");
      }
    }
  }

  Future<Result<String>> getUserUID() async {
    User? user = _auth.currentUser;
    if (user != null) {
      return Result.success(user.uid);
    } else {
      return Result.failure("No user is currently signed in.");
    }
  }

  Future<Result<void>> signOut() async {
    try {
      await _auth.signOut();
      debugPrint("User signed out successfully.");
      return Result.success(null);
    } catch (e) {
      debugPrint("Error during sign out: $e");
      return Result.failure("Failed to sign out: ${e.toString()}");
    }
  }

  Future<Result<void>> reauthenticateUser(String email, String password) async {
    try {
      User? user = _auth.currentUser;
      if (user != null) {
        AuthCredential credential = EmailAuthProvider.credential(
          email: email,
          password: password,
        );
        await user.reauthenticateWithCredential(credential);
        return Result.success(null);
      } else {
        return Result.failure("No user is currently signed in.");
      }
    } catch (e) {
      debugPrint("Error during reauthentication: $e");
      return Result.failure("Failed to reauthenticate: ${e.toString()}");
    }
  }
}
