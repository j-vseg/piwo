import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import 'package:piwo/models/error_handling/result.dart';

class PaymentUrlService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // The name of the collection where payment URLs are stored
  final String _paymentUrlCollection = 'paymentUrls';
  final String _paymentUrlDoc = 'url'; // The document name

  Future<Result<String>> getPaymentUrl() async {
    try {
      DocumentReference paymentUrlRef =
          _firestore.collection(_paymentUrlCollection).doc(_paymentUrlDoc);
      DocumentSnapshot snapshot = await paymentUrlRef.get();

      if (snapshot.exists) {
        String paymentUrl = snapshot.get('url');
        debugPrint('Payment URL was retrieved successfully: $paymentUrl');
        return Result.success(paymentUrl);
      } else {
        debugPrint('Payment URL does not exist in Firestore.');
        return Result.failure('Payment URL not found');
      }
    } catch (e) {
      debugPrint("Error during payment URL retrieval: $e");
      return Result.failure(e.toString());
    }
  }

  Future<Result<void>> updatePaymentUrl(String paymentUrl) async {
    try {
      DocumentReference paymentUrlRef =
          _firestore.collection(_paymentUrlCollection).doc(_paymentUrlDoc);
      await paymentUrlRef.set({'url': paymentUrl});
      debugPrint('Payment URL updated successfully.');
      return Result.success(null);
    } catch (e) {
      debugPrint("Error during updating payment URL: $e");
      return Result.failure(e.toString());
    }
  }
}
