import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/enums/recurrance.dart';
import 'package:piwo/services/activity.dart';
import 'package:piwo/services/availability.dart';
import 'package:piwo/views/activity/edit_activity.dart';
import 'package:piwo/widgets/dialogs.dart';
import 'package:piwo/widgets/notifiers/availablity_notifier.dart';
import 'package:provider/provider.dart';
import 'package:piwo/models/account.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/availability.dart';
import 'package:piwo/models/enums/month.dart';
import 'package:piwo/models/enums/status.dart';
import 'package:piwo/models/enums/weekday.dart';

class ActivityPage extends StatefulWidget {
  const ActivityPage({
    super.key,
    required this.activity,
    required this.account,
  });

  final Activity activity;
  final Account account;

  @override
  ActivityPageState createState() => ActivityPageState();
}

class ActivityPageState extends State<ActivityPage> {
  Activity? _activity;
  Status _selectedStatus = Status.aanwezig;
  Status? _selectedStatusChange;

  @override
  void initState() {
    super.initState();

    _activity = widget.activity;
  }

  @override
  Widget build(BuildContext context) {
    final activityProvider = Provider.of<ActivityProvider>(context);

    if (_activity == null) {
      return const Center(child: CircularProgressIndicator());
    }

    Availability? yourAvailability = _activity!
        .getYourAvailability(_activity!.getStartDate, widget.account.id!);

    return Scaffold(
      appBar: AppBar(
        title: Text(_activity!.name!),
        backgroundColor: _activity!.color,
        elevation: 0,
        leading: IconButton(
          padding: EdgeInsets.zero,
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        actions: [
          PopupMenuButton<String>(
            padding: EdgeInsets.zero,
            icon: const Icon(Icons.more_vert, color: Colors.black),
            itemBuilder: (BuildContext context) {
              return [
                const PopupMenuItem<String>(
                  value: 'edit',
                  child: Text('Aanpassen'),
                ),
                if (_activity!.recurrence != Recurrence.geen) ...[
                  const PopupMenuItem<String>(
                    value: 'delete-only',
                    child: Text('Verwijder deze activiteit'),
                  ),
                ],
                const PopupMenuItem<String>(
                  value: 'delete',
                  child: Text('Verwijderen'),
                ),
              ];
            },
            onSelected: (value) async {
              if (value == 'edit') {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => EditActivityPage(
                      activity: _activity!,
                    ),
                  ),
                ).then((activity) {
                  if (activity != null) {
                    setState(() {
                      _activity = activity;
                    });
                  }
                });
              } else if (value == 'delete-only') {
                final result = await ActivityService().createExceptions(
                    _activity!.id ?? "", _activity!.getStartDate);
                if (result.isSuccess) {
                  if (!context.mounted) return;
                  SuccessDialog.showSuccessDialog(
                    context,
                    "Activiteit is verwijderd.",
                  );
                } else {
                  if (!context.mounted) return;
                  ErrorDialog.showErrorDialog(
                    context,
                    result.error ?? "Het is onduidelijk wat er mis is gegaan.",
                  );
                }
              } else if (value == 'delete') {
                final result =
                    await ActivityService().deleteActivity(_activity!.id ?? "");
                if (result.isSuccess) {
                  if (!context.mounted) return;
                  SuccessDialog.showSuccessDialogWithOnPressed(
                    context,
                    "Activiteit is verwijderd.",
                    () async {
                      await activityProvider
                          .deleteActivity(widget.activity.id ?? "");

                      if (!context.mounted) return;
                      Navigator.of(context).pop();
                    },
                  );
                } else {
                  if (!context.mounted) return;
                  ErrorDialog.showErrorDialog(
                    context,
                    result.error ?? "Het is onduidelijk wat er mis is gegaan.",
                  );
                }
              }
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _activity!.name ?? "",
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 2),
              Row(
                children: [
                  Icon(
                    Icons.category,
                    color: _activity!.color,
                    size: 16,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    _activity!.category.toString(),
                    style: const TextStyle(fontSize: 16, color: Colors.black87),
                  ),
                ],
              ),
              const SizedBox(height: 15),
              Row(
                children: [
                  const Icon(Icons.access_time, color: Colors.grey),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "${(Weekday.values[_activity!.startDate!.weekday - 1])}, ${_activity!.startDate!.day} ${Month.values[_activity!.startDate!.month - 1].name}",
                        style: const TextStyle(
                          fontSize: 16,
                          color: Colors.black87,
                        ),
                      ),
                      Text(
                        _activity!.getTimes,
                        style: const TextStyle(
                          fontSize: 15,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 10),
              if (widget.activity.location != null &&
                  widget.activity.location!.isNotEmpty) ...[
                Row(
                  children: [
                    const Icon(Icons.place, color: Colors.grey),
                    const SizedBox(width: 8),
                    Text(
                      _activity!.location!,
                      style:
                          const TextStyle(fontSize: 16, color: Colors.black87),
                    ),
                  ],
                ),
                const SizedBox(height: 15),
              ],
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
                    yourAvailability != null && yourAvailability.status != null
                        ? "Jij bent ${yourAvailability.status.toString()}"
                        : "Geen status opgegeven",
                    style: const TextStyle(fontSize: 16, color: Colors.black87),
                  ),
                ],
              ),
              if (!widget.activity.endDate!.isBefore(DateTime.now())) ...[
                TextButton(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (BuildContext context) {
                        return AlertDialog(
                          title: const Text('Aanpassen status'),
                          content: SingleChildScrollView(
                            child: StatefulBuilder(
                              builder:
                                  (BuildContext context, StateSetter setState) {
                                return Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    DropdownButton<Status>(
                                      hint: const Text("Selecteer een status"),
                                      value: _selectedStatusChange,
                                      items: [
                                        const DropdownMenuItem<Status>(
                                          value: null,
                                          child: Text(
                                            "Status verwijderen",
                                            style: TextStyle(
                                              fontSize: 18,
                                              color: Colors.grey,
                                            ),
                                          ),
                                        ),
                                        ...Status.values.map((Status status) {
                                          return DropdownMenuItem<Status>(
                                            value: status,
                                            child: Text(status.name),
                                          );
                                        }),
                                      ],
                                      onChanged: (Status? status) {
                                        setState(() {
                                          _selectedStatusChange = status;
                                        });
                                      },
                                    ),
                                  ],
                                );
                              },
                            ),
                          ),
                          actions: <Widget>[
                            TextButton(
                              onPressed: () {
                                Navigator.of(context).pop();
                              },
                              child: const Text('Cancel'),
                            ),
                            TextButton(
                              onPressed: () async {
                                final availability = Availability(
                                  account: widget.account,
                                  status: _selectedStatusChange,
                                );

                                await AvailabilityService().changeAvailability(
                                  _activity!.id!,
                                  _activity!.availabilities ?? {},
                                  _activity!.getStartDate,
                                  availability,
                                );

                                await activityProvider.changeAvailability(
                                  _activity!.id!,
                                  _activity!.getStartDate,
                                  availability,
                                );

                                setState(() {
                                  yourAvailability?.status =
                                      _selectedStatusChange;
                                });

                                if (!context.mounted) return;
                                Navigator.of(context).pop();
                              },
                              child: const Text('Aanpassen'),
                            ),
                          ],
                        );
                      },
                    );
                  },
                  child: const Text('Status aanpassen'),
                ),
              ],
              const SizedBox(height: 16),
              const Divider(),
              const SizedBox(height: 10),
              const Text(
                'Aanwezigheid',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedStatus = Status.aanwezig;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          vertical: 8.0, horizontal: 16.0),
                      decoration: BoxDecoration(
                        color: _selectedStatus == Status.aanwezig
                            ? Colors.green
                            : Colors.grey[300],
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: const Text("Aanwezig"),
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedStatus = Status.misschien;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          vertical: 8.0, horizontal: 16.0),
                      decoration: BoxDecoration(
                        color: _selectedStatus == Status.misschien
                            ? Colors.orange
                            : Colors.grey[300],
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: const Text("Misschien"),
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedStatus = Status.afwezig;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          vertical: 8.0, horizontal: 16.0),
                      decoration: BoxDecoration(
                        color: _selectedStatus == Status.afwezig
                            ? Colors.red
                            : Colors.grey[300],
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: const Text("Afwezig"),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              if (_activity!.availabilities != null) ...[
                _buildOverviewSection(
                    _activity!.availabilities![_activity!.getStartDate]),
              ] else ...[
                _buildOverviewSection([]),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOverviewSection(List<Availability>? availabilities) {
    List<String> people = [];
    List<String> aanwezig = [];
    List<String> misschien = [];
    List<String> afwezig = [];

    if (availabilities != null) {
      for (var availability in availabilities) {
        if (availability.status != null) {
          if (availability.status! == Status.aanwezig) {
            aanwezig.add(availability.account!.getFullName);
          } else if (availability.status! == Status.misschien) {
            misschien.add(availability.account!.getFullName);
          } else {
            afwezig.add(availability.account!.getFullName);
          }
        }
      }
    }

    if (_selectedStatus == Status.aanwezig) {
      people = aanwezig;
    } else if (_selectedStatus == Status.misschien) {
      people = misschien;
    } else if (_selectedStatus == Status.afwezig) {
      people = afwezig;
    }

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 15),
          if (people.isEmpty) ...[
            const Text(
              'Geen mensen geregistreerd',
              style: TextStyle(
                fontSize: 16,
                color: Colors.black87,
              ),
            )
          ] else ...[
            ListView.builder(
              physics: const NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: people.length,
              itemBuilder: (context, index) {
                final person = people[index];
                return ListTile(
                  leading: const Icon(Icons.person),
                  title: Text(
                    person,
                    style: const TextStyle(
                      fontSize: 16,
                      color: Colors.black87,
                    ),
                  ),
                );
              },
            ),
          ],
        ],
      ),
    );
  }
}
