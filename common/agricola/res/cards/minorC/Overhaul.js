module.exports = {
  id: "overhaul-c001",
  name: "Overhaul",
  deck: "minorC",
  number: 1,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupations: 2 },
  category: "Farm Planner",
  text: "Immediately raze all of your fences, add up to 3 fences from your supply, and rebuild them. (You do not lose any animals during this.)",
  onPlay(game, player) {
    // 1. Save all animals from pastures
    const savedAnimals = { sheep: 0, boar: 0, cattle: 0 }
    for (const pasture of player.farmyard.pastures) {
      if (pasture.animalType && pasture.animalCount > 0) {
        savedAnimals[pasture.animalType] += pasture.animalCount
      }
    }

    // 2. Remove all fences
    const fencesReturned = player.farmyard.fences.length
    player.farmyard.fences = []

    // 3. Reset pasture spaces to empty
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const space = player.getSpace(row, col)
        if (space.type === 'pasture') {
          space.type = 'empty'
        }
      }
    }
    player.farmyard.pastures = []

    game.log.add({
      template: '{player} razes {count} fences with Overhaul',
      args: { player, count: fencesReturned },
    })

    // 4. Set up 3 free fences for rebuild
    player._overhaulFreeFences = 3

    // 5. Rebuild fences
    game.actions.buildFences(player)

    // 6. Clear free fence tracking
    delete player._overhaulFreeFences

    // 7. Place animals back into new pastures
    for (const [type, count] of Object.entries(savedAnimals)) {
      if (count > 0) {
        player.addAnimals(type, count)
      }
    }
  },
}
