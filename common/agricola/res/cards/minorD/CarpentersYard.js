module.exports = {
  id: "carpenters-yard-d026",
  name: "Carpenter's Yard",
  deck: "minorD",
  number: 26,
  type: "minor",
  cost: { wood: 1, reed: 1 },
  vps: 1,
  category: "Actions Booster",
  text: "You can build the \"Joinery\" and \"Well\" major improvement even when taking a \"Minor Improvement\" action, or you can build both with a single \"Major Improvement\" action.",
  allowsMajorsOnMinorAction: ["joinery", "well"],
  allowsBothMajorsOnMajorAction: ["joinery", "well"],
}
