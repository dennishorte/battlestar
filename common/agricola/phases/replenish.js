const { Agricola } = require('../agricola.js')
const res = require('../res/index.js')


Agricola.prototype.replenishPhase = function() {
  this.log.add({ template: 'Replenishing action spaces' })
  this.log.indent()

  for (const actionId of this.state.activeActions) {
    const action = res.getActionById(actionId)
    if (action && action.type === 'accumulating' && action.accumulates) {
      const state = this.state.actionSpaces[actionId]

      for (const [, amount] of Object.entries(action.accumulates)) {
        const prevAccumulated = state.accumulated
        state.accumulated += amount

        if (actionId === 'take-reed') {
          const wasNonEmpty = prevAccumulated > 0
          this.callCardHook('onReedBankReplenish', wasNonEmpty)
        }
      }

      if (state.accumulated > 0) {
        this.log.add({
          template: '{action}: {amount} accumulated',
          args: { action: action.name, amount: state.accumulated },
        })
      }
    }
  }

  this.log.outdent()
}

Agricola.prototype._resetActionSpaces = function() {
  for (const actionId of this.state.activeActions) {
    this.state.actionSpaces[actionId].occupiedBy = null
  }
}

Agricola.prototype._handleActivePlayer = function(player) {
  // OysterEater: skip this person placement
  if (player.skipNextPersonPlacement) {
    player.skipNextPersonPlacement = false
    this.log.add({
      template: '{player} skips placement (Oyster Eater)',
      args: { player },
    })
    return
  }

  // Exclude newborns from worker count (they can't work this round)
  const newbornCount = player.getNewbornsReturningHome()
  const workersThatCanWork = player.getFamilySize() - newbornCount
  const workersUsed = workersThatCanWork - player.getAvailableWorkers() + 1
  const totalWorkerCount = workersThatCanWork
  this.log.add({
    template: "{player}'s turn ({workersUsed}/{totalWorkers})",
    args: { player, workersUsed, totalWorkers: totalWorkerCount },
    event: 'player-turn',
  })
  this.log.indent()
  this.playerTurn(player)
  this.log.outdent()

  // BasketChair: if player moved first person, they get a bonus turn
  if (this.state.basketChairBonusTurn === player.name) {
    this.state.basketChairBonusTurn = null
    this.log.add({
      template: "{player}'s bonus turn (Basket Chair)",
      args: { player },
      event: 'player-turn',
    })
    this.log.indent()
    this.playerTurn(player, { isBonusTurn: true })
    this.log.outdent()
  }

  // BrotherlyLove: 4 people, after 2nd person → 3rd and 4th back-to-back
  if (this.canUseBrotherlyLove(player)) {
    this.log.add({
      template: '{player} places 3rd and 4th person back-to-back (Brotherly Love)',
      args: { player },
    })
    // 3rd person
    this.log.indent()
    this.playerTurn(player, { isBonusTurn: true })
    this.log.outdent()
    const lastActionId = player._lastActionId
    // 4th person — can use same space as 3rd
    this.log.indent()
    this.playerTurn(player, { isBonusTurn: true, allowSameSpaceAs: lastActionId })
    this.log.outdent()
  }
}

Agricola.prototype._tryAlternativeWorkerSource = function(player) {
  if (this.canUseAdoptiveParents(player)) {
    const choices = ['Adopt newborn (1 food)', 'Pass']
    const selection = this.actions.choose(player, choices, {
      title: 'Adoptive Parents: Take action with newborn?',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Adopt newborn (1 food)') {
      player.adoptNewborn()
      this.log.add({
        template: '{player} uses Adoptive Parents (pays 1 food)',
        args: { player },
      })
      this.log.indent()
      this.playerTurn(player)
      this.log.outdent()
      return true
    }
    // Player declined — skip remaining sources (matches original else-if priority)
    return false
  }

  if (this.canUseGuestRoom(player)) {
    const choices = ['Use Guest Room (1 food from card)', 'Pass']
    const selection = this.actions.choose(player, choices, {
      title: 'Guest Room: Place a guest worker?',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Use Guest Room (1 food from card)') {
      const card = this._getGuestRoomCard(player)
      const state = this.cardState(card.id)
      state.food -= 1
      state.lastUsedRound = this.state.round
      this.log.add({
        template: '{player} uses Guest Room (discards 1 food from card)',
        args: { player },
      })
      this.log.indent()
      this.playerTurn(player, { skipUseWorker: true })
      this.log.outdent()
      return true
    }
    // Player declined — skip remaining sources
    return false
  }

  if (this.canUseWorkPermit(player)) {
    const entry = this.state.workPermitWorkers.find(
      e => e.round === this.state.round && e.playerName === player.name
    )
    this.state.workPermitWorkers = this.state.workPermitWorkers.filter(e => e !== entry)
    this.log.add({
      template: '{player} uses scheduled worker (Work Permit)',
      args: { player },
    })
    this.log.indent()
    this.playerTurn(player, { skipUseWorker: true })
    this.log.outdent()
    return true
  }

  return false
}

Agricola.prototype._executeArchwayAction = function() {
  if (!this.state.archwayPlayer) {
    return
  }

  const archwayPlayer = this.players.byName(this.state.archwayPlayer)
  this.state.archwayPlayer = null

  // Get unoccupied action spaces (exclude card-provided action spaces)
  const available = this.getAvailableActions(archwayPlayer, { excludeCardSpaces: true })
  if (available.length === 0) {
    return
  }

  const choices = available.map(actionId => {
    const action = res.getActionById(actionId)
    const state = this.state.actionSpaces[actionId]
    const name = action ? action.name : state.name
    return { id: actionId, label: name }
  })
  choices.push({ id: 'skip', label: 'Skip extra action' })

  const selectorChoices = choices.map(c => c.label)
  const selection = this.actions.choose(
    archwayPlayer,
    selectorChoices,
    { title: 'Archway: Choose an unoccupied action space', min: 1, max: 1 }
  )

  const selectedChoice = choices.find(c => c.label === selection[0])
  if (selectedChoice && selectedChoice.id !== 'skip') {
    const actionId = selectedChoice.id
    this.state.actionSpaces[actionId].occupiedBy = archwayPlayer.name
    this.log.add({
      template: '{player} uses Archway to take extra action: {action}',
      args: { player: archwayPlayer, action: selectedChoice.label },
    })
    this.actions.executeAction(archwayPlayer, actionId)
  }
}
