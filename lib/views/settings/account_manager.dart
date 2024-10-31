import 'package:accordion/accordion.dart';
import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/enums/role.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/services/role.dart';
import 'package:piwo/views/settings/account_approval.dart';

class AccountManagerPage extends StatefulWidget {
  final Account account;

  const AccountManagerPage({
    super.key,
    required this.account,
  });

  @override
  AccountManagerPageState createState() => AccountManagerPageState();
}

class AccountManagerPageState extends State<AccountManagerPage> {
  List<Account> accounts = [];
  Account? _selectedAccount;
  Role? _selectedRole;

  @override
  void initState() {
    super.initState();
    _initializeFutures();
  }

  void _initializeFutures() async {
    accounts = await AccountService().getAllAccounts();

    setState(() {});
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
      body: Column(
        children: [
          const Text(
            "Beheer accounts",
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          ListTile(
            leading: const Icon(Icons.mark_email_read),
            trailing: const Icon(Icons.chevron_right),
            title: const Text("Bekijk nieuwe accounts"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const AccountApprovalPage(),
                ),
              );
            },
          ),
          Accordion(
            headerBorderColor: Colors.transparent,
            headerBorderColorOpened: Colors.transparent,
            headerBackgroundColor: Colors.transparent,
            headerBackgroundColorOpened: Colors.transparent,
            contentBackgroundColor: Colors.transparent,
            contentBorderColor: Colors.transparent,
            headerPadding: const EdgeInsets.only(
              top: 8,
              bottom: 8,
              left: 4,
              right: 16,
            ),
            children: [
              AccordionSection(
                isOpen: true,
                contentVerticalPadding: 20,
                rightIcon: const Icon(
                  Icons.keyboard_arrow_down,
                  color: Colors.black54,
                ),
                leftIcon: const Icon(Icons.work, color: Colors.black54),
                header: const Text(
                  "Update account rechten",
                  style: TextStyle(
                    fontSize: 16,
                  ),
                ),
                content: Column(
                  children: [
                    const Text(
                      "Update account rechten",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    DropdownButton<Account>(
                      style: const TextStyle(
                        fontSize: 18,
                        color: Colors.black,
                      ),
                      hint: const Text("Selecteer een account"),
                      value: _selectedAccount,
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
                        ...accounts
                            .where((account) => account.id != widget.account.id)
                            .map((Account account) {
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
                          _selectedAccount = newValue;
                        });
                      },
                    ),
                    Text(_selectedAccount != null
                        ? "${_selectedAccount!.firstName} heeft de volgende rolen: ${_selectedAccount!.roles!.map((role) => role.name)}"
                        : ""),
                    DropdownButton<Role>(
                      hint: const Text("Selecteer een rol"),
                      value: _selectedRole,
                      items: Role.values.map((Role role) {
                        return DropdownMenuItem<Role>(
                          value: role,
                          child: Text(role.name),
                        );
                      }).toList(),
                      onChanged: (Role? role) {
                        setState(() {
                          _selectedRole = role;
                        });
                      },
                    ),
                    const SizedBox(height: 20),
                    MaterialButton(
                      minWidth: double.maxFinite,
                      color: CustomColors.themePrimary,
                      onPressed: () async {
                        if (_selectedRole != null) {
                          final role = _selectedRole;

                          if (_selectedAccount != null) {
                            if (_selectedAccount!.roles!.contains(role)) {
                              if (await RoleService().removeRole(
                                _selectedAccount!.id ?? "",
                                role ?? Role.user,
                              )) {
                                _showSuccessDialog("De rol is verwijderd");
                              } else {
                                _showErrorDialog(
                                    "Het lijkt er op dat er iets mis is gegaan.");
                              }
                            } else {
                              if (await RoleService().addRole(
                                _selectedAccount!,
                                role ?? Role.user,
                              )) {
                                _showSuccessDialog("De rol is toegevoegd");
                              } else {
                                _showErrorDialog(
                                    "Het lijkt er op dat er iets mis is gegaan.");
                              }
                            }
                          } else {
                            _showErrorDialog(
                                "Het lijkt er op dat er iets mis is gegaan. Controleer uw gegevens en probeer het nog een keer.");
                          }
                        }
                      },
                      child: Text(_selectedAccount != null
                          ? _selectedAccount!.roles!.contains(_selectedRole)
                              ? "Verwijder rol"
                              : "Voeg rol toe"
                          : "Voeg rol toe"),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

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
