import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:piwo/widgets/notifiers/availablity_notifier.dart';
import 'package:provider/provider.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/services/coin.dart';
import 'package:piwo/services/payment_url.dart';
import 'package:piwo/widgets/activity.dart';
import 'package:url_launcher/url_launcher.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  Account _profile = Account();
  bool _isLoadingProfile = true;
  String _errorMessage = "";
  bool _urlIsClicked = false;

  @override
  void initState() {
    super.initState();
    _fetchProfileInfo();
  }

  void _fetchProfileInfo() async {
    try {
      final profile = (await AccountService().getMyAccount()).data!;
      setState(() {
        _profile = profile;
        _isLoadingProfile = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = "Error loading profile";
        _isLoadingProfile = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ActivityProvider>(
      builder: (context, activityProvider, child) {
        final activities = activityProvider.activities
            .where((activity) => DateTime.now().isBefore(activity.startDate!))
            .toList()
          ..sort((a, b) => a.startDate!.compareTo(b.startDate!));

        List<Activity> limitedActivities =
            activities.isNotEmpty ? activities.take(3).toList() : [];

        return CustomScaffold(
          useAppBar: true,
          appBar: AppBar(
            title: const Text(
              "Home",
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          body: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (_isLoadingProfile) ...[
                  const CircularProgressIndicator()
                ] else ...[
                  if (_errorMessage.isNotEmpty) ...[
                    Text(
                      _errorMessage,
                      style: const TextStyle(
                        fontSize: 20,
                        color: Colors.red,
                      ),
                    )
                  ] else ...[
                    Text(
                      "Welkom, ${_profile.firstName}!",
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ],
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Jouw munten (${_profile.amountOfCoins ?? 0})",
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Container(
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: CustomColors.themePrimary,
                      ),
                      width: 40,
                      height: 40,
                      child: IconButton(
                        icon: const Icon(Icons.add),
                        color: Colors.white,
                        onPressed: () {
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                                title: const Text('Koop een bierkaart'),
                                content: SingleChildScrollView(
                                  child: StatefulBuilder(
                                    builder: (BuildContext context,
                                        StateSetter setState) {
                                      return Column(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Text("€ 15.00"),
                                          const SizedBox(height: 10),
                                          GestureDetector(
                                            onTap: () async {
                                              final paymentUrl = Uri.parse(
                                                  (await PaymentUrlService()
                                                              .getPaymentUrl())
                                                          .data ??
                                                      "");
                                              if (await canLaunchUrl(
                                                  paymentUrl)) {
                                                final launched =
                                                    await launchUrl(paymentUrl);
                                                if (launched) {
                                                  _urlIsClicked = launched;
                                                  debugPrint(
                                                      "URL launched successfully");
                                                }
                                              }
                                            },
                                            child: const Text(
                                              'Klik hier om te betalen',
                                              style: TextStyle(
                                                color:
                                                    CustomColors.themePrimary,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                        ],
                                      );
                                    },
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
                                      if (_urlIsClicked) {
                                        setState(() {
                                          _profile.amountOfCoins =
                                              (_profile.amountOfCoins ?? 0) +
                                                  20;
                                        });

                                        CoinService()
                                            .setCoins(_profile.amountOfCoins!);

                                        if (!context.mounted) return;
                                        Navigator.of(context).pop();
                                      }
                                    },
                                    child: const Text('Afronden'),
                                  ),
                                ],
                              );
                            },
                          );
                        },
                      ),
                    ),
                  ],
                ),
                const Text(
                  "Lever je munten in voor een dankje",
                  style: TextStyle(
                    fontSize: 16,
                    color: CustomColors.unselectedMenuColor,
                  ),
                ),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      if (_profile.amountOfCoins != null) ...[
                        for (var i = 0; i < _profile.amountOfCoins!; i++) ...[
                          InkWell(
                            onTap: () {
                              showDialog(
                                context: context,
                                builder: (BuildContext context) {
                                  return AlertDialog(
                                    title: const Text('Weet je het zeker?'),
                                    content: const Text(
                                      "Weet je zeker dat een munt wil inleveren voor een drankje?",
                                      style: TextStyle(
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
                                          final result = await CoinService()
                                              .removeCoin(
                                                  _profile.amountOfCoins! - 1);

                                          if (result.isSuccess) {
                                            setState(() {
                                              _profile.amountOfCoins =
                                                  result.data!;
                                            });
                                          }

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
                            child: Container(
                              padding: const EdgeInsets.all(7),
                              child: Image.asset(
                                'assets/images/coin.png',
                                width: 85,
                                height: 85,
                              ),
                            ),
                          ),
                        ]
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  "Toekomstige activiteiten",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Text(
                  "Bekijk de meest recent toekomstige activiteiten.",
                  style: TextStyle(
                    fontSize: 16,
                    color: CustomColors.unselectedMenuColor,
                  ),
                ),
                const SizedBox(height: 20),
                if (limitedActivities.isEmpty) ...[
                  const Text(
                    "Je bent voor geen activiteiten aangemeld.",
                    style: TextStyle(
                      fontSize: 18,
                    ),
                  ),
                ] else ...[
                  if (_errorMessage.isNotEmpty) ...[
                    Text(
                      _errorMessage,
                      style: const TextStyle(
                        fontSize: 20,
                        color: Colors.red,
                      ),
                    )
                  ] else ...[
                    ActivityWidget(
                      activities: limitedActivities,
                      account: _profile,
                    )
                  ],
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}
