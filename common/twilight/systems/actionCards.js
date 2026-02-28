const res = require('../res/index.js')

module.exports = function(Twilight) {

  ////////////////////////////////////////////////////////////////////////////////
  // Action Cards

  Twilight.prototype._initActionCardDeck = function() {
    if (this.state.actionCardDeck) {
      return
    }

    const deck = res.buildActionDeck()
    this._shuffle(deck)
    this.state.actionCardDeck = deck
  }

  Twilight.prototype._drawActionCards = function(player, count) {
    this._initActionCardDeck()

    const drawn = []
    for (let i = 0; i < count; i++) {
      if (this.state.actionCardDeck.length === 0) {
        break
      }
      const card = this.state.actionCardDeck.pop()
      drawn.push(card)
    }

    if (drawn.length === 0) {
      return
    }

    // Store in player's hand
    if (!player.actionCards) {
      player.actionCards = []
    }
    player.actionCards.push(...drawn)

    const cardNames = drawn.map(c => c.name).join(', ')
    this.log.add({
      template: '{player} draws {count} action cards: {cards}',
      args: { player, count: drawn.length, cards: cardNames },
      visibility: [player.name],
      redacted: '{player} draws {count} action cards',
    })

    // Yssaril Scheming: draw 1 extra, then discard 1
    this.factionAbilities.onActionCardDraw(player, drawn)
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Playing Action Cards

  Twilight.prototype._playActionCard = function(player) {
    const actionCards = (player.actionCards || []).filter(c => c.timing === 'action')
    if (actionCards.length === 0) {
      return
    }

    const cardNames = actionCards.map(c => c.name)
    const selection = this.actions.choose(player, cardNames, {
      title: 'Play Action Card',
    })

    const cardName = selection[0]
    const cardIndex = player.actionCards.findIndex(c => c.name === cardName && c.timing === 'action')
    if (cardIndex === -1) {
      return
    }

    const card = player.actionCards.splice(cardIndex, 1)[0]

    this.log.add({
      template: '{player} plays {card}',
      args: { player, card: card.name },
    })

    // Discard the card
    if (!this.state.actionCardDiscard) {
      this.state.actionCardDiscard = []
    }
    this.state.actionCardDiscard.push(card)

    // Allow reactions (e.g., Xxcha Instinct Training can cancel)
    const cancelled = this.factionAbilities.onActionCardPlayed(player, card)
    if (cancelled) {
      return
    }

    // Resolve the card effect
    this._resolveActionCard(player, card)

    // Council Keleres commander unlock: Spend 1 TG after playing an action card
    // that has a component action (timing: 'action').
    this._checkKeleresCommanderUnlock(player, card)
  }

  Twilight.prototype._checkKeleresCommanderUnlock = function(player, card) {
    if (player.faction?.id !== 'council-keleres') {
      return
    }
    if (player.isCommanderUnlocked()) {
      return
    }
    // Action cards with "ACTION:" timing are component-action cards
    if (card.timing !== 'action') {
      return
    }
    if (player.tradeGoods < 1) {
      return
    }

    const choice = this.actions.choose(player, ['Spend 1 TG to unlock commander', 'Pass'], {
      title: 'Suffi An: Spend 1 trade good to unlock your commander?',
    })

    if (choice[0] === 'Spend 1 TG to unlock commander') {
      player.addTradeGoods(-1)
      player.unlockCommander()
      this.log.add({
        template: '{player} spends 1 TG to unlock commander: {name}',
        args: { player, name: player.faction?.leaders?.commander?.name || 'Commander' },
      })
    }
  }

  Twilight.prototype._resolveActionCard = function(player, card) {
    switch (card.id) {
      case 'focused-research':
        this._resolveCard_focusedResearch(player)
        break
      case 'mining-initiative':
        this._resolveCard_miningInitiative(player)
        break
      case 'industrial-initiative':
        this._resolveCard_industrialInitiative(player)
        break
      case 'unexpected-action':
        this._resolveCard_unexpectedAction(player)
        break
      case 'ghost-ship':
        this._resolveCard_ghostShip(player)
        break
      case 'plague':
        this._resolveCard_plague(player)
        break
      case 'uprising':
        this._resolveCard_uprising(player)
        break
    }
  }

  // Focused Research: Spend 4 trade goods to research 1 technology
  Twilight.prototype._resolveCard_focusedResearch = function(player) {
    if (player.tradeGoods < 4) {
      return
    }
    player.spendTradeGoods(4)
    this._researchTech(player)
  }

  // Mining Initiative: Gain trade goods equal to the resource value of 1 planet you control
  Twilight.prototype._resolveCard_miningInitiative = function(player) {
    const planets = player.getControlledPlanets()
    if (planets.length === 0) {
      return
    }

    const selection = this.actions.choose(player, planets, {
      title: 'Choose planet (Mining Initiative)',
    })

    const planetId = selection[0]
    const planet = res.getPlanet(planetId)
    if (planet) {
      player.addTradeGoods(planet.resources)
      this.log.add({
        template: '{player} gains {amount} trade goods from {planet}',
        args: { player, amount: planet.resources, planet: planetId },
      })
    }
  }

  // Industrial Initiative: Gain 1 trade good for each industrial planet you control
  Twilight.prototype._resolveCard_industrialInitiative = function(player) {
    const planets = player.getControlledPlanets()
    let count = 0
    for (const planetId of planets) {
      const planet = res.getPlanet(planetId)
      if (planet && planet.trait === 'industrial') {
        count++
      }
    }
    if (count > 0) {
      player.addTradeGoods(count)
      this.log.add({
        template: '{player} gains {count} trade goods from industrial planets',
        args: { player, count },
      })
    }
  }

  // Unexpected Action: Remove 1 command token from a system and return it
  Twilight.prototype._resolveCard_unexpectedAction = function(player) {
    const systemsWithTokens = Object.entries(this.state.systems)
      .filter(([, sys]) => sys.commandTokens.includes(player.name))
      .map(([id]) => id)

    if (systemsWithTokens.length === 0) {
      return
    }

    const selection = this.actions.choose(player, systemsWithTokens, {
      title: 'Remove command token from system',
    })

    const systemId = selection[0]
    const tokens = this.state.systems[systemId].commandTokens
    const idx = tokens.indexOf(player.name)
    if (idx !== -1) {
      tokens.splice(idx, 1)
      player.commandTokens.tactics++
      this.log.add({
        template: '{player} removes command token from system {system}',
        args: { player, system: systemId },
      })
    }
  }

  // Ghost Ship: Place 1 destroyer in a system with a wormhole and no enemy ships
  Twilight.prototype._resolveCard_ghostShip = function(player) {
    const validSystems = Object.entries(this.state.systems)
      .filter(([, sys]) => {
        const tile = res.getSystemTile(sys.tileId) || res.getSystemTile(Number(sys.tileId))
        if (!tile || !tile.wormholes || tile.wormholes.length === 0) {
          return false
        }
        const units = this.state.units[String(sys.tileId)]
        if (!units) {
          return false
        }
        const hasEnemyShips = units.space.some(
          u => u.owner !== player.name && res.getUnit(u.type)?.category === 'ship'
        )
        return !hasEnemyShips
      })
      .map(([id]) => id)

    if (validSystems.length === 0) {
      return
    }

    const selection = this.actions.choose(player, validSystems, {
      title: 'Place destroyer (Ghost Ship)',
    })

    const systemId = selection[0]
    this._addUnit(systemId, 'space', 'destroyer', player.name)
    this.log.add({
      template: '{player} places a destroyer in system {system}',
      args: { player, system: systemId },
    })
  }

  // Plague: Roll dice for infantry on a planet, destroy on 6+
  Twilight.prototype._resolveCard_plague = function(player) {
  // Find all planets with infantry
    const planetsWithInfantry = []
    for (const [, systemUnits] of Object.entries(this.state.units)) {
      for (const [planetId, units] of Object.entries(systemUnits.planets)) {
        const infantry = units.filter(u => u.type === 'infantry')
        if (infantry.length > 0) {
          planetsWithInfantry.push(planetId)
        }
      }
    }

    if (planetsWithInfantry.length === 0) {
      return
    }

    const selection = this.actions.choose(player, planetsWithInfantry, {
      title: 'Choose planet (Plague)',
    })

    const planetId = selection[0]
    const systemId = this._findSystemForPlanet(planetId)
    if (!systemId) {
      return
    }

    const planetUnits = this.state.units[systemId].planets[planetId]
    const infantry = planetUnits.filter(u => u.type === 'infantry')
    let destroyed = 0

    for (const unit of infantry) {
      const roll = Math.floor(this.random() * 10) + 1
      if (roll >= 6) {
        const idx = planetUnits.findIndex(u => u.id === unit.id)
        if (idx !== -1) {
          planetUnits.splice(idx, 1)
          destroyed++
        }
      }
    }

    this.log.add({
      template: 'Plague destroys {count} infantry on {planet}',
      args: { count: destroyed, planet: planetId },
    })
  }

  // Uprising: Exhaust 1 non-home planet controlled by another player, gain TG equal to resources
  Twilight.prototype._resolveCard_uprising = function(player) {
    const targetPlanets = []
    for (const [planetId, planetState] of Object.entries(this.state.planets)) {
      if (planetState.controller && planetState.controller !== player.name && !planetState.exhausted) {
      // Check if this is a home planet
        const controller = this.players.byName(planetState.controller)
        if (!controller?.faction) {
          continue
        }
        const homeSystem = res.getSystemTile(controller.faction.homeSystem)
        if (homeSystem && homeSystem.planets.includes(planetId)) {
          continue  // Skip home planets
        }
        targetPlanets.push(planetId)
      }
    }

    if (targetPlanets.length === 0) {
      return
    }

    const selection = this.actions.choose(player, targetPlanets, {
      title: 'Choose planet (Uprising)',
    })

    const planetId = selection[0]
    this.state.planets[planetId].exhausted = true
    const planet = res.getPlanet(planetId)
    if (planet) {
      player.addTradeGoods(planet.resources)
      this.log.add({
        template: '{player} exhausts {planet} and gains {amount} trade goods',
        args: { player, planet: planetId, amount: planet.resources },
      })
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Secret Objectives

  Twilight.prototype._initSecretObjectiveDeck = function() {
    if (this.state.secretObjectiveDeck) {
      return
    }

    const secrets = res.getSecretObjectives().map(o => o.id)
    this._shuffle(secrets)
    this.state.secretObjectiveDeck = secrets
  }

  Twilight.prototype._drawSecretObjective = function(player) {
    this._initSecretObjectiveDeck()

    if (this.state.secretObjectiveDeck.length === 0) {
      return
    }

    // Rule 61.21: max 3 secret objectives in hand
    if (player.secretObjectives && player.secretObjectives.length >= 3) {
      return
    }

    const objectiveId = this.state.secretObjectiveDeck.pop()

    if (!player.secretObjectives) {
      player.secretObjectives = []
    }
    player.secretObjectives.push(objectiveId)

    this.log.add({
      template: '{player} draws a secret objective',
      args: { player },
    })
  }

} // module.exports
