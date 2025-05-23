import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/config/theme/size_setter.dart';

class CustomScaffold extends StatefulWidget {
  const CustomScaffold(
      {super.key,
      required this.body,
      this.appBarTitle,
      this.appBackgroundColor = CustomColors.dark,
      this.appBarLeading,
      this.actions,
      this.appBarBackgroundColor = Colors.transparent,
      this.backgroundColor = CustomColors.themeBackground,
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
      this.bodyPadding});
  final Widget body;
  final Widget? appBarTitle;
  final Widget? appBarLeading;
  final List<Widget>? actions;
  final Color appBarBackgroundColor;
  final Color? backgroundColor;
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
  final Padding? bodyPadding;

  @override
  State<CustomScaffold> createState() => _CustomScaffoldState();
}

class _CustomScaffoldState extends State<CustomScaffold> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: widget.appBar != null
          ? AppBar(
              title: widget.appBar!.title,
              leading: widget.appBar!.leading,
              backgroundColor: widget.appBar?.backgroundColor ??
                  CustomColors.themeBackground,
              toolbarHeight: 85,
              centerTitle: true,
              elevation: 0,
              actions: widget.actions,
              leadingWidth: 40 + SizeSetter.getHorizontalScreenPadding(),
              systemOverlayStyle: widget.systemOverlayStyle,
              automaticallyImplyLeading: widget.automaticallyImplyLeading,
              iconTheme: const IconThemeData(
                color: CustomColors.light,
              ),
              surfaceTintColor: Colors.transparent,
            )
          : null,
      backgroundColor: widget.backgroundColor,
      floatingActionButton:
          widget.floatingActionButton ?? widget.floatingActionButton,
      body: SafeArea(
        top: widget.topSafeArea,
        bottom: widget.bottomSafeArea,
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: widget.bodyPadding?.padding.horizontal ??
                SizeSetter.getHorizontalScreenPadding(),
          ),
          child: widget.body,
        ),
      ),
    );
  }
}
