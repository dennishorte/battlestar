module.exports = {
  id: "brook-b056",
  name: "Brook",
  deck: "minorB",
  number: 56,
  type: "minor",
  cost: {},
  prereqs: { personOnFishing: true },
  category: "Food Provider",
  text: "Each time you use one of the four action spaces above the \"Fishing\" accumulation space (Reed Bank, Clay Pit, Forest, or the round 1 action card), you get 1 additional food.",
  matches_onAction(game, player, actionId) {
    // The four action spaces above Fishing: Reed Bank, Clay Pit, Forest, and round 1 card
    const aboveFishing = ['take-reed', 'take-clay', 'take-wood']
    const round1CardId = game.state.roundCardDeck[0]?.id
    if (round1CardId) {
      aboveFishing.push(round1CardId)
    }
    return aboveFishing.includes(actionId)
  },
  onAction(game, player, _actionId) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food',
      args: { player },
    })
  },
}
