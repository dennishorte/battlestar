module.exports = {
  id: "portmonger-a103",
  name: "Portmonger",
  deck: "occupationA",
  number: 103,
  type: "occupation",
  players: "1+",
  text: "Each time you take 1/2/3+ food from a food accumulation space, you also get 1 vegetable/grain/reed.",
  onAction(game, player, actionId, resources) {
    if (resources && resources.food > 0) {
      const foodTaken = resources.food
      let bonus = null
      if (foodTaken >= 3) {
        bonus = 'reed'
      }
      else if (foodTaken === 2) {
        bonus = 'grain'
      }
      else if (foodTaken === 1) {
        bonus = 'vegetables'
      }
      if (bonus) {
        player.addResource(bonus, 1)
        game.log.add({
          template: '{player} gets 1 {resource} from Portmonger',
          args: { player, resource: bonus },
        })
      }
    }
  },
}
