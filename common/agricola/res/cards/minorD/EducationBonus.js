module.exports = {
  id: "education-bonus-d042",
  name: "Education Bonus",
  deck: "minorD",
  number: 42,
  type: "minor",
  cost: { food: 1 },
  prereqs: { improvements: 2 },
  category: "Building Resource Provider",
  text: "After you play your 1st/2nd/3rd/4th/5th/6th occupation this game, you immediately get 1 grain/clay/reed/stone/vegetable/field (not retroactively).",
  onPlayOccupation(game, player) {
    const occCount = player.occupationsPlayed || 0
    const rewards = {
      1: { type: 'grain', amount: 1 },
      2: { type: 'clay', amount: 1 },
      3: { type: 'reed', amount: 1 },
      4: { type: 'stone', amount: 1 },
      5: { type: 'vegetables', amount: 1 },
      6: { type: 'field', amount: 1 },
    }
    const reward = rewards[occCount]
    if (reward) {
      if (reward.type === 'field') {
        game.actions.plowField(player, { immediate: true })
      }
      else {
        player.addResource(reward.type, reward.amount)
        game.log.add({
          template: '{player} gets 1 {resource} from Education Bonus',
          args: { player, resource: reward.type },
        })
      }
    }
  },
}
