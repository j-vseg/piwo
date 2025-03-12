import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:piwo/models/error_handling/result.dart';

class CoinService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  Future<Result<int>> removeCoin(int newAmountOfCoins) async {
    try {
      User? user = _auth.currentUser;

      if (user != null) {
        DocumentReference userRef =
            _firestore.collection('accounts').doc(user.uid);

        await userRef.update({'amountOfCoins': newAmountOfCoins});

        debugPrint('Coin was removed successfully');
        return Result.success(newAmountOfCoins);
      } else {
        debugPrint("User does not exist or is not logged in.");
        return Result.failure("User does not exist or is not logged in.");
      }
    } catch (e) {
      debugPrint("Error during coin removal: $e");
      return Result.failure(e.toString());
    }
  }

  Future<Result<int>> setCoins(int newAmountOfCoins) async {
    try {
      User? user = _auth.currentUser;

      if (user != null) {
        DocumentReference userRef =
            _firestore.collection('accounts').doc(user.uid);

        await userRef.update({'amountOfCoins': newAmountOfCoins});

        debugPrint('Coins were set successfully');
        return Result.success(newAmountOfCoins);
      } else {
        debugPrint("User does not exist or is not logged in.");
        return Result.failure("User does not exist or is not logged in.");
      }
    } catch (e) {
      debugPrint('Error occurred while setting coins: $e');
      return Result.failure(e.toString());
    }
  }
}
