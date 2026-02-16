module.exports = {
  id: "water-worker-d144",
  name: "Water Worker",
  deck: "occupationD",
  number: 144,
  type: "occupation",
  players: "1+",
  text: "Each time after you use Fishing, Day Laborer, Reed Bank, or the Round 4 action space, you get 1 additional reed.",
  onAction(game, player, actionId) {
    const round4Card = game.state.roundCardDeck[3]
    const triggerIds = ['fishing', 'day-laborer', 'take-reed']
    if (round4Card) {
      triggerIds.push(round4Card.id)
    }
    if (triggerIds.includes(actionId)) {
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 reed from Water Worker',
        args: { player },
      })
    }
  },
}
