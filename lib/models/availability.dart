import 'package:piwo/models/account.dart';
import 'package:piwo/models/enums/status.dart';
import 'package:piwo/services/account.dart';

class Availability {
  Account? account;
  Status? status;

  Availability({
    this.account,
    this.status,
  });

  static Future<Availability> fromJson(Map<String, dynamic> json) async {
    return Availability(
      account: json['accountId'] != null
          ? await AccountService().getAccountById(json['accountId'])
          : null,
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
      'accountId': account?.id.toString(),
      'status': status?.toString(),
    };
  }
}
