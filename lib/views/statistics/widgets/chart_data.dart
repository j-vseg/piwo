import 'package:flutter/material.dart';
import 'package:piwo/models/account.dart';

class ChartDataWidget extends StatefulWidget {
  const ChartDataWidget({
    super.key,
    required this.selectedButton,
    this.leaderboardChartData,
    this.accountChartData,
  });

  final Map<Account, Map<String, int>>? leaderboardChartData;
  final Map<String, int>? accountChartData;
  final String selectedButton;

  @override
  ChartDataWidgetState createState() => ChartDataWidgetState();
}

class ChartDataWidgetState extends State<ChartDataWidget> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.leaderboardChartData != null) {
      // Sort leaderboard data by the selected button's value
      final sortedLeaderboard = widget.leaderboardChartData!.entries.toList()
        ..sort((a, b) => (b.value[widget.selectedButton] ?? 0)
            .compareTo(a.value[widget.selectedButton] ?? 0));

      return Column(
        children: [
          for (var i = 0; i < sortedLeaderboard.length; i++) ...[
            Material(
              child: ListTile(
                leading: Text("#${i + 1}"),
                title: Text(sortedLeaderboard[i].key.firstName),
                trailing: Text(sortedLeaderboard[i]
                    .value[widget.selectedButton]
                    .toString()),
                tileColor: _getColor(i),
              ),
            ),
          ]
        ],
      );
    } else if (widget.accountChartData != null) {
      // Sort account data by availability values
      final sortedAvailability = widget.accountChartData!.entries.toList()
        ..sort((a, b) => b.value.compareTo(a.value));

      return Column(
        children: [
          for (var i = 0; i < sortedAvailability.length; i++) ...[
            Material(
              child: ListTile(
                leading: Text("#${i + 1}"),
                title: Text(
                  sortedAvailability[i].key.substring(0, 1).toUpperCase() +
                      sortedAvailability[i].key.substring(1),
                ),
                trailing: Text(sortedAvailability[i].value.toString()),
                tileColor: _getColor(i),
              ),
            ),
          ]
        ],
      );
    } else {
      return const SizedBox();
    }
  }

  Color _getColor(int number) {
    switch (number) {
      case 0:
        return const Color(0xFFFFD700).withOpacity(0.3);
      case 1:
        return const Color(0xFFC0C0C0).withOpacity(0.3);
      case 2:
        return const Color(0xFFCD7F32).withOpacity(0.3);
      default:
        return Colors.white;
    }
  }
}
