enum Weekday {
  maandag,
  dinsdag,
  woensdag,
  donderdag,
  vrijdag,
  zaterdag,
  zondag;

  @override
  String toString() {
    if (name == 'vrijdag') {
      return "${name.substring(0, 1).toUpperCase()}${name.substring(1, 4)}";
    } else if (name == 'maandag') {
      return "${name.substring(0, 1).toUpperCase()}${name.substring(1, 2)}";
    }
    return "${name.substring(0, 1).toUpperCase()}${name.substring(1, 3)}";
  }
}
