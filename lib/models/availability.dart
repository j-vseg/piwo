import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:piwo/models/enums/status.dart';

class Availability {
  DocumentReference account;
  Status status;

  Availability({
    required this.account,
    required this.status,
  });

  String get id => account.id;

  static Future<Availability> fromJson(Map<String, dynamic> json) async {
    return Availability(
      account: json['account'] as DocumentReference,
      status: Status.values.firstWhere(
        (s) =>
            s.toString().split('.').last.toLowerCase() ==
            json['status'].toString().toLowerCase(),
        orElse: () => Status.afwezig,
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'account': account,
      'status': status.name,
    };
  }

  static String formatDateTime(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  static DateTime parseFormattedDateTime(String formattedDate) {
    List<String> dateParts = formattedDate.split('-');
    return DateTime(
      int.parse(dateParts[0]),
      int.parse(dateParts[1]),
      int.parse(dateParts[2]),
    );
  }
}
