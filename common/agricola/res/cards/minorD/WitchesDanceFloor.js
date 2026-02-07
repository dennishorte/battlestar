module.exports = {
  id: "witches-dance-floor-d025",
  name: "Witches' Dance Floor",
  deck: "minorD",
  number: 25,
  type: "minor",
  cost: {},
  category: "Farm Planner",
  text: "This card is a field that you can sow in, an occupation, and the \"Fireplace\" major improvement with all of its effects. You can play it only via a \"Minor Improvement\" action.",
  providesField: true,
  countsAsOccupation: true,
  countsAsMajorOrMinor: true,
  isFireplace: true,
  anytimeConversions: [
    { from: "sheep", to: "food", rate: 2 },
    { from: "boar", to: "food", rate: 2 },
    { from: "vegetables", to: "food", rate: 2 },
  ],
  bakingConversion: { from: "grain", to: "food", rate: 2 },
  onPlay(game, player) {
    player.addVirtualField({
      cardId: 'witches-dance-floor-d025',
      label: "Witches' Floor",
      cropRestriction: null,  // Can grow any crop
    })
    game.log.add({
      template: "{player} plays Witches' Dance Floor, gaining a field and Fireplace abilities",
      args: { player },
    })
  },
}
