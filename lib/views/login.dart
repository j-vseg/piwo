import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/services/auth.dart';
import 'package:piwo/widgets/notifiers/login_notifier.dart';
import 'package:provider/provider.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({
    super.key,
  });

  @override
  LoginPageState createState() => LoginPageState();
}

class LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _isPasswordVisible = false;

  final AuthService _authService = AuthService();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.only(top: 50.0, left: 20.0, right: 20.0),
          child: Column(
            children: [
              const Text(
                "Inloggen",
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Text(
                "Login in je account",
                style: TextStyle(
                  fontSize: 20,
                  color: CustomColors.unselectedMenuColor,
                ),
              ),
              const SizedBox(height: 20.0),
              Form(
                key: _formKey,
                child: Column(
                  children: <Widget>[
                    TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Email*',
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Veld kan niet leeg zijn';
                        }

                        String pattern = r'^[\w-\.]+@([\w-]+\.)+[\w]{2,4}$';
                        RegExp regex = RegExp(pattern);

                        if (!regex.hasMatch(value)) {
                          return 'Geef een geldig email address op.';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      controller: _passwordController,
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
                          return 'Wachtwoord moet minstens 8 characters lang zijn.';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    MaterialButton(
                      minWidth: double.maxFinite,
                      color: CustomColors.activityPrimairyColorGreen,
                      onPressed: () async {
                        if (_formKey.currentState!.validate()) {
                          final email = _emailController.text.trim();
                          final password = _passwordController.text.trim();

                          Account? account =
                              await _authService.signIn(email, password);
                          if (account != null) {
                            debugPrint('Sign In Successful');

                            if (!context.mounted) return;
                            context.read<LoginStateNotifier>().logIn();
                          } else {
                            if (!context.mounted) return;

                            showDialog(
                              context: context,
                              builder: (BuildContext context) {
                                return AlertDialog(
                                  title: const Text('Er is iets misgegaan'),
                                  content: const Text(
                                      'Het lijkt er op dat er iets mis is gegaan. Controleer uw gegevens en probeer het nog een keer.'),
                                  actions: <Widget>[
                                    TextButton(
                                      onPressed: () {
                                        Navigator.pop(context);
                                      },
                                      child: const Text('OK'),
                                    ),
                                  ],
                                );
                              },
                            );
                          }
                        }
                      },
                      child: const Text('Login'),
                    ),
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
