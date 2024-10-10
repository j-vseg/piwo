// ignore_for_file: library_private_types_in_public_api

import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';

class ActivitiesPage extends StatefulWidget {
  const ActivitiesPage({super.key});

  @override
  _ActivitiesPageState createState() => _ActivitiesPageState();
}

class _ActivitiesPageState extends State<ActivitiesPage> {
  @override
  Widget build(BuildContext context) {
    return const SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Activities",
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            "Bekijk alle activiteiten die gepland zijn.",
            style: TextStyle(
              fontSize: 18,
              color: CustomColors.unselectedMenuColor,
            ),
          ),
        ],
      ),
    );
  }
}
