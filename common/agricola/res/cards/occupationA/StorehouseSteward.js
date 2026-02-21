module.exports = {
  id: "storehouse-steward-a146",
  name: "Storehouse Steward",
  deck: "occupationA",
  number: 146,
  type: "occupation",
  players: "3+",
  text: "Each time you take exactly 2/3/4/5 food from a food accumulation space, you also get 1 stone/reed/clay/wood. (If you take 6 or more food, you do not get a bonus good).",
  onAction(game, player, actionId, resources) {
    if (resources && resources.food > 0) {
      const bonuses = { 2: 'stone', 3: 'reed', 4: 'clay', 5: 'wood' }
      const bonus = bonuses[resources.food]
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
