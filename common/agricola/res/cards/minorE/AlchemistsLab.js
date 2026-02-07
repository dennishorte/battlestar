module.exports = {
  id: "alchemists-lab-e081",
  name: "Alchemist's Lab",
  deck: "minorE",
  number: 81,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { occupations: 3 },
  text: "This card is an action space for all. A player who uses it gets 1 building resource of each type they already have. If another player uses it, they must first pay you 1 food.",
  isActionSpace: true,
  actionSpaceEffect(game, player, owner) {
    if (player.name !== owner.name) {
      player.addResource('food', -1)
      owner.addResource('food', 1)
    }
    const resources = ['wood', 'clay', 'stone', 'reed']
    for (const res of resources) {
      if ((player[res] || 0) > 0) {
        player.addResource(res, 1)
      }
    }
  },
}
