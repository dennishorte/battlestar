const res = require('../res/index.js')

module.exports = function(Twilight) {

  ////////////////////////////////////////////////////////////////////////////////
  // State helpers (follow _isTechReady/_exhaustTech pattern)

  Twilight.prototype._hasRelic = function(player, relicId) {
    return (this.state.relicsGained?.[player.name] || []).includes(relicId)
  }

  Twilight.prototype._isRelicReady = function(player, relicId) {
    return this._hasRelic(player, relicId)
      && !(this.state.exhaustedRelics?.[player.name] || []).includes(relicId)
  }

  Twilight.prototype._exhaustRelic = function(player, relicId) {
    if (!this.state.exhaustedRelics) {
      this.state.exhaustedRelics = {}
    }
    if (!this.state.exhaustedRelics[player.name]) {
      this.state.exhaustedRelics[player.name] = []
    }
    this.state.exhaustedRelics[player.name].push(relicId)
  }

  Twilight.prototype._purgeRelic = function(player, relicId) {
    const relics = this.state.relicsGained?.[player.name]
    if (relics) {
      const idx = relics.indexOf(relicId)
      if (idx !== -1) {
        relics.splice(idx, 1)
      }
    }
    // Also remove from exhausted if present
    const exhausted = this.state.exhaustedRelics?.[player.name]
    if (exhausted) {
      const idx = exhausted.indexOf(relicId)
      if (idx !== -1) {
        exhausted.splice(idx, 1)
      }
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Component actions for ACTION-type relics

  Twilight.prototype._getRelicComponentActions = function(player) {
    const actions = []

    // The Codex: purge to take up to 3 action cards from discard pile
    if (this._hasRelic(player, 'the-codex')) {
      const discard = this.state.actionCardDiscard || []
      if (discard.length > 0) {
        actions.push({
          id: 'the-codex',
          name: 'The Codex',
          execute: (p) => this._executeTheCodex(p),
        })
      }
    }

    // Stellar Converter: purge to destroy a non-home, non-legendary planet
    if (this._hasRelic(player, 'stellar-converter')) {
      if (this._getStellarConverterTargets(player).length > 0) {
        actions.push({
          id: 'stellar-converter',
          name: 'Stellar Converter',
          execute: (p) => this._executeStellarConverter(p),
        })
      }
    }

    // Dynamis Core: gain TG equal to commodity value, then purge
    if (this._hasRelic(player, 'dynamis-core')) {
      actions.push({
        id: 'dynamis-core',
        name: 'Dynamis Core',
        execute: (p) => this._executeDynamisCore(p),
      })
    }

    // JR-XS455-O: exhaust, choose a player — they spend 3 resources for structure or gain 1 TG
    if (this._isRelicReady(player, 'jr-xs455-o')) {
      actions.push({
        id: 'jr-xs455-o',
        name: 'JR-XS455-O',
        execute: (p) => this._executeJRXS455O(p),
      })
    }

    // Nano-Forge: attach to a non-legendary, non-home planet you control
    if (this._hasRelic(player, 'nano-forge') && !this._isNanoForgeAttached()) {
      const targets = this._getNanoForgeTargets(player)
      if (targets.length > 0) {
        actions.push({
          id: 'nano-forge',
          name: 'Nano-Forge',
          execute: (p) => this._executeNanoForge(p),
        })
      }
    }

    // Circlet of the Void: exhaust to explore a frontier token
    if (this._isRelicReady(player, 'circlet-of-the-void')) {
      const targets = this._getCircletFrontierTargets(player)
      if (targets.length > 0) {
        actions.push({
          id: 'circlet-of-the-void',
          name: 'Circlet of the Void',
          execute: (p) => this._executeCircletOfTheVoid(p),
        })
      }
    }

    // Book of Latvinia: purge — gain 1 VP if all 4 tech specialties, else gain speaker
    if (this._hasRelic(player, 'book-of-latvinia')) {
      actions.push({
        id: 'book-of-latvinia',
        name: 'Book of Latvinia',
        execute: (p) => this._executeBookOfLatvinia(p),
      })
    }

    return actions
  }


  ////////////////////////////////////////////////////////////////////////////////
  // The Codex — ACTION: purge to take up to 3 action cards from discard

  Twilight.prototype._executeTheCodex = function(player) {
    this._purgeRelic(player, 'the-codex')

    const discard = this.state.actionCardDiscard || []
    if (discard.length === 0) {
      return
    }

    const taken = []
    for (let i = 0; i < 3; i++) {
      const remaining = this.state.actionCardDiscard || []
      if (remaining.length === 0) {
        break
      }

      const choices = ['Done', ...remaining.map(c => c.name)]
      const sel = this.actions.choose(player, choices, {
        title: `The Codex: Take action card ${i + 1}/3`,
      })

      if (sel[0] === 'Done') {
        break
      }

      const cardName = sel[0]
      const cardIdx = this.state.actionCardDiscard.findIndex(c => c.name === cardName)
      if (cardIdx !== -1) {
        const card = this.state.actionCardDiscard.splice(cardIdx, 1)[0]
        if (!player.actionCards) {
          player.actionCards = []
        }
        player.actionCards.push(card)
        taken.push(card.name)
      }
    }

    if (taken.length > 0) {
      this.log.add({
        template: '{player} purges The Codex to take {count} action cards from discard',
        args: { player, count: taken.length },
      })
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Stellar Converter — ACTION: purge to destroy a planet

  Twilight.prototype._getStellarConverterTargets = function(player) {
    const targets = []

    for (const [systemId, systemUnits] of Object.entries(this.state.units)) {
      const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
      if (!tile) {
        continue
      }

      // Check for bombardment units in adjacent systems
      const adjacentSystems = this._getAdjacentSystems(systemId)
      let hasBombardmentAdjacent = false
      for (const adjId of adjacentSystems) {
        const adjUnits = this.state.units[adjId]
        if (!adjUnits) {
          continue
        }
        for (const unit of adjUnits.space) {
          if (unit.owner !== player.name) {
            continue
          }
          const unitDef = this._getUnitStats(unit.owner, unit.type)
          if (unitDef?.abilities?.some(a => a.startsWith('bombardment-'))) {
            hasBombardmentAdjacent = true
            break
          }
        }
        if (hasBombardmentAdjacent) {
          break
        }
      }

      // Also check current system for bombardment units
      if (!hasBombardmentAdjacent) {
        for (const unit of systemUnits.space) {
          if (unit.owner !== player.name) {
            continue
          }
          const unitDef = this._getUnitStats(unit.owner, unit.type)
          if (unitDef?.abilities?.some(a => a.startsWith('bombardment-'))) {
            hasBombardmentAdjacent = true
            break
          }
        }
      }

      if (!hasBombardmentAdjacent) {
        continue
      }

      for (const planetId of (tile.planets || [])) {
        const planet = res.getPlanet(planetId)
        if (!planet) {
          continue
        }
        // Not home system, not legendary, not Mecatol Rex
        if (tile.type === 'home') {
          continue
        }
        if (planet.legendary) {
          continue
        }
        if (planetId === 'mecatol-rex') {
          continue
        }
        if (this.state.planets[planetId]?.destroyed) {
          continue
        }
        targets.push(planetId)
      }
    }

    return targets
  }

  Twilight.prototype._executeStellarConverter = function(player) {
    const targets = this._getStellarConverterTargets(player)
    if (targets.length === 0) {
      return
    }

    const sel = this.actions.choose(player, targets, {
      title: 'Stellar Converter: Choose planet to destroy',
    })
    const planetId = sel[0]
    const systemId = this._findSystemForPlanet(planetId)

    this._purgeRelic(player, 'stellar-converter')

    // Destroy all units on the planet
    if (systemId && this.state.units[systemId]?.planets[planetId]) {
      this.state.units[systemId].planets[planetId] = []
    }

    // Clear attachments and mark as destroyed
    if (this.state.planets[planetId]) {
      this.state.planets[planetId].attachments = []
      this.state.planets[planetId].controller = null
      this.state.planets[planetId].destroyed = true
    }

    this.log.add({
      template: '{player} purges Stellar Converter to destroy {planet}',
      args: { player, planet: planetId },
    })
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Dynamis Core — passive +2 commodity value + ACTION: gain TG = commodity value, purge

  Twilight.prototype._getDynamisCoreCommodityBonus = function(player) {
    if (this._hasRelic(player, 'dynamis-core')) {
      return 2
    }
    return 0
  }

  Twilight.prototype._executeDynamisCore = function(player) {
    const effectiveValue = player.getEffectiveCommodityValue()
    player.addTradeGoods(effectiveValue)
    this._purgeRelic(player, 'dynamis-core')

    this.log.add({
      template: '{player} purges Dynamis Core to gain {tg} trade goods',
      args: { player, tg: effectiveValue },
    })
  }


  ////////////////////////////////////////////////////////////////////////////////
  // JR-XS455-O — ACTION: exhaust, choose player → 3 resources for structure OR 1 TG

  Twilight.prototype._executeJRXS455O = function(player) {
    this._exhaustRelic(player, 'jr-xs455-o')

    const allPlayers = this.players.all()
    const targetChoices = allPlayers.map(p => p.name)
    const targetSel = this.actions.choose(player, targetChoices, {
      title: 'JR-XS455-O: Choose a player',
    })
    const targetPlayer = this.players.byName(targetSel[0])

    // Target player chooses: spend 3 resources for a structure, or gain 1 TG
    const canAfford = (targetPlayer.tradeGoods + this._getAvailableResources(targetPlayer)) >= 3
    const controlledPlanets = targetPlayer.getControlledPlanets()

    let choices
    if (canAfford && controlledPlanets.length > 0) {
      choices = ['Place Structure (3 resources)', 'Gain 1 Trade Good']
    }
    else {
      choices = ['Gain 1 Trade Good']
    }

    const sel = this.actions.choose(targetPlayer, choices, {
      title: 'JR-XS455-O: Choose benefit',
    })

    if (sel[0] === 'Place Structure (3 resources)') {
      // Spend 3 resources
      this._payResources(targetPlayer, 3)

      // Choose planet for structure
      const planetSel = this.actions.choose(targetPlayer, controlledPlanets, {
        title: 'JR-XS455-O: Place structure on which planet?',
      })
      const structPlanet = planetSel[0]

      // Choose structure type (PDS or space dock)
      const structSel = this.actions.choose(targetPlayer, ['pds', 'space-dock'], {
        title: 'JR-XS455-O: Choose structure type',
      })
      const structType = structSel[0]
      const structSystem = this._findSystemForPlanet(structPlanet)

      if (structSystem) {
        this._addUnit(structSystem, structPlanet, structType, targetPlayer.name)
      }

      this.log.add({
        template: '{player} uses JR-XS455-O: {target} places {structure} on {planet}',
        args: { player, target: targetPlayer.name, structure: structType, planet: structPlanet },
      })
    }
    else {
      targetPlayer.addTradeGoods(1)
      this.log.add({
        template: '{player} uses JR-XS455-O: {target} gains 1 trade good',
        args: { player, target: targetPlayer.name },
      })
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Nano-Forge — ACTION: attach to a non-legendary, non-home planet you control

  Twilight.prototype._isNanoForgeAttached = function() {
    for (const [, planetState] of Object.entries(this.state.planets)) {
      if (planetState.attachments?.includes('nano-forge')) {
        return true
      }
    }
    return false
  }

  Twilight.prototype._getNanoForgeTargets = function(player) {
    const targets = []
    const controlledPlanets = player.getControlledPlanets()
    for (const planetId of controlledPlanets) {
      const planet = res.getPlanet(planetId)
      if (!planet) {
        continue
      }
      // Must be non-legendary, non-home
      if (planet.legendary) {
        continue
      }
      const systemId = this._findSystemForPlanet(planetId)
      if (!systemId) {
        continue
      }
      const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
      if (tile?.type === 'home') {
        continue
      }
      if (this.state.planets[planetId]?.destroyed) {
        continue
      }
      targets.push(planetId)
    }
    return targets
  }

  Twilight.prototype._executeNanoForge = function(player) {
    const targets = this._getNanoForgeTargets(player)
    if (targets.length === 0) {
      return
    }

    const sel = this.actions.choose(player, targets, {
      title: 'Nano-Forge: Attach to which planet?',
    })
    const planetId = sel[0]

    // Attach nano-forge to the planet
    if (!this.state.planets[planetId]) {
      this.state.planets[planetId] = { controller: null, exhausted: false, attachments: [] }
    }
    if (!this.state.planets[planetId].attachments) {
      this.state.planets[planetId].attachments = []
    }
    this.state.planets[planetId].attachments.push('nano-forge')

    this.log.add({
      template: '{player} uses Nano-Forge on {planet} (+2R/+2I, legendary)',
      args: { player, planet: planetId },
    })
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Circlet of the Void — ACTION: exhaust to explore a frontier token

  Twilight.prototype._getCircletFrontierTargets = function(player) {
    const targets = []
    for (const [systemId, systemUnits] of Object.entries(this.state.units)) {
      const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
      if (!tile) {
        continue
      }
      // Frontier = system with no planets
      if (tile.planets.length > 0) {
        continue
      }
      // Must not already be explored
      if (this.state.exploredPlanets?.[systemId]) {
        continue
      }
      // Must not contain enemy ships
      const hasEnemyShips = systemUnits.space.some(u => u.owner !== player.name)
      if (hasEnemyShips) {
        continue
      }
      // Must contain player's ships
      const hasOwnShips = systemUnits.space.some(u => u.owner === player.name)
      if (!hasOwnShips) {
        continue
      }
      targets.push(systemId)
    }
    return targets
  }

  Twilight.prototype._executeCircletOfTheVoid = function(player) {
    const targets = this._getCircletFrontierTargets(player)
    if (targets.length === 0) {
      return
    }

    this._exhaustRelic(player, 'circlet-of-the-void')

    let targetSystem
    if (targets.length === 1) {
      targetSystem = targets[0]
    }
    else {
      const sel = this.actions.choose(player, targets, {
        title: 'Circlet of the Void: Explore which frontier?',
      })
      targetSystem = sel[0]
    }

    this._exploreFrontier(targetSystem, player.name, 'Circlet of the Void')
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Book of Latvinia — on-gain: research up to 2 no-prereq techs
  //                    ACTION: purge — all 4 tech specialties → +1 VP, else speaker

  Twilight.prototype._executeBookOfLatviniaOnGain = function(player) {
    // Research up to 2 technologies that have no prerequisites
    for (let i = 0; i < 2; i++) {
      const allTechs = [...res.getGenericTechnologies()]
      if (player.faction?.factionTechnologies) {
        allTechs.push(...player.faction.factionTechnologies)
      }
      const noPrereq = allTechs
        .filter(t => !player.hasTechnology(t.id) && (!t.prerequisites || t.prerequisites.length === 0) && !t.unitUpgrade)
        .map(t => t.id)

      if (noPrereq.length === 0) {
        break
      }

      const choices = ['Done', ...noPrereq]
      const sel = this.actions.choose(player, choices, {
        title: `Book of Latvinia: Research no-prereq tech ${i + 1}/2`,
      })

      if (sel[0] === 'Done') {
        break
      }

      this._grantTechnology(player, sel[0])
      this.log.add({
        template: 'Book of Latvinia: {player} gains {tech}',
        args: { player, tech: sel[0] },
      })
    }
  }

  Twilight.prototype._executeBookOfLatvinia = function(player) {
    this._purgeRelic(player, 'book-of-latvinia')

    // Check if player controls planets with all 4 tech specialty types
    const specialties = new Set()
    const controlledPlanets = player.getControlledPlanets()
    for (const planetId of controlledPlanets) {
      const planet = res.getPlanet(planetId)
      if (planet?.techSpecialty) {
        specialties.add(planet.techSpecialty)
      }
      // Also check attachment bonuses for tech specialties
      const bonuses = this._getPlanetAttachmentBonuses(planetId)
      for (const spec of bonuses.techSpecialties) {
        specialties.add(spec)
      }
    }

    if (specialties.size >= 4) {
      player.addVictoryPoints(1)
      this.log.add({
        template: '{player} purges Book of Latvinia (all 4 tech specialties) for 1 VP',
        args: { player },
      })
    }
    else {
      this.state.speaker = player.name
      this.log.add({
        template: '{player} purges Book of Latvinia to become Speaker',
        args: { player },
      })
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Scepter of Emelpar — trigger: when spending a strategy token, exhaust to skip

  Twilight.prototype._offerScepterOfEmelpar = function(player) {
    if (!this._isRelicReady(player, 'scepter-of-emelpar')) {
      return false
    }

    const choice = this.actions.choose(player, ['Exhaust Scepter of Emelpar', 'Spend Strategy Token'], {
      title: 'Scepter of Emelpar: Avoid spending strategy token?',
    })

    if (choice[0] === 'Exhaust Scepter of Emelpar') {
      this._exhaustRelic(player, 'scepter-of-emelpar')
      this.log.add({
        template: '{player} exhausts Scepter of Emelpar instead of spending strategy token',
        args: { player },
      })
      return true
    }
    return false
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Prophet's Tears — trigger: after researching a tech, exhaust to draw 1 action card

  Twilight.prototype._offerProphetsTears = function(player) {
    if (!this._isRelicReady(player, 'the-prophets-tears')) {
      return
    }

    const choice = this.actions.choose(player, ['Draw 1 Action Card', 'Pass'], {
      title: "Prophet's Tears: Exhaust for a bonus?",
    })

    if (choice[0] === 'Draw 1 Action Card') {
      this._exhaustRelic(player, 'the-prophets-tears')
      this._drawActionCards(player, 1)
      this.log.add({
        template: "{player} exhausts Prophet's Tears to draw 1 action card",
        args: { player },
      })
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Crown of Emphidia — after tactical action: exhaust to explore a planet
  //                      end of status phase: purge for +1 VP if controlling Tomb

  Twilight.prototype._offerCrownOfEmphidiaAfterTactical = function(player) {
    if (!this._isRelicReady(player, 'the-crown-of-emphidia')) {
      return
    }

    // Find controlled planets that haven't been explored
    const controlledPlanets = player.getControlledPlanets()
    const unexplored = controlledPlanets.filter(pId => {
      const planet = res.getPlanet(pId)
      return planet?.trait && !this.state.exploredPlanets?.[pId]
    })

    if (unexplored.length === 0) {
      return
    }

    const choices = ['Pass', ...unexplored]
    const sel = this.actions.choose(player, choices, {
      title: 'Crown of Emphidia: Explore a planet you control?',
    })

    if (sel[0] !== 'Pass') {
      this._exhaustRelic(player, 'the-crown-of-emphidia')
      this._explorePlanet(sel[0], player.name)
      this.log.add({
        template: '{player} exhausts Crown of Emphidia to explore {planet}',
        args: { player, planet: sel[0] },
      })
    }
  }

  Twilight.prototype._offerCrownOfEmphidiaStatusPhase = function(player) {
    if (!this._hasRelic(player, 'the-crown-of-emphidia')) {
      return
    }

    // Check if player controls Tomb of Emphidia
    if (this.state.planets['tomb-of-emphidia']?.controller !== player.name) {
      return
    }

    const choice = this.actions.choose(player, ['Purge for 1 VP', 'Keep'], {
      title: 'Crown of Emphidia: Control Tomb of Emphidia — purge for 1 VP?',
    })

    if (choice[0] === 'Purge for 1 VP') {
      this._purgeRelic(player, 'the-crown-of-emphidia')
      player.addVictoryPoints(1)
      this.log.add({
        template: '{player} purges Crown of Emphidia for 1 VP',
        args: { player },
      })
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Dominus Orb — trigger: before movement, purge to move from systems with own tokens

  Twilight.prototype._offerDominusOrb = function(player) {
    if (!this._hasRelic(player, 'dominus-orb')) {
      return false
    }

    const choice = this.actions.choose(player, ['Purge Dominus Orb', 'Pass'], {
      title: 'Dominus Orb: Purge to move from systems with your command tokens?',
    })

    if (choice[0] === 'Purge Dominus Orb') {
      this._purgeRelic(player, 'dominus-orb')
      this.state._dominusOrbActive = true
      this.log.add({
        template: '{player} purges Dominus Orb to move units from token systems',
        args: { player },
      })
      return true
    }
    return false
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Maw of Worlds — trigger: start of agenda phase, purge + exhaust all planets for any tech

  Twilight.prototype._offerMawOfWorlds = function(player) {
    if (!this._hasRelic(player, 'maw-of-worlds')) {
      return
    }

    const choice = this.actions.choose(player, ['Purge Maw of Worlds', 'Pass'], {
      title: 'Maw of Worlds: Purge + exhaust all planets to gain any 1 technology?',
    })

    if (choice[0] !== 'Purge Maw of Worlds') {
      return
    }

    this._purgeRelic(player, 'maw-of-worlds')

    // Exhaust all planets
    for (const planetId of player.getControlledPlanets()) {
      if (this.state.planets[planetId]) {
        this.state.planets[planetId].exhausted = true
      }
    }

    // Research any 1 tech (no prerequisite check)
    const allTechs = [...res.getGenericTechnologies()]
    if (player.faction?.factionTechnologies) {
      allTechs.push(...player.faction.factionTechnologies)
    }
    const available = allTechs
      .filter(t => !player.hasTechnology(t.id))
      .map(t => t.id)

    if (available.length === 0) {
      return
    }

    const sel = this.actions.choose(player, available, {
      title: 'Maw of Worlds: Choose any technology to gain',
    })

    const techId = sel[0]
    const tech = res.getTechnology(techId)
    if (tech) {
      this.factionAbilities.onPreResearch(player, tech)

      const cardId = `${player.name}-${techId}`
      let card
      try {
        card = this.cards.byId(cardId)
      }
      catch {
        const { BaseCard } = require('../../lib/game/index.js')
        card = new BaseCard(this, { ...tech, id: cardId })
        this.cards.register(card)
      }

      const techZone = this.zones.byPlayer(player, 'technologies')
      techZone.push(card, techZone.nextIndex())

      this.log.add({
        template: '{player} purges Maw of Worlds: exhausts all planets, gains {tech}',
        args: { player, tech: tech.name },
      })

      this.factionAbilities.onTechResearched(player, tech)
    }
  }

} // module.exports
