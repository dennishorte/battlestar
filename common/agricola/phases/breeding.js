const { Agricola } = require('../agricola.js')


Agricola.prototype.breedingPhase = function() {
  this.log.add({ template: 'Breeding Phase' })
  this.log.indent()

  const newbornTypesMap = new Map()

  for (const player of this.players.all()) {
    if (this.state.skipBreeding?.includes(player.name)) {
      continue
    }

    this.callPlayerCardHook(player, 'onBreedingPhaseStart')

    const bred = player.breedAnimals()

    const newbornTypes = (bred.sheep > 0 ? 1 : 0) + (bred.boar > 0 ? 1 : 0) + (bred.cattle > 0 ? 1 : 0)
    newbornTypesMap.set(player.name, newbornTypes)

    const totalBred = bred.sheep + bred.boar + bred.cattle
    if (totalBred > 0) {
      const parts = []
      if (bred.sheep > 0) {
        parts.push('1 sheep')
      }
      if (bred.boar > 0) {
        parts.push('1 boar')
      }
      if (bred.cattle > 0) {
        parts.push('1 cattle')
      }

      this.log.add({
        template: '{player} breeds: {animals}',
        args: { player, animals: parts.join(', ') },
      })
    }
  }

  // Call onBreedingPhaseEnd hooks (e.g., Feedyard food from unused spots, Slurry sow action)
  for (const player of this.players.all()) {
    const newbornTypes = newbornTypesMap.get(player.name) || 0
    this.callPlayerCardHook(player, 'onBreedingPhaseEnd', newbornTypes)
  }

  this.log.outdent()
}

// Revised Edition: After breeding (non-final harvest only), players may cook/exchange animals
Agricola.prototype.postBreedingPhase = function() {
  for (const player of this.players.all()) {
    // Only offer cooking if player has cooking ability and animals
    if (!player.hasCookingAbility()) {
      continue
    }

    const animals = player.getAllAnimals()
    const hasAnimals = animals.sheep > 0 || animals.boar > 0 || animals.cattle > 0

    if (!hasAnimals) {
      continue
    }

    // Only offer cooking if the player has more animals than they can house
    const hasOverflow = ['sheep', 'boar', 'cattle'].some(type => {
      return player.getTotalAnimals(type) > player.getTotalAnimalCapacity(type)
    })

    if (!hasOverflow) {
      continue
    }

    // Offer optional cooking
    let wantsToCook = true
    while (wantsToCook) {
      const options = []

      const currentAnimals = player.getAllAnimals()
      if (currentAnimals.sheep > 0) {
        options.push('Cook 1 sheep')
      }
      if (currentAnimals.boar > 0) {
        options.push('Cook 1 boar')
      }
      if (currentAnimals.cattle > 0) {
        options.push('Cook 1 cattle')
      }

      if (options.length === 0) {
        break
      }

      options.push('Done cooking')

      const selection = this.actions.choose(player, options, {
        title: 'Cook animals after breeding? (optional)',
        min: 1,
        max: 1,
      })

      const choice = selection[0]

      if (choice === 'Done cooking') {
        wantsToCook = false
      }
      else if (choice === 'Cook 1 sheep') {
        const food = player.cookAnimal('sheep', 1)
        this.log.add({
          template: '{player} cooks 1 sheep for {food} food',
          args: { player, food },
        })
      }
      else if (choice === 'Cook 1 boar') {
        const food = player.cookAnimal('boar', 1)
        this.log.add({
          template: '{player} cooks 1 boar for {food} food',
          args: { player, food },
        })
      }
      else if (choice === 'Cook 1 cattle') {
        const food = player.cookAnimal('cattle', 1)
        this.log.add({
          template: '{player} cooks 1 cattle for {food} food',
          args: { player, food },
        })
      }
    }
  }
}
