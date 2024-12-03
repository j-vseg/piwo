import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/config/theme/size_setter.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/availability.dart';
import 'package:piwo/models/enums/month.dart';
import 'package:piwo/models/enums/status.dart';
import 'package:piwo/models/enums/weekday.dart';
import 'package:piwo/services/availability.dart';
import 'package:piwo/views/activities/widgets/inverted_rounded_corners.dart';
import 'package:piwo/views/activity/activity.dart';
import 'package:piwo/widgets/notifiers/availablity_notifier.dart';
import 'package:provider/provider.dart';

class ActivityOverview extends StatefulWidget {
  const ActivityOverview({
    super.key,
    required this.activities,
    required this.account,
    this.selectedDate,
    this.title,
    this.description,
  });

  final List<Activity> activities;
  final Account account;
  final DateTime? selectedDate;
  final String? title;
  final String? description;

  @override
  State<ActivityOverview> createState() => _ActivityOverviewState();
}

class _ActivityOverviewState extends State<ActivityOverview> {
  // ignore: unused_field
  Status? _selectedStatus;

  @override
  Widget build(BuildContext context) {
    widget.activities.sort((a, b) => a.getStartDate.compareTo(b.getStartDate));
    final activityProvider = Provider.of<ActivityProvider>(context);

    return CustomPaint(
      size: MediaQuery.of(context).size,
      painter: InvertedRoundedRectanglePainter(
        color: Colors.white,
        radius: 35,
        backgroundColor: CustomColors.themeBackground,
      ),
      child: SizedBox(
        width: double.infinity,
        child: Padding(
          padding: EdgeInsets.only(
            left: SizeSetter.getHorizontalScreenPadding(),
            right: SizeSetter.getHorizontalScreenPadding(),
            bottom: SizeSetter.getHorizontalScreenPadding(),
            top: 25.0,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (widget.selectedDate != null) ...[
                Text(
                  "${(Weekday.values[widget.selectedDate!.weekday - 1])}, ${widget.selectedDate!.day} ${Month.values[widget.selectedDate!.month - 1].name}",
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
              if (widget.title != null && widget.description != null) ...[
                Text(
                  widget.title!,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  widget.description!,
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.grey,
                  ),
                ),
              ],
              const SizedBox(height: 20),
              ...widget.activities.isEmpty
                  ? [
                      const Text(
                        "Geen activiteiten.",
                        style: TextStyle(fontSize: 16),
                      ),
                    ]
                  : widget.activities.map(
                      (activity) {
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
                              borderRadius:
                                  const BorderRadius.all(Radius.circular(20)),
                              color: CustomColors.getActivityBackgroundColor(
                                  activity.category!),
                            ),
                            margin: const EdgeInsets.symmetric(
                                vertical: 5, horizontal: 10),
                            padding: const EdgeInsets.symmetric(
                                vertical: 5, horizontal: 5),
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
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.category,
                                        color: activity.color,
                                        size: 14,
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        activity.category.toString(),
                                        style: const TextStyle(
                                          fontSize: 14,
                                          color: Colors.black87,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    activity.getFullDate,
                                    style: const TextStyle(fontSize: 16),
                                  ),
                                  const SizedBox(height: 10),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceAround,
                                    children: [
                                      GestureDetector(
                                        onTap: () {
                                          _updateAvailability(activityProvider,
                                              Status.aanwezig, activity);
                                        },
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 8.0, horizontal: 16.0),
                                          decoration: BoxDecoration(
                                            color: CustomColors
                                                .getActivityButtonColor(
                                              Status.aanwezig,
                                              yourAvailability,
                                              activityHasBeen,
                                              activity.category!,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(8.0),
                                          ),
                                          child: const Text("Aanwezig"),
                                        ),
                                      ),
                                      GestureDetector(
                                        onTap: () {
                                          _updateAvailability(activityProvider,
                                              Status.misschien, activity);
                                        },
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 8.0, horizontal: 16.0),
                                          decoration: BoxDecoration(
                                            color: CustomColors
                                                .getActivityButtonColor(
                                              Status.misschien,
                                              yourAvailability,
                                              activityHasBeen,
                                              activity.category!,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(8.0),
                                          ),
                                          child: const Text("Misschien"),
                                        ),
                                      ),
                                      GestureDetector(
                                        onTap: () {
                                          _updateAvailability(activityProvider,
                                              Status.afwezig, activity);
                                        },
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 8.0, horizontal: 16.0),
                                          decoration: BoxDecoration(
                                            color: CustomColors
                                                .getActivityButtonColor(
                                              Status.afwezig,
                                              yourAvailability,
                                              activityHasBeen,
                                              activity.category!,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(8.0),
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
                      },
                    ),
            ],
          ),
        ),
      ),
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
