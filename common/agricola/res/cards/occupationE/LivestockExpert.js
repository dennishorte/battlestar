module.exports = {
  id: "livestock-expert-e138",
  name: "Livestock Expert",
  deck: "occupationE",
  number: 138,
  type: "occupation",
  players: "1+",
  text: "If you play this card in round 11 or before, choose an animal type: you immediately get a number of animals of that type equal to the number you already have on your farm.",
  onPlay(game, player) {
    if (game.state.round <= 11) {
      const choices = []
      const sheep = player.getTotalAnimals('sheep')
      const boar = player.getTotalAnimals('boar')
      const cattle = player.getTotalAnimals('cattle')
      if (sheep > 0 && player.canPlaceAnimals('sheep', sheep)) {
        choices.push(`Double sheep (${sheep} → ${sheep * 2})`)
      }
      if (boar > 0 && player.canPlaceAnimals('boar', boar)) {
        choices.push(`Double boar (${boar} → ${boar * 2})`)
      }
      if (cattle > 0 && player.canPlaceAnimals('cattle', cattle)) {
        choices.push(`Double cattle (${cattle} → ${cattle * 2})`)
      }
      if (choices.length === 0) {
        return
      }

      choices.push('Skip')
      const selection = game.actions.choose(player, choices, {
        title: 'Livestock Expert: Double which animal?',
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Skip') {
        return
      }

      let type
      if (selection[0].startsWith('Double sheep')) {
        type = 'sheep'
      }
      else if (selection[0].startsWith('Double boar')) {
        type = 'boar'
      }
      else if (selection[0].startsWith('Double cattle')) {
        type = 'cattle'
      }

      if (type) {
        const count = player.getTotalAnimals(type)
        player.addAnimals(type, count)
        game.log.add({
          template: '{player} doubles {type} to {total} using {card}',
          args: { player, type, total: count * 2 , card: this},
        })
      }
    }
  },
}
