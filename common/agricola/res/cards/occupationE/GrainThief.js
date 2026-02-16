module.exports = {
  id: "grain-thief-e112",
  name: "Grain Thief",
  deck: "occupationE",
  number: 112,
  type: "occupation",
  players: "1+",
  text: "Each time you would harvest a grain field, you can leave the grain on the field and take 1 grain from the general supply instead.",
  onHarvestGrain(game, player, grainCount) {
    // Offer to leave grain on field and take from supply instead
    if (grainCount > 0) {
      const choices = ['Use Grain Thief', 'Skip']
      const selection = game.actions.choose(player, choices, {
        title: 'Grain Thief: Leave grain on field, take 1 from supply?',
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Use Grain Thief') {
        // Return 1 grain to a field (put it back) and take 1 from supply
        const fields = player.getFieldSpaces().filter(f => f.crop === 'grain' && f.cropCount === 0)
        if (fields.length > 0) {
          fields[0].cropCount = 1
        }
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} uses Grain Thief to leave grain on field and take 1 from supply',
          args: { player },
        })
      }
    }
  },
}
