const { Agricola } = require('../agricola.js')
const res = require('../res/index.js')


Agricola.prototype.harvestPhase = function() {
  this.log.add({ template: '=== Harvest ===', event: 'harvest' })
  this.log.indent()

  // Call onHarvestStart and onBeforeHarvest hooks (e.g., Lunchtime Beer, Haydryer)
  this.state.skipField = []
  this.state.skipFeeding = []
  this.state.skipBreeding = []
  for (const player of this.players.all()) {
    this.callPlayerCardHook(player, 'onHarvestStart')
    this.callPlayerCardHook(player, 'onBeforeHarvest')

    // Consume skipNextHarvest flag (Layabout: skip entire harvest)
    if (player.skipNextHarvest) {
      this.state.skipField.push(player.name)
      this.state.skipFeeding.push(player.name)
      this.state.skipBreeding.push(player.name)
      delete player.skipNextHarvest
      this.log.add({
        template: '{player} skips the harvest',
        args: { player },
      })
    }
  }

  const isFinalHarvest = this.state.round === res.constants.totalRounds

  // Call onBeforeFinalHarvest hooks (e.g., Transactor collects board resources)
  if (isFinalHarvest) {
    this.callCardHook('onBeforeFinalHarvest')
  }

  this.fieldPhase()
  this.feedingPhase()
  this.breedingPhase()

  // Clean up skip flags
  delete this.state.skipField
  delete this.state.skipFeeding
  delete this.state.skipBreeding

  // Call onHarvestEnd hooks (e.g., ValueAssets offers to buy building resources)
  this.callCardHook('onHarvestEnd')

  // Call onAfterFinalHarvest hooks (e.g., EarthenwarePotter bonus points)
  if (isFinalHarvest) {
    this.callCardHook('onAfterFinalHarvest')
  }

  // Revised Edition rule:
  // - During breeding phase, you cannot eat/exchange animals
  // - After breeding in rounds 4, 7, 9, 11, 13: eating/exchanging IS allowed before next round
  // - After breeding in round 14: game ends IMMEDIATELY, no cooking allowed
  if (!isFinalHarvest) {
    // Allow optional cooking/exchanging after breeding (non-final harvest only)
    this.postBreedingPhase()
  }
  else {
    this.log.add({ template: 'Final harvest complete - game ends immediately' })
  }

  this.log.outdent()
}

Agricola.prototype.fieldPhase = function() {
  this.log.add({ template: 'Field Phase: Harvesting crops' })
  this.log.indent()

  // Record last harvest round for Dutch Windmill
  this.state.lastHarvestRound = this.state.round

  // Snapshot goods in fields before final harvest (for Wood Rake)
  if (this.state.round === 14) {
    for (const player of this.players.all()) {
      player.goodsInFieldsBeforeFinalHarvest = player.getTotalGoodsInFields()
    }
  }

  for (const player of this.players.all()) {
    if (this.state.skipField?.includes(player.name)) {
      continue
    }

    // Call onBeforeFieldPhase hooks (e.g., Straw Manure adds vegetables before harvest)
    this.callPlayerCardHook(player, 'onBeforeFieldPhase')

    // Give players with crop-move ability a chance to rearrange before harvest
    const anytimeActions = this.getAnytimeActions(player)
    const hasCropMove = anytimeActions.some(a => a.type === 'crop-move')
    if (hasCropMove) {
      this.actions.choose(player, ['Harvest crops'], {
        title: 'Use anytime actions before harvest?',
        min: 1, max: 1,
      })
    }

    // Count fields with crops before harvesting (for onHarvestField hook)
    const fieldsWithCrops = player.getFieldSpaces().filter(f => f.crop && f.cropCount > 0).length

    const result = player.harvestFields()
    const harvested = result.harvested

    // Fire onHarvestField once per field that was harvested
    for (let i = 0; i < fieldsWithCrops; i++) {
      this.callPlayerCardHook(player, 'onHarvestField')
    }

    if (harvested.grain > 0 || harvested.vegetables > 0 || harvested.wood > 0) {
      this.log.add({
        template: '{player} harvests {grain} grain, {veg} vegetables, and {wood} wood',
        args: { player, grain: harvested.grain, veg: harvested.vegetables, wood: harvested.wood },
      })
    }

    if (harvested.grain > 0) {
      this.callPlayerCardHook(player, 'onHarvestGrain', harvested.grain)
    }
    if (harvested.vegetables > 0) {
      this.callPlayerCardHook(player, 'onHarvestVegetables', harvested.vegetables)
    }

    // Process virtual field callbacks
    for (const vfh of result.virtualFieldHarvests) {
      // onHarvest callback (e.g., Artichoke Field gives food per harvest)
      if (vfh.onHarvest) {
        const card = this.cards.byId(vfh.cardId)
        if (card && card.definition.onHarvest) {
          card.definition.onHarvest(this, player, vfh.amount)
        }
      }

      // onHarvestLast callback (e.g., Cherry Orchard gives vegetable)
      if (vfh.isLast && vfh.onHarvestLast) {
        const card = this.cards.byId(vfh.cardId)
        if (card && card.definition.onHarvestLast) {
          card.definition.onHarvestLast(this, player, vfh.crop)
        }
      }
    }

    // Call onHarvestLastCrop hooks for fields that became empty (e.g., Slurry Spreader)
    if (result.lastCropHarvests) {
      for (const cropType of result.lastCropHarvests) {
        this.callPlayerCardHook(player, 'onHarvestLastCrop', cropType)
      }
    }

    // Call onFieldPhase hooks (e.g., Scythe harvests all from one field)
    this.callPlayerCardHook(player, 'onFieldPhase')
  }

  // Call onHarvest hooks (e.g., Scythe Worker gives bonus grain)
  this.callHarvestHooks()

  this.callCardHook('onFieldPhaseEnd')

  this.log.outdent()
}
