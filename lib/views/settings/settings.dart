import 'package:flutter/material.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/enums/role.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/views/settings/account_manager.dart';
import 'package:piwo/views/settings/payment_url_manger.dart';
import 'package:piwo/views/settings/profile.dart';
import 'package:piwo/widgets/custom_scaffold.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  SettingsPageState createState() => SettingsPageState();
}

class SettingsPageState extends State<SettingsPage> {
  Account _account = Account();

  @override
  void initState() {
    super.initState();
    _initializeAccount();
  }

  void _initializeAccount() async {
    try {
      _account = await AccountService().getMyAccount();
    } catch (e) {
      debugPrint("Error fetching data: $e");
    } finally {
      setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
    return CustomScaffold(
      useAppBar: false,
      body: Column(
        children: [
          const Text(
            "Instellingen",
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
          const SizedBox(height: 40),
          const Text(
            "Jouw account",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          ListTile(
            leading: const Icon(Icons.person),
            trailing: const Icon(Icons.chevron_right),
            title: const Text("Mijn profiel"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const ProfilePage(),
                ),
              );
            },
            contentPadding: const EdgeInsets.all(0.0),
          ),
          const SizedBox(height: 20),
          const Text(
            "Beheren",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          if (_account.roles != null &&
              (_account.roles!.contains(Role.beheerder) ||
                  _account.roles!.contains(Role.admin))) ...[
            ListTile(
              leading: const Icon(Icons.groups),
              trailing: const Icon(Icons.chevron_right),
              title: const Text("Beheer accounts"),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => AccountManagerPage(
                      account: _account,
                    ),
                  ),
                );
              },
              contentPadding: const EdgeInsets.all(0.0),
            ),
          ],
          if (_account.roles != null &&
              (_account.roles!.contains(Role.penningmeester) ||
                  _account.roles!.contains(Role.admin))) ...[
            ListTile(
              leading: const Icon(Icons.payment),
              trailing: const Icon(Icons.chevron_right),
              title: const Text("Wijzing bierkaart URL"),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const PaymentUrlManagerPage(),
                  ),
                );
              },
              contentPadding: const EdgeInsets.all(0.0),
            ),
          ]
        ],
      ),
    );
  }
}
