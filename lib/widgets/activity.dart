import 'package:flutter/material.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/enums/status.dart';
import 'package:piwo/views/activity.dart';

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
        final yourAvailibilty = activity.getYourAvailibilty(widget.account.id!);

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
                  Row(
                    children: [
                      if (yourAvailibilty != null &&
                          yourAvailibilty.status != null) ...[
                        if (yourAvailibilty.status == Status.aanwezig) ...[
                          const Icon(Icons.check_circle, color: Colors.green),
                        ] else if (yourAvailibilty.status ==
                            Status.misschien) ...[
                          const Icon(Icons.help, color: Colors.orange),
                        ] else ...[
                          const Icon(Icons.cancel, color: Colors.red),
                        ]
                      ] else ...[
                        const Icon(Icons.help, color: Colors.grey),
                      ],
                      const SizedBox(width: 8),
                      Text(
                        yourAvailibilty != null &&
                                yourAvailibilty.status != null
                            ? "Jij bent ${yourAvailibilty.status.toString()}"
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
