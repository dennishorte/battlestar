module.exports = {
  id: "recount-e006",
  name: "Recount",
  deck: "minorE",
  number: 6,
  type: "minor",
  cost: {},
  text: "You immediately get 1 building resource of each type of which you have 4 or more resources in your supply already.",
  onPlay(game, player) {
    const resources = ['wood', 'clay', 'stone', 'reed']
    for (const res of resources) {
      if ((player[res] || 0) >= 4) {
        player.addResource(res, 1)
        game.log.add({
          template: '{player} gets 1 {resource} from {card}',
          args: { player, resource: res , card: this},
        })
      }
    }
  },
}
