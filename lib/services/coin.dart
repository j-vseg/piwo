import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/foundation.dart';

class CoinService {
  final DatabaseReference _database = FirebaseDatabase.instance.ref();
  final FirebaseAuth _auth = FirebaseAuth.instance;

  void removeCoin(int newAmountOfCoins) async {
    try {
      User? user = _auth.currentUser;

      if (user != null) {
        DatabaseReference coinRef = _database.child('accounts/${user.uid}');
        coinRef.update({
          'amountOfCoins': newAmountOfCoins,
        });
        debugPrint('Coin was removed successfully');
      }
    } catch (e) {
      debugPrint("Error during coin removal: $e");
    }
  }

  Future<int> setCoins(int newAmountOfCoins) async {
    try {
      User? user = _auth.currentUser;

      if (user != null) {
        DatabaseReference coinRef = _database.child('accounts/${user.uid}');
        coinRef.update({
          'amountOfCoins': newAmountOfCoins,
        });
        debugPrint('Coin was removed successfully');
        return newAmountOfCoins;
      }
      return -1;
    } catch (e) {
      debugPrint('Error occurred while setting coins: $e');
      throw ('Error occurred while setting coins: $e');
    }
  }
}
