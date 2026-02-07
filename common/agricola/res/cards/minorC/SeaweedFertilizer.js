module.exports = {
  id: "seaweed-fertilizer-c073",
  name: "Seaweed Fertilizer",
  deck: "minorC",
  number: 73,
  type: "minor",
  cost: { food: 2 },
  category: "Crop Provider",
  text: "Each time after you take an unconditional \"Sow\" action, you get 1 grain from the general supply. From round 11 on, you can get 1 vegetable instead.",
  onSow(game, player) {
    if (game.state.round >= 11) {
      game.actions.offerSeaweedFertilizer(player, this)
    }
    else {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Seaweed Fertilizer',
        args: { player },
      })
    }
  },
}
