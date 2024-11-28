import 'dart:math';
import 'package:flutter/material.dart';

class InvertedRoundedRectanglePainter extends CustomPainter {
  InvertedRoundedRectanglePainter({
    required this.radius,
    required this.color,
    required this.backgroundColor,
  });

  final double radius;
  final Color color; // The color of the inverted rounded rectangle
  final Color backgroundColor; // The color of the "transparent" area

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint();
    // Paint the background color
    paint.color = backgroundColor;
    canvas.drawRect(Offset.zero & size, paint);

    final cornerSize = Size.square(radius * 2);
    paint.color = color;
    final path = Path()
      ..moveTo(0, radius) // Start below the top-left arc
      // Top-left arc
      ..arcTo(
        Rect.fromLTWH(0, 0, cornerSize.width, cornerSize.height),
        pi, // Start from the left
        pi / 2, // Sweep clockwise to the top
        false,
      )
      // Top edge
      ..lineTo(size.width - radius, 0)
      // Top-right arc
      ..arcTo(
        Rect.fromLTWH(
          size.width - cornerSize.width, // Top-right x offset
          0, // Top y offset
          cornerSize.width,
          cornerSize.height,
        ),
        -pi / 2, // Start from the top
        pi / 2, // Sweep clockwise to the right
        false,
      )
      // Right edge to bottom
      ..lineTo(size.width, size.height)
      // Bottom edge
      ..lineTo(0, size.height)
      // Left edge back to starting point
      ..close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant InvertedRoundedRectanglePainter oldDelegate) =>
      oldDelegate.radius != radius ||
      oldDelegate.color != color ||
      oldDelegate.backgroundColor != backgroundColor;
}
