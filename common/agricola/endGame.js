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

  // Prompt animal reorganization for players with cards that score based on arrangement
  for (const player of this.players.all()) {
    const cards = this.getPlayerActiveCards(player)
    const needsReorg = cards.some(c =>
      c.definition.requiresAnimalArrangement && c.hasHook('getEndGamePoints')
    )
    if (needsReorg) {
      this.actions.promptAnimalReorganization(player)
    }
  }

  // Commit end-game resource→VP exchanges (auto-optimized).
  // Must run before getScoreBreakdown so deducted resources aren't available
  // for other end-game calculations (tie-breaker by building resources).
  for (const player of this.players.all()) {
    const exchange = player.computeEndGameExchanges()
    for (const [resource, amount] of Object.entries(exchange.spent)) {
      player.removeResource(resource, amount)
    }
    if (exchange.bonus > 0) {
      player.addBonusPoints(exchange.bonus)
    }
    for (const entry of exchange.perCard) {
      this.log.add({
        template: `{player} spends ${entry.cost} ${entry.resource} on ${entry.cardName} for +${entry.vp} bonus ${entry.vp === 1 ? 'point' : 'points'}`,
        args: { player },
      })
    }
    player._endGameExchangeApplied = true
  }

  // Collect scores and remaining resources for all players
  const playerResults = []

  for (const player of this.players.all()) {
    const breakdown = player.getScoreBreakdown()
    const buildingResources = player.getBuildingResourcesCount()

    this.log.add({
      template: `{player}: ${breakdown.total} points`,
      args: { player },
    })

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
