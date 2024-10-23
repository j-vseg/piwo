import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:piwo/services/account.dart';

class LoginState {
  final bool isLoggedIn;
  final bool isApproved;
  final bool isComfired;

  LoginState({
    required this.isLoggedIn,
    required this.isApproved,
    required this.isComfired,
  });

  bool get getIsLoggedIn => isLoggedIn;
  bool get getIsApproved => isApproved;
  bool get getIsComfired => isComfired;
}

class LoginStateNotifier extends ValueNotifier<LoginState> {
  LoginStateNotifier()
      : super(LoginState(
            isLoggedIn: false, isApproved: false, isComfired: false));

  Future<void> checkLoginStatus() async {
    User? user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      var account = await AccountService().getMyAccount();
      bool isApproved = account.isApproved ?? false;
      bool isComfired = account.isConfirmed ?? false;

      value = LoginState(
        isLoggedIn: true,
        isApproved: isApproved,
        isComfired: isComfired,
      );
    } else {
      value = LoginState(
        isLoggedIn: false,
        isApproved: false,
        isComfired: false,
      );
    }
  }

  void logIn() {
    value = LoginState(
      isLoggedIn: true,
      isApproved: value.isApproved,
      isComfired: value.isComfired,
    );
  }

  void logOut() {
    value = LoginState(
      isLoggedIn: false,
      isApproved: false,
      isComfired: false,
    );
  }
}
