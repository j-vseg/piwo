enum Role {
  user,
  adviseur,
  penningmeester,
  beheerder,
  admin;

  @override
  String toString() {
    return name;
  }
}
