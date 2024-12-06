import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/services/auth.dart';
import 'package:piwo/views/settings/account.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:piwo/widgets/dialogs.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({
    super.key,
    this.onPressed,
  });

  final Function? onPressed;

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
    return CustomScaffold(
      bodyPadding: const Padding(padding: EdgeInsets.all(0)),
      body: Center(
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
              "Login met je account",
              style: TextStyle(
                fontSize: 16,
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
                    keyboardType: TextInputType.emailAddress,
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
                  const SizedBox(height: 5),
                  GestureDetector(
                    onTap: () async {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => AccountPage(
                            isResetingPassword: true,
                            isCreatingAccount: false,
                            title: "Reset wachtwoord",
                            description:
                                "Reset je wachtwoord om opnieuw toegang tot je account te krijgen.",
                            emailController: TextEditingController(),
                          ),
                        ),
                      );
                    },
                    child: const Text(
                      'Wachtwoord vergeten?',
                      style: TextStyle(
                        color: Colors.orange,
                        decoration: TextDecoration.underline,
                        decorationColor: Colors.orange,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  MaterialButton(
                    minWidth: double.maxFinite,
                    color: CustomColors.themePrimary,
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        final email = _emailController.text.trim();
                        final password = _passwordController.text.trim();

                        final result =
                            await _authService.signIn(email, password);

                        if (result.isSuccess) {
                          if (widget.onPressed != null) widget.onPressed!();
                        } else {
                          if (!context.mounted) return;
                          ErrorDialog.showErrorDialog(
                            context,
                            result.error ??
                                "Het is onduidelijk wat er mis is gegaan.",
                          );
                        }
                      }
                    },
                    child: const Text('Login'),
                  ),
                  GestureDetector(
                    onTap: () async {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => AccountPage(
                            isResetingPassword: false,
                            isCreatingAccount: true,
                            title: "Maak een account",
                            description:
                                "Maak een account aan om de app te kunnen gebruiken.",
                            emailController: TextEditingController(),
                            passwordController: TextEditingController(),
                            firstNameController: TextEditingController(),
                            lastNameController: TextEditingController(),
                          ),
                        ),
                      );
                    },
                    child: const Text(
                      'Nog geen account?',
                      style: TextStyle(
                        color: Colors.orange,
                        decoration: TextDecoration.underline,
                        decorationColor: Colors.orange,
                      ),
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
