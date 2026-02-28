const res = require('../res/index.js')

module.exports = function(Twilight) {

  Twilight.prototype._initExplorationDecks = function() {
    if (this.state.explorationDecks) {
      return
    }

    this.state.explorationDecks = {}
    for (const trait of ['cultural', 'hazardous', 'industrial', 'frontier']) {
      const cards = res.getExplorationCards(trait)
      this._shuffle(cards)
      this.state.explorationDecks[trait] = cards
    }
  }

  Twilight.prototype._drawExplorationCard = function(trait) {
    this._initExplorationDecks()

    const deck = this.state.explorationDecks[trait]
    if (!deck || deck.length === 0) {
      return null
    }

    return deck.pop()
  }

  // Shared card resolution logic used by both planet and frontier exploration.
  // context: { player, ownerName, planetId?, systemId? }
  Twilight.prototype._resolveExplorationCard = function(card, context) {
    const { player, ownerName, planetId, systemId } = context

    if (card.type === 'attach') {
      if (planetId) {
        // Attach to planet
        if (!this.state.planets[planetId]) {
          this.state.planets[planetId] = { controller: null, exhausted: false, attachments: [] }
        }
        if (!this.state.planets[planetId].attachments) {
          this.state.planets[planetId].attachments = []
        }
        this.state.planets[planetId].attachments.push(card.id)

        this.log.add({
          template: '{card} attached to {planet}',
          args: { card: card.name, planet: planetId },
        })

        // Demilitarized Zone immediate effect
        if (card.attachment?.demilitarized && systemId) {
          this._applyDemilitarizedZone(systemId, planetId, ownerName)
        }
      }
    }
    else if (card.type === 'fragment') {
      if (!player.relicFragments) {
        player.relicFragments = []
      }
      player.relicFragments.push(card.fragmentType)

      this.log.add({
        template: '{player} gains a {type} relic fragment',
        args: { player: ownerName, type: card.fragmentType },
      })
    }
    else if (card.type === 'action') {
      this._resolveActionExploration(card, context)
    }
  }

  Twilight.prototype._explorePlanet = function(planetId, ownerName) {
    // Only explore planets with traits (not home system planets or Mecatol Rex)
    const planet = res.getPlanet(planetId)
    if (!planet || !planet.trait) {
      return
    }

    // Only explore once per planet
    if (this.state.exploredPlanets[planetId]) {
      return
    }

    this.state.exploredPlanets[planetId] = true

    const player = this.players.byName(ownerName)

    // Draw exploration card(s) — Naaz-Rokha distant-suns draws extra with mech
    const bonusCards = this.factionAbilities.getExplorationBonus(player, planetId)
    const cards = []
    const mainCard = this._drawExplorationCard(planet.trait)
    if (mainCard) {
      cards.push(mainCard)
    }
    for (let i = 0; i < bonusCards; i++) {
      const extra = this._drawExplorationCard(planet.trait)
      if (extra) {
        cards.push(extra)
      }
    }

    let card
    if (cards.length === 0) {
      return
    }
    else if (cards.length === 1) {
      card = cards[0]
    }
    else {
      // Player chooses which card to keep
      const cardChoices = cards.map(c => c.name || c.id)
      const selection = this.actions.choose(player, cardChoices, {
        title: 'Choose exploration card to keep',
      })
      card = cards.find(c => (c.name || c.id) === selection[0]) || cards[0]
    }

    this.log.add({
      template: '{player} explores {planet}: {card}',
      args: { player: ownerName, planet: planetId, card: card.name },
    })

    // Ensure planet state exists
    if (!this.state.planets[planetId]) {
      this.state.planets[planetId] = { controller: null, exhausted: false, attachments: [] }
    }

    const systemId = this._findSystemForPlanet(planetId)
    this._resolveExplorationCard(card, { player, ownerName, planetId, systemId })

    // Titans terragenesis: offer sleeper placement after exploration
    if (systemId) {
      this.factionAbilities.afterExploration(player, planetId, systemId)
    }
  }

  // Explore a frontier token in a system (no planets).
  // Used by Dark Energy Tap tech and Empyrean Multiverse Shift hero.
  Twilight.prototype._exploreFrontier = function(systemId, ownerName, logPrefix) {
    if (!this.state.exploredPlanets) {
      this.state.exploredPlanets = {}
    }

    // Already explored
    if (this.state.exploredPlanets[systemId]) {
      return false
    }

    this.state.exploredPlanets[systemId] = true

    // Remove frontier token if tracked
    if (this.state._frontierTokens) {
      delete this.state._frontierTokens[systemId]
    }

    const player = this.players.byName(ownerName)
    const card = this._drawExplorationCard('frontier')
    if (!card) {
      return false
    }

    const prefix = logPrefix ? `${logPrefix}: ` : ''
    this.log.add({
      template: `${prefix}{player} explores frontier — {card}`,
      args: { player: ownerName, card: card.name },
    })

    this._resolveExplorationCard(card, { player, ownerName, systemId })
    return true
  }

  // Dispatch action-type exploration card effects.
  Twilight.prototype._resolveActionExploration = function(card, context) {
    const { player, ownerName, planetId, systemId } = context
    const baseId = card.id.replace(/-\d+$/, '')

    switch (baseId) {

      // === Cultural ===

      case 'mercenary-outfit': {
        if (planetId && systemId && !this._isDemilitarizedZone(planetId)) {
          this._addUnit(systemId, planetId, 'infantry', ownerName)
          this.log.add({
            template: '{player} places 1 infantry on {planet}',
            args: { player: ownerName, planet: planetId },
          })
        }
        break
      }

      case 'freelancers': {
        if (!systemId) {
          break
        }

        // Calculate available resources (influence counts as resources for Freelancers)
        const controlledPlanets = player.getControlledPlanets()
        const readyPlanets = controlledPlanets.filter(
          pId => !this.state.planets[pId]?.exhausted
        )
        let availableForFreelancers = 0
        for (const pId of readyPlanets) {
          const p = res.getPlanet(pId)
          if (p) {
            availableForFreelancers += p.resources + p.influence
          }
          // Include attachment bonuses
          const bonuses = this._getPlanetAttachmentBonuses(pId)
          availableForFreelancers += bonuses.resources + bonuses.influence
        }
        availableForFreelancers += player.tradeGoods

        // Offer unit type choices that the player can afford
        const unitTypes = ['infantry', 'fighter', 'mech', 'pds', 'space-dock',
          'destroyer', 'cruiser', 'carrier', 'dreadnought', 'war-sun']
        const affordable = unitTypes.filter(type => {
          const def = this._getUnitStats(ownerName, type)
          return def && def.cost <= availableForFreelancers
        })

        if (affordable.length === 0) {
          break
        }

        const choices = ['Pass', ...affordable]
        const sel = this.actions.choose(player, choices, {
          title: 'Freelancers: Produce 1 unit (influence counts as resources)',
          noAutoRespond: true,
        })

        if (sel[0] === 'Pass') {
          break
        }

        const unitType = sel[0]
        const unitDef = this._getUnitStats(ownerName, unitType)
        const unitCategory = res.getUnit(unitType)?.category

        // Place the unit
        if (unitCategory === 'ship') {
          this._addUnit(systemId, 'space', unitType, ownerName)
        }
        else if (planetId) {
          this._addUnit(systemId, planetId, unitType, ownerName)
        }

        // Pay cost: exhaust cheapest planets (both R+I count), then trade goods
        let cost = unitDef.cost
        const sortedPlanets = readyPlanets
          .map(pId => {
            const p = res.getPlanet(pId)
            const bonuses = this._getPlanetAttachmentBonuses(pId)
            const value = (p ? p.resources + p.influence : 0) + bonuses.resources + bonuses.influence
            return { id: pId, value }
          })
          .sort((a, b) => a.value - b.value)

        for (const { id: pId, value } of sortedPlanets) {
          if (cost <= 0) {
            break
          }
          this.state.planets[pId].exhausted = true
          cost -= value
        }
        if (cost > 0) {
          player.spendTradeGoods(Math.min(cost, player.tradeGoods))
        }

        this.log.add({
          template: '{player} uses Freelancers to produce 1 {unit}',
          args: { player: ownerName, unit: unitType },
        })
        break
      }

      case 'gamma-wormhole': {
        if (systemId) {
          if (!this.state.gammaWormholeTokens) {
            this.state.gammaWormholeTokens = []
          }
          if (!this.state.gammaWormholeTokens.includes(String(systemId))) {
            this.state.gammaWormholeTokens.push(String(systemId))
          }
          this.log.add({
            template: 'Gamma wormhole token placed in system {system}',
            args: { system: systemId },
          })
        }
        break
      }

      // === Industrial ===

      case 'abandoned-warehouses': {
        const choices = ['Gain 2 Commodities']
        if (player.commodities > 0) {
          choices.push('Convert Commodities to Trade Goods')
        }
        if (choices.length === 1) {
          player.commodities = Math.min(player.commodities + 2, player.maxCommodities)
          this.log.add({
            template: '{player} gains 2 commodities',
            args: { player: ownerName },
          })
        }
        else {
          const sel = this.actions.choose(player, choices, {
            title: 'Abandoned Warehouses',
          })
          if (sel[0] === 'Gain 2 Commodities') {
            player.commodities = Math.min(player.commodities + 2, player.maxCommodities)
            this.log.add({
              template: '{player} gains 2 commodities',
              args: { player: ownerName },
            })
          }
          else {
            const toConvert = Math.min(2, player.commodities)
            player.addTradeGoods(toConvert)
            player.commodities -= toConvert
            this.log.add({
              template: '{player} converts {count} commodities to trade goods',
              args: { player: ownerName, count: toConvert },
            })
          }
        }
        break
      }

      case 'functioning-base': {
        const choices = ['Gain 1 Commodity']
        if (player.tradeGoods > 0 || player.commodities > 0) {
          choices.push('Spend 1 to Draw Action Card')
        }
        if (choices.length === 1) {
          player.commodities = Math.min(player.commodities + 1, player.maxCommodities)
          this.log.add({
            template: '{player} gains 1 commodity',
            args: { player: ownerName },
          })
        }
        else {
          const sel = this.actions.choose(player, choices, {
            title: 'Functioning Base',
          })
          if (sel[0] === 'Gain 1 Commodity') {
            player.commodities = Math.min(player.commodities + 1, player.maxCommodities)
            this.log.add({
              template: '{player} gains 1 commodity',
              args: { player: ownerName },
            })
          }
          else {
            if (player.commodities > 0) {
              player.commodities -= 1
            }
            else {
              player.addTradeGoods(-1)
            }
            this._drawActionCards(player, 1)
          }
        }
        break
      }

      case 'local-fabricators': {
        const choices = ['Gain 1 Commodity']
        if ((player.tradeGoods > 0 || player.commodities > 0) && planetId && systemId) {
          choices.push('Spend 1 to Place Mech')
        }
        if (choices.length === 1) {
          player.commodities = Math.min(player.commodities + 1, player.maxCommodities)
          this.log.add({
            template: '{player} gains 1 commodity',
            args: { player: ownerName },
          })
        }
        else {
          const sel = this.actions.choose(player, choices, {
            title: 'Local Fabricators',
          })
          if (sel[0] === 'Gain 1 Commodity') {
            player.commodities = Math.min(player.commodities + 1, player.maxCommodities)
            this.log.add({
              template: '{player} gains 1 commodity',
              args: { player: ownerName },
            })
          }
          else {
            if (player.commodities > 0) {
              player.commodities -= 1
            }
            else {
              player.addTradeGoods(-1)
            }
            this._addUnit(systemId, planetId, 'mech', ownerName)
            this.log.add({
              template: '{player} places 1 mech on {planet}',
              args: { player: ownerName, planet: planetId },
            })
          }
        }
        break
      }

      // === Hazardous ===
      // Shared pattern: "If you have at least 1 mech on this planet,
      // or if you remove 1 infantry from this planet" → effect.

      case 'core-mine':
      case 'expedition':
      case 'volatile-fuel-source': {
        if (!planetId || !systemId) {
          break
        }

        const units = this.state.units[systemId]?.planets[planetId] || []
        const hasMech = units.some(u => u.type === 'mech' && u.owner === ownerName)
        const infantry = units.find(u => u.type === 'infantry' && u.owner === ownerName)

        let eligible = false
        if (hasMech) {
          eligible = true
        }
        else if (infantry) {
          this._removeUnit(systemId, planetId, infantry.id)
          this.log.add({
            template: '{player} removes 1 infantry from {planet}',
            args: { player: ownerName, planet: planetId },
          })
          eligible = true
        }

        if (eligible) {
          if (baseId === 'core-mine') {
            player.addTradeGoods(1)
            this.log.add({
              template: '{player} gains 1 trade good',
              args: { player: ownerName },
            })
          }
          else if (baseId === 'expedition') {
            this.state.planets[planetId].exhausted = false
            this.log.add({
              template: '{player} readies {planet}',
              args: { player: ownerName, planet: planetId },
            })
          }
          else if (baseId === 'volatile-fuel-source') {
            const poolChoice = this.actions.choose(player, ['tactics', 'fleet', 'strategy'], {
              title: 'Volatile Fuel Source: Place command token in:',
            })
            player.commandTokens[poolChoice[0]]++
            this.log.add({
              template: '{player} gains 1 command token in {pool}',
              args: { player: ownerName, pool: poolChoice[0] },
            })
          }
        }
        break
      }

      // === Frontier ===

      case 'lost-crew': {
        this._drawActionCards(player, 2)
        break
      }

      case 'derelict-vessel': {
        this._drawSecretObjective(player)
        break
      }

      case 'merchant-station': {
        const choices = ['Replenish Commodities', 'Convert Commodities to Trade Goods']
        const sel = this.actions.choose(player, choices, {
          title: 'Merchant Station',
        })
        if (sel[0] === 'Replenish Commodities') {
          player.replenishCommodities()
          this.log.add({
            template: '{player} replenishes commodities',
            args: { player: ownerName },
          })
        }
        else {
          const toConvert = player.commodities
          player.addTradeGoods(toConvert)
          player.commodities = 0
          this.log.add({
            template: '{player} converts {count} commodities to trade goods',
            args: { player: ownerName, count: toConvert },
          })
        }
        break
      }

      case 'entropic-field':
      case 'major-entropic-field':
      case 'minor-entropic-field': {
        const tgAmount = baseId === 'major-entropic-field' ? 3
          : baseId === 'entropic-field' ? 2
            : 1
        player.addTradeGoods(tgAmount)

        const poolChoice = this.actions.choose(player, ['tactics', 'fleet', 'strategy'], {
          title: `${card.name}: Place command token in:`,
        })
        player.commandTokens[poolChoice[0]]++

        this.log.add({
          template: '{player} gains {tg} trade goods and 1 command token in {pool}',
          args: { player: ownerName, tg: tgAmount, pool: poolChoice[0] },
        })
        break
      }

      case 'keleres-ship': {
        for (let i = 0; i < 2; i++) {
          const poolChoice = this.actions.choose(player, ['tactics', 'fleet', 'strategy'], {
            title: `Keleres Ship: Place command token ${i + 1} of 2 in:`,
          })
          player.commandTokens[poolChoice[0]]++
        }
        this.log.add({
          template: '{player} gains 2 command tokens',
          args: { player: ownerName },
        })
        break
      }

      case 'dead-world': {
        this._gainRelic(ownerName)
        break
      }

      case 'enigmatic-device': {
        // Persistent card: place in play area
        if (!this.state.persistentCards[ownerName]) {
          this.state.persistentCards[ownerName] = []
        }
        this.state.persistentCards[ownerName].push(card.id)
        this.log.add({
          template: '{player} places {card} in play area',
          args: { player: ownerName, card: card.name },
        })
        break
      }

      case 'gamma-relay': {
        if (systemId) {
          if (!this.state.gammaWormholeTokens) {
            this.state.gammaWormholeTokens = []
          }
          if (!this.state.gammaWormholeTokens.includes(String(systemId))) {
            this.state.gammaWormholeTokens.push(String(systemId))
          }
          this.log.add({
            template: 'Gamma wormhole token placed in system {system}',
            args: { system: systemId },
          })
        }
        break
      }

      case 'ion-storm': {
        if (!systemId) {
          break
        }

        // Choose which wormhole side to start with
        const sideSel = this.actions.choose(player, ['alpha', 'beta'], {
          title: 'Ion Storm: Choose wormhole side',
        })
        const side = sideSel[0]

        this.state.ionStormToken = { systemId: String(systemId), side }

        this.log.add({
          template: '{player} places Ion Storm ({side} wormhole) in system {system}',
          args: { player: ownerName, side, system: systemId },
        })
        break
      }

      case 'mirage': {
        if (!systemId) {
          break
        }

        // Place Mirage planet in this system
        this.state.miragePlanet = String(systemId)

        // Initialize planet state
        this.state.planets['mirage'] = {
          controller: ownerName,
          exhausted: false,
          attachments: [],
        }

        // Initialize unit storage
        if (!this.state.units[systemId].planets['mirage']) {
          this.state.units[systemId].planets['mirage'] = []
        }

        this.log.add({
          template: '{player} places the Mirage planet in system {system}',
          args: { player: ownerName, system: systemId },
        })
        break
      }
    }
  }

  Twilight.prototype._initRelicDeck = function() {
    if (this.state.relicDeck) {
      return
    }
    const allRelics = res.getAllRelics()
    this.state.relicDeck = this._shuffle(allRelics.map(r => r.id))
  }

  Twilight.prototype._gainRelic = function(playerName) {
    this._initRelicDeck()
    if (this.state.relicDeck.length === 0) {
      return null
    }

    const relicId = this.state.relicDeck.pop()
    if (!this.state.relicsGained) {
      this.state.relicsGained = {}
    }
    if (!this.state.relicsGained[playerName]) {
      this.state.relicsGained[playerName] = []
    }
    this.state.relicsGained[playerName].push(relicId)

    const relic = res.getRelic(relicId)
    this.log.add({
      template: '{player} gains relic: {relic}',
      args: { player: playerName, relic: relic?.name || relicId },
    })

    // On-gain effects
    if (relic?.onGain === 'drawSecretObjective') {
      const player = this.players.byName(playerName)
      this._drawSecretObjective(player)
    }
    else if (relic?.onGain === 'researchTwoNoPrereq') {
      const player = this.players.byName(playerName)
      this._executeBookOfLatviniaOnGain(player)
    }
    else if (relic?.victoryPoints) {
      const player = this.players.byName(playerName)
      player.addVictoryPoints(relic.victoryPoints)
    }

    this.factionAbilities.onRelicGained(playerName)
    return relicId
  }

  Twilight.prototype._getPlanetAttachmentBonuses = function(planetId) {
    const bonuses = { resources: 0, influence: 0, techSpecialties: [] }
    const attachments = this.state.planets[planetId]?.attachments || []
    for (const cardId of attachments) {
      // Check exploration cards first, then relics (for Nano-Forge)
      const card = res.getExplorationCard(cardId) || res.getRelic(cardId)
      if (!card?.attachment) {
        continue
      }
      const att = card.attachment
      const planet = res.getPlanet(planetId)

      // Research facilities: fallback to +1/+1 if planet already has a specialty
      if (att.techSpecialty) {
        if (planet?.techSpecialty) {
          bonuses.resources += att.fallback?.resources || 0
          bonuses.influence += att.fallback?.influence || 0
        }
        else {
          bonuses.techSpecialties.push(att.techSpecialty)
        }
      }

      bonuses.resources += att.resources || 0
      bonuses.influence += att.influence || 0
      if (att.legendary) {
        bonuses.legendary = true
      }
    }
    return bonuses
  }

  // Check if a planet has the Demilitarized Zone attachment
  Twilight.prototype._isDemilitarizedZone = function(planetId) {
    return this.state.planets[planetId]?.attachments?.includes('demilitarized-zone') || false
  }

  // Immediate effect when DMZ is attached: remove structures, move ground forces to space
  Twilight.prototype._applyDemilitarizedZone = function(systemId, planetId, ownerName) {
    const systemUnits = this.state.units[systemId]
    if (!systemUnits?.planets[planetId]) {
      return
    }

    const planetUnits = systemUnits.planets[planetId]
    const toRemove = []
    const toSpace = []

    for (let i = planetUnits.length - 1; i >= 0; i--) {
      const unit = planetUnits[i]
      if (unit.owner !== ownerName) {
        continue
      }
      const unitDef = res.getUnit(unit.type)
      if (!unitDef) {
        continue
      }
      if (unitDef.category === 'structure') {
        toRemove.push(planetUnits.splice(i, 1)[0])
      }
      else if (unitDef.category === 'ground') {
        toSpace.push(planetUnits.splice(i, 1)[0])
      }
    }

    // Move ground forces to space area
    for (const unit of toSpace) {
      systemUnits.space.push(unit)
    }

    if (toRemove.length > 0) {
      this.log.add({
        template: 'Demilitarized Zone: {count} structures returned to reinforcements',
        args: { count: toRemove.length },
      })
    }
    if (toSpace.length > 0) {
      this.log.add({
        template: 'Demilitarized Zone: {count} ground forces moved to space',
        args: { count: toSpace.length },
      })
    }
  }

} // module.exports
