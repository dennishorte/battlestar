module.exports = {
  id: "bookshelf-d049",
  name: "Bookshelf",
  deck: "minorD",
  number: 49,
  type: "minor",
  cost: { wood: 1 },
  vps: 1,
  prereqs: { occupations: 3 },
  category: "Food Provider",
  text: "Immediately before each time you play an occupation (even before paying the occupation cost), you get 3 food.",
  onBeforePlayOccupation(game, player) {
    player.addResource('food', 3)
    game.log.add({
      template: '{player} gets 3 food from Bookshelf',
      args: { player },
    })
  },
}
