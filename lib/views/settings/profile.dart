import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/services/auth.dart';
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
  Account _account = Account();

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
      body: Column(
        children: [
          const Text(
            "Profiel",
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            _account.getFullName,
            style: const TextStyle(
              fontSize: 18,
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
                    isResetingPassword: null,
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
                    isResetingPassword: null,
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
                    isResetingPassword: null,
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

                  if (!context.mounted) return;
                  context.read<LoginStateNotifier>().logOut();
                  Navigator.of(context).pop();
                  RestartWidget.restartApp(context);
                },
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
                "Weet je zeker dat je account wilt verwijderen?",
                () async {
                  AccountService().deleteAccount();

                  if (!context.mounted) return;
                  context.read<LoginStateNotifier>().logOut();
                  Navigator.of(context).pop();
                  RestartWidget.restartApp(context);
                },
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
  ) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Weet je het zeker?"),
          content: Text(description),
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
                onPressed();
              },
            ),
          ],
        );
      },
    );
  }
}
