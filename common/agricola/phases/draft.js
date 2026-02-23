const { Agricola } = require('../agricola.js')


Agricola.prototype.draftPhase = function() {
  this.log.add({ template: '=== Card Drafting ===' })
  this.log.indent()

  // Draft occupations first (pass left)
  this.log.add({ template: 'Drafting Occupations' })
  this.log.indent()
  this.draftCardType('occupations', 1) // 1 = pass left
  this.log.outdent()

  // Draft minor improvements (pass right)
  this.log.add({ template: 'Drafting Minor Improvements' })
  this.log.indent()
  this.draftCardType('minors', -1) // -1 = pass right
  this.log.outdent()

  this.log.outdent()

  // Log final hands
  for (const player of this.players.all()) {
    const occupations = player.hand.filter(id => {
      const card = this.cards.byId(id)
      return card && card.type === 'occupation'
    })
    const minors = player.hand.filter(id => {
      const card = this.cards.byId(id)
      return card && card.type === 'minor'
    })

    this.log.add({
      template: '{player} drafted {occ} occupations and {minor} minor improvements',
      args: { player, occ: occupations.length, minor: minors.length },
    })
  }

  // Clean up draft state
  delete this.state.draftPools
}

Agricola.prototype.draftCardType = function(cardType, passDirection) {
  const players = this.players.all()
  const playerCount = players.length
  const pools = this.state.draftPools[cardType]
  const cardTypeName = cardType === 'occupations' ? 'Occupation' : 'Minor Improvement'

  // Each player starts with one pool in their queue.
  // As they pick, remaining cards pass to the next player immediately.
  const playerQueues = players.map((_, i) => [pools[i]])
  const totalPicks = pools.reduce((sum, pool) => sum + pool.length, 0)
  let picksMade = 0

  while (picksMade < totalPicks) {
    const playerOptions = []

    for (let i = 0; i < playerCount; i++) {
      if (playerQueues[i].length === 0) {
        continue
      }
      const pool = playerQueues[i][0]
      if (pool.length === 0) {
        continue
      }

      const player = players[i]
      const choices = pool.map(cardId => {
        const card = this.cards.byId(cardId)
        return card ? card.name : cardId
      })

      playerOptions.push({
        actor: player.name,
        title: `Draft ${cardTypeName}`,
        choices,
      })
    }

    if (playerOptions.length === 0) {
      break
    }

    const response = this.requestInputAny(playerOptions)
    const player = this.players.byName(response.actor)
    const playerIndex = players.indexOf(player)
    const pool = playerQueues[playerIndex][0]
    const selectedName = response.selection[0]

    const cardId = pool.find(id => {
      const card = this.cards.byId(id)
      return card && card.name === selectedName
    })

    if (cardId) {
      pool.splice(pool.indexOf(cardId), 1)

      // Move card from supply to player's hand zone
      const card = this.cards.byId(cardId)
      const handZone = this.zones.byPlayer(player, 'hand')
      card.moveTo(handZone)

      picksMade++

      // Record draft pick for stats
      this.stats.draft.picks[cardId] = {
        name: card.name,
        type: card.type,
        setId: card.definition?.deck || 'unknown',
        pickOrder: picksMade,
        pickedBy: player.name,
      }
      this.stats.players[player.name].drafted.push(cardId)

      this.log.add({
        template: '{player} drafts {draftedCard}',
        redacted: '{player} drafts a card',
        visibility: [player.name],
        args: { player, draftedCard: selectedName },
      })

      // Remove this pool from the player's queue
      playerQueues[playerIndex].shift()

      // Pass remaining cards to next player (if any)
      if (pool.length > 0) {
        const nextIndex = (playerIndex + passDirection + playerCount) % playerCount
        playerQueues[nextIndex].push(pool)
      }
    }
  }
}
