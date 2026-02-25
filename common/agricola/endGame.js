const { Agricola } = require('./agricola')

Agricola.prototype.endGame = function() {
  this.log.add({ template: '=== Game Over ===' })
  this.log.add({ template: 'Calculating final scores' })
  this.log.indent()

  // Process getEndGamePointsAllPlayers hooks (comparative scoring cards)
  for (const player of this.players.all()) {
    const cards = this.getPlayerActiveCards(player)
    for (const card of cards) {
      if (card.hasHook('getEndGamePointsAllPlayers')) {
        const bonuses = card.callHook('getEndGamePointsAllPlayers', this)
        if (bonuses) {
          for (const [playerName, points] of Object.entries(bonuses)) {
            const p = this.players.byName(playerName)
            if (p && points) {
              p.addBonusPoints(points)
            }
          }
        }
      }
    }
  }
  for (const player of this.players.all()) {
    player._endGameAllPlayersBonusApplied = true
  }

  // Collect scores and remaining resources for all players
  const playerResults = []

  for (const player of this.players.all()) {
    const breakdown = player.getScoreBreakdown()
    const buildingResources = player.getBuildingResourcesCount()

    this.log.add({
      template: '{player} score breakdown:',
      args: { player },
    })
    this.log.indent()

    this.log.add({ template: `Fields: ${breakdown.fields.count} = ${breakdown.fields.points} pts` })
    this.log.add({ template: `Pastures: ${breakdown.pastures.count} = ${breakdown.pastures.points} pts` })
    this.log.add({ template: `Grain: ${breakdown.grain.count} = ${breakdown.grain.points} pts` })
    this.log.add({ template: `Vegetables: ${breakdown.vegetables.count} = ${breakdown.vegetables.points} pts` })
    this.log.add({ template: `Sheep: ${breakdown.sheep.count} = ${breakdown.sheep.points} pts` })
    this.log.add({ template: `Wild Boar: ${breakdown.boar.count} = ${breakdown.boar.points} pts` })
    this.log.add({ template: `Cattle: ${breakdown.cattle.count} = ${breakdown.cattle.points} pts` })
    this.log.add({ template: `Rooms (${breakdown.rooms.type}): ${breakdown.rooms.count} = ${breakdown.rooms.points} pts` })
    this.log.add({ template: `Family: ${breakdown.familyMembers.count} = ${breakdown.familyMembers.points} pts` })
    this.log.add({ template: `Unused spaces: ${breakdown.unusedSpaces.count} = ${breakdown.unusedSpaces.points} pts` })
    this.log.add({ template: `Fenced stables: ${breakdown.fencedStables.count} = ${breakdown.fencedStables.points} pts` })
    this.log.add({ template: `Begging cards: ${breakdown.beggingCards.count} = ${breakdown.beggingCards.points} pts` })
    this.log.add({ template: `Card points: ${breakdown.cardPoints} pts` })
    this.log.add({ template: `Bonus points: ${breakdown.bonusPoints} pts` })
    this.log.add({ template: `TOTAL: ${breakdown.total} points` })
    this.log.add({ template: `Building resources remaining: ${buildingResources}` })

    this.log.outdent()

    playerResults.push({
      player,
      score: breakdown.total,
      buildingResources,
    })
  }

  this.log.outdent()

  // Determine winner with tie-breaker
  // Revised Edition: Tie-breaker is building resources (wood + clay + reed + stone) remaining in supply
  playerResults.sort((a, b) => {
    // First compare by score (higher is better)
    if (b.score !== a.score) {
      return b.score - a.score
    }
    // Tie-breaker: more building resources wins
    return b.buildingResources - a.buildingResources
  })

  const winner = playerResults[0]

  // Check for unbreakable tie
  const tiedPlayers = playerResults.filter(
    p => p.score === winner.score && p.buildingResources === winner.buildingResources
  )

  // Finalize stats before game ends
  this._finalizeStats(playerResults)

  if (tiedPlayers.length > 1) {
    // True tie - multiple winners
    const names = tiedPlayers.map(p => p.player.name).join(' and ')
    this.log.add({ template: `Tie between ${names}!` })
    this.youWin(winner.player, 'tied for highest score')
  }
  else if (playerResults[1] && playerResults[1].score === winner.score) {
    // Won by tie-breaker
    this.log.add({
      template: '{player} wins the tie-breaker with {resources} building resources',
      args: { player: winner.player, resources: winner.buildingResources },
    })
    this.youWin(winner.player, 'tie-breaker (more building resources)')
  }
  else {
    this.youWin(winner.player, 'highest score')
  }
}

Agricola.prototype._finalizeStats = function(playerResults) {
  for (const result of playerResults) {
    const playerStats = this.stats.players[result.player.name]
    if (playerStats) {
      playerStats.score = result.score

      // Calculate unplayed cards (drafted but not played)
      const draftedSet = new Set(playerStats.drafted)
      const playedSet = new Set(playerStats.played)
      playerStats.unplayed = [...draftedSet].filter(id => !playedSet.has(id))
    }
  }
}

Agricola.prototype.calculateScore = function(player) {
  return player.calculateScore()
}
