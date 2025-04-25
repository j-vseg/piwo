import 'package:flutter/material.dart';
import 'package:piwo/models/enums/role.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/services/payment_url.dart';
import 'package:piwo/views/settings/account_manager.dart';
import 'package:piwo/views/settings/payment_url_manger.dart';
import 'package:piwo/views/settings/profile.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:url_launcher/url_launcher.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  SettingsPageState createState() => SettingsPageState();
}

class SettingsPageState extends State<SettingsPage> {
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
      useAppBar: true,
      appBar: AppBar(
        title: const Text(
          "Instellingen",
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Column(
        children: [
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
          if (_account.roles != null &&
              (_account.roles!.contains(Role.beheerder) ||
                  _account.roles!.contains(Role.admin))) ...[
            const SizedBox(height: 20),
            const Text(
              "Beheren",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
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
          const SizedBox(height: 20),
          Text(
            (_account.roles != null &&
                    (_account.roles!.contains(Role.penningmeester) ||
                        _account.roles!.contains(Role.admin)))
                ? "Penningmeester"
                : "Bierkaart kopen",
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          ListTile(
            leading: const Icon(Icons.euro),
            trailing: const Icon(Icons.chevron_right),
            title: const Text("Koop een bierkaart (€ 15.00)"),
            onTap: () async {
              final paymentUrl = Uri.parse(
                  (await PaymentUrlService().getPaymentUrl()).data ?? "");
              if (await canLaunchUrl(paymentUrl)) {
                final launched = await launchUrl(paymentUrl);
                if (launched) {
                  debugPrint("URL launched successfully");
                }
              }
            },
            contentPadding: const EdgeInsets.all(0.0),
          ),
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
          ],
        ],
      ),
    );
  }
}
