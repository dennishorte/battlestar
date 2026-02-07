module.exports = {
  id: "millwright-d088",
  name: "Millwright",
  deck: "occupationD",
  number: 88,
  type: "occupation",
  players: "1+",
  text: "You immediately get 1 grain. Each time you build fences, stables, and rooms, or renovate your house, you can replace up to 2 building resources of any type with 1 grain each.",
  allowsGrainSubstitution: true,
  maxSubstitutions: 2,
  onPlay(game, player) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 grain from Millwright',
      args: { player },
    })
  },
}
