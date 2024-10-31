import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/enums/month.dart';
import 'package:piwo/models/enums/role.dart';
import 'package:piwo/models/enums/weekday.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/views/activity/edit_activity.dart';
import 'package:piwo/widgets/activity.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:piwo/widgets/notifiers/availablity_notifier.dart';
import 'package:provider/provider.dart';
import 'package:table_calendar/table_calendar.dart';

class ActivitiesPage extends StatefulWidget {
  const ActivitiesPage({super.key});

  @override
  ActivitiesPageState createState() => ActivitiesPageState();
}

class ActivitiesPageState extends State<ActivitiesPage> {
  DateTime _selectedDate = DateTime.now();
  CalendarFormat _calendarFormat = CalendarFormat.month;
  Account _account = Account();

  @override
  void initState() {
    super.initState();
    _initializeDateFormatting();
    _initializeFutures();

    final activityProvider =
        Provider.of<ActivityProvider>(context, listen: false);
    activityProvider.fetchActivities();
  }

  void _initializeFutures() async {
    try {
      _account = await AccountService().getMyAccount();
    } catch (e) {
      debugPrint("Error fetching data: $e");
    } finally {
      setState(() {});
    }
  }

  Future<void> _initializeDateFormatting() async {
    try {
      await initializeDateFormatting('nl', null);
    } catch (e) {
      debugPrint("Error initializing date formatting: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ActivityProvider>(
      builder: (context, activityProvider, child) {
        final activities = activityProvider.activities;
        if (activities.isEmpty) {
          return const Center(child: CircularProgressIndicator());
        }

        final groupedActivities = _groupActivitiesByDay(activities);

        return CustomScaffold(
          floatingActionButton: _account.roles!.contains(Role.admin) ||
                  _account.roles!.contains(Role.beheerder)
              ? FloatingActionButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const EditActivityPage(
                          activity: null,
                        ),
                      ),
                    );
                  },
                  backgroundColor: CustomColors.themePrimary,
                  child: const Icon(Icons.add),
                )
              : null,
          body: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20.0),
                TableCalendar(
                  firstDay: DateTime.now().subtract(const Duration(days: 365)),
                  lastDay: DateTime.now().add(const Duration(days: 365)),
                  focusedDay: _selectedDate,
                  selectedDayPredicate: (day) {
                    return isSameDay(_selectedDate, day);
                  },
                  onDaySelected: (selectedDay, focusedDay) {
                    setState(() {
                      _selectedDate = selectedDay;
                    });
                  },
                  calendarFormat: _calendarFormat,
                  locale: 'nl_NL',
                  availableCalendarFormats: const {
                    CalendarFormat.month: 'Maand',
                    CalendarFormat.twoWeeks: '2 Weken',
                    CalendarFormat.week: 'Week',
                  },
                  onFormatChanged: (format) {
                    setState(() {
                      _calendarFormat = format;
                    });
                  },
                  calendarBuilders: CalendarBuilders(
                    markerBuilder: (context, day, events) {
                      final normalizedDate =
                          DateTime(day.year, day.month, day.day);
                      if (groupedActivities.containsKey(normalizedDate)) {
                        final activitiesList =
                            groupedActivities[normalizedDate];
                        return _buildMarkers(
                            activitiesList ?? [], _account.id ?? "", day);
                      }
                      return null;
                    },
                  ),
                  calendarStyle: CalendarStyle(
                    selectedDecoration: const BoxDecoration(
                      color: CustomColors.themePrimary,
                      shape: BoxShape.circle,
                    ),
                    todayDecoration: BoxDecoration(
                      color: CustomColors.themePrimary.withOpacity(0.5),
                      shape: BoxShape.circle,
                    ),
                    todayTextStyle: const TextStyle(
                      color: Colors.black,
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                _buildActivitiesForDay(
                    groupedActivities, _selectedDate, context, _account),
              ],
            ),
          ),
        );
      },
    );
  }

  Map<DateTime, List<Activity>> _groupActivitiesByDay(
      List<Activity> activities) {
    Map<DateTime, List<Activity>> activitiesByDate = {};

    for (var activity in activities) {
      DateTime activityDate = DateTime(activity.getStartDate.year,
          activity.getStartDate.month, activity.getStartDate.day);

      if (!activitiesByDate.containsKey(activityDate)) {
        activitiesByDate[activityDate] = [];
      }
      activitiesByDate[activityDate]!.add(activity);
    }

    return activitiesByDate;
  }

  Widget _buildActivitiesForDay(
    Map<DateTime, List<Activity>> activitiesByDay,
    DateTime selectedDate,
    BuildContext context,
    Account account,
  ) {
    DateTime selectedDay =
        DateTime(selectedDate.year, selectedDate.month, selectedDate.day);
    List<Activity>? activitiesThisDay = activitiesByDay[selectedDay];

    if (activitiesThisDay == null || activitiesThisDay.isEmpty) {
      return const Text(
        "Geen activiteiten op deze dag",
        style: TextStyle(fontSize: 18),
      );
    }

    activitiesThisDay.sort((a, b) => a.startDate!.compareTo(b.startDate!));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "${(Weekday.values[selectedDate.weekday - 1])}, ${selectedDay.day} ${Month.values[selectedDate.month - 1].name}",
          style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 20),
        ActivityWidget(activities: activitiesThisDay, account: account),
      ],
    );
  }

  Widget _buildMarkers(
      List<Activity> activities, String accountId, DateTime day) {
    List<Widget> markers = [];
    double markerSize = 7;
    double markerSpacing = 4;
    double totalWidth;

    if (activities.length >= 4) {
      totalWidth = 4 * markerSize + (4 - 1) * markerSpacing;
    } else {
      totalWidth = activities.length * markerSize +
          (activities.length - 1) * markerSpacing;
    }

    double startPosition = (50 - totalWidth) / 2;

    for (var activity in activities) {
      if (DateTime.now().isBefore(activity.getEndDateTimes)) {
        if (activity.getYourAvailability(activity.getStartDate, accountId) !=
            null) {
          markers.add(Positioned(
            bottom: 1,
            left: startPosition,
            child: Container(
              width: markerSize,
              height: markerSize,
              decoration: BoxDecoration(
                color: CustomColors.getAvailabilityColor(activity
                    .getYourAvailability(activity.getStartDate, accountId)!
                    .status),
                shape: BoxShape.circle,
              ),
            ),
          ));
        } else {
          markers.add(Positioned(
            bottom: 1,
            left: startPosition + markers.length * (markerSize + markerSpacing),
            child: Container(
              width: markerSize,
              height: markerSize,
              decoration: const BoxDecoration(
                color: CustomColors.themePrimary,
                shape: BoxShape.circle,
              ),
            ),
          ));
        }
      } else {
        markers.add(Positioned(
          bottom: 1,
          left: startPosition,
          child: Container(
            width: markerSize,
            height: markerSize,
            decoration: const BoxDecoration(
              color: Colors.grey,
              shape: BoxShape.circle,
            ),
          ),
        ));
      }
    }

    return Stack(
      children: markers,
    );
  }
}
