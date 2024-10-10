import 'package:piwo/models/enums/role.dart';

class Account {
  String? id;
  String? firstName;
  String? lastName;
  String? email;
  Role? role;
  int? amountOfCoins;
  String? password;

  Account(
      {this.id,
      this.firstName,
      this.lastName,
      this.email,
      this.role,
      this.amountOfCoins,
      this.password});

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
        print('Unknown role: ${json['role']}');
      }
    }
    amountOfCoins = json['amountOfCoins'];
    password = json['password'];
  }

  Map<String, dynamic> toJson() {
    String? roleString;
    try {
      if (role == Role.admin) {
        roleString = "admin";
      } else if (role == Role.user) {
        roleString = "user";
      } else {
        roleString = "Unknown";
      }
    } catch (e) {
      print('Error determining role: $e');
    }

    return {
      'id': id,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      if (roleString != null) 'role': roleString,
      'amountOfCoins': amountOfCoins,
      'password': password,
    };
  }
}
