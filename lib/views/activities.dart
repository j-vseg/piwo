import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/enums/month.dart';
import 'package:piwo/models/enums/weekday.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/services/activity.dart';
import 'package:piwo/widgets/activity.dart';
import 'package:table_calendar/table_calendar.dart';

class ActivitiesPage extends StatefulWidget {
  const ActivitiesPage({super.key});

  @override
  ActivitiesPageState createState() => ActivitiesPageState();
}

class ActivitiesPageState extends State<ActivitiesPage> {
  List<Activity> _activities = [];
  Account _account = Account();
  DateTime _selectedDate = DateTime.now();
  Map<DateTime, List<Activity>> _groupedActivities = {};
  CalendarFormat _calendarFormat = CalendarFormat.month;

  void _initializeFutures() async {
    try {
      _activities = await ActivityService().getAllActivities();
      _account = await AccountService().getMyAccount();
      _groupedActivities = _groupActivitiesByDay(_activities);
    } catch (e) {
      debugPrint("Error fetching data: $e");
    } finally {
      setState(() {});
    }
  }

  @override
  void initState() {
    super.initState();
    _initializeFutures();
    _initializeDateFormatting();
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
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 20.0),
          Column(
            children: [
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
                    if (_groupedActivities.containsKey(normalizedDate)) {
                      final activitiesList = _groupedActivities[normalizedDate];
                      return buildMarkers(
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
              buildActivitiesForDay(
                  _groupedActivities, _selectedDate, context, _account),
            ],
          ),
        ],
      ),
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

  Widget buildActivitiesForDay(
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

  Widget buildMarkers(
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

    List<Activity> otherActivities = [];

    for (var activity in activities) {
      otherActivities.add(activity);
    }

    if (DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day)
        .isBefore(day)) {
      for (var i = 0; i < otherActivities.length; i++) {
        if (markers.length >= 4) break;

        markers.add(Positioned(
          bottom: 1,
          left: startPosition + markers.length * (markerSize + markerSpacing),
          child: Container(
            width: markerSize,
            height: markerSize,
            decoration: BoxDecoration(
              color: otherActivities[i].color,
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

    return Stack(
      children: markers,
    );
  }
}
