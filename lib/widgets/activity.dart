import 'package:flutter/material.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/availability.dart';
import 'package:piwo/models/enums/status.dart';
import 'package:piwo/services/availability.dart';
import 'package:piwo/views/activity/activity.dart';
import 'package:piwo/widgets/notifiers/availablity_notifier.dart';
import 'package:provider/provider.dart';

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
  // ignore: unused_field
  Status? _selectedStatus;

  @override
  Widget build(BuildContext context) {
    widget.activities.sort((a, b) => a.getStartDate.compareTo(b.getStartDate));
    final activityProvider = Provider.of<ActivityProvider>(context);

    return Column(
      children: widget.activities.map((activity) {
        final yourAvailability = activity.getYourAvailability(
            activity.getStartDate, widget.account.id!);
        _selectedStatus = yourAvailability?.status;
        final activityHasBeen =
            activity.endDate!.isBefore(DateTime.now().toUtc());

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
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    activity.getFullDate,
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      GestureDetector(
                        onTap: () {
                          _updateAvailability(
                              activityProvider, Status.aanwezig, activity);
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              vertical: 8.0, horizontal: 16.0),
                          decoration: BoxDecoration(
                            color: !activityHasBeen
                                ? yourAvailability != null &&
                                        yourAvailability.status ==
                                            Status.aanwezig
                                    ? Colors.green
                                    : Colors.grey[300]
                                : yourAvailability != null &&
                                        yourAvailability.status ==
                                            Status.aanwezig
                                    ? Colors.grey
                                    : Colors.grey[300],
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          child: const Text("Aanwezig"),
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          _updateAvailability(
                              activityProvider, Status.misschien, activity);
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              vertical: 8.0, horizontal: 16.0),
                          decoration: BoxDecoration(
                            color: !activityHasBeen
                                ? yourAvailability != null &&
                                        yourAvailability.status ==
                                            Status.misschien
                                    ? Colors.orange
                                    : Colors.grey[300]
                                : yourAvailability != null &&
                                        yourAvailability.status ==
                                            Status.misschien
                                    ? Colors.grey
                                    : Colors.grey[300],
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          child: const Text("Misschien"),
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          _updateAvailability(
                              activityProvider, Status.afwezig, activity);
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              vertical: 8.0, horizontal: 16.0),
                          decoration: BoxDecoration(
                            color: !activityHasBeen
                                ? yourAvailability != null &&
                                        yourAvailability.status ==
                                            Status.afwezig
                                    ? Colors.red
                                    : Colors.grey[300]
                                : yourAvailability != null &&
                                        yourAvailability.status ==
                                            Status.afwezig
                                    ? Colors.grey
                                    : Colors.grey[300],
                            borderRadius: BorderRadius.circular(8.0),
                          ),
                          child: const Text("Afwezig"),
                        ),
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

  void _updateAvailability(
    ActivityProvider activityProvider,
    Status status,
    Activity activity,
  ) async {
    if (!activity.endDate!.isBefore(DateTime.now().toUtc())) {
      final availability = Availability(
        account: widget.account,
        status: status,
      );

      await AvailabilityService().changeAvailability(
        activity.id!,
        activity.availabilities ?? {},
        activity.getStartDate,
        availability,
      );

      await activityProvider.changeAvailability(
        activity.id!,
        activity.getStartDate,
        availability,
      );

      setState(() {
        _selectedStatus = status;
      });
    }
  }
}
