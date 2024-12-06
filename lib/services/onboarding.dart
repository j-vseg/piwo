import 'package:shared_preferences/shared_preferences.dart';

class OnboardingService {
  static Future<void> saveOnboardingCompleted(bool bool) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('onboardingCompleted', bool);
  }

  static Future<bool> isOnboardingCompleted() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('onboardingCompleted') ?? false;
  }
}
