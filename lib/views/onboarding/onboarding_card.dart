import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:piwo/config/theme/custom_colors.dart';

class OnboardingCard extends StatefulWidget {
  final String asset, title, description, buttonText;
  final Function onPressed;

  const OnboardingCard({
    super.key,
    required this.asset,
    required this.title,
    required this.description,
    required this.buttonText,
    required this.onPressed,
  });

  @override
  OnboardingCardState createState() => OnboardingCardState();
}

class OnboardingCardState extends State<OnboardingCard> {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: MediaQuery.sizeOf(context).height * 0.80,
      width: MediaQuery.sizeOf(context).width,
      child: Column(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          widget.asset.contains('.json')
              ? Lottie.asset(
                  widget.asset,
                  width: 1500,
                  height: 275,
                )
              : Padding(
                  padding: const EdgeInsets.all(50.0),
                  child: Image.asset(
                    widget.asset,
                    fit: BoxFit.contain,
                  ),
                ),
          Column(
            children: [
              Text(
                widget.title,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                widget.description,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 16,
                  color: CustomColors.unselectedMenuColor,
                ),
              ),
            ],
          ),
          MaterialButton(
            minWidth: 300,
            onPressed: () => widget.onPressed(),
            color: CustomColors.themePrimary,
            child: Text(widget.buttonText),
          )
        ],
      ),
    );
  }
}
