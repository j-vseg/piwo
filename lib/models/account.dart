import 'package:flutter/foundation.dart';
import 'package:piwo/models/enums/role.dart';

class Account {
  String? id;
  String? firstName;
  String? lastName;
  String? email;
  Role? role;
  int? amountOfCoins;

  Account(
      {this.id,
      this.firstName,
      this.lastName,
      this.email,
      this.role,
      this.amountOfCoins});

  Account.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    firstName = json['firstName'];
    lastName = json['lastName'];
    email = json['email'];
    if (json['role'] != null) {
      try {
        if (json['role'].toString().toLowerCase() == "admin") {
          role = Role.admin;
        } else {
          role = Role.user;
        }
      } catch (e) {
        debugPrint('Unknown role: ${json['role']}');
      }
    }
    amountOfCoins = json['amountOfCoins'];
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'role': role.toString(),
      'amountOfCoins': amountOfCoins,
    };
  }
}
