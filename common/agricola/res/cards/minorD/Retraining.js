module.exports = {
  id: "retraining-d027",
  name: "Retraining",
  deck: "minorD",
  number: 27,
  type: "minor",
  cost: { food: 1 },
  vps: 1,
  prereqs: { occupations: 1 },
  category: "Actions Booster",
  text: "At the end of each turn in which you renovate, you can exchange your Joinery for the Pottery or your Pottery for the Basketmaker's Workshop.",
  onRenovate(game, player) {
    const swaps = [
      { from: ['joinery', 'joinery-2'], to: ['pottery', 'pottery-2'], label: 'Exchange Joinery for Pottery' },
      { from: ['pottery', 'pottery-2'], to: ['basketmakers-workshop', 'basketmakers-workshop-2'], label: "Exchange Pottery for Basketmaker's Workshop" },
    ]

    const commonZone = player.zones.byId('common.majorImprovements')
    const commonIds = commonZone.cardlist().map(c => c.id)

    const validSwaps = swaps.filter(swap => {
      const hasFrom = player.majorImprovements.some(id => swap.from.includes(id))
      const targetAvailable = commonIds.some(id => swap.to.includes(id))
      return hasFrom && targetAvailable
    })

    if (validSwaps.length === 0) {
      return
    }

    const choices = [...validSwaps.map(s => s.label), 'Skip']
    const selection = game.actions.choose(player, choices, {
      title: 'Retraining',
      min: 1,
      max: 1,
    })

    const chosen = validSwaps.find(s => s.label === selection[0])
    if (chosen) {
      const oldId = player.majorImprovements.find(id => chosen.from.includes(id))
      const newId = commonIds.find(id => chosen.to.includes(id))
      const oldCard = game.cards.byId(oldId)
      const newCard = game.cards.byId(newId)
      oldCard.moveTo(commonZone)
      newCard.moveTo(player.zones.byPlayer(player, 'majorImprovements'))
      game.log.add({
        template: '{player} uses Retraining to exchange {old} for {new}',
        args: { player, old: oldCard.name, new: newCard.name },
      })
    }
  },
}
