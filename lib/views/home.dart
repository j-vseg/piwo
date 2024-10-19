import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/services/account_service.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  Account? _profile;
  bool _isLoading = true;
  String _errorMessage = "";

  @override
  void initState() {
    super.initState();
    _fetchProfileInfo();
  }

  void _fetchProfileInfo() async {
    try {
      final profile = await AccountService().getMyAccount();
      setState(() {
        _profile = profile;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = "Error loading profile";
        _isLoading = false;
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
          if (_isLoading) ...[
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
                "Welkom, ${_profile!.firstName}!",
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ],
          const SizedBox(height: 20),
          const Text(
            "Jouw statistieken",
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const Text(
            "Bekijk jouw statistieken.",
            style: TextStyle(
              fontSize: 18,
              color: CustomColors.unselectedMenuColor,
            ),
          ),
          const SizedBox(height: 20),
          // Horizontal scrollable row for the statistic containers
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                Container(
                  margin: const EdgeInsets.only(right: 16.0),
                  decoration: BoxDecoration(
                    color: CustomColors.themePrimary,
                    border: Border.all(
                      color: CustomColors.themePrimary,
                      width: 2,
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.all(15),
                  child: const Column(
                    children: [
                      Text(
                        "13424",
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        "drankjes",
                        style: TextStyle(
                          fontSize: 15,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  margin: const EdgeInsets.only(right: 16.0),
                  decoration: BoxDecoration(
                    color: CustomColors.themePrimary,
                    border: Border.all(
                      color: CustomColors.themePrimary,
                      width: 2,
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.all(15),
                  child: const Column(
                    children: [
                      Text(
                        "124x",
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        "aanwezig",
                        style: TextStyle(
                          fontSize: 15,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  margin: const EdgeInsets.only(right: 16.0),
                  decoration: BoxDecoration(
                    color: CustomColors.themePrimary,
                    border: Border.all(
                      color: CustomColors.themePrimary,
                      width: 2,
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.all(15),
                  child: const Column(
                    children: [
                      Text(
                        "12x",
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        "afwezig",
                        style: TextStyle(
                          fontSize: 15,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 30),
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
          InkWell(
            onTap: () {
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
              child: const Padding(
                padding: EdgeInsets.all(15.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Groeps avond',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      "10-10-2024 20:00 - 21:00",
                      style: TextStyle(fontSize: 18),
                    ),
                    Text(
                      "Aanwezig",
                      style: TextStyle(fontSize: 18),
                    ),
                    // Text(
                    //   Activity.alreadySignedUp(
                    //           activity.getBegeleiders, account.getId)
                    //       ? "Je bent al aangemeld"
                    //       : peopleNeeded < 1
                    //           ? "Geen begeleiders meer nodig"
                    //           : peopleNeeded <= 1
                    //               ? "$peopleNeeded begeleider"
                    //               : "$peopleNeeded begeleiders",
                    //   style: const TextStyle(fontSize: 18),
                    // ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
