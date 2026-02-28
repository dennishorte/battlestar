module.exports = {
  id: "game-provider-b165",
  name: "Game Provider",
  deck: "occupationB",
  number: 165,
  type: "occupation",
  players: "4+",
  text: "Immediately before each harvest, you can discard 1/3/4 grain from different fields to receive 1/2/3 wild boars.",
  onBeforeHarvest(game, player) {
    // Count fields with grain
    const fieldsWithGrain = []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const space = player.getSpace(row, col)
        if (space && space.type === 'field' && space.crop === 'grain' && space.cropCount >= 1) {
          fieldsWithGrain.push({ row, col, cropCount: space.cropCount })
        }
      }
    }

    if (fieldsWithGrain.length === 0) {
      return
    }

    // Determine available exchanges: 1 grain → 1 boar, 3 grain → 2 boar, 4 grain → 3 boar
    const choices = ['Skip']
    if (fieldsWithGrain.length >= 1) {
      choices.push('Discard 1 grain from 1 field → 1 wild boar')
    }
    if (fieldsWithGrain.length >= 3) {
      choices.push('Discard 1 grain each from 3 fields → 2 wild boar')
    }
    if (fieldsWithGrain.length >= 4) {
      choices.push('Discard 1 grain each from 4 fields → 3 wild boar')
    }

    if (choices.length <= 1) {
      return
    }

    const selection = game.actions.choose(player, choices, {
      title: 'Game Provider: Discard grain from fields for wild boar?',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Skip') {
      return
    }

    let fieldsToDiscard = 0
    let boarToGain = 0
    if (selection[0].includes('4 fields')) {
      fieldsToDiscard = 4
      boarToGain = 3
    }
    else if (selection[0].includes('3 fields')) {
      fieldsToDiscard = 3
      boarToGain = 2
    }
    else {
      fieldsToDiscard = 1
      boarToGain = 1
    }

    // Remove 1 grain from the first N fields with grain
    let discarded = 0
    for (const field of fieldsWithGrain) {
      if (discarded >= fieldsToDiscard) {
        break
      }
      const space = player.getSpace(field.row, field.col)
      if (space && space.cropCount >= 1) {
        space.cropCount -= 1
        if (space.cropCount === 0) {
          space.crop = null
        }
        discarded++
      }
    }

    if (player.canPlaceAnimals('boar', boarToGain)) {
      game.actions.handleAnimalPlacement(player, { boar: boarToGain })
    }
    else {
      // Add as many as can be placed
      for (let i = 0; i < boarToGain; i++) {
        if (player.canPlaceAnimals('boar', 1)) {
          game.actions.handleAnimalPlacement(player, { boar: 1 })
        }
      }
    }

    game.log.add({
      template: '{player} uses {card}: discards grain from {count} fields for {boar} wild boar',
      args: { player, count: fieldsToDiscard, boar: boarToGain , card: this},
    })
  },
}
