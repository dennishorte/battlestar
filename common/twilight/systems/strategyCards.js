const { BaseCard } = require('../../lib/game/index.js')
const res = require('../res/index.js')

module.exports = function(Twilight) {

  Twilight.prototype._strategicAction = function(player) {
    this.log.indent()
    const usedCardId = player.useStrategyCard()

    this.log.add({
      template: '{player} uses {card}',
      args: { player, card: res.getStrategyCard(usedCardId).name },
    })

    // Resolve primary ability
    switch (usedCardId) {
      case 'leadership':
        this._leadershipPrimary(player)
        break
      case 'diplomacy':
        this._diplomacyPrimary(player)
        break
      case 'politics':
        this._politicsPrimary(player)
        break
      case 'construction':
        this._constructionPrimary(player)
        break
      case 'trade':
        this._tradePrimary(player)
        break
      case 'warfare':
        this._warfarePrimary(player)
        break
      case 'technology':
        this._technologyPrimary(player)
        break
      case 'imperial':
        this._imperialPrimary(player)
        break
    }

    // Resolve secondary abilities for other players
    this.state.lastStrategyCard = usedCardId
    this._resolveSecondaries(player, usedCardId)

    this.log.outdent()
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Strategy Card — Leadership (#1)

  Twilight.prototype._leadershipPrimary = function(player) {
  // Gain 3 command tokens (added to tactics by default)
    player.commandTokens.tactics += 3

    this.log.add({
      template: '{player} gains 3 command tokens',
      args: { player },
    })
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Strategy Card — Trade (#5)

  Twilight.prototype._tradePrimary = function(player) {
  // Gain 3 trade goods
    player.addTradeGoods(3)

    // Replenish commodities for active player
    player.replenishCommodities()

    // Replenish commodities for all other players
    const otherPlayers = this.players.all().filter(p => p.name !== player.name)
    for (const other of otherPlayers) {
      other.replenishCommodities()
    }

    this.log.add({
      template: '{player} gains 3 trade goods and replenishes commodities',
      args: { player },
    })

    // Notify faction abilities about each player's commodity replenish
    this.factionAbilities.onCommoditiesReplenished(player)
    for (const other of otherPlayers) {
      this.factionAbilities.onCommoditiesReplenished(other)
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Strategy Card — Technology (#7)

  Twilight.prototype._technologyPrimary = function(player) {
    this._researchTech(player)
  }

  Twilight.prototype._researchTech = function(player) {
  // Nekro Propagation: cannot research technology normally
    if (!this.factionAbilities.canResearchNormally(player)) {
      this.log.add({
        template: '{player} cannot research technology (Propagation)',
        args: { player },
      })
      return null
    }

    // Get available technologies player can research (generic + faction techs)
    const allTechs = [...res.getGenericTechnologies()]
    if (player.faction?.factionTechnologies) {
      allTechs.push(...player.faction.factionTechnologies)
    }
    const available = allTechs
      .filter(t => player.canResearchTechnology(t.id))
      .map(t => t.id)

    // Add techs available via special abilities (e.g., Yin commander: sacrifice infantry)
    const additionalTechs = this.factionAbilities.getAdditionalResearchableTechs(player, allTechs)
    for (const techId of additionalTechs) {
      if (!available.includes(techId)) {
        available.push(techId)
      }
    }

    if (available.length === 0) {
      return null
    }

    const selection = this.actions.choose(player, available, {
      title: 'Research Technology',
    })

    const techId = selection[0]
    const tech = res.getTechnology(techId)
    if (!tech) {
      return null
    }

    // Check if the selected tech requires a special cost (e.g., Yin infantry sacrifice)
    this.factionAbilities.onPreResearch(player, tech)

    // Create tech card and add to player's zone
    const cardId = `${player.name}-${techId}`
    let card
    try {
      card = this.cards.byId(cardId)
    }
    catch {
      card = new BaseCard(this, { ...tech, id: cardId })
      this.cards.register(card)
    }

    const techZone = this.zones.byPlayer(player, 'technologies')
    techZone.push(card, techZone.nextIndex())

    this.log.add({
      template: '{player} researches {tech}',
      args: { player, tech: tech.name },
    })

    // AI Development Algorithm: exhaust if used for unit upgrade prerequisite skip
    if (tech.unitUpgrade && this._isTechReady(player, 'ai-development-algorithm')) {
      const prereqs = player.getTechPrerequisites()
      const needed = {}
      for (const color of tech.prerequisites) {
        needed[color] = (needed[color] || 0) + 1
      }
      let deficit = 0
      for (const [color, count] of Object.entries(needed)) {
        const shortfall = count - (prereqs[color] || 0)
        if (shortfall > 0) {
          deficit += shortfall
        }
      }
      if (deficit > 0) {
        this._exhaustTech(player, 'ai-development-algorithm')
      }
    }

    // Jol-Nar Brilliant: exhaust 2 techs if this research required brilliant skip
    this.factionAbilities.onTechResearched(player, tech)

    return techId
  }

  // Get all technologies a player can currently research (has prerequisites for)
  Twilight.prototype._getResearchableTechs = function(player) {
    const allTechs = [...res.getGenericTechnologies()]
    if (player.faction?.factionTechnologies) {
      allTechs.push(...player.faction.factionTechnologies)
    }
    return allTechs.filter(t => player.canResearchTechnology(t.id))
  }

  // Grant technology directly (bypasses prerequisites — used by Nekro, Vuil'raith)
  Twilight.prototype._grantTechnology = function(player, techId) {
    const tech = res.getTechnology(techId)
    if (!tech) {
      return
    }

    const cardId = `${player.name}-${techId}`
    let card
    try {
      card = this.cards.byId(cardId)
    }
    catch {
      card = new BaseCard(this, { ...tech, id: cardId })
      this.cards.register(card)
    }

    const techZone = this.zones.byPlayer(player, 'technologies')
    techZone.push(card, techZone.nextIndex())
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Strategy Card — Imperial (#8)

  Twilight.prototype._imperialPrimary = function(player) {
  // If you control Mecatol Rex, gain 1 VP
    if (this.state.planets['mecatol-rex']?.controller === player.name) {
      player.addVictoryPoints(1)
      this.log.add({
        template: '{player} scores 1 VP from controlling Mecatol Rex (Imperial)',
        args: { player },
        event: 'scoring',
      })
      this._checkVictory()
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Strategy Card — Diplomacy (#2)

  Twilight.prototype._diplomacyPrimary = function(player) {
  // Choose a system containing a planet you control
    const controlledPlanets = player.getControlledPlanets()
    const systemsWithControlledPlanets = []
    for (const planetId of controlledPlanets) {
      const systemId = this._findSystemForPlanet(planetId)
      if (systemId && !systemsWithControlledPlanets.includes(systemId)) {
        systemsWithControlledPlanets.push(systemId)
      }
    }

    if (systemsWithControlledPlanets.length === 0) {
      return
    }

    const selection = this.actions.choose(player, systemsWithControlledPlanets, {
      title: 'Choose System (Diplomacy)',
      noAutoRespond: true,
    })
    const chosenSystem = selection[0]

    // Each other player places a command token from reinforcements in that system
    const otherPlayers = this.players.all().filter(p => p.name !== player.name)
    for (const other of otherPlayers) {
    // Only if they have tokens to place
      if (other.commandTokens.tactics > 0) {
        if (!this.state.systems[chosenSystem].commandTokens.includes(other.name)) {
          this.state.systems[chosenSystem].commandTokens.push(other.name)
        }
      }
    }

    this.log.add({
      template: '{player} uses Diplomacy on {system}',
      args: { player, system: chosenSystem },
    })

    // Faction abilities after diplomacy (e.g., Xxcha Peace Accords)
    this.factionAbilities.afterDiplomacyResolved(player)
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Strategy Card — Politics (#3)

  Twilight.prototype._politicsPrimary = function(player) {
  // Choose a player to become the new speaker (current speaker is not eligible)
    const allPlayers = this.players.all()
    const playerNames = allPlayers.map(p => p.name).filter(n => n !== this.state.speaker)

    const selection = this.actions.choose(player, playerNames, {
      title: 'Choose New Speaker (Politics)',
    })
    const newSpeaker = selection[0]
    this.state.speaker = newSpeaker

    this.log.add({
      template: '{playerSpeaker} is the new speaker',
      args: { playerSpeaker: newSpeaker },
    })

    // Draw 2 action cards
    this._drawActionCards(player, 2)

    // Look at the top 2 cards of the agenda deck
    this._politicsAgendaPeek(player)
  }

  Twilight.prototype._politicsAgendaPeek = function(player) {
  // Initialize agenda deck if needed
    if (!this.state.agendaDeck) {
      const allAgendas = res.getAllAgendaCards()
      const agendaDeck = [...allAgendas]
      this._shuffle(agendaDeck)
      this.state.agendaDeck = agendaDeck
    }

    if (this.state.agendaDeck.length === 0) {
      return
    }

    // Take the top 2 cards (or 1 if only 1 left)
    const peeked = this.state.agendaDeck.splice(0, Math.min(2, this.state.agendaDeck.length))
    const cardLabel = (card) => `${card.id}: ${card.name}`

    this.log.add({
      template: '{player} looks at the top {count} of the agenda deck',
      args: { player, count: peeked.length === 1 ? 'card' : '2 cards' },
    })

    // Place each card on top or bottom, player chooses order
    const remaining = [...peeked]

    for (let i = 0; i < peeked.length; i++) {
    // Choose which card to place (if more than 1 remaining)
      let card
      if (remaining.length === 1) {
        card = remaining[0]
      }
      else {
        const cardChoices = remaining.map(c => cardLabel(c))
        const pick = this.actions.choose(player, cardChoices, {
          title: 'Choose an agenda card to place',
        })
        card = remaining.find(c => cardLabel(c) === pick[0])
      }

      // Choose top or bottom
      const placement = this.actions.choose(player, ['Top of deck', 'Bottom of deck'], {
        title: `Place ${card.name}:`,
      })

      if (placement[0] === 'Top of deck') {
        this.state.agendaDeck.unshift(card)
      }
      else {
        this.state.agendaDeck.push(card)
      }

      remaining.splice(remaining.indexOf(card), 1)

      const position = placement[0] === 'Top of deck' ? 'top' : 'bottom'
      this.log.add({
        template: '{player} places {card} on the {position} of the deck',
        args: { player, card: card.name, position },
        visibility: [player.name],
        redacted: '{player} places an agenda card on the {position} of the deck',
      })
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Strategy Card — Construction (#4)

  Twilight.prototype._constructionPrimary = function(player) {
  // Place 1 PDS or 1 Space Dock on a planet you control
  // Then place 1 PDS on a planet you control
    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    // First structure: PDS or Space Dock
    const firstChoices = controlledPlanets.map(p => `pds:${p}`)
      .concat(controlledPlanets.map(p => `space-dock:${p}`))

    const firstSelection = this.actions.choose(player, firstChoices, {
      title: 'Place Structure (Construction)',
    })
    const [firstType, firstPlanet] = firstSelection[0].split(':')
    const firstSystemId = this._findSystemForPlanet(firstPlanet)
    if (firstSystemId) {
    // Saar Floating Factory: space docks are placed in the space area
      if (firstType === 'space-dock' && player.faction?.unitOverrides?.['space-dock']?.move > 0) {
        this._addUnit(firstSystemId, 'space', 'space-dock', player.name)
      }
      else {
        this._addUnitToPlanet(firstSystemId, firstPlanet, firstType, player.name)
      }
    }

    // Second structure: PDS only
    const secondChoices = controlledPlanets.map(p => `pds:${p}`)
    if (secondChoices.length > 0) {
      const secondSelection = this.actions.choose(player, secondChoices, {
        title: 'Place PDS (Construction)',
        noAutoRespond: true,
      })
      const [, secondPlanet] = secondSelection[0].split(':')
      const secondSystemId = this._findSystemForPlanet(secondPlanet)
      if (secondSystemId) {
        this._addUnitToPlanet(secondSystemId, secondPlanet, 'pds', player.name)
      }
    }

    this.log.add({
      template: '{player} uses Construction',
      args: { player },
    })
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Strategy Card — Warfare (#6)

  Twilight.prototype._warfarePrimary = function(player) {
  // Remove 1 command token from the game board
    const systemsWithTokens = []
    for (const [systemId, system] of Object.entries(this.state.systems)) {
      if (system.commandTokens.includes(player.name)) {
        systemsWithTokens.push(systemId)
      }
    }

    if (systemsWithTokens.length > 0) {
      const selection = this.actions.choose(player, systemsWithTokens, {
        title: 'Remove Command Token (Warfare)',
        noAutoRespond: true,
      })
      const chosenSystem = selection[0]
      const tokens = this.state.systems[chosenSystem].commandTokens
      const idx = tokens.indexOf(player.name)
      if (idx !== -1) {
        tokens.splice(idx, 1)
      }

      this.log.add({
        template: '{player} removes a command token from {system}',
        args: { player, system: chosenSystem },
      })
    }

    // Redistribute command tokens (same as status phase redistribution)
    this._redistributeTokens(player)
  }

  Twilight.prototype._redistributeTokens = function(player) {
    const totalTokens = player.commandTokens.tactics + player.commandTokens.strategy + player.commandTokens.fleet
    this.actions.choose(player, ['Done'], {
      title: `Redistribute Tokens (${totalTokens} total)`,
      noAutoRespond: true,
    })
  // For now, keep current distribution when player clicks Done
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Secondary Abilities

  Twilight.prototype._resolveSecondaries = function(activePlayer, cardId) {
    const otherPlayers = this.players.all().filter(p => p.name !== activePlayer.name)

    for (const player of otherPlayers) {
    // Determine what secondary this card offers
      const secondaryAvailable = this._getSecondaryDescription(cardId)
      if (!secondaryAvailable) {
        continue
      }

      // Hacan Masters of Trade: free Trade secondary (no strategy token cost)
      let isFree = cardId === 'trade'
      && this.factionAbilities.canSkipTradeSecondaryCost(player)

      // Acquiescence (Winnu PN): free secondary when Winnu uses strategic action
      if (!isFree && this.factionAbilities.hasAcquiescence(player, activePlayer)) {
        isFree = true
      }

      // Skip if player has no strategy tokens to spend (unless free)
      if (!isFree && player.commandTokens.strategy <= 0) {
        continue
      }

      const costLabel = isFree ? 'free' : 'costs 1 strategy token'
      const choice = this.actions.choose(player, ['Use Secondary', 'Pass'], {
        title: `${secondaryAvailable} (${costLabel})`,
      })

      if (choice[0] === 'Use Secondary') {
        if (!isFree) {
          player.spendStrategyToken()
          this.factionAbilities.onStrategyTokenSpent(player, activePlayer.name)
        }
        this._resolveSecondary(player, cardId)

        // Acquiescence: return PN to Winnu after free secondary
        this.factionAbilities.returnAcquiescence(player, activePlayer)
      }
      else {
        this.log.add({
          template: '{player} declines {secondary}',
          args: { player, secondary: secondaryAvailable },
          classes: ['player-action'],
        })
      }
    }
  }

  Twilight.prototype._getSecondaryDescription = function(cardId) {
    switch (cardId) {
      case 'leadership': return 'Spend influence to gain command tokens'
      case 'diplomacy': return 'Ready exhausted planets'
      case 'politics': return 'Draw 2 action cards'
      case 'construction': return 'Place 1 structure'
      case 'trade': return 'Replenish commodities'
      case 'warfare': return 'Produce units in your home system'
      case 'technology': return 'Research 1 technology'
      case 'imperial': return 'Draw 1 secret objective'
      default: return null
    }
  }

  Twilight.prototype._resolveSecondary = function(player, cardId) {
    switch (cardId) {
      case 'leadership':
      // Spend 3 influence to gain 1 command token
        player.commandTokens.tactics += 1
        this.log.add({
          template: '{player} gains 1 command token (Leadership secondary)',
          args: { player },
        })
        break
      case 'diplomacy':
      // Ready 2 exhausted planets (simplified)
        this._diplomacySecondary(player)
        break
      case 'politics':
      // Draw 2 action cards
        this._drawActionCards(player, 2)
        break
      case 'technology':
      // Research 1 technology (same as primary but costs strategy token)
        this._researchTech(player)
        break
      case 'warfare':
      // Produce units in home system
        this._warfareSecondary(player)
        break
      case 'construction':
      // Place 1 PDS or 1 space dock on a planet you control
        this._constructionSecondary(player)
        break
      case 'trade':
      // Replenish commodities
        player.replenishCommodities()
        this.log.add({
          template: '{player} replenishes commodities (Trade secondary)',
          args: { player },
        })
        // Nomad Artuno: after commodities replenished
        this.factionAbilities.onCommoditiesReplenished(player)
        break
      case 'imperial':
        this._drawSecretObjective(player)
        break
      default:
        break
    }
  }

  Twilight.prototype._diplomacySecondary = function(player) {
  // Ready exhausted planets outside home system (simplified: ready any 2)
    const exhaustedPlanets = player.getControlledPlanets()
      .filter(pId => this.state.planets[pId].exhausted)

    if (exhaustedPlanets.length === 0) {
      return
    }

    // Choose up to 2 planets to ready (simplified — just ready them all if ≤ 2)
    const toReady = exhaustedPlanets.slice(0, 2)
    for (const planetId of toReady) {
      this.state.planets[planetId].exhausted = false
    }

    this.log.add({
      template: '{player} readies planets (Diplomacy secondary)',
      args: { player },
    })

    // Faction abilities after diplomacy (e.g., Xxcha Peace Accords)
    this.factionAbilities.afterDiplomacyResolved(player)
  }

  Twilight.prototype._warfareSecondary = function(player) {
  // Produce units in home system (simplified: use existing production)
    const homeSystem = this._getHomeSystem(player)
    if (homeSystem) {
      this._productionStep(player, homeSystem)
    }
  }

  Twilight.prototype._constructionSecondary = function(player) {
  // Place 1 PDS or 1 space dock on a planet you control
    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    const choices = controlledPlanets.map(p => `pds:${p}`)
      .concat(controlledPlanets.map(p => `space-dock:${p}`))

    const selection = this.actions.choose(player, choices, {
      title: 'Place Structure (Construction Secondary)',
    })
    const [unitType, planetId] = selection[0].split(':')
    const systemId = this._findSystemForPlanet(planetId)
    if (systemId) {
      this._addUnitToPlanet(systemId, planetId, unitType, player.name)
    }

    this.log.add({
      template: '{player} places a {type} (Construction secondary)',
      args: { player, type: unitType },
    })
  }

  Twilight.prototype._getHomeSystem = function(player) {
    const faction = player.faction
    if (!faction) {
      return null
    }
    return faction.homeSystem || `${faction.id}-home`
  }

  Twilight.prototype._addUnitToPlanet = function(systemId, planetId, unitType, ownerName) {
    if (!this.state.units[systemId]) {
      return
    }
    if (!this.state.units[systemId].planets[planetId]) {
      return
    }
    const unitId = `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    this.state.units[systemId].planets[planetId].push({
      id: unitId,
      type: unitType,
      owner: ownerName,
      damaged: false,
    })
  }


  Twilight.prototype._payInfluence = function(player, cost) {
  // Auto-exhaust planets to pay influence cost (cheapest first to conserve value)
    let remaining = cost
    const canSpendFlexibly = this.factionAbilities.canSpendFlexibly(player)
    const readyPlanets = player.getReadyPlanets()
      .map(pId => {
        const planet = res.getPlanet(pId)
        let influence = planet?.influence || 0
        // Archon's Gift: resources count as influence too
        if (canSpendFlexibly) {
          influence += (planet?.resources || 0)
        }
        return { id: pId, influence }
      })
      .sort((a, b) => a.influence - b.influence)

    for (const planet of readyPlanets) {
      if (remaining <= 0) {
        break
      }
      this.state.planets[planet.id].exhausted = true
      remaining -= planet.influence
    }
  }

} // module.exports
