import 'package:accordion/accordion.dart';
import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/enums/role.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/services/role.dart';
import 'package:piwo/views/settings/account_approval.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:piwo/widgets/dialogs.dart';

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
  List<Account> _accounts = [];
  Account? _selectedAccount;
  Role? _selectedRole;

  @override
  void initState() {
    super.initState();
    _initializeFutures();
  }

  void _initializeFutures() async {
    _accounts = (await AccountService().getAllAccounts()).data!;

    setState(() {});
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
          "Beheer accounts",
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Column(
        children: [
          ListTile(
            leading: const Icon(Icons.mark_email_read),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (_accounts
                    .where((account) => account.isConfirmed == false)
                    .isNotEmpty)
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(
                      color: CustomColors.selectedMenuColor,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      _accounts
                          .where((account) => account.isConfirmed == false)
                          .length
                          .toString(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                const SizedBox(width: 8),
                const Icon(Icons.chevron_right),
              ],
            ),
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
                contentBackgroundColor: CustomColors.background100,
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
                        ..._accounts
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
                        ? "${_selectedAccount!.firstName} heeft de volgende rolen: ${_selectedAccount!.roles.map((role) => role.name)}"
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
                        if (_selectedRole != null && _selectedAccount != null) {
                          final role = _selectedRole;
                          if (_selectedAccount!.roles.contains(role)) {
                            final result = await RoleService().removeRole(
                              _selectedAccount!.id,
                              role ?? Role.user,
                            );
                            if (result.isSuccess) {
                              if (!context.mounted) return;
                              SuccessDialog.show(
                                context,
                                message:
                                    "We hebben successful de rechten van het account gewijzigd.",
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
                            final result = await RoleService().addRole(
                              _selectedAccount!,
                              role ?? Role.user,
                            );
                            if (result.isSuccess) {
                              if (!context.mounted) return;
                              SuccessDialog.show(
                                context,
                                message:
                                    "We hebben successful de rechten van het account gewijzigd.",
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
                        } else {
                          ErrorDialog.showErrorDialog(
                            context,
                            "Zorg ervoor dat een account en rol geselecteerd hebt.",
                          );
                        }
                      },
                      child: Text(_selectedAccount != null
                          ? _selectedAccount!.roles.contains(_selectedRole)
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
}
