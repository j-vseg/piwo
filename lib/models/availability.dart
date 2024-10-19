import 'package:piwo/models/account.dart';
import 'package:piwo/models/enums/status.dart';

class Availability {
  Account? account;
  Status? status;

  Availability({
    this.account,
    this.status,
  });

  factory Availability.fromJson(Map<String, dynamic> json) {
    return Availability(
      account:
          json['account'] != null ? Account.fromJson(json['account']) : null,
      status: json['status'] != null
          ? Status.values.firstWhere(
              (s) =>
                  s.toString().split('.').last.toLowerCase() ==
                  json['status'].toString().toLowerCase(),
            )
          : null,
    );
  }
  Map<String, dynamic> toJson() {
    return {
      'account': account?.toJson(),
      'status': status?.toString(),
    };
  }
}
