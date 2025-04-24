import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/config/theme/size_setter.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/services/activity.dart';
import 'package:piwo/views/activities/widgets/inverted_rounded_corners.dart';
import 'package:piwo/widgets/activity_overview.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:piwo/services/account.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  Future<Account> _fetchProfileInfo() async {
    final accountService = AccountService();
    final profile = (await accountService.getMyAccount()).data!;
    return profile;
  }

  Future<List<Activity>> _fetchActivities() async {
    final activities = (await ActivityService().getAllActivities()).data ?? [];

    // Filter and assign to a new list
    List<Activity> filteredActivities = activities
        .where((activity) =>
            DateTime.now().toLocal().isBefore(activity.endDate.toLocal()))
        .toList();

    // Sort the filtered list in-place
    filteredActivities.sort((a, b) => a.startDate.compareTo(b.startDate));

    // Return top 3
    return filteredActivities.take(3).toList();
  }

  @override
  Widget build(BuildContext context) {
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
        backgroundColor: Colors.white,
        bodyPadding:
            const Padding(padding: EdgeInsets.symmetric(horizontal: 0.0)),
        body: FutureBuilder<Account>(
          future: _fetchProfileInfo(),
          builder: (context, profileSnapshot) {
            if (profileSnapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: CircularProgressIndicator(),
              );
            } else if (profileSnapshot.hasError) {
              return const Center(
                child: Text(
                  'Er is een fout opgetreden. Probeer het later opnieuw.',
                  style: TextStyle(color: Colors.red, fontSize: 16),
                ),
              );
            } else if (profileSnapshot.hasData) {
              final profile = profileSnapshot.data!;
              return FutureBuilder<List<Activity>>(
                future: _fetchActivities(),
                builder: (context, activitiesSnapshot) {
                  if (activitiesSnapshot.connectionState ==
                      ConnectionState.waiting) {
                    return const Center(
                      child: CircularProgressIndicator(),
                    );
                  } else if (activitiesSnapshot.hasError) {
                    return const Center(
                      child: Text(
                        'Fout bij het ophalen van activiteiten.',
                        style: TextStyle(color: Colors.red, fontSize: 16),
                      ),
                    );
                  } else if (activitiesSnapshot.hasData) {
                    final limitedActivities = activitiesSnapshot.data!;
                    return SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: double.infinity,
                            decoration: const BoxDecoration(
                              color: CustomColors.themeBackground,
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Padding(
                                  padding: EdgeInsets.only(
                                    top: 0.0,
                                    left:
                                        SizeSetter.getHorizontalScreenPadding(),
                                    right:
                                        SizeSetter.getHorizontalScreenPadding(),
                                  ),
                                  child: Text(
                                    "Welkom, ${profile.firstName}!",
                                    style: const TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 20),
                              ],
                            ),
                          ),
                          limitedActivities.isEmpty
                              ? CustomPaint(
                                  size: MediaQuery.of(context).size,
                                  painter: InvertedRoundedRectanglePainter(
                                    color: Colors.white,
                                    radius: 35,
                                    backgroundColor:
                                        CustomColors.themeBackground,
                                  ),
                                  child: const Padding(
                                    padding: EdgeInsets.all(50.0),
                                    child: Center(
                                      child: Text(
                                          'Geen toekomstige activiteiten beschikbaar.'),
                                    ),
                                  ),
                                )
                              : ActivityOverview(
                                  activities: limitedActivities,
                                  account: profile,
                                  title: "Toekomstige activiteiten",
                                  description:
                                      "Bekijk de meest recent toekomstige activiteiten.",
                                ),
                        ],
                      ),
                    );
                  } else {
                    return const Center(
                      child: Text('Geen gegevens beschikbaar.'),
                    );
                  }
                },
              );
            } else {
              return const Center(
                child: Text('Geen gegevens beschikbaar.'),
              );
            }
          },
        ));
  }
}
