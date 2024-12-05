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

class SuccessDialog {
  static void show(
    BuildContext context, {
    required String message,
    VoidCallback? onPressed,
    String? buttonLabel,
  }) {
    final snackBar = SnackBar(
      content: Row(
        children: [
          const Icon(
            Icons.check,
            color: Colors.green,
          ),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              message,
              style: const TextStyle(color: Colors.black87),
            ),
          ),
        ],
      ),
      behavior: SnackBarBehavior.floating,
      backgroundColor: Colors.green[100],
      action: (onPressed != null && buttonLabel != null)
          ? SnackBarAction(
              label: buttonLabel,
              textColor: Colors.black87,
              onPressed: onPressed,
            )
          : null,
    );

    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }
}

class InfoDialog {
  static void show(
    BuildContext context, {
    required String message,
    VoidCallback? onPressed,
    String? buttonLabel,
    Duration? duration,
  }) {
    final snackBar = SnackBar(
      content: Row(
        children: [
          const Icon(
            Icons.info,
            color: Colors.blue,
          ),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              message,
              style: const TextStyle(color: Colors.black87),
            ),
          ),
        ],
      ),
      behavior: SnackBarBehavior.floating,
      backgroundColor: Colors.blue[100],
      duration: duration ?? const Duration(seconds: 3),
      action: (onPressed != null)
          ? SnackBarAction(
              label: buttonLabel ?? "OK",
              textColor: Colors.black87,
              onPressed: onPressed,
            )
          : null,
    );

    // Display the snackbar
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }
}
