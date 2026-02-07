module.exports = {
  id: "farm-hand-b085",
  name: "Farm Hand",
  deck: "occupationB",
  number: 85,
  type: "occupation",
  players: "1+",
  text: "Once you have 4 field tiles arranged in a 2x2, you can use a \"Build Stables\" action to build a stable in the center of the 2x2. This stable provides room for a person but no animal.",
  allowsCenterStable: true,
  getCenterStableLocation(player) {
    return player.get2x2FieldCenter()
  },
}
