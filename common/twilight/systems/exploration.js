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
    const { player, ownerName, planetId } = context

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
        if (planetId && systemId) {
          this._addUnit(systemId, planetId, 'infantry', ownerName)
          this.log.add({
            template: '{player} places 1 infantry on {planet}',
            args: { player: ownerName, planet: planetId },
          })
        }
        break
      }

      case 'freelancers': {
        // Produce 1 unit in this system (may spend influence as resources).
        // Deferred: requires mini-production flow.
        break
      }

      case 'gamma-wormhole': {
        // Place gamma wormhole token in this system, then purge card.
        // Deferred: requires wormhole token system.
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
        // Persistent card: ACTION: spend 6 resources + purge → research 1 tech.
        // Deferred: requires persistent card tracking.
        break
      }

      case 'gamma-relay': {
        // Place gamma wormhole token in this system, then purge card.
        // Deferred: requires wormhole token system.
        break
      }

      case 'ion-storm': {
        // Place ion storm token, persistent flip mechanic.
        // Deferred.
        break
      }

      case 'mirage': {
        // Place Mirage planet token, dynamic planet creation.
        // Deferred.
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
      const card = res.getExplorationCard(cardId)
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
    }
    return bonuses
  }

} // module.exports
