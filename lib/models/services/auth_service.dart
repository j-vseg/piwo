import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/enums/role.dart';
import 'package:piwo/models/services/account_service.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final AccountService _accountService = AccountService();
  final _secureStorage = const FlutterSecureStorage();

  Future<Account?> signUp(String email, String password, Role role,
      String firstName, String lastName) async {
    try {
      UserCredential result = await _auth.createUserWithEmailAndPassword(
          email: email, password: password);
      User? firebaseUser = result.user;

      if (firebaseUser != null) {
        Account? account = await _accountService.createAccountInDatabase(
          firebaseUser,
          password,
          role,
          firstName,
          lastName,
        );

        if (account != null) {
          await storeUserUID(firebaseUser.uid);
          return account;
        }
      }
      return null;
    } catch (e) {
      print("Error during sign-up: $e");
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

        await storeUserUID(firebaseUser.uid);
        return account;
      }
      return null;
    } catch (e) {
      print("Error during sign-in: $e");
      return null;
    }
  }

  Future<void> storeUserUID(String uid) async {
    try {
      await _secureStorage.write(key: 'user_uid', value: uid);
    } catch (e) {
      print("Error storing UID: $e");
      throw Exception('Failed to store user UID');
    }
  }

  Future<String?> getUserUID() async {
    return await _secureStorage.read(key: 'user_uid');
  }

  Future<void> signOut() async {
    try {
      await _auth.signOut();
      await _secureStorage.delete(key: 'user_uid');
      print("User signed out successfully.");
    } catch (e) {
      print("Error during sign out: $e");
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
