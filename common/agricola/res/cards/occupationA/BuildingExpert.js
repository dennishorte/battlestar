module.exports = {
  id: "building-expert-a163",
  name: "Building Expert",
  deck: "occupationA",
  number: 163,
  type: "occupation",
  players: "4+",
  text: "Each time you use the \"Resource Market\" action space with the 1st/2nd/3rd/4th/5th person you place, you also get 1 wood/clay/reed/stone/stone.",
  onAction(game, player, actionId) {
    if (actionId === 'resource-market' || actionId.startsWith('resource-market-')) {
      const personNumber = player.getPersonPlacedThisRound()
      const bonuses = { 1: 'wood', 2: 'clay', 3: 'reed', 4: 'stone', 5: 'stone' }
      const bonus = bonuses[personNumber]
      if (bonus) {
        player.addResource(bonus, 1)
        game.log.add({
          template: '{player} gets 1 {resource} from {card}',
          args: { player, resource: bonus , card: this},
        })
      }
    }
  },
}
