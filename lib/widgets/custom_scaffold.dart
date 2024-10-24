import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/config/theme/custom_theme.dart';
import 'package:piwo/config/theme/size_setter.dart';
import 'package:piwo/views/activities.dart';
import 'package:piwo/views/activity/edit_activity.dart';
import 'package:piwo/views/home.dart';
import 'package:piwo/views/settings/settings.dart';

class CustomScaffold extends StatefulWidget {
  const CustomScaffold({
    super.key,
    required this.body,
    this.isAuthenticated = false,
    this.appBarTitle,
    this.appBackgroundColor = CustomColors.dark,
    this.appBarLeading,
    this.actions,
    this.appBarBackgroundColor = Colors.transparent,
    this.automaticallyImplyLeading = false,
    this.systemOverlayStyle = SystemUiOverlayStyle.light,
    this.extendBehindAppBar = false,
    this.appBar,
    this.floatingActionButton,
    this.drawer,
    this.useAppBar = true,
    this.bottomSafeArea = true,
    this.topSafeArea = true,
    this.floatingActionButtonLocation,
  });

  final Widget body;
  final bool isAuthenticated;
  final Widget? appBarTitle;
  final Widget? appBarLeading;
  final List<Widget>? actions;
  final Color appBarBackgroundColor;
  final Color appBackgroundColor;
  final bool automaticallyImplyLeading;
  final SystemUiOverlayStyle systemOverlayStyle;
  final bool extendBehindAppBar;
  final AppBar? appBar;
  final Widget? floatingActionButton;
  final Widget? drawer;
  final bool useAppBar;
  final bool bottomSafeArea;
  final bool topSafeArea;
  final FloatingActionButtonLocation? floatingActionButtonLocation;

  @override
  State<CustomScaffold> createState() => _CustomScaffoldState();
}

class _CustomScaffoldState extends State<CustomScaffold> {
  int _selectedIndex = 1;

  final List<Widget> pages = [
    const ActivitiesPage(),
    const HomePage(),
    const SettingsPage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: !widget.useAppBar
          ? null
          : widget.appBar ??
              AppBar(
                title: widget.appBarTitle,
                backgroundColor: widget.appBarBackgroundColor,
                titleTextStyle:
                    CustomTheme(context).themeData.textTheme.headlineMedium,
                centerTitle: true,
                elevation: 0,
                leading: widget.appBarLeading,
                actions: widget.actions,
                leadingWidth: 40 + SizeSetter.getHorizontalScreenPadding(),
                systemOverlayStyle: widget.systemOverlayStyle,
                automaticallyImplyLeading: widget.automaticallyImplyLeading,
                iconTheme: const IconThemeData(color: CustomColors.light),
              ),
      bottomNavigationBar: widget.isAuthenticated
          ? const SizedBox()
          : BottomNavigationBar(
              currentIndex: _selectedIndex,
              backgroundColor: Colors.white,
              selectedIconTheme:
                  const IconThemeData(color: CustomColors.themePrimary),
              selectedItemColor: CustomColors.themePrimary,
              unselectedIconTheme: const IconThemeData(color: Colors.grey),
              unselectedItemColor: Colors.grey,
              onTap: _onItemTapped,
              items: const [
                BottomNavigationBarItem(
                  icon: Icon(Icons.calendar_month),
                  label: 'Activiteiten',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.home),
                  label: 'Home',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.settings),
                  label: 'Instellingen',
                ),
              ],
            ),
      floatingActionButton: _selectedIndex == 0
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
          : const SizedBox(),
      body: SafeArea(
        top: widget.topSafeArea,
        bottom: widget.bottomSafeArea,
        child: Padding(
          padding: EdgeInsets.symmetric(
              horizontal: SizeSetter.getHorizontalScreenPadding()),
          child: IndexedStack(
            index: _selectedIndex,
            children: widget.isAuthenticated ? [widget.body] : pages,
          ),
        ),
      ),
    );
  }
}
