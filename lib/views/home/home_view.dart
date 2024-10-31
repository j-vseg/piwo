import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/config/theme/custom_theme.dart';
import 'package:piwo/config/theme/size_setter.dart';
import 'package:piwo/views/activities/activities.dart';
import 'package:piwo/views/home/home.dart';
import 'package:piwo/views/settings/settings.dart';

class HomeView extends StatefulWidget {
  const HomeView({
    super.key,
  });

  @override
  State<HomeView> createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  int selectedIndex = 1;

  void onItemTapped(int index) {
    setState(() {
      selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          IndexedStack(
            index: selectedIndex,
            children: const [
              ActivitiesPage(),
              HomePage(),
              SettingsPage(),
            ],
          ),
        ],
      ),
      bottomNavigationBar: Stack(
        children: [
          Theme(
            data: Theme.of(context).copyWith(
              splashFactory: NoSplash.splashFactory,
            ),
            child: SizedBox(
              height: SizeSetter.getBottomNavigationBarHeight(),
              child: BottomNavigationBar(
                items: const [
                  BottomNavigationBarItem(
                    key: Key('activities_view_button'),
                    icon: Icon(Icons.calendar_month),
                    label: 'Activiteiten',
                  ),
                  BottomNavigationBarItem(
                    key: Key('home_view_button'),
                    icon: Icon(Icons.home),
                    label: 'Home',
                  ),
                  BottomNavigationBarItem(
                    key: Key('settings_view_button'),
                    icon: Icon(Icons.settings),
                    label: 'Instellingen',
                  ),
                ],
                type: BottomNavigationBarType.fixed,
                selectedItemColor: CustomColors.selectedMenuColor,
                unselectedItemColor: CustomColors.unselectedMenuColor,
                backgroundColor: Colors.white,
                selectedFontSize: SizeSetter.getBodySmallSize(),
                unselectedFontSize: SizeSetter.getBodySmallSize(),
                currentIndex: selectedIndex,
                unselectedLabelStyle:
                    CustomTheme(context).themeData.textTheme.bodySmall,
                selectedLabelStyle:
                    CustomTheme(context).themeData.textTheme.bodySmall,
                onTap: onItemTapped,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
