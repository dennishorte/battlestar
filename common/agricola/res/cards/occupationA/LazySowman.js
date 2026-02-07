module.exports = {
  id: "lazy-sowman-a094",
  name: "Lazy Sowman",
  deck: "occupationA",
  number: 94,
  type: "occupation",
  players: "1+",
  text: "Each time you decline an unconditional \"Sow\" action on your turn, you can immediately place another person on an action space of your choice (even if it is occupied).",
  onDeclineSow(game, player) {
    game.actions.offerExtraPerson(player, this, { allowOccupied: true, excludeMeetingPlace: true })
  },
}
