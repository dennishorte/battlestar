module.exports = {
  id: "piggy-bank-e027",
  name: "Piggy Bank",
  deck: "minorE",
  number: 27,
  type: "minor",
  cost: {},
  text: "At the end of each work phase, you can place 1 food on this card, irretrievably. At any time, you can discard 6 food from this card to build a major improvement at no cost.",
  storedResource: "food",
  enablesFreeMajor: { cost: 6 },
  onWorkPhaseEnd(game, player) {
    game.actions.offerPiggyBankDeposit(player, this)
  },
}
