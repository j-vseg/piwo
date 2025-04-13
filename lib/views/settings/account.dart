import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/enums/role.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/services/auth.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:piwo/widgets/dialogs.dart';
import 'package:piwo/widgets/notifiers/login_notifier.dart';
import 'package:piwo/widgets/restart.dart';
import 'package:provider/provider.dart';

class AccountPage extends StatefulWidget {
  final bool isCreatingAccount;
  final bool isResetingPassword;
  final String title;
  final String description;
  final TextEditingController? emailController;
  final TextEditingController? passwordController;
  final TextEditingController? firstNameController;
  final TextEditingController? lastNameController;
  final Account? account;

  const AccountPage({
    super.key,
    required this.isCreatingAccount,
    required this.isResetingPassword,
    String? title,
    String? description,
    this.emailController,
    this.passwordController,
    this.firstNameController,
    this.lastNameController,
    this.account,
  })  : title = title ?? "Beheer je account",
        description = description ?? "Maak hier wijzingen aan je account.";

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
    if (widget.account != null) {
      if (widget.emailController != null) {
        widget.emailController!.text = widget.account!.email ?? "";
      }
      if (widget.firstNameController != null) {
        widget.firstNameController!.text = widget.account!.firstName ?? "";
      }
      if (widget.lastNameController != null) {
        widget.lastNameController!.text = widget.account!.lastName ?? "";
      }
    }

    return CustomScaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          padding: EdgeInsets.zero,
          icon: const Icon(
            Icons.chevron_left,
            color: Colors.black,
          ),
          iconSize: 25.0,
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        title: Text(
          widget.title,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.only(left: 20.0, right: 20.0, top: 20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              widget.description,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 16,
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
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        border: const OutlineInputBorder(),
                        labelText: widget.isCreatingAccount ||
                                widget.isResetingPassword
                            ? 'Email*'
                            : 'Nieuwe email*',
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
                        labelText: widget.isCreatingAccount
                            ? 'Wachtwoord*'
                            : 'Nieuw wachtwoord*',
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
                  if (!widget.isResetingPassword &&
                      !widget.isCreatingAccount) ...[
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
                  ],
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

                        if (!widget.isCreatingAccount) {
                          if (widget.emailController != null) {
                            email = widget.emailController!.text.trim();

                            final result = await AccountService()
                                .updateEmail(email, oldPassword);

                            if (result.isSuccess) {
                              if (!context.mounted) return;
                              InfoDialog.show(
                                context,
                                message:
                                    "Er is een email verstuurd om je nieuwe email: $email te verifieeren. Je moet weer opnieuw inloggen om het nieuwe email address te bevestigen.",
                                onPressed: () async {
                                  await AuthService().signOut();

                                  if (!context.mounted) return;
                                  context.read<LoginStateNotifier>().logOut();
                                  Navigator.of(context).pop();
                                  RestartWidget.restartApp(context);
                                },
                              );
                            } else {
                              if (!context.mounted) return;
                              ErrorDialog.showErrorDialog(
                                context,
                                result.error ??
                                    "Het is onduidelijk wat er mis is gegaan.",
                              );
                            }
                          }
                          if (widget.passwordController != null) {
                            newPassword =
                                widget.passwordController!.text.trim();

                            final result = await AccountService()
                                .updatePassword(newPassword, oldPassword);

                            if (result.isSuccess) {
                              if (!context.mounted) return;
                              SuccessDialog.show(
                                context,
                                message:
                                    "We hebben successful je wachtwoord gewijzigd.",
                              );
                            } else {
                              if (!context.mounted) return;
                              ErrorDialog.showErrorDialog(
                                context,
                                result.error ??
                                    "Het is onduidelijk wat er mis is gegaan.",
                              );
                            }
                          }
                          if (widget.firstNameController != null &&
                              widget.lastNameController != null) {
                            firstName = widget.firstNameController!.text.trim();
                            lastName = widget.lastNameController!.text.trim();

                            final result =
                                await AccountService().updateAccountCredentials(
                              firstName,
                              lastName,
                              oldPassword,
                            );
                            if (result.isSuccess) {
                              if (!context.mounted) return;
                              SuccessDialog.show(
                                context,
                                message:
                                    "Het updaten van je account informatie is gelukt!",
                              );
                            } else {
                              if (!context.mounted) return;
                              ErrorDialog.showErrorDialog(
                                context,
                                result.error ??
                                    "Het is onduidelijk wat er mis is gegaan.",
                              );
                            }
                          }
                        } else if (widget.isResetingPassword) {
                          email = widget.emailController!.text.trim();

                          final result =
                              await AccountService().resetPassword(email);

                          if (result.isSuccess) {
                            if (!context.mounted) return;
                            InfoDialog.show(
                              context,
                              message:
                                  "Er is een email verstuurd naar: $email om je wachtwoord te resetten.",
                            );
                          } else {
                            if (!context.mounted) return;
                            ErrorDialog.showErrorDialog(
                              context,
                              result.error ??
                                  "Het is onduidelijk wat er mis is gegaan.",
                            );
                          }
                        } else {
                          email = widget.emailController!.text.trim();
                          newPassword = widget.passwordController!.text.trim();
                          firstName = widget.firstNameController!.text.trim();
                          lastName = widget.lastNameController!.text.trim();

                          final account = Account(
                            firstName: firstName,
                            lastName: lastName,
                            amountOfCoins: 0,
                            isApproved: false,
                            isConfirmed: false,
                            isFirstLogin: true,
                            roles: [Role.user],
                          );

                          final result = await AuthService().signUp(
                            account,
                            email,
                            newPassword,
                          );

                          if (result.isSuccess) {
                            if (!context.mounted) return;
                            SuccessDialog.show(
                              context,
                              message:
                                  "Het aanmaken van een account is gelukt! Je kan nu inloggen.",
                            );
                          } else {
                            if (!context.mounted) return;
                            ErrorDialog.showErrorDialog(
                              context,
                              result.error ??
                                  "Het is onduidelijk wat er mis is gegaan.",
                            );
                          }
                        }
                      }
                    },
                    child: Text(widget.isCreatingAccount
                        ? 'Creëer je account'
                        : widget.isResetingPassword
                            ? "Reset wachtwoord"
                            : 'Wijzig je account'),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  void showErrorDialog(
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
