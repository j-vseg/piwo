import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/services/auth.dart';
import 'package:piwo/widgets/notifiers/login_notifier.dart';
import 'package:provider/provider.dart';

class AccountPage extends StatefulWidget {
  final TextEditingController? emailController;
  final TextEditingController? passwordController;
  final TextEditingController? firstNameController;
  final TextEditingController? lastNameController;

  const AccountPage({
    super.key,
    this.emailController,
    this.passwordController,
    this.firstNameController,
    this.lastNameController,
  });

  @override
  AccountPageState createState() => AccountPageState();
}

class AccountPageState extends State<AccountPage> {
  @override
  void initState() {
    super.initState();
  }

  final _formKey = GlobalKey<FormState>();

  final TextEditingController _oldPasswordController = TextEditingController();

  bool _isPasswordVisible = false;
  bool _isOldPasswordVisible = false;

  @override
  void dispose() {
    if (widget.emailController != null) {
      widget.emailController!.dispose();
    }
    if (widget.passwordController != null) {
      widget.passwordController!.dispose();
    }
    if (widget.firstNameController != null) {
      widget.firstNameController!.dispose();
    }
    if (widget.lastNameController != null) {
      widget.lastNameController!.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 8.0),
          child: Container(
            width: 40,
            height: 40,
            decoration: const BoxDecoration(
              color: CustomColors.themePrimary,
              shape: BoxShape.circle,
            ),
            child: IconButton(
              padding: EdgeInsets.zero,
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.only(left: 20.0, right: 20.0, top: 20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Beheer je account",
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Text(
              "Maak hier wijzingen aan je account",
              style: TextStyle(
                fontSize: 20,
                color: CustomColors.unselectedMenuColor,
              ),
            ),
            const SizedBox(height: 20),
            Form(
              key: _formKey,
              child: Column(
                children: <Widget>[
                  if (widget.emailController != null) ...[
                    TextFormField(
                      controller: widget.emailController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Nieuwe email*',
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
                  ],
                  if (widget.passwordController != null) ...[
                    TextFormField(
                      controller: widget.passwordController,
                      obscureText: !_isPasswordVisible,
                      decoration: InputDecoration(
                        border: const OutlineInputBorder(),
                        labelText: 'Nieuw wachtwoord',
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
                    const SizedBox(height: 10),
                  ],
                  if (widget.firstNameController != null) ...[
                    TextFormField(
                      controller: widget.firstNameController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Voornaam*',
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Veld kan niet leeg zijn';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 10),
                  ],
                  if (widget.lastNameController != null) ...[
                    TextFormField(
                      controller: widget.lastNameController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Achternaam*',
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Veld kan niet leeg zijn';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 10),
                  ],
                  TextFormField(
                    controller: _oldPasswordController,
                    obscureText: !_isOldPasswordVisible,
                    decoration: InputDecoration(
                      border: const OutlineInputBorder(),
                      labelText: 'Wachtwoord*',
                      suffixIcon: IconButton(
                        icon: Icon(
                          _isOldPasswordVisible
                              ? Icons.visibility
                              : Icons.visibility_off,
                        ),
                        onPressed: () {
                          setState(() {
                            _isOldPasswordVisible = !_isOldPasswordVisible;
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
                  const SizedBox(height: 10),
                  MaterialButton(
                    minWidth: double.maxFinite,
                    color: CustomColors.themePrimary,
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        String? email;
                        String? newPassword;
                        String? firstName;
                        String? lastName;
                        final oldPassword = _oldPasswordController.text.trim();

                        if (widget.emailController != null) {
                          email = widget.emailController!.text.trim();

                          if (await AccountService()
                              .updateEmail(email, oldPassword)) {
                            if (!context.mounted) return;
                            _showDialog(
                              context,
                              "Email verstuurd",
                              "Er is een email verstuurd om je nieuwe email: $email te verifieeren. Je moet weer opnieuw inloggen om het nieuwe email address te bevestigen.",
                              () async {
                                await AuthService().signOut();

                                if (!context.mounted) return;
                                context.read<LoginStateNotifier>().logOut();
                                Navigator.of(context).pop();
                              },
                            );
                          } else {
                            if (!context.mounted) return;
                            _showDialog(
                              context,
                              "Er is iets mis gegaan",
                              'Controleer je gegevens en probeer het nog eens.',
                              () {
                                Navigator.of(context).pop();
                              },
                            );
                          }
                        }
                        if (widget.passwordController != null) {
                          newPassword = widget.passwordController!.text.trim();

                          if (await AccountService()
                              .updatePassword(newPassword, oldPassword)) {
                            if (!context.mounted) return;
                            _showDialog(
                              context,
                              "Wachtwoord is gewijzigd",
                              "We hebben successful je wachtwoord gewijzigd.",
                              () {
                                Navigator.of(context).pop();
                              },
                            );
                          } else {
                            if (!context.mounted) return;
                            _showDialog(
                              context,
                              "Er is iets mis gegaan",
                              'Controleer je gegevens en probeer het nog eens.',
                              () {
                                Navigator.of(context).pop();
                              },
                            );
                          }
                        }
                        if (widget.firstNameController != null &&
                            widget.lastNameController != null) {
                          firstName = widget.firstNameController!.text.trim();
                          lastName = widget.lastNameController!.text.trim();

                          if (await AccountService().updateAccountCredentials(
                            firstName,
                            lastName,
                            oldPassword,
                          )) {
                            if (!context.mounted) return;
                            _showDialog(
                              context,
                              "Account credentials zijn gewijzigd",
                              "We hebben successful je account credentials zijn gewijzigd.",
                              () {
                                Navigator.of(context).pop();
                              },
                            );
                          } else {
                            if (!context.mounted) return;
                            _showDialog(
                              context,
                              "Er is iets mis gegaan",
                              'Controleer je gegevens en probeer het nog eens.',
                              () {
                                Navigator.of(context).pop();
                              },
                            );
                          }
                        }
                      }
                    },
                    child: const Text('Wijzig je account'),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  void _showDialog(
    BuildContext context,
    String title,
    String description,
    Function onPressed,
  ) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: Text(description),
          actions: <Widget>[
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Ja'),
              onPressed: () {
                onPressed();
              },
            ),
          ],
        );
      },
    );
  }
}
