import 'package:piwo/models/enums/role.dart';

class Account {
  String id;
  String firstName;
  String lastName;
  String email;
  List<Role> roles;
  bool isApproved;
  bool isConfirmed;
  bool isFirstLogin;

  Account({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.roles,
    required this.isApproved,
    required this.isConfirmed,
    required this.isFirstLogin,
  });

  static Account fromJson(Map<String, dynamic> json) {
    return Account(
      id: json['id'] ?? '',
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      email: json['email'] ?? '',
      roles: (json['roles'] as List<dynamic>? ?? []).map((roleString) {
        if (roleString != null && roleString is String) {
          return Role.values.firstWhere(
            (role) => role.name == roleString,
            orElse: () => throw Exception("Invalid role: $roleString"),
          );
        } else {
          throw Exception("Null or invalid role found in roles list");
        }
      }).toList(),
      isApproved: json['isApproved'] ?? false,
      isConfirmed: json['isConfirmed'] ?? false,
      isFirstLogin: json['isFirstLogin'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = {};

    data['firstName'] = firstName;
    data['lastName'] = lastName;
    data['isApproved'] = isApproved;
    data['isConfirmed'] = isConfirmed;
    data['isFirstLogin'] = isFirstLogin;
    data['roles'] = roles.map((role) => role.name).toList();

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
    return "$firstName $lastName";
  }
}
