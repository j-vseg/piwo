import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/services/activity.dart';
import 'package:piwo/services/auth.dart';
import 'package:piwo/services/onboarding.dart';
import 'package:piwo/services/verification.dart';
import 'package:piwo/views/home/home_view.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:piwo/widgets/notifiers/login_notifier.dart';
import 'package:piwo/widgets/restart.dart';
import 'package:provider/provider.dart';

class VerificationPage extends StatefulWidget {
  final bool isApproved;
  final bool isComfired;

  const VerificationPage({
    super.key,
    required this.isApproved,
    required this.isComfired,
  });

  @override
  VerificationPageState createState() => VerificationPageState();
}

class VerificationPageState extends State<VerificationPage> {
  bool _isPasswordVisible = false;

  @override
  Widget build(BuildContext context) {
    return CustomScaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.only(top: 100.0, left: 20.0, right: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Lottie.asset(
                !widget.isComfired
                    ? "assets/images/waiting.json"
                    : widget.isApproved
                        ? "assets/images/check.json"
                        : "assets/images/denied.json",
                width: 1000,
                height: 275,
              ),
              const SizedBox(
                height: 10,
              ),
              Text(
                !widget.isComfired
                    ? "Je toelating is nog in verwerking"
                    : widget.isApproved
                        ? "Je account is geaccepteerd"
                        : "Je account is niet geaccepteerd",
                style: const TextStyle(
                  fontSize: 18,
                ),
              ),
              const SizedBox(height: 40.0),
              if (!widget.isApproved) ...[
                MaterialButton(
                  minWidth: double.maxFinite,
                  color: CustomColors.themePrimary,
                  onPressed: () async {
                    OnboardingService.saveOnboardingCompleted(false);
                    await AuthService().signOut();

                    if (!context.mounted) return;
                    context.read<LoginStateNotifier>().logOut();
                  },
                  child: const Text('Uitloggen'),
                ),
                MaterialButton(
                  minWidth: double.maxFinite,
                  color: Colors.red,
                  onPressed: () async {
                    _showYesNoDialog(
                      context,
                      (String password) async {
                        await ActivityService()
                            .deleteAllAvailabilitiesOfAccount(
                                FirebaseAuth.instance.currentUser?.uid ?? "");
                        await AccountService().deleteAccount(password);

                        await OnboardingService.saveOnboardingCompleted(false);
                        if (!context.mounted) return;
                        context.read<LoginStateNotifier>().logOut();
                        Navigator.of(context).pop();
                        RestartWidget.restartApp(context);
                      },
                    );
                  },
                  child: const Text('Verwijder je account'),
                ),
              ] else ...[
                MaterialButton(
                  minWidth: double.maxFinite,
                  color: CustomColors.themePrimary,
                  onPressed: () async {
                    VerificationService().updateFirstLogin(
                        FirebaseAuth.instance.currentUser?.uid ?? "");
                    if (!context.mounted) return;
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const HomeView(),
                      ),
                      (route) => false,
                    );
                  },
                  child: const Text('Ga naar de app'),
                ),
              ]
            ],
          ),
        ),
      ),
    );
  }

  void _showYesNoDialog(
    BuildContext context,
    Function onPressed,
  ) {
    final formKey = GlobalKey<FormState>();
    final TextEditingController passwordController = TextEditingController();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Weet je het zeker?"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                  "Weet je zeker dat je account wilt verwijderen? Al je account informatie wordt hiermee verwijderd."),
              const SizedBox(height: 8),
              Form(
                key: formKey,
                child: TextFormField(
                  controller: passwordController,
                  obscureText: !_isPasswordVisible,
                  decoration: InputDecoration(
                    border: const OutlineInputBorder(),
                    labelText: 'Wachtwoord*',
                    suffixIcon: IconButton(
                      icon: Icon(
                        _isPasswordVisible
                            ? Icons.visibility
                            : Icons.visibility_off,
                      ),
                      onPressed: () {
                        setState(() {
                          _isPasswordVisible = !_isPasswordVisible;
                        });
                      },
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Veld kan niet leeg zijn';
                    }
                    if (value.length < 8) {
                      return "Wachtwoord moet minimaal 8 characters lang zijn";
                    }
                    return null;
                  },
                ),
              ),
            ],
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Nee'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Ja'),
              onPressed: () {
                if (formKey.currentState!.validate()) {
                  onPressed(passwordController.text.trim());
                }
              },
            ),
          ],
        );
      },
    );
  }
}
