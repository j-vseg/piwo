import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/enums/recurrance.dart';
import 'package:piwo/services/account.dart';
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

// ... your imports remain unchanged

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
  Status? _selectedStatus;
  Status _selectedStatusOverview = Status.aanwezig;

  final List<String> _aanwezig = [];
  final List<String> _misschien = [];
  final List<String> _afwezig = [];

  @override
  void initState() {
    super.initState();
    _buildAvailabilities(
        widget.activity.availabilities?[widget.activity.getStartDate]);
  }

  Future<void> _buildAvailabilities(
      List<DocumentReference>? availabilities) async {
    _aanwezig.clear();
    _misschien.clear();
    _afwezig.clear();

    if (availabilities != null) {
      for (var availabilityRef in availabilities) {
        var availability =
            await AvailabilityService().getAvailability(availabilityRef.id);
        if (availability != null) {
          final account =
              (await AccountService().getAccountById(availability.account.id))
                      .data ??
                  Account(firstName: 'Unknown user');
          if (availability.status == Status.aanwezig) {
            _aanwezig.add(account.getFullName);
          } else if (availability.status == Status.misschien) {
            _misschien.add(account.getFullName);
          } else {
            _afwezig.add(account.getFullName);
          }
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final activityProvider = Provider.of<ActivityProvider>(context);
    final activityHasBeen =
        widget.activity.endDate.isBefore(DateTime.now().toUtc());

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.activity.name),
        backgroundColor: widget.activity.color,
        elevation: 0,
        leading: IconButton(
          padding: EdgeInsets.zero,
          icon: const Icon(Icons.chevron_left, color: Colors.black),
          iconSize: 25.0,
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          PopupMenuButton<String>(
            padding: EdgeInsets.zero,
            icon: const Icon(Icons.more_vert, color: Colors.black),
            itemBuilder: (BuildContext context) {
              return [
                const PopupMenuItem<String>(
                    value: 'edit', child: Text('Aanpassen')),
                if (widget.activity.recurrence != Recurrence.geen)
                  const PopupMenuItem<String>(
                      value: 'delete-only',
                      child: Text('Verwijder deze activiteit')),
                const PopupMenuItem<String>(
                    value: 'delete', child: Text('Verwijderen')),
              ];
            },
            onSelected: (value) async {
              if (value == 'edit') {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        EditActivityPage(activity: widget.activity),
                  ),
                ).then((activity) {
                  // if (activity != null) {
                  //   setState(() {
                  //     widget.activity = activity;
                  //   });
                  // }
                });
              } else if (value == 'delete-only') {
                final result = await ActivityService().createExceptions(
                    widget.activity.id, widget.activity.getStartDate);
                if (!context.mounted) return;
                result.isSuccess
                    ? SuccessDialog.show(context,
                        message: "Activiteit is verwijderd.")
                    : ErrorDialog.showErrorDialog(
                        context, result.error ?? "Onbekende fout.");
              } else if (value == 'delete') {
                final result =
                    await ActivityService().deleteActivity(widget.activity.id);
                if (!context.mounted) return;
                if (result.isSuccess) {
                  SuccessDialog.show(
                    context,
                    message: "Activiteit is verwijderd.",
                    onPressed: () {
                      if (!context.mounted) return;
                      Navigator.of(context).pop();
                    },
                  );
                } else {
                  ErrorDialog.showErrorDialog(
                      context, result.error ?? "Onbekende fout.");
                }
              }
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.activity.name,
                style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87)),
            const SizedBox(height: 2),
            Row(
              children: [
                Icon(Icons.category, color: widget.activity.color, size: 16),
                const SizedBox(width: 8),
                Text(widget.activity.category.toString(),
                    style:
                        const TextStyle(fontSize: 16, color: Colors.black87)),
              ],
            ),
            const SizedBox(height: 15),
            Row(
              children: [
                const Icon(Icons.access_time, color: Colors.grey),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                          "${(Weekday.values[widget.activity.startDate.weekday - 1])}, ${widget.activity.startDate.day} ${Month.values[widget.activity.startDate.month - 1].name}",
                          style: const TextStyle(
                              fontSize: 16, color: Colors.black87)),
                      Text(widget.activity.getTimes,
                          style: const TextStyle(
                              fontSize: 15, color: Colors.grey)),
                    ],
                  ),
                ),
              ],
            ),
            if (widget.activity.location != null &&
                widget.activity.location!.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 10),
                child: Row(
                  children: [
                    const Icon(Icons.place, color: Colors.grey),
                    const SizedBox(width: 8),
                    Flexible(
                        child: Text(widget.activity.location!,
                            style: const TextStyle(
                                fontSize: 16, color: Colors.black87))),
                  ],
                ),
              ),
            const Divider(height: 30),
            const Text('Jouw aanwezigheid',
                style: TextStyle(
                    fontSize: 16,
                    color: Colors.black,
                    fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            FutureBuilder<Availability?>(
              future: widget.activity.getYourAvailability(
                  widget.activity.getStartDate, widget.account.id!),
              builder: (context, snapshot) {
                final yourAvailability = snapshot.data;
                return Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    GestureDetector(
                      onTap: () => _updateAvailability(
                          activityProvider, Status.aanwezig),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            vertical: 8.0, horizontal: 16.0),
                        decoration: BoxDecoration(
                          color: CustomColors.getActivityButtonColor(
                              Status.aanwezig,
                              yourAvailability,
                              activityHasBeen,
                              widget.activity.category),
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                        child: const Text("Aanwezig"),
                      ),
                    ),
                    GestureDetector(
                      onTap: () => _updateAvailability(
                          activityProvider, Status.misschien),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            vertical: 8.0, horizontal: 16.0),
                        decoration: BoxDecoration(
                          color: CustomColors.getActivityButtonColor(
                              Status.misschien,
                              yourAvailability,
                              activityHasBeen,
                              widget.activity.category),
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                        child: const Text("Misschien"),
                      ),
                    ),
                    GestureDetector(
                      onTap: () =>
                          _updateAvailability(activityProvider, Status.afwezig),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            vertical: 8.0, horizontal: 16.0),
                        decoration: BoxDecoration(
                          color: CustomColors.getActivityButtonColor(
                              Status.afwezig,
                              yourAvailability,
                              activityHasBeen,
                              widget.activity.category),
                          borderRadius: BorderRadius.circular(8.0),
                        ),
                        child: const Text("Afwezig"),
                      ),
                    ),
                  ],
                );
              },
            ),
            const Divider(height: 40),
            const Text('Aanwezigheid',
                style: TextStyle(
                    fontSize: 16,
                    color: Colors.black,
                    fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            _buildOverviewStatusButtons(),
            _buildOverviewSection(),
          ],
        ),
      ),
    );
  }

  void _updateAvailability(
      ActivityProvider activityProvider, Status status) async {
    if (!widget.activity.endDate.isBefore(DateTime.now().toUtc())) {
      final availability = Availability(
          account:
              FirebaseFirestore.instance.doc('accounts/${widget.account.id}'),
          status: status);

      // await AvailabilityService().changeAvailability(availability);

      // await activityProvider.changeAvailability(
      //   widget.activity.id!,
      //   widget.activity.getStartDate,
      //   availability,
      // );

      setState(() {
        _selectedStatus = status;
        _buildAvailabilities(
            widget.activity.availabilities?[widget.activity.getStartDate]);
      });
    }
  }

  Widget _buildOverviewStatusButtons() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: Status.values.map((status) {
        final statusText =
            status.name[0].toUpperCase() + status.name.substring(1);
        final count = {
          Status.aanwezig: _aanwezig.length,
          Status.misschien: _misschien.length,
          Status.afwezig: _afwezig.length,
        }[status]!;

        return GestureDetector(
          onTap: () => setState(() => _selectedStatusOverview = status),
          child: Container(
            padding:
                const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
            decoration: BoxDecoration(
              color: _selectedStatusOverview == status
                  ? (status == Status.aanwezig
                      ? Colors.green
                      : status == Status.afwezig
                          ? Colors.red
                          : Colors.orange)
                  : CustomColors.getButtonColorForCategory(
                      widget.activity.category),
              borderRadius: BorderRadius.circular(8.0),
            ),
            child: Row(
              children: [
                Text(statusText),
                const SizedBox(width: 6),
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: const BoxDecoration(
                    color: CustomColors.selectedMenuColor,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    count.toString(),
                    style: const TextStyle(
                        fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildOverviewSection() {
    final List<String> people = {
      Status.aanwezig: _aanwezig,
      Status.misschien: _misschien,
      Status.afwezig: _afwezig,
    }[_selectedStatusOverview]!;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (people.isEmpty)
          const Text('Geen mensen geregistreerd',
              style: TextStyle(fontSize: 16, color: Colors.black87))
        else
          ListView.builder(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            itemCount: people.length,
            itemBuilder: (context, index) {
              final person = people[index];
              return ListTile(
                leading: const Icon(Icons.person),
                title: Text(person,
                    style:
                        const TextStyle(fontSize: 16, color: Colors.black87)),
              );
            },
          ),
      ],
    );
  }
}
