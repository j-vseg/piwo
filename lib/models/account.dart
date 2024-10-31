import 'package:piwo/models/enums/role.dart';

class Account {
  String? id;
  String? firstName;
  String? lastName;
  String? email;
  List<Role>? roles;
  int? amountOfCoins;
  bool? isApproved;
  bool? isConfirmed;

  Account({
    this.id,
    this.firstName,
    this.lastName,
    this.email,
    this.roles,
    this.amountOfCoins,
    this.isApproved,
    this.isConfirmed,
  });

  Account.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    firstName = json['firstName'];
    lastName = json['lastName'];
    email = json['email'];

    roles = (json['roles'] as List<dynamic>?)?.map((roleString) {
      if (roleString != null && roleString is String) {
        return Role.values.firstWhere(
          (role) => role.name == roleString,
          orElse: () => throw Exception("Invalid role: $roleString"),
        );
      } else {
        throw Exception("Null or invalid role found in roles list");
      }
    }).toList();

    amountOfCoins = json['amountOfCoins'];
    isApproved = json['isApproved'];
    isConfirmed = json['isConfirmed'];
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'roles': roles?.map((role) => role.name).toList(),
      'amountOfCoins': amountOfCoins,
      'isApproved': isApproved,
      'isConfirmed': isConfirmed,
    };
  }

  String get getFullName {
    return firstName != null && lastName != null ? "$firstName $lastName" : "";
  }
}
