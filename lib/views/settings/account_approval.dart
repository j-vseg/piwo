import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/services/verification.dart';

class AccountApprovalPage extends StatefulWidget {
  const AccountApprovalPage({super.key});

  @override
  AccountApprovalPageState createState() => AccountApprovalPageState();
}

class AccountApprovalPageState extends State<AccountApprovalPage> {
  List<Account> _accounts = [];
  List<List<bool>> _selectionStatus = [];

  @override
  void initState() {
    super.initState();
    _initializeAccounts();
  }

  void _initializeAccounts() async {
    try {
      _accounts = (await AccountService().getAllAccounts())
          .data!
          .where((account) => !account.isApproved! && !account.isConfirmed!)
          .toList();

      _selectionStatus =
          List.generate(_accounts.length, (index) => [false, false]);
    } catch (e) {
      debugPrint("Error fetching data: $e");
    } finally {
      setState(() {});
    }
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
        title: const Text(
          "Nieuwe accounts",
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.only(top: 20.0, left: 20.0, right: 20.0),
          child: Column(
            children: [
              const Text(
                "Beheer de accounts die toegang hebben tot de app",
                style: TextStyle(
                  fontSize: 20,
                  color: CustomColors.unselectedMenuColor,
                ),
              ),
              const SizedBox(height: 20),
              if (_accounts.isEmpty) ...[
                const Text(
                  "Geen nieuwe accounts",
                  style: TextStyle(
                    fontSize: 18,
                  ),
                )
              ] else ...[
                Expanded(
                  child: ListView.builder(
                    itemCount: _accounts.length,
                    itemBuilder: (context, index) {
                      final account = _accounts[index];
                      final isSelected = _selectionStatus[index];

                      return ListTile(
                        trailing: ToggleButtons(
                          borderRadius: BorderRadius.circular(20.0),
                          isSelected: isSelected,
                          constraints: const BoxConstraints(
                            minHeight: 40,
                          ),
                          color: Colors.black,
                          selectedColor: Colors.white,
                          fillColor: isSelected[0] ? Colors.green : Colors.red,
                          children: const [
                            Padding(
                              padding: EdgeInsets.symmetric(
                                  horizontal: 8.0, vertical: 0),
                              child: Text('Toestaan'),
                            ),
                            Padding(
                              padding: EdgeInsets.symmetric(
                                  horizontal: 8.0, vertical: 0),
                              child: Text('Afkeuren'),
                            ),
                          ],
                          onPressed: (int newIndex) async {
                            for (int buttonIndex = 0;
                                buttonIndex < isSelected.length;
                                buttonIndex++) {
                              isSelected[buttonIndex] = buttonIndex == newIndex;
                            }

                            showDialog(
                              context: context,
                              builder: (BuildContext context) {
                                return AlertDialog(
                                  title: const Text('Weet je het zeker?'),
                                  content: Text(
                                    "Weet je zeker dat je dit account wil ${isSelected[0] ? "toestaan" : "afkeuren"}?",
                                    style: const TextStyle(
                                      color: CustomColors.unselectedMenuColor,
                                    ),
                                  ),
                                  actions: <Widget>[
                                    TextButton(
                                      onPressed: () {
                                        Navigator.of(context).pop();
                                      },
                                      child: const Text('Cancel'),
                                    ),
                                    TextButton(
                                      onPressed: () async {
                                        await VerificationService()
                                            .updateAccountApproval(
                                                isSelected[0], account.id!);
                                        setState(() {
                                          _initializeAccounts();
                                        });

                                        if (!context.mounted) return;
                                        Navigator.of(context).pop();
                                      },
                                      child: const Text('Ja'),
                                    ),
                                  ],
                                );
                              },
                            );
                          },
                        ),
                        title: Text(account.getFullName),
                      );
                    },
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
