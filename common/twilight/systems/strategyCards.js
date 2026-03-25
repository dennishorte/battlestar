const { BaseCard } = require('../../lib/game/index.js')
const res = require('../res/index.js')

module.exports = function(Twilight) {

  Twilight.prototype._strategicAction = function(player, cardId) {
    this.log.indent()
    const usedCardId = player.useStrategyCard(cardId)

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
  // Rule 52.2: Gain 3 command tokens, then may spend influence (1 token per 3 influence)
    this.log.add({
      template: '{player} gains 3 command tokens',
      args: { player },
    })

    this._redistributeTokens(player, 3)

    this._offerInfluenceForTokens(player)
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Strategy Card — Trade (#5)

  Twilight.prototype._tradePrimary = function(player) {
  // Gain 3 trade goods
    player.addTradeGoods(3)

    // Replenish commodities for active player
    player.replenishCommodities()

    this.log.add({
      template: '{player} gains 3 trade goods and replenishes commodities',
      args: { player },
    })

    this.factionAbilities.onCommoditiesReplenished(player)

    // Choose any number of other players to get free secondary (replenish commodities)
    const otherPlayers = this.players.all().filter(p =>
      p.name !== player.name && !this._isEliminated(p.name)
    )
    const selection = this.actions.choose(player, otherPlayers.map(p => p.name), {
      title: 'Choose players for free Trade secondary (replenish commodities)',
      min: 0,
    })

    // Store chosen players so _resolveSecondaries marks them as free
    this.state._tradeFreeSecondary = selection
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Strategy Card — Technology (#7)

  Twilight.prototype._technologyPrimary = function(player) {
  // Rule 91: Research 1 tech, then may spend 6 resources for 1 additional tech
    this._researchTech(player)

    const tgValue = this.factionAbilities.getTradeGoodResourceValue(player)
    const availableResources = this._getAvailableResources(player) + player.tradeGoods * tgValue
    if (availableResources >= 6) {
      const choice = this.actions.choose(player, ['Research Additional Tech (6 resources)', 'Skip'], {
        title: 'Spend 6 resources for additional research?',
        noAutoRespond: true,
      })

      if (choice[0] !== 'Skip') {
        this._payResources(player, 6)
        this._researchTech(player)
      }
    }
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

    // Prophet's Tears: exhaust to draw 1 action card after research
    this._offerProphetsTears(player)

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
  // Rule 45: Three parts
  // Part 1: May score 1 public objective if requirements met
    let scoredVP = false
    const revealedObjectives = this.state.revealedObjectives || []
    const playerScored = this.state.scoredObjectives[player.name] || []
    const controlsHome = this._controlsHomeSystemPlanets(player)

    if (revealedObjectives.length > 0 && controlsHome) {
      const scorable = revealedObjectives.filter(objId => {
        if (playerScored.includes(objId)) {
          return false
        }
        const obj = res.getObjective(objId)
        if (!obj || !obj.check) {
          return false
        }
        return obj.check(player, this)
      })

      if (scorable.length > 0) {
        const choices = ['Skip', ...scorable.map(id => {
          const obj = res.getObjective(id)
          return `${id}: ${obj.name}`
        })]

        const selection = this.actions.choose(player, choices, {
          title: 'Score Public Objective (Imperial)',
          noAutoRespond: true,
        })

        const chosen = selection[0]
        if (chosen !== 'Skip') {
          this._recordObjectiveScore(player, chosen)
          scoredVP = true
        }
      }
    }

    // Part 2: If controlling Mecatol Rex, gain 1 VP
    if (this.state.planets['mecatol-rex']?.controller === player.name) {
      player.addVictoryPoints(1)
      scoredVP = true
      this.log.add({
        template: '{player} scores 1 VP from controlling Mecatol Rex (Imperial)',
        args: { player },
        event: 'scoring',
      })
      this._checkVictory()
    }
    else {
    // Part 3: If not controlling Mecatol Rex, draw 1 secret objective
      this._drawSecretObjective(player)
    }

    // Custodia Vigilia reactive: Keleres player gains 1 command token when another player scores VP via Imperial
    if (scoredVP && this.state.iihqModernization) {
      const cvOwner = this.state.iihqModernization.owner
      if (cvOwner !== player.name && this.state.planets['custodia-vigilia']?.controller === cvOwner) {
        const keleresPlayer = this.players.byName(cvOwner)
        if (keleresPlayer) {
          const poolChoice = this.actions.choose(keleresPlayer, ['tactics', 'fleet', 'strategy'], {
            title: 'Custodia Vigilia: Gain 1 command token — choose pool',
          })
          keleresPlayer.commandTokens[poolChoice[0]]++
          this.log.add({
            template: 'Custodia Vigilia: {player} gains 1 command token ({pool})',
            args: { player: keleresPlayer, pool: poolChoice[0] },
          })
        }
      }
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

    // Rule 32: cannot choose the Mecatol Rex system
    const filteredSystems = systemsWithControlledPlanets.filter(systemId => {
      const planets = this._getSystemPlanets(systemId)
      return !planets.some(p => p.id === 'mecatol-rex')
    })

    if (filteredSystems.length === 0) {
      return
    }

    const selection = this.actions.choose(player, filteredSystems, {
      title: 'Choose System (Diplomacy)',
      noAutoRespond: true,
    })
    const chosenSystem = selection[0]

    // Each other player places a command token from reinforcements in that system
    // Rule 32.1a: skip if player already has a command token there
    const otherPlayers = this.players.all().filter(p => p.name !== player.name)
    for (const other of otherPlayers) {
      if (this.state.systems[chosenSystem].commandTokens.includes(other.name)) {
        continue
      }
      // Take from command sheet: tactics → strategy → fleet
      if (other.commandTokens.tactics > 0) {
        other.commandTokens.tactics--
      }
      else if (other.commandTokens.strategy > 0) {
        other.commandTokens.strategy--
      }
      else if (other.commandTokens.fleet > 0) {
        other.commandTokens.fleet--
      }
      else {
        continue  // No tokens available
      }
      this.state.systems[chosenSystem].commandTokens.push(other.name)
    }

    this.log.add({
      template: '{player} uses Diplomacy on {system}',
      args: { player, system: chosenSystem },
    })

    // Then, ready up to 2 exhausted planets you control
    this._diplomacyReadyPlanets(player)

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

  function _buildStructureChoices(planets, types) {
    const choices = []
    const labelToPlanet = {}
    for (const planetId of planets) {
      const planet = res.getPlanet(planetId)
      const systemTile = planet ? res.getSystemTile(planet.systemId) : null
      const planetName = planet ? planet.name : planetId
      let systemLabel
      if (systemTile?.type === 'home' && systemTile.faction) {
        const faction = res.getFaction(systemTile.faction)
        systemLabel = faction ? faction.name : (systemTile.tileNumber || systemTile.id)
      }
      else {
        systemLabel = systemTile ? (systemTile.tileNumber || systemTile.id) : '?'
      }
      const label = `${systemLabel}:${planetName}`
      labelToPlanet[label] = planetId
      choices.push({
        title: label,
        choices: [...types],
      })
    }
    return { choices, labelToPlanet }
  }

  Twilight.prototype._constructionPrimary = function(player) {
  // Step 1: Either place 1 structure on a planet you control
  //         OR use the PRODUCTION ability of 1 of your space docks
  // Step 2: Place 1 structure on a planet you control
    const controlledPlanets = player.getControlledPlanets()

    // Find systems where the player has space docks (for production option)
    const systemsWithDocks = this._findSystemsWithSpaceDocks(player)

    if (controlledPlanets.length === 0 && systemsWithDocks.length === 0) {
      return
    }

    // Step 1: Place structure OR use production
    const canPlaceStructure = controlledPlanets.length > 0
    const canUseProduction = systemsWithDocks.length > 0

    if (canPlaceStructure || canUseProduction) {
      // Determine mode: if both available, ask; otherwise pick the only option
      let mode
      if (canPlaceStructure && canUseProduction) {
        const modeSelection = this.actions.choose(player, ['Place Structure', 'Use Production'], {
          title: 'Construction',
        })
        mode = modeSelection[0]
      }
      else {
        mode = canPlaceStructure ? 'Place Structure' : 'Use Production'
      }

      if (mode === 'Place Structure') {
        const { choices: structureChoices, labelToPlanet } = _buildStructureChoices(controlledPlanets, ['pds', 'space-dock'])
        const sel = this.actions.choose(player, structureChoices, {
          title: 'Place Structure (Construction)',
        })
        const firstType = sel[0].selection[0]
        const firstPlanet = labelToPlanet[sel[0].title]
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
      }
      else {
        // Use production: choose which system's space dock to use
        const systemSelection = this.actions.choose(player, systemsWithDocks, {
          title: 'Use Production (Construction)',
        })
        this._productionStep(player, systemSelection[0])
      }
    }

    // Step 2: Place 1 structure on a planet you control
    if (controlledPlanets.length > 0) {
      const { choices: secondChoices, labelToPlanet: secondLabelToPlanet } = _buildStructureChoices(controlledPlanets, ['pds', 'space-dock'])
      if (secondChoices.length > 0) {
        const planetLabels = secondChoices.map(c => c.title)
        const planetSelection = this.actions.choose(player, ['Done', ...planetLabels], {
          title: 'Place Structure (Construction)',
          noAutoRespond: true,
        })
        if (planetSelection[0] !== 'Done') {
          const secondPlanet = secondLabelToPlanet[planetSelection[0]]
          // Ask which structure type
          const typeSelection = this.actions.choose(player, ['pds', 'space-dock'], {
            title: 'Choose Structure Type',
          })
          const secondType = typeSelection[0]
          const secondSystemId = this._findSystemForPlanet(secondPlanet)
          if (secondSystemId) {
            if (secondType === 'space-dock' && player.faction?.unitOverrides?.['space-dock']?.move > 0) {
              this._addUnit(secondSystemId, 'space', 'space-dock', player.name)
            }
            else {
              this._addUnitToPlanet(secondSystemId, secondPlanet, secondType, player.name)
            }
          }
        }
      }
    }

    this.log.add({
      template: '{player} uses Construction',
      args: { player },
    })
  }

  Twilight.prototype._findSystemsWithSpaceDocks = function(player) {
    const systems = []
    for (const [systemId, systemUnits] of Object.entries(this.state.units)) {
      // Check planets for space docks
      for (const [, planetUnits] of Object.entries(systemUnits.planets || {})) {
        if (planetUnits.some(u => u.owner === player.name && u.type === 'space-dock')) {
          systems.push(systemId)
          break
        }
      }
      if (systems.includes(systemId)) {
        continue
      }
      // Check space area for floating factories (Saar)
      if (systemUnits.space?.some(u => u.owner === player.name && u.type === 'space-dock')) {
        systems.push(systemId)
      }
    }
    return systems
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

  Twilight.prototype._redistributeTokens = function(player, newTokens) {
    newTokens = newTokens || 0
    const totalTokens = player.commandTokens.tactics + player.commandTokens.strategy + player.commandTokens.fleet + newTokens
    this.log.add({
      template: '{player}: Redistribute Tokens',
      args: { player },
      event: 'step',
    })
    const selection = this.actions.choose(player, ['Done'], {
      title: `Redistribute Tokens (${totalTokens} total)`,
      allowsAction: 'redistribute-tokens',
      newTokens,
      noAutoRespond: true,
    })

    const before = { ...player.commandTokens }
    if (selection.action === 'redistribute-tokens') {
      player.setCommandTokens(selection)
    }
    else {
      // Player clicked Done without redistributing — assign new tokens to tactics
      player.commandTokens.tactics += newTokens
    }

    const dt = player.commandTokens.tactics - before.tactics
    const ds = player.commandTokens.strategy - before.strategy
    const df = player.commandTokens.fleet - before.fleet
    if (dt !== 0 || ds !== 0 || df !== 0) {
      const parts = []
      if (dt !== 0) {
        parts.push(`${dt > 0 ? '+' : ''}${dt} tactic`)
      }
      if (ds !== 0) {
        parts.push(`${ds > 0 ? '+' : ''}${ds} strategy`)
      }
      if (df !== 0) {
        parts.push(`${df > 0 ? '+' : ''}${df} fleet`)
      }
      this.log.add({
        template: `{player} allocates tokens: ${parts.join(', ')}`,
        args: { player },
      })
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Secondary Abilities

  Twilight.prototype._resolveSecondaries = function(activePlayer, cardId) {
    const otherPlayers = this.players.all().filter(p =>
      p.name !== activePlayer.name && !this._isEliminated(p.name)
    )

    for (const player of otherPlayers) {
    // Determine what secondary this card offers
      const secondaryAvailable = this._getSecondaryDescription(cardId)
      if (!secondaryAvailable) {
        continue
      }

      // Leadership secondary has no strategy token cost (Rule 52.2)
      // Hacan Masters of Trade: free Trade secondary (no strategy token cost)
      // Trade primary: chosen players get free secondary
      let isFree = cardId === 'leadership'
      || (cardId === 'trade'
      && (this.factionAbilities.canSkipTradeSecondaryCost(player)
      || (this.state._tradeFreeSecondary || []).includes(player.name)))

      // Acquiescence (Winnu PN): free secondary when Winnu uses strategic action
      if (!isFree && this.factionAbilities.hasAcquiescence(player, activePlayer)) {
        isFree = true
      }

      // Scepter of Emelpar: can use secondary even with 0 strategy tokens
      const hasScepter = !isFree && this._isRelicReady(player, 'scepter-of-emelpar')

      // Skip if player has no strategy tokens to spend (unless free or has Scepter)
      if (!isFree && !hasScepter && player.commandTokens.strategy <= 0) {
        this.log.add({
          template: '{player} has no strategy tokens for {secondary}',
          args: { player, secondary: secondaryAvailable },
        })
        continue
      }

      // Skip technology secondary if player cannot afford 4 resources
      if (cardId === 'technology') {
        const tgVal = this.factionAbilities.getTradeGoodResourceValue(player)
        const availRes = this._getAvailableResources(player) + player.tradeGoods * tgVal
        if (availRes < 4) {
          this.log.add({
            template: '{player} cannot afford 4 resources for {secondary}',
            args: { player, secondary: secondaryAvailable },
          })
          continue
        }
      }

      // Leadership: combine "Use Secondary / Pass" with influence spending into one prompt
      if (cardId === 'leadership') {
        const totalInfluence = player.getTotalInfluence()
        const maxTokens = Math.floor(totalInfluence / 3)

        // Auto-resolve when player has insufficient influence (< 3)
        if (maxTokens === 0) {
          this.log.add({
            template: '{player} has insufficient influence for {secondary}',
            args: { player, secondary: secondaryAvailable },
          })
          // Acquiescence: return PN to Winnu even when auto-resolving
          this.factionAbilities.returnAcquiescence(player, activePlayer)
          continue
        }

        const choices = ['Pass']
        for (let i = 1; i <= maxTokens; i++) {
          choices.push(`${i} token${i > 1 ? 's' : ''} (${i * 3} influence)`)
        }
        this.log.add({
          template: '{player}: {secondary}',
          args: { player, secondary: secondaryAvailable },
          event: 'step',
        })
        const selection = this.actions.choose(player, choices, {
          title: 'Spend Influence for Command Tokens (free, 1 per 3 influence)',
        })

        if (selection[0] !== 'Pass') {
          const tokenCount = parseInt(selection[0])
          const influenceCost = tokenCount * 3
          this._payInfluence(player, influenceCost)

          this.log.add({
            template: '{player} spends {influence} influence to gain {tokens} command token(s)',
            args: { player, influence: influenceCost, tokens: tokenCount },
          })

          this._redistributeTokens(player, tokenCount)
        }
        else {
          this.log.add({
            template: '{player} declines {secondary}',
            args: { player, secondary: secondaryAvailable },
            classes: ['player-action'],
          })
        }
        continue
      }

      // Diplomacy: combine into planet selection prompt (like Leadership above)
      if (cardId === 'diplomacy') {
        const exhaustedPlanets = player.getControlledPlanets()
          .filter(pId => this.state.planets[pId].exhausted)

        // Auto-skip when player has no exhausted planets
        if (exhaustedPlanets.length === 0) {
          this.log.add({
            template: '{player} has no exhausted planets for {secondary}',
            args: { player, secondary: secondaryAvailable },
          })
          this.factionAbilities.returnAcquiescence(player, activePlayer)
          continue
        }

        const costLabel = isFree ? 'free' : 'costs 1 strategy token'
        const choices = ['Pass', ...exhaustedPlanets]
        this.log.add({
          template: '{player}: {secondary}',
          args: { player, secondary: secondaryAvailable },
          event: 'step',
        })
        const first = this.actions.choose(player, choices, {
          title: `Ready up to 2 exhausted planets (${costLabel})`,
        })

        if (first[0] !== 'Pass') {
          // Spend strategy token (or Scepter)
          if (!isFree) {
            const scepterUsed = this._offerScepterOfEmelpar(player)
            if (!scepterUsed) {
              player.spendStrategyToken()
              this.factionAbilities.onStrategyTokenSpent(player, activePlayer.name)
            }
          }

          this.state.planets[first[0]].exhausted = false
          const remaining = exhaustedPlanets.filter(p => p !== first[0])
          if (remaining.length > 0) {
            const secondChoices = ['Done', ...remaining]
            const second = this.actions.choose(player, secondChoices, {
              title: 'Ready another planet? (Diplomacy)',
            })
            if (second[0] !== 'Done') {
              this.state.planets[second[0]].exhausted = false
            }
          }

          this.factionAbilities.afterDiplomacyResolved(player)
          this.factionAbilities.returnAcquiescence(player, activePlayer)
        }
        else {
          this.log.add({
            template: '{player} declines {secondary}',
            args: { player, secondary: secondaryAvailable },
            classes: ['player-action'],
          })
        }
        continue
      }

      const costLabel = isFree ? 'free'
        : cardId === 'technology' ? 'costs 1 strategy token + 4 resources'
          : 'costs 1 strategy token'
      this.log.add({
        template: '{player}: {secondary}',
        args: { player, secondary: secondaryAvailable },
        event: 'step',
      })
      const choice = this.actions.choose(player, ['Use Secondary', 'Pass'], {
        title: `${secondaryAvailable} (${costLabel})`,
      })

      if (choice[0] === 'Use Secondary') {
        if (!isFree) {
          // Scepter of Emelpar: offer to exhaust instead of spending strategy token
          const scepterUsed = this._offerScepterOfEmelpar(player)
          if (!scepterUsed) {
            player.spendStrategyToken()
            this.factionAbilities.onStrategyTokenSpent(player, activePlayer.name)
          }
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
      case 'leadership': return 'Spend influence for command tokens'
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
      // Rule 52.3: Spend influence for 1 token per 3 influence (free, no strategy token cost)
      // (Combined into single prompt by secondary framework — see _resolveSecondaries)
        this._offerInfluenceForTokens(player)
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
      // Rule 91.3: Research 1 technology (costs strategy token + 4 resources)
        this._payResources(player, 4)
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

  Twilight.prototype._diplomacyReadyPlanets = function(player) {
  // Ready up to 2 exhausted planets you control
    const exhaustedPlanets = player.getControlledPlanets()
      .filter(pId => this.state.planets[pId].exhausted)

    if (exhaustedPlanets.length === 0) {
      return
    }

    if (exhaustedPlanets.length <= 2) {
      // Auto-select all if 2 or fewer
      for (const planetId of exhaustedPlanets) {
        this.state.planets[planetId].exhausted = false
      }
    }
    else {
      // Let player choose which 2 planets to ready
      const first = this.actions.choose(player, exhaustedPlanets, {
        title: 'Ready planet 1 of 2 (Diplomacy)',
      })
      this.state.planets[first[0]].exhausted = false

      const remaining = exhaustedPlanets.filter(p => p !== first[0])
      const second = this.actions.choose(player, remaining, {
        title: 'Ready planet 2 of 2 (Diplomacy)',
      })
      this.state.planets[second[0]].exhausted = false
    }
  }

  Twilight.prototype._diplomacySecondary = function(player) {
    this._diplomacyReadyPlanets(player)

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
  // Rule 24.3: Place command token in a system with your planet, then build 1 structure there
    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    // Get unique systems containing controlled planets
    const systemsWithPlanets = []
    for (const planetId of controlledPlanets) {
      const systemId = this._findSystemForPlanet(planetId)
      if (systemId && !systemsWithPlanets.includes(systemId)) {
        systemsWithPlanets.push(systemId)
      }
    }

    if (systemsWithPlanets.length === 0) {
      return
    }

    // Choose system to place command token in
    const systemSelection = this.actions.choose(player, systemsWithPlanets, {
      title: 'Place Command Token in System (Construction Secondary)',
    })
    const chosenSystem = systemSelection[0]

    // Place the command token (the spent strategy token goes on the board)
    if (!this.state.systems[chosenSystem].commandTokens.includes(player.name)) {
      this.state.systems[chosenSystem].commandTokens.push(player.name)
    }

    // Get planets in the chosen system that the player controls
    const planetsInSystem = this._getSystemPlanets(chosenSystem)
      .filter(pId => this.state.planets[pId]?.controller === player.name)

    if (planetsInSystem.length === 0) {
      return
    }

    // Place 1 structure (PDS or space dock) on a planet in that system
    const { choices, labelToPlanet: structLabelToPlanet } = _buildStructureChoices(planetsInSystem, ['pds', 'space-dock'])

    const selection = this.actions.choose(player, choices, {
      title: 'Place Structure (Construction Secondary)',
    })
    const unitType = selection[0].selection[0]
    const planetId = structLabelToPlanet[selection[0].title]
    this._addUnitToPlanet(chosenSystem, planetId, unitType, player.name)

    this.log.add({
      template: '{player} places a {type} in {system} (Construction secondary)',
      args: { player, type: unitType, system: chosenSystem },
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


  Twilight.prototype._offerInfluenceForTokens = function(player) {
  // Rule 52: Spend influence to gain 1 command token per 3 influence
    const totalInfluence = player.getTotalInfluence()
    const maxTokens = Math.floor(totalInfluence / 3)

    if (maxTokens <= 0) {
      return
    }

    const choices = ['Skip']
    for (let i = 1; i <= maxTokens; i++) {
      choices.push(`${i} token${i > 1 ? 's' : ''} (${i * 3} influence)`)
    }

    const selection = this.actions.choose(player, choices, {
      title: 'Spend Influence for Command Tokens (1 per 3 influence)',
    })

    if (selection[0] !== 'Skip') {
      const tokenCount = parseInt(selection[0])
      const influenceCost = tokenCount * 3
      this._payInfluence(player, influenceCost)

      this.log.add({
        template: '{player} spends {influence} influence to gain {tokens} command token(s)',
        args: { player, influence: influenceCost, tokens: tokenCount },
      })

      this._redistributeTokens(player, tokenCount)
    }
  }

  Twilight.prototype._payResources = function(player, cost, options) {
    if (cost <= 0) {
      return
    }

    const canSpendFlexibly = options?.flexibleSpend || this.factionAbilities.canSpendFlexibly(player)
    const tgResourceValue = this.factionAbilities.getTradeGoodResourceValue(player)
    const readyPlanets = player.getReadyPlanets()

    const planetChoices = readyPlanets.map(pId => {
      const planet = res.getPlanet(pId)
      let resources = planet?.resources || 0
      if (this.state.planets[pId]?.terraform) {
        resources += 1
      }
      const bonuses = this._getPlanetAttachmentBonuses(pId)
      resources += bonuses.resources
      if (canSpendFlexibly) {
        resources += (planet?.influence || 0) + bonuses.influence
      }
      return `${pId} (${resources})`
    })

    const totalPlanetResources = planetChoices.reduce((sum, c) => sum + parseInt(c.match(/\((\d+)\)/)[1]), 0)

    // Auto-resolve: 0-1 planets or must use all
    if (readyPlanets.length <= 1 && totalPlanetResources >= cost) {
      for (const pId of readyPlanets) {
        this.state.planets[pId].exhausted = true
      }
      return
    }
    if (totalPlanetResources <= cost) {
      for (const pId of readyPlanets) {
        this.state.planets[pId].exhausted = true
      }
      const remaining = cost - totalPlanetResources
      if (remaining > 0) {
        const tgNeeded = Math.ceil(remaining / tgResourceValue)
        player.spendTradeGoods(Math.min(tgNeeded, player.tradeGoods))
      }
      return
    }

    // Player selects which planets to exhaust
    const selection = this.actions.choose(player, planetChoices, {
      title: `Exhaust planets for ${cost} resources`,
      min: 1,
      max: readyPlanets.length,
    })

    let totalSelected = 0
    for (const choice of selection) {
      const planetId = choice.split(' (')[0]
      this.state.planets[planetId].exhausted = true
      totalSelected += parseInt(choice.match(/\((\d+)\)/)[1])
    }

    // Trade goods for remainder
    const remaining = cost - totalSelected
    if (remaining > 0) {
      const tgNeeded = Math.ceil(remaining / tgResourceValue)
      player.spendTradeGoods(Math.min(tgNeeded, player.tradeGoods))
    }
  }

  Twilight.prototype._payInfluence = function(player, cost) {
    if (cost <= 0) {
      return
    }

    const canSpendFlexibly = this.factionAbilities.canSpendFlexibly(player)
    const readyPlanets = player.getReadyPlanets()

    const planetChoices = readyPlanets.map(pId => {
      const planet = res.getPlanet(pId)
      let inf = planet?.influence || 0
      if (this.state.planets[pId]?.terraform) {
        inf += 1
      }
      const bonuses = this._getPlanetAttachmentBonuses(pId)
      inf += bonuses.influence
      if (canSpendFlexibly) {
        inf += (planet?.resources || 0) + bonuses.resources
      }
      return `${pId} (${inf})`
    })

    const totalAvailable = planetChoices.reduce((sum, c) => sum + parseInt(c.match(/\((\d+)\)/)[1]), 0)

    // Auto-resolve: 0-1 planets or must use all
    if (readyPlanets.length <= 1) {
      for (const pId of readyPlanets) {
        this.state.planets[pId].exhausted = true
      }
      return
    }
    if (totalAvailable <= cost) {
      for (const pId of readyPlanets) {
        this.state.planets[pId].exhausted = true
      }
      return
    }

    // Player selects which planets to exhaust
    const selection = this.actions.choose(player, planetChoices, {
      title: `Exhaust planets for ${cost} influence`,
      min: 1,
      max: readyPlanets.length,
    })

    for (const choice of selection) {
      const planetId = choice.split(' (')[0]
      this.state.planets[planetId].exhausted = true
    }
  }

} // module.exports
