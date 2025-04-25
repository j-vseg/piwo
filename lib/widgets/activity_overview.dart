import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/config/theme/size_setter.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/availability.dart';
import 'package:piwo/models/enums/category.dart';
import 'package:piwo/models/enums/month.dart';
import 'package:piwo/models/enums/status.dart';
import 'package:piwo/models/enums/weekday.dart';
import 'package:piwo/services/availability.dart';
import 'package:piwo/views/activities/widgets/inverted_rounded_corners.dart';
import 'package:piwo/views/activity/activity.dart';

class ActivityOverview extends StatefulWidget {
  const ActivityOverview({
    super.key,
    required this.activities,
    required this.account,
    this.selectedDate,
    this.title,
    this.description,
    this.onAvailabilityChanged,
  });

  final List<Activity> activities;
  final Account account;
  final DateTime? selectedDate;
  final String? title;
  final String? description;
  final void Function()? onAvailabilityChanged;

  @override
  State<ActivityOverview> createState() => _ActivityOverviewState();
}

class _ActivityOverviewState extends State<ActivityOverview> {
  Future<Availability?> _fetchAvailability(Activity activity) async {
    try {
      return await activity.getYourAvailability(
          activity.getStartDate, widget.account.id);
    } catch (e) {
      debugPrint("Error fetching availability: $e");
      return null;
    }
  }

  Future<void> _handleAvailabilityChange(
    Status status,
    Activity activity,
  ) async {
    if (!activity.endDate.isBefore(DateTime.now().toUtc())) {
      // Create new availability object
      final availability = Availability(
        account:
            FirebaseFirestore.instance.doc('accounts/${widget.account.id}'),
        status: status,
      );

      // Save availability to Firestore and get ID
      final id = await AvailabilityService().changeAvailability(
        availability,
        activity.id,
        activity.getStartDate,
      );
      final newRef = FirebaseFirestore.instance.doc('availabilities/$id');

      // Ensure map & list are initialized
      activity.availabilities ??= {};
      activity.availabilities!.putIfAbsent(activity.getStartDate, () => []);

      // Replace existing availability if account already exists
      List<DocumentReference> updatedRefs = activity
          .availabilities![activity.getStartDate]!
          .where((ref) => ref.id != id)
          .toList();

      // Add the new availability reference
      updatedRefs.add(newRef);

      // Update the map with the new list
      activity.availabilities![activity.getStartDate] = updatedRefs;

      // Save updated activity
      if (activity.availabilities != null) {
        await AvailabilityService().addAvailabilityToActivity(
            activity.id, activity.availabilities ?? {});
      }

      // Refresh UI
      if (widget.onAvailabilityChanged != null) {
        widget.onAvailabilityChanged!();
      }
      setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
    // Don't mutate widget.activities directly
    final sortedActivities = [...widget.activities]
      ..sort((a, b) => a.getStartDate.compareTo(b.getStartDate));

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
                  "${Weekday.values[widget.selectedDate!.weekday - 1]} ${widget.selectedDate!.day} ${Month.values[widget.selectedDate!.month - 1].name}",
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
              if (sortedActivities.isEmpty)
                const Text(
                  "Geen activiteiten op deze dag.",
                  style: TextStyle(fontSize: 16),
                )
              else
                ...sortedActivities.map((activity) {
                  final activityHasBeen =
                      activity.endDate.isBefore(DateTime.now().toUtc());

                  return FutureBuilder<Availability?>(
                    future: _fetchAvailability(activity),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(child: CircularProgressIndicator());
                      }

                      if (snapshot.hasError) {
                        return const Text("Fout bij laden van beschikbaarheid");
                      }

                      final yourAvailability = snapshot.data;

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
                                activity.category),
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
                                  activity.name,
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
                                    _buildAvailabilityButton(
                                      status: Status.aanwezig,
                                      current: yourAvailability,
                                      hasPassed: activityHasBeen,
                                      category: activity.category,
                                      onTap: () => _handleAvailabilityChange(
                                          Status.aanwezig, activity),
                                    ),
                                    _buildAvailabilityButton(
                                      status: Status.misschien,
                                      current: yourAvailability,
                                      hasPassed: activityHasBeen,
                                      category: activity.category,
                                      onTap: () => _handleAvailabilityChange(
                                          Status.misschien, activity),
                                    ),
                                    _buildAvailabilityButton(
                                      status: Status.afwezig,
                                      current: yourAvailability,
                                      hasPassed: activityHasBeen,
                                      category: activity.category,
                                      onTap: () => _handleAvailabilityChange(
                                          Status.afwezig, activity),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  );
                }),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAvailabilityButton({
    required Status status,
    required Availability? current,
    required bool hasPassed,
    required Category category,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
        decoration: BoxDecoration(
          color: CustomColors.getActivityButtonColor(
              status, current, hasPassed, category),
          borderRadius: BorderRadius.circular(8.0),
        ),
        child: Text(status.name),
      ),
    );
  }
}
