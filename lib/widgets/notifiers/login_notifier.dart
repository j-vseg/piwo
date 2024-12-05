import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:piwo/services/account.dart';

class LoginState {
  final bool isLoggedIn;
  final bool isApproved;
  final bool isComfired;
  final bool isLoading;
  final bool isFirstLogin;

  LoginState({
    required this.isLoggedIn,
    required this.isApproved,
    required this.isComfired,
    this.isLoading = true,
    this.isFirstLogin = true,
  });

  bool get getIsLoggedIn => isLoggedIn;
  bool get getIsApproved => isApproved;
  bool get getIsComfired => isComfired;
  bool get getIsLoading => isLoading;
  bool get getIsFirstLogin => isFirstLogin;
}

class LoginStateNotifier extends ValueNotifier<LoginState> {
  LoginStateNotifier()
      : super(LoginState(
          isLoggedIn: false,
          isApproved: false,
          isComfired: false,
          isLoading: true,
          isFirstLogin: true,
        ));

  Future<void> checkLoginStatus() async {
    User? user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      var account = (await AccountService().getMyAccount()).data!;
      bool isApproved = account.isApproved ?? false;
      bool isComfired = account.isConfirmed ?? false;
      bool isFirstLogin = account.isFirstLogin ?? false;

      value = LoginState(
        isLoggedIn: true,
        isApproved: isApproved,
        isComfired: isComfired,
        isLoading: false,
        isFirstLogin: isFirstLogin,
      );
    } else {
      value = LoginState(
        isLoggedIn: false,
        isApproved: false,
        isComfired: false,
        isLoading: false,
        isFirstLogin: true,
      );
    }
  }

  void logIn() async {
    await checkLoginStatus();
  }

  void logOut() {
    value = LoginState(
      isLoggedIn: false,
      isApproved: false,
      isComfired: false,
      isLoading: false,
      isFirstLogin: false,
    );
  }
}
