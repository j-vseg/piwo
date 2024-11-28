import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/config/theme/size_setter.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/enums/status.dart';
import 'package:piwo/services/account.dart';
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
          body: SingleChildScrollView(
            child: Padding(
              padding: EdgeInsets.only(
                top: 0.0,
                left: SizeSetter.getHorizontalScreenPadding(),
                right: SizeSetter.getHorizontalScreenPadding(),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(15.0),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: _buildAvailabilityByYearChart(),
                    ),
                  ),
                  const SizedBox(height: 40),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(15.0),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: _buildAvailabilityByStatusChart(),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  void _processData(List<Activity> activities) {
    yearlyData.clear();

    for (var activity in activities) {
      final year = activity.getStartDate.year;

      if (activity.availabilities != null &&
          activity.availabilities![activity.getStartDate] != null) {
        for (var availability
            in activity.availabilities![activity.getStartDate]!) {
          final account = availability.account!;
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

  Widget _buildAvailabilityByYearChart() {
    if (!yearlyData.containsKey(_selectedYear) ||
        !yearlyData[_selectedYear]!.containsKey(_account)) {
      return const SizedBox.shrink();
    }

    return Column(
      children: [
        const Text(
          "Jouw aanwezigheid",
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 35,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: yearlyData.keys.length,
            itemBuilder: (context, index) {
              int year = yearlyData.keys.elementAt(index);

              if (yearlyData[year]?.containsKey(_account) ?? false) {
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8.0),
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _selectedYear = year;
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _selectedYear == year
                          ? CustomColors.themePrimary
                          : CustomColors.greyYellow,
                    ),
                    child: Text(year.toString()),
                  ),
                );
              } else {
                return const SizedBox.shrink();
              }
            },
          ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 175,
          child: BarChart(
            BarChartData(
              alignment: BarChartAlignment.spaceAround,
              barGroups: _buildBarGroupsForAccount(),
              titlesData: FlTitlesData(
                leftTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    interval: 5,
                    getTitlesWidget: (value, meta) {
                      return Text(
                        value.toInt().toString(),
                        style: const TextStyle(fontSize: 12),
                      );
                    },
                  ),
                ),
                bottomTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    getTitlesWidget: (value, meta) {
                      switch (value.toInt()) {
                        case 0:
                          return const Text("Aanwezig");
                        case 1:
                          return const Text("Misschien");
                        case 2:
                          return const Text("Afwezig");
                        default:
                          return const Text("");
                      }
                    },
                  ),
                ),
                topTitles:
                    const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                rightTitles:
                    const AxisTitles(sideTitles: SideTitles(showTitles: false)),
              ),
              borderData: FlBorderData(show: false),
            ),
          ),
        ),
      ],
    );
  }

  List<BarChartGroupData> _buildBarGroupsForAccount() {
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

  Widget _buildAvailabilityByStatusChart() {
    final thisYearsAvailabilityAccounts =
        yearlyData[DateTime.now().toUtc().year];
    if (thisYearsAvailabilityAccounts == null) {
      return const SizedBox();
    }

    double maxWidth = 20 * thisYearsAvailabilityAccounts.length + 300;

    return Column(
      children: [
        const Text(
          "Leaderboard",
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 35,
          child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 3,
              itemBuilder: (context, index) {
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() {
                        switch (index) {
                          case 0:
                            _selectedAvailability = Status.aanwezig;
                          case 1:
                            _selectedAvailability = Status.misschien;
                          case 2:
                            _selectedAvailability = Status.afwezig;
                        }
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: index == 0
                          ? Colors.green
                          : index == 1
                              ? Colors.orange
                              : Colors.red,
                    ),
                    child: Text(
                      index == 0
                          ? "Aanwezig"
                          : index == 1
                              ? "Misschien"
                              : "Afwezig",
                      style: const TextStyle(
                        color: Colors.black87,
                      ),
                    ),
                  ),
                );
              }),
        ),
        const SizedBox(height: 10),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: SizedBox(
            height: 300,
            width: maxWidth,
            child: BarChart(
              BarChartData(
                alignment: BarChartAlignment.spaceEvenly,
                barGroups: _getAccountBars(),
                titlesData: FlTitlesData(
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (value, meta) {
                        final accounts =
                            yearlyData[_selectedYear]?.keys.toList() ?? [];
                        if (value.toInt() < accounts.length) {
                          return Text(accounts[value.toInt()].firstName!);
                        }
                        return const Text('');
                      },
                    ),
                  ),
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      interval: 5,
                      getTitlesWidget: (value, meta) {
                        return Text(
                          value.toInt().toString(),
                          style: const TextStyle(fontSize: 12),
                        );
                      },
                    ),
                  ),
                  rightTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  topTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                ),
                gridData: const FlGridData(show: true),
                borderData: FlBorderData(show: false),
              ),
            ),
          ),
        ),
        const SizedBox(height: 10),
      ],
    );
  }

  List<BarChartGroupData> _getAccountBars() {
    List<BarChartGroupData> barGroups = [];

    final accountsData = yearlyData[_selectedYear] ?? {};

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
}
