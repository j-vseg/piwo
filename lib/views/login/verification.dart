import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/services/auth.dart';
import 'package:piwo/widgets/notifiers/login_notifier.dart';
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
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.only(top: 200.0, left: 20.0, right: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Icon(
                !widget.isComfired
                    ? Icons.help
                    : widget.isApproved
                        ? Icons.check
                        : Icons.cancel,
                color: !widget.isComfired
                    ? Colors.grey
                    : widget.isApproved
                        ? Colors.green
                        : Colors.red,
                size: 56,
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
              MaterialButton(
                minWidth: double.maxFinite,
                color: CustomColors.themePrimary,
                onPressed: () async {
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
                  AccountService().deleteAccount();

                  if (!context.mounted) return;
                  context.read<LoginStateNotifier>().logOut();
                },
                child: const Text('Verwijder je account'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
