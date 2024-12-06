import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/services/onboarding.dart';
import 'package:piwo/views/login/login.dart';
import 'package:piwo/views/onboarding/onboarding_card.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:piwo/widgets/dialogs.dart';
import 'package:piwo/widgets/notifiers/login_notifier.dart';
import 'package:provider/provider.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class OnboardingPage extends StatelessWidget {
  final int initialPage;

  const OnboardingPage({
    super.key,
    required this.initialPage,
  });

  @override
  Widget build(BuildContext context) {
    final pageController = PageController(initialPage: initialPage);
    final List<Widget> onboardingPages = [
      OnboardingCard(
        asset: "assets/logo/logo.png",
        title: "Welkom!",
        description: "Welkom bij de kennismaking van de Piwo app!",
        buttonText: "Volgende",
        onPressed: () {
          pageController.animateToPage(
            1,
            duration: Durations.long1,
            curve: Curves.linear,
          );
        },
      ),
      OnboardingCard(
        asset: 'assets/images/campfire.json',
        title: "Inloggen",
        description:
            "Om de app te gebruiken moet je een account hebben of kun je er een aanmaken.",
        buttonText: "Login met een account",
        onPressed: () {
          pageController.animateToPage(
            2,
            duration: Durations.long1,
            curve: Curves.linear,
          );
        },
      ),
      LoginPage(
        onPressed: () async {
          await OnboardingService.saveOnboardingCompleted(true);
          pageController.animateToPage(
            3,
            duration: Durations.long1,
            curve: Curves.linear,
          );
        },
      ),
      OnboardingCard(
        asset: 'assets/images/verification.json',
        title: "Verificatie",
        description:
            "Als je een nieuw/vers account hebt, wordt je account gecontroleerd. Als alles goed is wordt je account toegang verleend. Dit kan een paar dagen duren.",
        buttonText: "Volgende",
        onPressed: () {
          pageController.animateToPage(
            4,
            duration: Durations.long1,
            curve: Curves.linear,
          );
        },
      ),
      OnboardingCard(
        asset: "assets/logo/logo.png",
        title: "Klaar!",
        description: "Je bent klaar om de app te gebruiken.",
        buttonText: "Ga naar de app",
        onPressed: () async {
          if (await OnboardingService.isOnboardingCompleted()) {
            if (!context.mounted) return;
            context.read<LoginStateNotifier>().checkLoginStatus();
            context.read<LoginStateNotifier>().logIn();
          } else {
            if (!context.mounted) return;
            InfoDialog.show(context,
                message:
                    'Maak eerst de onboarding af voordat je de app kan gebruiken.');
          }
        },
      ),
    ];

    return CustomScaffold(
      bodyPadding: const Padding(padding: EdgeInsets.all(0)),
      body: Padding(
        padding: const EdgeInsets.all(50.0),
        child: Column(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Expanded(
              child: PageView(
                controller: pageController,
                children: onboardingPages,
              ),
            ),
            SmoothPageIndicator(
              controller: pageController,
              count: onboardingPages.length,
              effect: const WormEffect(
                activeDotColor: CustomColors.themePrimary,
              ),
              onDotClicked: (index) {
                pageController.animateToPage(
                  index,
                  duration: Durations.long1,
                  curve: Curves.bounceInOut,
                );
              },
            )
          ],
        ),
      ),
    );
  }
}
