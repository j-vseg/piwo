import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/config/theme/size_setter.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/enums/status.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/views/activities/widgets/inverted_rounded_corners.dart';
import 'package:piwo/views/statistics/widgets/bar_chart.dart';
import 'package:piwo/views/statistics/widgets/chart_data.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:piwo/widgets/notifiers/availablity_notifier.dart';
import 'package:provider/provider.dart';

class StatisticsPage extends StatefulWidget {
  const StatisticsPage({super.key});

  @override
  StatisticsPageState createState() => StatisticsPageState();
}

class StatisticsPageState extends State<StatisticsPage> {
  Account _account = Account();
  Map<int, Map<Account, Map<String, int>>> yearlyData = {};

  String _selectedCategory = "leaderboard";
  int _selectedYear = DateTime.now().toUtc().year;
  Status _selectedAvailability = Status.aanwezig;

  @override
  void initState() {
    super.initState();
    _fetchAccountInfo();
  }

  void _fetchAccountInfo() async {
    final account = (await AccountService().getMyAccount()).data!;
    setState(() {
      _account = account;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ActivityProvider>(
      builder: (context, activityProvider, child) {
        _processData(activityProvider.activities);

        return CustomScaffold(
          useAppBar: true,
          appBar: AppBar(
            title: const Text(
              "Statistieken",
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          backgroundColor: Colors.white,
          bodyPadding:
              const Padding(padding: EdgeInsets.symmetric(horizontal: 0.0)),
          body: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  decoration: const BoxDecoration(
                    color: CustomColors.themeBackground,
                  ),
                  child: Padding(
                    padding: EdgeInsets.only(
                      top: 0.0,
                      left: SizeSetter.getHorizontalScreenPadding(),
                      right: SizeSetter.getHorizontalScreenPadding(),
                    ),
                    child: Column(
                      children: [
                        // const SizedBox(
                        //   height: 65,
                        //   child: Text(
                        //     "Statistieken",
                        //     style: TextStyle(
                        //       fontSize: 24,
                        //       fontWeight: FontWeight.bold,
                        //     ),
                        //   ),
                        // ),
                        Container(
                          decoration: BoxDecoration(
                            color: CustomColors.background200,
                            borderRadius: BorderRadius.circular(25.0),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _selectedCategory = "leaderboard";
                                    });
                                  },
                                  child: Container(
                                    height: 35,
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 8.0, horizontal: 16.0),
                                    decoration: BoxDecoration(
                                      color: _selectedCategory != "leaderboard"
                                          ? Colors.transparent
                                          : CustomColors.themePrimary,
                                      borderRadius: BorderRadius.circular(25.0),
                                    ),
                                    child: const Text(
                                      "Leaderboard",
                                      style: TextStyle(fontSize: 14.0),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _selectedCategory = "aanwezig";
                                    });
                                  },
                                  child: Container(
                                    height: 35,
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 8.0, horizontal: 16.0),
                                    decoration: BoxDecoration(
                                      color: _selectedCategory != "aanwezig"
                                          ? Colors.transparent
                                          : CustomColors.themePrimary,
                                      borderRadius: BorderRadius.circular(25.0),
                                    ),
                                    child: const Text(
                                      "Jouw aanwezigheid",
                                      style: TextStyle(fontSize: 14.0),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        if (_selectedCategory != "leaderboard") ...[
                          BarChartWidget(
                            chartData: _getAccountBars(),
                            buttons: _getAccountButtons(),
                            labels: const ["Aanwezig", "Misschien", "Afwezig"],
                          )
                        ] else ...[
                          BarChartWidget(
                            chartData: _getLeaderboardBars(),
                            buttons: _getLeaderboardButtons(),
                            labels: _getLeaderboardLabel(),
                          )
                        ],
                        const SizedBox(height: 15),
                      ],
                    ),
                  ),
                ),
                CustomPaint(
                  size: MediaQuery.of(context).size,
                  painter: InvertedRoundedRectanglePainter(
                    color: Colors.white,
                    radius: 35,
                    backgroundColor: CustomColors.themeBackground,
                  ),
                  child: ClipRRect(
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(35.0),
                      topRight: Radius.circular(35.0),
                    ),
                    child: _selectedCategory == "leaderboard"
                        ? ChartDataWidget(
                            leaderboardChartData:
                                yearlyData[DateTime.now().toUtc().year] ?? {},
                            selectedButton: _selectedAvailability.name,
                          )
                        : ChartDataWidget(
                            accountChartData:
                                yearlyData[_selectedYear]![_account] ?? {},
                            selectedButton: _selectedAvailability.name,
                          ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  List<Widget> _getAccountButtons() {
    List<Widget> buttons = [];
    var sortedYears = yearlyData.keys.toList()..sort((a, b) => b.compareTo(a));

    for (var year in sortedYears) {
      if (buttons.length == 3) break;

      if (yearlyData.containsKey(year) &&
          yearlyData[year]!.containsKey(_account)) {
        buttons.add(
          GestureDetector(
            onTap: () {
              setState(() {
                _selectedYear = year;
              });
            },
            child: Container(
              height: 35,
              padding:
                  const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
              decoration: BoxDecoration(
                color: _selectedYear == year
                    ? CustomColors.themePrimary
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(25.0),
              ),
              child: Text(
                year.toString(),
                style: const TextStyle(
                  color: Colors.black87,
                  fontSize: 14.0,
                ),
              ),
            ),
          ),
        );
      }
    }

    return buttons;
  }

  List<Widget> _getLeaderboardButtons() {
    List<Widget> buttons = [];

    if (yearlyData.containsKey(_selectedYear) &&
        yearlyData[_selectedYear]!.containsKey(_account)) {
      for (var index = 0; index < 3; index++) {
        // Check if the button is selected and set color accordingly
        bool isSelected = _selectedAvailability == Status.values[index];

        buttons.add(
          GestureDetector(
            onTap: () {
              setState(() {
                switch (index) {
                  case 0:
                    _selectedAvailability = Status.aanwezig;
                    break;
                  case 1:
                    _selectedAvailability = Status.misschien;
                    break;
                  case 2:
                    _selectedAvailability = Status.afwezig;
                    break;
                }
              });
            },
            child: Container(
              height: 35,
              padding:
                  const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
              decoration: BoxDecoration(
                color: isSelected
                    ? (index == 0
                        ? Colors.green
                        : index == 1
                            ? Colors.orange
                            : Colors.red)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(25.0),
              ),
              child: Text(
                index == 0
                    ? "Aanwezig"
                    : index == 1
                        ? "Misschien"
                        : "Afwezig",
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.black87,
                  fontSize: 14.0,
                ),
              ),
            ),
          ),
        );
      }
    }
    return buttons;
  }

  void _processData(List<Activity> activities) {
    yearlyData.clear();

    for (var activity in activities) {
      final year = activity.getStartDate.year;

      if (activity.availabilities != null &&
          activity.availabilities![activity.getStartDate] != null) {
        for (var availability
            in activity.availabilities![activity.getStartDate]!) {
          final account =
              availability.account ?? Account(firstName: 'Unknown user');
          final status = availability.status;

          if (!yearlyData.containsKey(year)) {
            yearlyData[year] = {};
          }

          if (!yearlyData[year]!.containsKey(account)) {
            yearlyData[year]![account] = {
              "aanwezig": 0,
              "misschien": 0,
              "afwezig": 0,
            };
          }

          if (status == Status.aanwezig) {
            yearlyData[year]![account]!["aanwezig"] =
                yearlyData[year]![account]!["aanwezig"]! + 1;
          } else if (status == Status.misschien) {
            yearlyData[year]![account]!["misschien"] =
                yearlyData[year]![account]!["misschien"]! + 1;
          } else if (status == Status.afwezig) {
            yearlyData[year]![account]!["afwezig"] =
                yearlyData[year]![account]!["afwezig"]! + 1;
          }
        }
      }
    }
  }

  List<BarChartGroupData> _getAccountBars() {
    if (!yearlyData[_selectedYear]!.containsKey(_account)) {
      return [];
    }

    final data = yearlyData[_selectedYear]![_account]!;
    const double barWidth = 20.0;

    return [
      BarChartGroupData(
        x: 0,
        barRods: [
          BarChartRodData(
            toY: data["aanwezig"]!.toDouble(),
            color: Colors.green,
            width: barWidth,
            borderRadius: BorderRadius.circular(8),
          )
        ],
      ),
      BarChartGroupData(
        x: 1,
        barRods: [
          BarChartRodData(
            toY: data["misschien"]!.toDouble(),
            color: Colors.orange,
            width: barWidth,
            borderRadius: BorderRadius.circular(8),
          )
        ],
      ),
      BarChartGroupData(
        x: 2,
        barRods: [
          BarChartRodData(
            toY: data["afwezig"]!.toDouble(),
            color: Colors.red,
            width: barWidth,
            borderRadius: BorderRadius.circular(8),
          )
        ],
      ),
    ];
  }

  List<BarChartGroupData> _getLeaderboardBars() {
    List<BarChartGroupData> barGroups = [];

    final accountsData = yearlyData[DateTime.now().toUtc().year] ?? {};

    int index = 0;
    accountsData.forEach((accountName, availability) {
      final count = availability[_selectedAvailability.name] ?? 0;

      barGroups.add(
        BarChartGroupData(
          x: index,
          barRods: [
            BarChartRodData(
              toY: count.toDouble(),
              color: _selectedAvailability == Status.aanwezig
                  ? Colors.green
                  : _selectedAvailability == Status.misschien
                      ? Colors.orange
                      : Colors.red,
              width: 20,
              borderRadius: BorderRadius.circular(8),
            ),
          ],
        ),
      );
      index++;
    });

    return barGroups;
  }

  List<String> _getLeaderboardLabel() {
    List<String> labels = [];
    if (yearlyData.containsKey(DateTime.now().toUtc().year)) {
      for (var account in yearlyData[DateTime.now().toUtc().year]!.keys) {
        labels.add(account.firstName ?? "");
      }
    }
    return labels;
  }
}
