import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/enums/month.dart';
import 'package:piwo/models/enums/weekday.dart';
import 'package:piwo/models/services/account_service.dart';
import 'package:piwo/models/services/activity_service.dart';
import 'package:piwo/models/services/auth_service.dart';
import 'package:table_calendar/table_calendar.dart';

class ActivitiesPage extends StatefulWidget {
  const ActivitiesPage({super.key});

  @override
  ActivitiesPageState createState() => ActivitiesPageState();
}

class ActivitiesPageState extends State<ActivitiesPage> {
  late Future<List<Activity>> activitiesFuture;
  late Future<Account> accountFuture;
  late DateTime selectedDate;
  late Map<DateTime, List<Activity>> groupedActivities;
  CalendarFormat _calendarFormat = CalendarFormat.month;

  void _initializeFutures() async {
    activitiesFuture = ActivityService().getAllActivitiesFromDatabase();

    final accountId = await AuthService().getUserUID();
    accountFuture = AccountService().getAccountById(accountId ?? "");

    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    selectedDate = DateTime.now();
    groupedActivities = {};

    _initializeFutures();
    _initializeDateFormatting();
  }

  Future<void> _initializeDateFormatting() async {
    await initializeDateFormatting('nl', '');
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 20.0),
          FutureBuilder<List<Activity>>(
              future: activitiesFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const CircularProgressIndicator();
                } else if (snapshot.hasData) {
                  final activities = snapshot.data!;
                  groupedActivities = _groupActivitiesByDay(activities);

                  return FutureBuilder<Account>(
                    future: accountFuture,
                    builder: (context, accountSnapshot) {
                      if (accountSnapshot.connectionState ==
                          ConnectionState.waiting) {
                        return const Center(child: CircularProgressIndicator());
                      } else if (accountSnapshot.hasData) {
                        final account = accountSnapshot.data;
                        return Column(
                          children: [
                            TableCalendar(
                              firstDay: DateTime.now()
                                  .subtract(const Duration(days: 365)),
                              lastDay:
                                  DateTime.now().add(const Duration(days: 365)),
                              focusedDay: selectedDate,
                              selectedDayPredicate: (day) {
                                return isSameDay(selectedDate, day);
                              },
                              onDaySelected: (selectedDay, focusedDay) {
                                setState(() {
                                  selectedDate = selectedDay;
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
                                  if (groupedActivities.containsKey(
                                      DateTime(day.year, day.month, day.day))) {
                                    final activitiesList = groupedActivities[
                                        DateTime(day.year, day.month, day.day)];
                                    return buildMarkers(activitiesList ?? [],
                                        account!.id ?? "", day);
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
                                  color: CustomColors.themePrimary
                                      .withOpacity(0.5),
                                  shape: BoxShape.circle,
                                ),
                                todayTextStyle: const TextStyle(
                                  color: Colors.black,
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),
                            buildActivitiesForDay(groupedActivities,
                                selectedDate, context, account!),
                          ],
                        );
                      } else {
                        return const Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Text(
                            "Geen account data beschikbaar",
                            style: TextStyle(
                              fontSize: 18,
                            ),
                          ),
                        );
                      }
                    },
                  );
                } else {
                  return const Text(
                    "Geen activiteiten beschikbaar",
                    style: TextStyle(
                      fontSize: 18,
                    ),
                  );
                }
              }),
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

  Widget buildActivitiesForDay(Map<DateTime, List<Activity>> activitiesByDay,
      DateTime selectedDate, BuildContext context, Account account) {
    DateTime selectedDay =
        DateTime(selectedDate.year, selectedDate.month, selectedDate.day);

    List<Activity>? activitiesThisDay = activitiesByDay[selectedDay];
    DateTime? dateOfActivity;

    if (activitiesThisDay == null || activitiesThisDay.isEmpty) {
      return const Text(
        "Geen activiteiten op deze dag",
        style: TextStyle(fontSize: 18),
      );
    }
    activitiesThisDay.sort((a, b) => a.startDate!.compareTo(b.startDate!));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: activitiesThisDay.map((activity) {
        final index = activitiesThisDay.indexOf(activity);

        bool showDateHeader = dateOfActivity != activity.getStartDate;
        if (showDateHeader) {
          dateOfActivity = activity.getStartDate;
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (showDateHeader) ...[
              const SizedBox(height: 10.0),
              Text(
                "${(Weekday.values[activity.getStartDate.weekday - 1])}, ${activity.getStartDate.day} ${Month.values[activity.getStartDate.month - 1].name}",
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
            InkWell(
              onTap: () {
                // TODO: Navigate to activity page
                // Navigator.push(
                //   context,
                //   MaterialPageRoute(
                //     builder: (context) =>
                //         ActivityPage(activityId: activity.getId),
                //   ),
                // );
              },
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.all(Radius.circular(20)),
                  color: Color(int.parse(CustomColors.getActivityColor(index))),
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
                        style: const TextStyle(
                          fontSize: 18,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        );
      }).toList(),
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
            decoration: const BoxDecoration(
              color: CustomColors.activityPrimairyColorGreen,
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
