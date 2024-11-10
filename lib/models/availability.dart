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
          ? (await AccountService().getAccountById(json['accountId'])).data
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

  static String formatDateTime(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  static DateTime parseFormattedDateTime(String formattedDate) {
    List<String> dateAndTime = formattedDate.split('_');
    List<String> dateParts = dateAndTime[0].split('-');

    int year = int.parse(dateParts[0]);
    int month = int.parse(dateParts[1]);
    int day = int.parse(dateParts[2]);

    return DateTime(year, month, day);
  }
}
