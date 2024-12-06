import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/views/home/home_view.dart';
import 'package:piwo/views/login/verification.dart';
import 'package:piwo/views/onboarding/onboarding.dart';
import 'package:piwo/widgets/notifiers/availablity_notifier.dart';
import 'package:piwo/widgets/notifiers/login_notifier.dart';
import 'package:piwo/widgets/restart.dart';
import 'package:provider/provider.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const RestartWidget(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<LoginStateNotifier>(
          create: (_) => LoginStateNotifier()..checkLoginStatus(),
        ),
        ChangeNotifierProvider<ActivityProvider>(
          create: (_) => ActivityProvider(),
        ),
      ],
      child: MaterialApp(
        title: 'Piwo',
        theme: ThemeData(
          useMaterial3: true,
          fontFamily: 'Poppins',
          colorScheme: ColorScheme.fromSeed(
            seedColor: CustomColors.themePrimary,
          ),
        ),
        debugShowCheckedModeBanner: false,
        home: const MyHomePage(),
      ),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  MyHomePageState createState() => MyHomePageState();
}

class MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    final loginState = context.watch<LoginStateNotifier>().value;

    if (loginState.getIsLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    } else if (loginState.getIsLoggedIn) {
      if (loginState.isFirstLogin) {
        return Scaffold(
          body: Center(
            child: VerificationPage(
              isApproved: loginState.getIsApproved,
              isComfired: loginState.getIsComfired,
            ),
          ),
        );
      } else {
        return const HomeView();
      }
    } else {
      return const Scaffold(
        body: Center(
          child: OnboardingPage(initialPage: 0),
        ),
      );
    }
  }
}
