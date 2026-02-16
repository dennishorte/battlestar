module.exports = {
  id: "party-organizer-d157",
  name: "Party Organizer",
  deck: "occupationD",
  number: 157,
  type: "occupation",
  players: "1+",
  text: "As soon as the next player but you gains their 5th person, you immediately get 8 food (not retroactively). During scoring, if only you have 5 people, you get 3 bonus points.",
  onAnyFamilyGrowth(game, actingPlayer, cardOwner) {
    if (actingPlayer.name === cardOwner.name) {
      return
    }
    const s = game.cardState(this.id)
    if (s.triggered) {
      return
    }
    if (actingPlayer.getFamilySize() === 5) {
      s.triggered = true
      cardOwner.addResource('food', 8)
      game.log.add({
        template: '{player} gets 8 food from Party Organizer ({other} reached 5 family members)',
        args: { player: cardOwner, other: actingPlayer },
      })
    }
  },
  getEndGamePoints(player, game) {
    if (player.getFamilySize() === 5) {
      const othersWithFive = game.players.all().filter(p => p.name !== player.name && p.getFamilySize() === 5)
      if (othersWithFive.length === 0) {
        return 3
      }
    }
    return 0
  },
}
