import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/services/activity.dart';
import 'package:piwo/services/coin.dart';
import 'package:piwo/services/payment_url.dart';
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

  List<Activity> _activities = [];
  bool _isLoadingActivities = true;

  @override
  void initState() {
    super.initState();
    _fetchProfileInfo();
    _fetchActivities();
  }

  void _fetchProfileInfo() async {
    try {
      final profile = await AccountService().getMyAccount();
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

  void _fetchActivities() async {
    try {
      final activities = await ActivityService().getAllActivities();
      setState(() {
        _activities = activities;
        _isLoadingActivities = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = "Error activties";
        _isLoadingActivities = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
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
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ],
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment:
                MainAxisAlignment.spaceBetween, // Align items to space out
            children: [
              Text(
                "Jouw munten (${_profile.amountOfCoins ?? 0})",
                style: const TextStyle(
                  fontSize: 22,
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
                              builder:
                                  (BuildContext context, StateSetter setState) {
                                return Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Text("€ 15.00"),
                                    const SizedBox(height: 10),
                                    GestureDetector(
                                      onTap: () async {
                                        final paymentUrl = Uri.parse(
                                            await PaymentUrlService()
                                                    .getPaymentUrl() ??
                                                "");
                                        if (await canLaunchUrl(paymentUrl)) {
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
                                          color: CustomColors.themePrimary,
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
                                        (_profile.amountOfCoins ?? 0) + 10;
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
              fontSize: 18,
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
                                    CoinService().removeCoin(
                                        _profile.amountOfCoins! - 1);
                                    _fetchProfileInfo();

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
            "Opkomende activiteiten",
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const Text(
            "Bekijk de meest recent opkomende activiteiten.",
            style: TextStyle(
              fontSize: 18,
              color: CustomColors.unselectedMenuColor,
            ),
          ),
          const SizedBox(height: 20),
          if (_activities.isEmpty) ...[
            const Text(
              "Je bent voor geen activiteiten aangemeld.",
              style: TextStyle(
                fontSize: 18,
              ),
            ),
          ] else ...[
            if (_isLoadingActivities) ...[
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
                buildActivities(_activities, _profile, context)
              ],
            ],
          ],
        ],
      ),
    );
  }

  Widget buildActivities(
      List<Activity> activities, Account account, BuildContext context) {
    activities.sort((a, b) => a.getStartDate.compareTo(b.getStartDate));

    return Column(
      children: activities.map((activity) {
        final availability = activity.didSubmitAvailibilty(account.id!);

        return InkWell(
          onTap: () {
            // TODO: Implement Activity page
            // Navigator.push(
            //   context,
            //   MaterialPageRoute(
            //     builder: (context) => ActivityPage(activityId: activity.getId),
            //   ),
            // );
          },
          child: Container(
            decoration: const BoxDecoration(
              borderRadius: BorderRadius.all(Radius.circular(20)),
              color: CustomColors.themePrimary,
            ),
            margin: const EdgeInsets.symmetric(vertical: 5, horizontal: 10),
            padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 5),
            height: 125,
            width: double.maxFinite,
            child: Padding(
              padding: const EdgeInsets.all(15.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    activity.name ?? "",
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    activity.getFullDate,
                    style: const TextStyle(fontSize: 18),
                  ),
                  Text(
                    availability != null
                        ? "Status: ${availability.status}"
                        : "Geen status opgegeven",
                    style: const TextStyle(fontSize: 18),
                  ),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
