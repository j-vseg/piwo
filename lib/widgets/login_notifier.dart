import 'package:flutter/material.dart';
import 'package:piwo/models/services/auth_service.dart';

class LoginStateNotifier extends ValueNotifier<bool> {
  LoginStateNotifier() : super(false);

  Future<void> checkLoginStatus() async {
    bool isLoggedIn = await AuthService().getUserUID() != null;
    value = isLoggedIn;
  }

  void logIn() {
    value = true;
  }

  void logOut() {
    value = false;
  }
}
