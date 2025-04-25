import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/services/activity.dart';
import 'package:piwo/services/auth.dart';
import 'package:piwo/services/onboarding.dart';
import 'package:piwo/views/settings/account.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:piwo/widgets/notifiers/login_notifier.dart';
import 'package:piwo/widgets/restart.dart';
import 'package:provider/provider.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  ProfilePageState createState() => ProfilePageState();
}

class ProfilePageState extends State<ProfilePage> {
  // ignore: prefer_typing_uninitialized_variables
  var _account;

  @override
  void initState() {
    super.initState();
    _initializeAccount();
  }

  void _initializeAccount() async {
    try {
      _account = (await AccountService().getMyAccount()).data!;
    } catch (e) {
      debugPrint("Error fetching data: $e");
    } finally {
      setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
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
        title: const Text(
          "Profiel",
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Column(
        children: [
          Text(
            _account.getFullName,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          ListTile(
            leading: const Icon(Icons.email),
            trailing: const Icon(Icons.chevron_right),
            title: const Text("Pas email aan"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AccountPage(
                    account: _account,
                    isResetingPassword: false,
                    isCreatingAccount: false,
                    emailController: TextEditingController(),
                  ),
                ),
              );
            },
            contentPadding: const EdgeInsets.all(0.0),
          ),
          ListTile(
            leading: const Icon(Icons.lock),
            trailing: const Icon(Icons.chevron_right),
            title: const Text("Pas wachtwoord aan"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AccountPage(
                    account: _account,
                    isResetingPassword: false,
                    isCreatingAccount: false,
                    passwordController: TextEditingController(),
                  ),
                ),
              );
            },
            contentPadding: const EdgeInsets.all(0.0),
          ),
          ListTile(
            leading: const Icon(Icons.person),
            trailing: const Icon(Icons.chevron_right),
            title: const Text("Pas persoonlijke gegevens aan"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AccountPage(
                    account: _account,
                    isResetingPassword: false,
                    isCreatingAccount: false,
                    firstNameController: TextEditingController(),
                    lastNameController: TextEditingController(),
                  ),
                ),
              );
            },
            contentPadding: const EdgeInsets.all(0.0),
          ),
          const SizedBox(
            height: 40,
          ),
          ListTile(
            leading: const Icon(
              Icons.logout,
              color: Colors.orange,
            ),
            trailing: const Icon(
              Icons.chevron_right,
              color: Colors.orange,
            ),
            title: const Text(
              "Uitloggen",
              style: TextStyle(
                color: Colors.orange,
              ),
            ),
            onTap: () {
              _showYesNoDialog(
                context,
                "Weet je zeker dat je wilt uitloggen?",
                () async {
                  await AuthService().signOut();

                  await OnboardingService.saveOnboardingCompleted(false);
                  if (!context.mounted) return;
                  context.read<LoginStateNotifier>().logOut();
                  Navigator.of(context).pop();
                  RestartWidget.restartApp(context);
                },
                false,
              );
            },
            contentPadding: const EdgeInsets.all(0.0),
          ),
          ListTile(
            leading: const Icon(
              Icons.delete,
              color: Colors.red,
            ),
            trailing: const Icon(
              Icons.chevron_right,
              color: Colors.red,
            ),
            title: const Text(
              "Verwijder je account",
              style: TextStyle(
                color: Colors.red,
              ),
            ),
            onTap: () {
              _showYesNoDialog(
                context,
                "Weet je zeker dat je account wilt verwijderen? Al je account informatie wordt hiermee verwijderd.",
                (String password) async {
                  await ActivityService().deleteAllAvailabilitiesOfAccount(
                      FirebaseAuth.instance.currentUser?.uid ?? "");
                  await AccountService().deleteAccount(password);
                  await OnboardingService.saveOnboardingCompleted(false);

                  if (!context.mounted) return;
                  context.read<LoginStateNotifier>().logOut();
                  Navigator.of(context).pop();
                  RestartWidget.restartApp(context);
                },
                true,
              );
            },
            contentPadding: const EdgeInsets.all(0.0),
          ),
        ],
      ),
    );
  }

  void _showYesNoDialog(
    BuildContext context,
    String description,
    Function onPressed,
    bool isDeletingAccount,
  ) {
    final formKey = GlobalKey<FormState>();
    final TextEditingController passwordController = TextEditingController();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        bool isPasswordVisible = false;

        return StatefulBuilder(
          builder:
              (BuildContext context, void Function(void Function()) setState) {
            return AlertDialog(
              title: const Text("Weet je het zeker?"),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(description),
                  if (isDeletingAccount) ...[
                    const SizedBox(height: 8),
                    Form(
                      key: formKey,
                      child: TextFormField(
                        controller: passwordController,
                        obscureText: !isPasswordVisible,
                        decoration: InputDecoration(
                          border: const OutlineInputBorder(),
                          labelText: 'Wachtwoord*',
                          suffixIcon: IconButton(
                            icon: Icon(
                              isPasswordVisible
                                  ? Icons.visibility
                                  : Icons.visibility_off,
                            ),
                            onPressed: () {
                              setState(() {
                                isPasswordVisible = !isPasswordVisible;
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
                    ),
                  ],
                ],
              ),
              actions: <Widget>[
                TextButton(
                  child: const Text('Nee'),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
                TextButton(
                  child: const Text('Ja'),
                  onPressed: () {
                    if (isDeletingAccount) {
                      if (formKey.currentState!.validate()) {
                        onPressed(passwordController.text.trim());
                        Navigator.of(context).pop();
                      }
                    } else {
                      onPressed();
                      Navigator.pop(context);
                    }
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }
}
