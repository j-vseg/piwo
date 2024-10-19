import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/views/login.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:piwo/widgets/login_notifier.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(
    ChangeNotifierProvider(
      create: (_) => LoginStateNotifier()..checkLoginStatus(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Piwo',
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Poppins',
        colorScheme: ColorScheme.fromSeed(
          seedColor: CustomColors.themePrimary,
        ),
      ),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final loginState = context.watch<LoginStateNotifier>();

    if (loginState.value) {
      return const CustomScaffold(body: Center());
    } else {
      return const Scaffold(
        body: Center(
          child: LoginPage(),
        ),
      );
    }
  }
}
