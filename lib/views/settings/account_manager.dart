import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/enums/role.dart';
import 'package:piwo/services/account.dart';

class AccountManagerPage extends StatefulWidget {
  const AccountManagerPage({
    super.key,
  });

  @override
  AccountManagerPageState createState() => AccountManagerPageState();
}

class AccountManagerPageState extends State<AccountManagerPage> {
  List<Account> accounts = [];
  Account? selectedAccount;

  @override
  void initState() {
    super.initState();
    _initializeFutures();
  }

  void _initializeFutures() async {
    accounts = await AccountService().getAllAccounts();

    setState(() {});
  }

  Role? _role;

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
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 20.0, right: 20.0, top: 20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Beheer account rechten",
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                DropdownButton<Account>(
                  style: const TextStyle(
                    fontSize: 18,
                    color: Colors.black,
                  ),
                  hint: const Text("Selecteer een account"),
                  value: selectedAccount,
                  items: [
                    const DropdownMenuItem<Account>(
                      value: null,
                      child: Text(
                        "Geen account geselecteerd",
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.grey,
                        ),
                      ),
                    ),
                    ...accounts.map((Account account) {
                      return DropdownMenuItem<Account>(
                        value: account,
                        child: Text(
                          account.getFullName,
                          style: const TextStyle(
                            fontSize: 18,
                            color: Colors.black,
                          ),
                        ),
                      );
                    }),
                  ],
                  onChanged: (Account? newValue) {
                    setState(() {
                      selectedAccount = newValue;

                      if (newValue == null) {
                        _role = null;
                      } else {
                        _role = newValue.role;
                      }
                    });
                  },
                ),
                const SizedBox(height: 10.0),
                DropdownButton<Role>(
                  hint: const Text("Selecteer een rol"),
                  value: _role,
                  items: Role.values.map((Role role) {
                    return DropdownMenuItem<Role>(
                      value: role,
                      child: Text(role.name),
                    );
                  }).toList(),
                  onChanged: (Role? role) {
                    setState(() {
                      _role = role;
                    });
                  },
                ),
                const SizedBox(height: 20),
                MaterialButton(
                  minWidth: double.maxFinite,
                  color: CustomColors.themePrimary,
                  onPressed: () async {
                    if (_role != null) {
                      final role = _role;

                      if (selectedAccount != null) {
                        if (await AccountService().updateAccountRole(
                          accountId: selectedAccount!.id ?? "",
                          newRole: role ?? Role.user,
                        )) {
                          _showSuccessDialog("De wijzigen zijn aangebracht");
                        } else {
                          _showErrorDialog(
                              "Het lijkt er op dat er iets mis is gegaan.");
                        }
                      }
                    } else {
                      _showErrorDialog(
                          "Het lijkt er op dat er iets mis is gegaan. Controleer uw gegevens en probeer het nog een keer.");
                    }
                  },
                  child: const Text("Update account rechten"),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Function to show success dialog
  void _showSuccessDialog(String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Succes'),
          content: Text(message),
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

  // Function to show error dialog
  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Fout'),
          content: Text(message),
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
