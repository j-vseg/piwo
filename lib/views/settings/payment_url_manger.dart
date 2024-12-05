import 'package:flutter/material.dart';
import 'package:piwo/config/theme/custom_colors.dart';
import 'package:piwo/services/payment_url.dart';
import 'package:piwo/widgets/custom_scaffold.dart';
import 'package:piwo/widgets/dialogs.dart';
import 'package:url_launcher/url_launcher.dart';

class PaymentUrlManagerPage extends StatefulWidget {
  const PaymentUrlManagerPage({super.key});

  @override
  PaymentUrlManagerPageState createState() => PaymentUrlManagerPageState();
}

class PaymentUrlManagerPageState extends State<PaymentUrlManagerPage> {
  String? _paymentUrl = "";
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _paymentUrlController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _initializePaymentUrl();
  }

  void _initializePaymentUrl() async {
    try {
      _paymentUrl = (await PaymentUrlService().getPaymentUrl()).data;
    } catch (e) {
      debugPrint("Error fetching data: $e");
    } finally {
      setState(() {});
    }
  }

  @override
  void dispose() {
    _paymentUrlController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CustomScaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
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
        title: const Text(
          "Wijzig de bierkaart URL",
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.only(top: 20.0, left: 20.0, right: 20.0),
          child: Column(
            children: [
              const Text(
                "Wijzing de bierkaart betaal URL.",
                style: TextStyle(
                  fontSize: 20,
                  color: CustomColors.unselectedMenuColor,
                ),
              ),
              const SizedBox(height: 40),
              const Text(
                "Het huidige betaalverzoek link is:",
                style: TextStyle(
                  fontSize: 16,
                ),
              ),
              GestureDetector(
                onTap: () async {
                  final paymentUrl = Uri.parse(_paymentUrl ?? "");
                  if (await canLaunchUrl(paymentUrl)) {
                    await launchUrl(paymentUrl);
                  }
                },
                child: Text(
                  _paymentUrl ?? "",
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.orange,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    TextFormField(
                      controller: _paymentUrlController,
                      decoration: InputDecoration(
                          border: const OutlineInputBorder(),
                          labelText: 'Nieuwe betaalzoek URL*',
                          hintText: _paymentUrl ?? ""),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Veld kan niet leeg zijn';
                        }

                        String pattern =
                            r'(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+';
                        RegExp regex = RegExp(pattern);

                        if (!regex.hasMatch(value)) {
                          return 'Geef een geldige link op.';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    MaterialButton(
                      minWidth: double.maxFinite,
                      color: CustomColors.themePrimary,
                      onPressed: () async {
                        if (_formKey.currentState!.validate()) {
                          final paymentUrl = _paymentUrlController.text.trim();
                          final result = await PaymentUrlService()
                              .updatePaymentUrl(paymentUrl);

                          if (result.isSuccess) {
                            if (!context.mounted) return;
                            SuccessDialog.show(
                              context,
                              message: "De betaalverzoek URL is gewijzigd.",
                            );
                          } else {
                            if (!context.mounted) return;
                            ErrorDialog.showErrorDialog(
                              context,
                              result.error ??
                                  "Het is onduidelijk wat er mis is gegaan.",
                            );
                          }
                          setState(() {
                            _paymentUrl = paymentUrl;
                          });
                        }
                      },
                      child: const Text('Wijzig het betaalverzoek'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
