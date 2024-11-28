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
          body: Column(
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
                        firstDay:
                            DateTime.now().subtract(const Duration(days: 365)),
                        lastDay: DateTime.now().add(const Duration(days: 365)),
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
                            if (groupedActivities.containsKey(normalizedDate)) {
                              final activitiesList =
                                  groupedActivities[normalizedDate];
                              return _buildMarkers(
                                  activitiesList ?? [], _account.id ?? "", day);
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
