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
  bool? isFirstLogin;

  Account({
    this.id,
    this.firstName,
    this.lastName,
    this.email,
    this.roles,
    this.amountOfCoins,
    this.isApproved,
    this.isConfirmed,
    this.isFirstLogin,
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
    isFirstLogin = json['isFirstLogin'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = {};

    if (firstName != null) data['firstName'] = firstName;
    if (lastName != null) data['lastName'] = lastName;
    if (isApproved != null) data['isApproved'] = isApproved;
    if (isConfirmed != null) data['isConfirmed'] = isConfirmed;
    if (isFirstLogin != null) data['isFirstLogin'] = isFirstLogin;
    if (roles != null) data['roles'] = roles?.map((role) => role.name).toList();

    return data;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Account && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  String get getFullName {
    return firstName != null && lastName != null ? "$firstName $lastName" : "";
  }
}
