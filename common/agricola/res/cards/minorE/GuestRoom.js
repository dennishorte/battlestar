module.exports = {
  id: "guest-room-e022",
  name: "Guest Room",
  deck: "minorE",
  number: 22,
  type: "minor",
  cost: { wood: 4, reed: 1 },
  text: "Immediately place any amount of food from your supply on this card. Once per round, you can discard 1 food from this card to place a person from your supply in that round.",
  enablesGuestWorker: true,
  storedResource: "food",
  onPlay(game, player) {
    const available = player.food || 0
    if (available === 0) {
      return
    }

    const cardName = this.definition?.name || this.name
    const cardId = this.definition?.id || this.id

    const choices = []
    for (let i = 0; i <= available; i++) {
      choices.push(`Place ${i} food`)
    }

    const selection = game.actions.choose(player, choices, {
      title: `${cardName}: Place food on card`,
      min: 1,
      max: 1,
    })

    const sel = Array.isArray(selection) ? selection[0] : selection
    const match = sel.match(/Place (\d+)/)
    if (match) {
      const amount = parseInt(match[1])
      if (amount > 0) {
        player.removeResource('food', amount)
        const state = game.cardState(cardId)
        state.food = (state.food || 0) + amount
        game.log.add({
          template: `{player} places ${amount} food on ${cardName}`,
          args: { player },
        })
      }
    }
  },
}
