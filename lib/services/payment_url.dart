import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/foundation.dart';

class PaymentUrlService {
  final DatabaseReference _database = FirebaseDatabase.instance.ref();

  Future<String?> getPaymentUrl() async {
    try {
      DatabaseReference paymentUrlRef = _database.child('paymentUrl');
      DataSnapshot snapshot = await paymentUrlRef.get();

      if (snapshot.exists) {
        debugPrint('Payment url was retrieved successfully');
        debugPrint(snapshot.value.toString());
        return snapshot.value.toString();
      }
      return null;
    } catch (e) {
      debugPrint("Error during coin removal: $e");
      throw ('Error during coin removal: $e');
    }
  }

  Future<void> updatePaymentUrl(String paymentUrl) async {
    try {
      await _database.update({
        'paymentUrl': paymentUrl,
      });
      debugPrint('Payment URL updated successfully.');
    } catch (e) {
      debugPrint("Error during updating paymentUrl: $e");
      throw ('Error during updating paymentUrl: $e');
    }
  }
}
