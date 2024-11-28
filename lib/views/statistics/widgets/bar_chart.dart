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
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (widget.buttons != null && widget.buttons!.isNotEmpty) ...[
          Container(
            decoration: BoxDecoration(
              color: CustomColors.background200,
              borderRadius: BorderRadius.circular(25.0),
            ),
            child: Padding(
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
          ),
          const SizedBox(height: 15),
        ],
        SizedBox(
          height: 300,
          child: BarChart(
            BarChartData(
              alignment: BarChartAlignment.spaceAround,
              barGroups: widget.chartData,
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
                      return Text(widget.labels[value.toInt()]);
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
}
