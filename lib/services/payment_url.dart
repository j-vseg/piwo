import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/foundation.dart';
import 'package:piwo/models/error_handling/result.dart';

class PaymentUrlService {
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  Future<Result<String>> getPaymentUrl() async {
    try {
      DatabaseReference paymentUrlRef = _database.child('paymentUrl');
      DataSnapshot snapshot = await paymentUrlRef.get();

      if (snapshot.exists) {
        debugPrint('Payment URL was retrieved successfully: ${snapshot.value}');
        return Result.success(snapshot.value.toString());
      } else {
        debugPrint('Payment URL does not exist in database.');
        return Result.failure('Payment URL not found');
      }
    } catch (e) {
      debugPrint("Error during payment URL retrieval: $e");
      return Result.failure(e.toString());
    }
  }

  Future<Result<void>> updatePaymentUrl(String paymentUrl) async {
    try {
      await _database.update({'paymentUrl': paymentUrl});
      debugPrint('Payment URL updated successfully.');
      return Result.success(null);
    } catch (e) {
      debugPrint("Error during updating payment URL: $e");
      return Result.failure(e.toString());
    }
  }
}
