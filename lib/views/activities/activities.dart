import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/config/theme/size_setter.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/enums/role.dart';
import 'package:piwo/services/account.dart';
import 'package:piwo/views/activity/edit_activity.dart';
import 'package:piwo/widgets/activity_overview.dart';
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
  Account _account = Account();
  DateTime _selectedDate = DateTime.now();
  CalendarFormat _calendarFormat = CalendarFormat.month;

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
      _account = (await AccountService().getMyAccount()).data!;
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
          appBar: AppBar(
            title: const Text(
              "Activiteiten",
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
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
          backgroundColor: Colors.white,
          bodyPadding:
              const Padding(padding: EdgeInsets.symmetric(horizontal: 0.0)),
          body: SingleChildScrollView(
            child: Column(
              children: [
                Container(
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    color: CustomColors.themeBackground,
                  ),
                  child: Column(
                    children: [
                      Padding(
                        padding: EdgeInsets.symmetric(
                          horizontal: SizeSetter.getHorizontalScreenPadding(),
                          vertical: 10.0,
                        ),
                        child: TableCalendar(
                          firstDay: DateTime.now()
                              .subtract(const Duration(days: 365)),
                          lastDay:
                              DateTime.now().add(const Duration(days: 365)),
                          startingDayOfWeek: StartingDayOfWeek.monday,
                          focusedDay: _selectedDate,
                          selectedDayPredicate: (day) {
                            return isSameDay(_selectedDate, day);
                          },
                          onDaySelected: (selectedDay, focusedDay) {
                            setState(() {
                              _calendarFormat = CalendarFormat.week;
                              _selectedDate = selectedDay;
                            });
                          },
                          calendarFormat: _calendarFormat,
                          locale: 'nl_NL',
                          availableCalendarFormats: const {
                            CalendarFormat.month: 'Maand',
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
                              if (groupedActivities
                                  .containsKey(normalizedDate)) {
                                final activitiesList =
                                    groupedActivities[normalizedDate];
                                return Align(
                                  alignment: Alignment.bottomCenter,
                                  child: _buildMarkers(activitiesList ?? [],
                                      _account.id ?? "", day),
                                );
                              }
                              return null;
                            },
                          ),
                          calendarStyle: const CalendarStyle(
                            selectedDecoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                            selectedTextStyle: TextStyle(
                              color: CustomColors.themePrimary,
                              fontWeight: FontWeight.bold,
                            ),
                            todayDecoration: BoxDecoration(
                              color: Colors.transparent,
                              shape: BoxShape.circle,
                            ),
                            todayTextStyle: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
                ActivityOverview(
                  activities: groupedActivities[DateTime(_selectedDate.year,
                          _selectedDate.month, _selectedDate.day)] ??
                      [],
                  selectedDate: _selectedDate,
                  account: _account,
                ),
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
      DateTime currentDay = DateTime(activity.getStartDate.year,
          activity.getStartDate.month, activity.getStartDate.day);
      DateTime endDay = DateTime(activity.getEndDateTimes.year,
          activity.getEndDateTimes.month, activity.getEndDateTimes.day);

      while (!currentDay.isAfter(endDay)) {
        if (!activitiesByDate.containsKey(currentDay)) {
          activitiesByDate[currentDay] = [];
        }
        activitiesByDate[currentDay]!.add(activity);
        currentDay = currentDay.add(const Duration(days: 1));
      }
    }

    return activitiesByDate;
  }

  Widget _buildMarkers(
      List<Activity> activities, String accountId, DateTime day) {
    List<Color> singleDayColors = [];
    List<Color> multiDayColors = [];
    List<Activity> singleDayActivities = [];
    List<Activity> multiDayActivities = [];

    for (var activity in activities) {
      bool isMultiDay = Activity.doesActivitySpanMultipleDays(activity);
      final color = activity.endDate!.isAfter(DateTime.now().toUtc())
          ? activity.getYourAvailability(activity.getStartDate, accountId) !=
                  null
              ? CustomColors.getAvailabilityColor(
                  activity
                      .getYourAvailability(activity.getStartDate, accountId)!
                      .status,
                  activity.category!,
                )
              : activity.color
          : Colors.grey;

      if (isMultiDay) {
        multiDayActivities.add(activity);
        multiDayColors.add(color);
      } else {
        singleDayActivities.add(activity);
        singleDayColors.add(color);
      }
    }

    return Center(
      child: Stack(
        children: [
          if (multiDayColors.isNotEmpty)
            Positioned(
              bottom: 6,
              left: 0,
              right: 0,
              child: Container(
                height: 3,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: multiDayColors,
                    stops: List.generate(multiDayColors.length,
                        (index) => index / multiDayColors.length.toDouble()),
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                  ),
                ),
              ),
            ),
          if (singleDayActivities.isNotEmpty)
            Positioned(
              bottom: 12,
              left: 0,
              right: 0,
              child: Center(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: List.generate(
                    singleDayActivities.length,
                    (index) {
                      return Container(
                        width: (1 / 4) * 50,
                        height: 3,
                        decoration: BoxDecoration(
                          color: singleDayColors[index],
                        ),
                      );
                    },
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
