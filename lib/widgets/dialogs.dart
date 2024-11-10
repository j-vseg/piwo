import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';

class ErrorDialog extends StatelessWidget {
  final String errorMessage;

  const ErrorDialog({
    super.key,
    required this.errorMessage,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Row(
        children: [
          Icon(Icons.error, color: CustomColors.error),
          SizedBox(width: 8),
          Text("Er is iets misgegaan!",
              style: TextStyle(color: CustomColors.error)),
        ],
      ),
      content: Text(
        errorMessage,
        style: const TextStyle(color: Colors.black87),
      ),
      backgroundColor: Colors.white,
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text(
            "OK",
            style: TextStyle(color: CustomColors.error),
          ),
        ),
      ],
    );
  }

  static void showErrorDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (context) => ErrorDialog(errorMessage: message),
    );
  }
}

class SuccessDialog extends StatelessWidget {
  final String successMessage;
  final Function? onPressed;

  const SuccessDialog({
    super.key,
    required this.successMessage,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Row(
        children: [
          Icon(Icons.check_circle, color: CustomColors.success),
          SizedBox(width: 8),
          Text("Het is gelukt!", style: TextStyle(color: CustomColors.success)),
        ],
      ),
      content: Text(
        successMessage,
        style: const TextStyle(color: Colors.black87),
      ),
      backgroundColor: Colors.white,
      actions: [
        TextButton(
          onPressed: () {
            onPressed != null ? onPressed!() : Navigator.of(context).pop();
          },
          child: const Text(
            "OK",
            style: TextStyle(color: CustomColors.success),
          ),
        ),
      ],
    );
  }

  static void showSuccessDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (context) => SuccessDialog(successMessage: message),
    );
  }

  static void showSuccessDialogWithOnPressed(
      BuildContext context, String message, Function onPressed) {
    showDialog(
      context: context,
      builder: (context) => SuccessDialog(
        successMessage: message,
        onPressed: onPressed,
      ),
    );
  }
}
