import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';

class BarChartWidget extends StatefulWidget {
  const BarChartWidget({
    super.key,
    required this.chartData,
    required this.labels,
    this.buttons,
  });

  @override
  BarChartWidgetState createState() => BarChartWidgetState();

  final List<BarChartGroupData> chartData;
  final List<String> labels;
  final List<Widget>? buttons;
}

class BarChartWidgetState extends State<BarChartWidget> {
  final ScrollController _scrollController = ScrollController();

  @override
  Widget build(BuildContext context) {
    if (widget.chartData.isEmpty) {
      return const SizedBox(
        height: 300,
        child: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    final sortedChartData = List<BarChartGroupData>.from(widget.chartData)
      ..sort((a, b) => b.barRods.first.toY.compareTo(a.barRods.first.toY));

    return Column(
      children: [
        if (widget.buttons != null && widget.buttons!.isNotEmpty) ...[
          Container(
            decoration: BoxDecoration(
              color: CustomColors.background200,
              borderRadius: BorderRadius.circular(25.0),
            ),
            padding: const EdgeInsets.all(8.0),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                for (var button in widget.buttons!)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0),
                    child: button,
                  ),
              ],
            ),
          ),
          const SizedBox(height: 15),
        ],
        LayoutBuilder(
          builder: (context, constraints) {
            double availableWidth = constraints.maxWidth;
            double barWidth = 18;
            double chartHeight = 300;
            double chartWidth = (barWidth + 40) * widget.chartData.length;
            double totalChartWidth =
                chartWidth < availableWidth ? availableWidth : chartWidth;

            return SizedBox(
              height: chartHeight,
              child: Scrollbar(
                controller: _scrollController,
                thickness: 8,
                radius: const Radius.circular(10),
                thumbVisibility: true,
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: SingleChildScrollView(
                    controller: _scrollController,
                    scrollDirection: Axis.horizontal,
                    child: SizedBox(
                      width: totalChartWidth,
                      child: BarChart(
                        BarChartData(
                          alignment: BarChartAlignment.spaceEvenly,
                          barGroups: sortedChartData.map((group) {
                            return group.copyWith(
                              barRods: group.barRods.map((rod) {
                                return rod.copyWith(width: barWidth);
                              }).toList(),
                            );
                          }).toList(),
                          titlesData: FlTitlesData(
                            leftTitles: AxisTitles(
                              sideTitles: SideTitles(
                                showTitles: true,
                                interval: 5,
                                getTitlesWidget: (value, meta) {
                                  return Text(value.toInt().toString());
                                },
                              ),
                            ),
                            bottomTitles: AxisTitles(
                              sideTitles: SideTitles(
                                showTitles: true,
                                getTitlesWidget: (value, meta) {
                                  return Text(
                                    widget.labels[value.toInt()],
                                    style: const TextStyle(fontSize: 12),
                                  );
                                },
                              ),
                            ),
                            topTitles: const AxisTitles(
                                sideTitles: SideTitles(showTitles: false)),
                            rightTitles: const AxisTitles(
                                sideTitles: SideTitles(showTitles: false)),
                          ),
                          borderData: FlBorderData(show: false),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}
