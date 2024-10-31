enum Role {
  user,
  penningmeester,
  beheerder,
  admin;

  @override
  String toString() {
    return name;
  }
}
