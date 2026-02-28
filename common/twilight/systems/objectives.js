const res = require('../res/index.js')

module.exports = function(Twilight) {

  ////////////////////////////////////////////////////////////////////////////////
  // Objectives

  Twilight.prototype._initObjectiveDecks = function() {
    if (!this.state.objectiveDeckI) {
      const stageI = res.getPublicObjectivesI().map(o => o.id)
      this._shuffle(stageI)
      this.state.objectiveDeckI = stageI
    }
    if (!this.state.objectiveDeckII) {
      const stageII = res.getPublicObjectivesII().map(o => o.id)
      this._shuffle(stageII)
      this.state.objectiveDeckII = stageII
    }
  }

  /**
 * Check if a player controls all planets in their home system.
 * Required to score public objectives (unless faction has Nomadic or similar ability).
 */
  Twilight.prototype._controlsHomeSystemPlanets = function(player) {
  // Saar Nomadic: bypass home system check
    if (this.factionAbilities.canBypassHomeSystemCheck(player)) {
      return true
    }

    const faction = player.faction
    if (!faction || !faction.homeSystem) {
      return true
    }

    const homeSystemId = faction.homeSystem
    const tile = res.getSystemTile(homeSystemId) || res.getSystemTile(Number(homeSystemId))
    if (!tile || !tile.planets || tile.planets.length === 0) {
      return true
    }

    // Check that each planet in the home system is controlled by this player
    for (const planetId of tile.planets) {
      const planetState = this.state.planets[planetId]
      if (!planetState || planetState.controller !== player.name) {
        return false
      }
    }
    return true
  }

  Twilight.prototype._scoreObjectives = function() {
  // Each player in initiative order may score 1 public objective and 1 secret objective
    const revealedObjectives = this.state.revealedObjectives || []

    // Get players in initiative order
    const players = this._getPlayersInInitiativeOrder()

    for (const player of players) {
      const playerScored = this.state.scoredObjectives[player.name] || []

      // --- Public Objective Scoring ---
      // Must control all home system planets to score public objectives
      // (unless faction has Nomadic or similar bypass ability)
      const controlsHome = this._controlsHomeSystemPlanets(player)

      if (revealedObjectives.length > 0 && controlsHome) {
      // Find which revealed public objectives this player can score
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
            title: 'Score Public Objective',
            noAutoRespond: true,
          })

          const chosen = selection[0]
          if (chosen !== 'Skip') {
            this._recordObjectiveScore(player, chosen)
          }
        }
      }

      // --- Secret Objective Scoring ---
      const secrets = player.secretObjectives || []
      const scorableSecrets = secrets.filter(objId => {
        if (playerScored.includes(objId)) {
          return false
        }
        const obj = res.getObjective(objId)
        if (!obj || !obj.check) {
          return false
        }
        return obj.check(player, this)
      })

      if (scorableSecrets.length > 0) {
        const secretChoices = ['Skip', ...scorableSecrets.map(id => {
          const obj = res.getObjective(id)
          return `${id}: ${obj.name}`
        })]

        const secretSelection = this.actions.choose(player, secretChoices, {
          title: 'Score Secret Objective',
          noAutoRespond: true,
        })

        const secretChosen = secretSelection[0]
        if (secretChosen !== 'Skip') {
          this._recordObjectiveScore(player, secretChosen)
        }
      }
    }
  }

  Twilight.prototype._recordObjectiveScore = function(player, choiceString) {
  // Extract objective ID from choice (format: "id: Name")
    const objId = choiceString.split(':')[0]
    const obj = res.getObjective(objId)
    if (!obj) {
      return
    }

    if (!this.state.scoredObjectives[player.name]) {
      this.state.scoredObjectives[player.name] = []
    }
    this.state.scoredObjectives[player.name].push(objId)
    player.addVictoryPoints(obj.points)

    this.log.add({
      template: '{player} scores {objective} (+{points} VP)',
      args: { player, objective: obj.name, points: obj.points },
      event: 'scoring',
    })

    this._checkVictory()
    this._checkLeaderUnlocks()
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Action Phase Secret Objective Scoring

  Twilight.prototype._recordSecretTrigger = function(playerName, objectiveId) {
    if (!playerName) {
      return
    }
    if (!this.state.actionPhaseSecretTriggers) {
      this.state.actionPhaseSecretTriggers = {}
    }
    if (!this.state.actionPhaseSecretTriggers[playerName]) {
      this.state.actionPhaseSecretTriggers[playerName] = []
    }
    if (!this.state.actionPhaseSecretTriggers[playerName].includes(objectiveId)) {
      this.state.actionPhaseSecretTriggers[playerName].push(objectiveId)
    }
  }

  Twilight.prototype._checkActionPhaseSecrets = function() {
    const triggers = this.state.actionPhaseSecretTriggers || {}

    for (const [playerName, triggeredIds] of Object.entries(triggers)) {
      const player = this.players.byName(playerName)
      if (!player) {
        continue
      }

      const secrets = player.secretObjectives || []
      const scored = this.state.scoredObjectives[playerName] || []

      const scorable = triggeredIds.filter(objId => {
        return secrets.includes(objId) && !scored.includes(objId)
      })

      if (scorable.length > 0) {
        const choices = ['Skip', ...scorable.map(id => {
          const obj = res.getObjective(id)
          return `${id}: ${obj.name}`
        })]

        const selection = this.actions.choose(player, choices, {
          title: 'Score Secret Objective',
          noAutoRespond: true,
        })

        const chosen = selection[0]
        if (chosen !== 'Skip') {
          this._recordObjectiveScore(player, chosen)
        }
      }
    }
  }

  Twilight.prototype._detectCombatSecrets = function(systemId, winner, loser, combatType) {
    const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
    const allPlayers = this.players.all()

    // spark-a-rebellion: winner beat player with most VP
    const maxVP = Math.max(...allPlayers.map(p => p.getVictoryPoints()))
    const loserPlayer = this.players.byName(loser)
    if (loserPlayer && loserPlayer.getVictoryPoints() === maxVP) {
      this._recordSecretTrigger(winner, 'spark-a-rebellion')
    }

    // brave-the-void: system is an anomaly
    if (tile && tile.anomaly) {
      this._recordSecretTrigger(winner, 'brave-the-void')
    }

    // darken-the-skies: system is another player's home system
    if (typeof systemId === 'string' && systemId.includes('-home')) {
      const factions = require('../res/factions/index.js')
      for (const p of allPlayers) {
        const f = factions.getFaction(p.factionId)
        if (f && f.homeSystem === systemId && p.name !== winner) {
          this._recordSecretTrigger(winner, 'darken-the-skies')
          break
        }
      }
    }

    // betray-a-friend: winner had loser's promissory note at tactical action start
    const ctx = this.state.currentTacticalAction
    if (ctx && ctx.promissoryNotesAtStart) {
      const winnerNotes = ctx.promissoryNotesAtStart[winner] || []
      if (winnerNotes.some(n => n.owner === loser)) {
        this._recordSecretTrigger(winner, 'betray-a-friend')
      }
    }

    // Space combat specific
    if (combatType === 'space') {
      const systemUnits = this.state.units[systemId]

      // unveil-flagship: winner has flagship in system that survived
      if (systemUnits) {
        const winnerShips = systemUnits.space.filter(u => u.owner === winner)
        if (winnerShips.some(u => u.type === 'flagship')) {
          this._recordSecretTrigger(winner, 'unveil-flagship')
        }
      }

      // demonstrate-your-power: winner has 3+ non-fighter ships
      if (systemUnits) {
        const nonFighterShips = systemUnits.space.filter(
          u => u.owner === winner && u.type !== 'fighter'
        )
        if (nonFighterShips.length >= 3) {
          this._recordSecretTrigger(winner, 'demonstrate-your-power')
        }
      }
    }
  }

  Twilight.prototype._revealObjective = function() {
    this._initObjectiveDecks()

    // Reveal Stage I objectives for the first 5 rounds, Stage II after
    const round = this.state.round
    let deck, stage
    if (round <= 5) {
      deck = this.state.objectiveDeckI
      stage = 'I'
    }
    else {
      deck = this.state.objectiveDeckII
      stage = 'II'
    }

    if (deck && deck.length > 0) {
      const objectiveId = deck.shift()
      if (!this.state.revealedObjectives) {
        this.state.revealedObjectives = []
      }
      this.state.revealedObjectives.push(objectiveId)

      const obj = res.getObjective(objectiveId)
      if (obj) {
        this.log.add({
          template: 'Public Objective Stage {stage} revealed: {name}',
          args: { stage, name: obj.name },
        })
      }

      // Neuraloop: player with this relic may purge another relic to replace the objective
      this._offerNeuraloop(objectiveId, deck, stage)
    }
  }

  Twilight.prototype._offerNeuraloop = function(objectiveId, deck, _stage) {
    const players = this.players.all()

    for (const player of players) {
      if (!this._hasRelic(player, 'neuraloop')) {
        continue
      }

      // Must have at least 1 other relic to purge
      const relics = this.state.relicsGained?.[player.name] || []
      const otherRelics = relics.filter(r => r !== 'neuraloop')
      if (otherRelics.length === 0) {
        continue
      }

      // No replacement cards available
      if (!deck || deck.length === 0) {
        continue
      }

      const choices = ['Pass', ...otherRelics]
      const sel = this.actions.choose(player, choices, {
        title: `Neuraloop: Purge a relic to replace the revealed objective?`,
        noAutoRespond: true,
      })

      if (sel[0] === 'Pass') {
        continue
      }

      const purgedRelicId = sel[0]

      // Purge the chosen relic
      this._purgeRelic(player, purgedRelicId)

      // Remove the revealed objective and put it back in the deck
      const revIdx = this.state.revealedObjectives.indexOf(objectiveId)
      if (revIdx !== -1) {
        this.state.revealedObjectives.splice(revIdx, 1)
      }
      deck.push(objectiveId)

      // Draw a replacement
      const replacementId = deck.shift()
      this.state.revealedObjectives.push(replacementId)

      const replacement = res.getObjective(replacementId)
      this.log.add({
        template: '{player} purges {relic} (Neuraloop) to replace objective with {name}',
        args: { player, relic: purgedRelicId, name: replacement?.name || replacementId },
      })

      // Purge the Neuraloop itself
      this._purgeRelic(player, 'neuraloop')

      break  // Only one player can use Neuraloop per reveal
    }
  }

} // module.exports
