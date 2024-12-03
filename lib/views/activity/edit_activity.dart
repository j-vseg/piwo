import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/models/activity.dart';
import 'package:piwo/models/enums/category.dart';
import 'package:piwo/models/enums/recurrance.dart';
import 'package:piwo/services/activity.dart';
import 'package:piwo/widgets/dialogs.dart';
import 'package:piwo/widgets/notifiers/availablity_notifier.dart';
import 'package:provider/provider.dart';

class EditActivityPage extends StatefulWidget {
  const EditActivityPage({
    super.key,
    required this.activity,
  });

  final Activity? activity;

  @override
  EditActivityPageState createState() => EditActivityPageState();
}

class EditActivityPageState extends State<EditActivityPage> {
  final _nameController = TextEditingController();
  DateTime _startDate = DateTime.now().add(const Duration(hours: 1)).toLocal();
  DateTime _endDate = DateTime.now().add(const Duration(hours: 2)).toLocal();
  Recurrence _selectedRecurrence = Recurrence.geen;
  Category _selectedCategory = Category.groepsavond;
  final _locationController = TextEditingController();

  final _formKey = GlobalKey<FormState>();

  String _formatDateTime(DateTime dateTime) {
    return DateFormat('MMM dd, yyyy – h:mm a').format(dateTime);
  }

  Future<void> _selectDateTime(BuildContext context, bool isStart) async {
    DateTime initialDate = isStart ? _startDate : _endDate;

    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime(2022),
      lastDate: DateTime(2030),
    );

    if (pickedDate != null) {
      if (!context.mounted) return;
      final TimeOfDay? pickedTime = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.fromDateTime(initialDate),
      );

      if (pickedTime != null) {
        final DateTime finalPickedDateTime = DateTime(
          pickedDate.year,
          pickedDate.month,
          pickedDate.day,
          pickedTime.hour,
          pickedTime.minute,
        );

        setState(() {
          if (isStart) {
            _startDate = finalPickedDateTime;
            if (widget.activity == null) {
              _endDate = finalPickedDateTime.add(const Duration(hours: 1));
            }
          } else {
            _endDate = finalPickedDateTime;
          }
        });
      }
    }
  }

  @override
  void initState() {
    super.initState();

    if (widget.activity != null) {
      _nameController.text = widget.activity!.name ?? "";
      _startDate = widget.activity!.startDate!.toLocal();
      _endDate = widget.activity!.endDate!.toLocal();
      _selectedRecurrence = widget.activity!.recurrence ?? Recurrence.geen;
      _selectedCategory = widget.activity!.category ?? Category.groepsavond;
      _locationController.text = widget.activity!.location ?? "";
    }
  }

  @override
  Widget build(BuildContext context) {
    final activityProvider = Provider.of<ActivityProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.activity != null
              ? _nameController.text.isNotEmpty
                  ? _nameController.text
                  : widget.activity!.name!
              : "Creer activiteit",
        ),
        backgroundColor: CustomColors.themePrimary,
        elevation: 0,
        leading: IconButton(
          padding: EdgeInsets.zero,
          icon: const Icon(
            Icons.chevron_left,
            color: Colors.black,
          ),
          iconSize: 25.0,
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        actions: [
          TextButton(
            onPressed: () async {
              if (_formKey.currentState!.validate()) {
                final name = _nameController.text.trim();
                String? location = _locationController.text.trim();
                if (location.isEmpty) {
                  location = null;
                }

                if (!_startDate.isAfter(_endDate) &&
                    !_endDate.isBefore(_startDate)) {
                  if (widget.activity != null) {
                    final activty = Activity(
                      name: name,
                      startDate: _startDate,
                      endDate: _endDate,
                      recurrence: _selectedRecurrence,
                      color: CustomColors.getActivityColor(_selectedCategory),
                      category: _selectedCategory,
                      location: location,
                      exceptions: widget.activity!.exceptions,
                      availabilities: widget.activity!.availabilities,
                    );

                    final result = await ActivityService()
                        .updateActivity(widget.activity!.id ?? "", activty);

                    if (result.isSuccess) {
                      if (!context.mounted) return;
                      SuccessDialog.showSuccessDialogWithOnPressed(
                        context,
                        "Activiteit is aangepast.",
                        () async {
                          await activityProvider.updateActivity(
                            widget.activity!.id!,
                            activty,
                          );

                          if (!context.mounted) return;
                          Navigator.of(context).pop();
                        },
                      );
                    } else {
                      if (!context.mounted) return;
                      ErrorDialog.showErrorDialog(
                        context,
                        result.error ??
                            "Het is onduidelijk wat er mis is gegaan.",
                      );
                    }
                  } else {
                    final activty = Activity(
                      name: name,
                      startDate: _startDate,
                      endDate: _endDate,
                      recurrence: _selectedRecurrence,
                      category: _selectedCategory,
                      location: location,
                    );

                    final result =
                        await ActivityService().createActivity(activty);

                    if (result.isSuccess) {
                      if (!context.mounted) return;
                      SuccessDialog.showSuccessDialogWithOnPressed(
                        context,
                        "Activiteit is gecreëerd.",
                        () async {
                          await activityProvider.createActivity(
                            result.data ?? "",
                            activty,
                          );

                          if (!context.mounted) return;
                          Navigator.of(context).pop();
                        },
                      );
                    } else {
                      if (!context.mounted) return;
                      ErrorDialog.showErrorDialog(
                        context,
                        result.error ??
                            "Het is onduidelijk wat er mis is gegaan.",
                      );
                    }
                  }
                } else {
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: const Text('Er is iets misgegaan'),
                        content: const Text(
                            'Start datum kan niet na de eind datum zijn of andersom'),
                        actions: <Widget>[
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            child: const Text('OK'),
                          ),
                        ],
                      );
                    },
                  );
                }
              }
            },
            style: ButtonStyle(
              backgroundColor: WidgetStateProperty.all<Color>(Colors.white),
            ),
            child: Text(
              widget.activity != null ? 'Opslaan' : 'Creer',
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: "Naam",
                  hintText:
                      widget.activity != null ? widget.activity!.name : "",
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veld kan niet leeg zijn';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),
              ListTile(
                title: const Text("Van"),
                subtitle: Text(_formatDateTime(_startDate)),
                trailing: const Icon(Icons.calendar_today),
                onTap: () => _selectDateTime(context, true),
              ),
              ListTile(
                title: const Text("Tot"),
                subtitle: Text(_formatDateTime(_endDate)),
                trailing: const Icon(Icons.calendar_today),
                onTap: () => _selectDateTime(context, false),
              ),
              const SizedBox(height: 20),
              ListTile(
                title: const Text("Herhaling"),
                leading: const Icon(Icons.repeat),
                trailing: DropdownButton<Recurrence>(
                  value: _selectedRecurrence,
                  icon: const Icon(Icons.arrow_drop_down),
                  onChanged: (Recurrence? newValue) {
                    setState(() {
                      _selectedRecurrence = newValue!;
                    });
                  },
                  items: Recurrence.values.map<DropdownMenuItem<Recurrence>>(
                      (Recurrence recurrance) {
                    return DropdownMenuItem<Recurrence>(
                      value: recurrance,
                      child: Text(recurrance.name),
                    );
                  }).toList(),
                ),
              ),
              ListTile(
                title: const Text("Categorie"),
                leading: const Icon(Icons.category),
                trailing: DropdownButton<Category>(
                  value: _selectedCategory,
                  icon: const Icon(Icons.arrow_drop_down),
                  onChanged: (Category? newValue) {
                    setState(() {
                      _selectedCategory = newValue!;
                    });
                  },
                  items: Category.values
                      .map<DropdownMenuItem<Category>>((Category category) {
                    return DropdownMenuItem<Category>(
                      value: category,
                      child: Text(category.name),
                    );
                  }).toList(),
                ),
              ),
              ListTile(
                leading: const Icon(Icons.location_on),
                title: TextField(
                  controller: _locationController,
                  decoration: InputDecoration(
                    labelText: "Locatie",
                    hintText: widget.activity != null
                        ? widget.activity!.location
                        : "",
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
