import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/config/theme/size_setter.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/widgets/activity_overview.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:piwo/widgets/notifiers/availablity_notifier.dart';
import 'package:provider/provider.dart';
import 'package:piwo/services/account.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  Account _profile = Account();
  bool _isLoadingProfile = true;

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
          backgroundColor: Colors.white,
          body: SingleChildScrollView(
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
                          left: SizeSetter.getHorizontalScreenPadding(),
                          right: SizeSetter.getHorizontalScreenPadding(),
                        ),
                        child: _isLoadingProfile
                            ? const CircularProgressIndicator()
                            : Text(
                                "Welkom, ${_profile.firstName}!",
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
                ActivityOverview(
                  activities: limitedActivities,
                  account: _profile,
                  title: "Toekomstige activiteiten",
                  description:
                      "Bekijk de meest recent toekomstige activiteiten.",
                )
              ],
            ),
          ),
        );
      },
    );
  }
}
