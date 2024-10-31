import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/enums/status.dart';
import 'package:piwo/views/activity/activity.dart';

class ActivityWidget extends StatefulWidget {
  const ActivityWidget({
    super.key,
    required this.activities,
    required this.account,
  });

  final List<Activity> activities;
  final Account account;

  @override
  State<ActivityWidget> createState() => _ActivityWidgetState();
}

class _ActivityWidgetState extends State<ActivityWidget> {
  @override
  Widget build(BuildContext context) {
    widget.activities.sort((a, b) => a.getStartDate.compareTo(b.getStartDate));

    return Column(
      children: widget.activities.map((activity) {
        final yourAvailability = activity.getYourAvailability(
            activity.getStartDate, widget.account.id!);

        return InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => ActivityPage(
                  activity: activity,
                  account: widget.account,
                ),
              ),
            );
          },
          child: Container(
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.all(Radius.circular(20)),
              color: activity.color,
            ),
            margin: const EdgeInsets.symmetric(vertical: 5, horizontal: 10),
            padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 5),
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
                  Row(
                    children: [
                      Icon(
                        yourAvailability != null
                            ? yourAvailability.status == Status.aanwezig
                                ? Icons.check_circle
                                : yourAvailability.status == Status.misschien
                                    ? Icons.help
                                    : Icons.cancel
                            : Icons.help,
                        color: yourAvailability != null
                            ? CustomColors.getAvailabilityColor(
                                yourAvailability.status)
                            : Colors.grey,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        yourAvailability != null &&
                                yourAvailability.status != null
                            ? "Jij bent ${yourAvailability.status.toString()}"
                            : "Geen status opgegeven",
                        style: const TextStyle(
                            fontSize: 16, color: Colors.black87),
                      ),
                    ],
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
