const util = require('../../lib/util.js')


function DrawAction(player, opts={}) {
  const { age, isAction } = opts

  if (isAction) {
    const karmaKind = this.game.triggerKarma(player, 'draw-action', opts)
    if (karmaKind === 'would-instead') {
      this.acted(player)
      return
    }
  }

  // Expansion the user should draw from, before looking at empty decks.
  const baseExp = opts.exp || _determineBaseDrawExpansion.call(this, player)

  // If age is not specified, draw based on player's current highest top card.
  const highestTopAge = _getAgeForDrawAction.call(this, player, isAction)
  const minAge = this.game.getMinAge()
  const baseAge = age !== undefined ? (age || minAge) : (highestTopAge || minAge)

  // Adjust age based on empty decks.
  let [ adjustedAge, adjustedExp ] = this.game.getAdjustedDrawDeck(baseAge, baseExp)

  const karmaKind = this.game.triggerKarma(player, 'draw', { ...opts, age: adjustedAge, exp: adjustedExp })
  if (karmaKind === 'would-instead') {
    this.acted(player)
    return
  }
  else if (karmaKind === 'would-first') {
    // Some effects junk decks, which might affect the draw age.
    ;[ adjustedAge, adjustedExp ] = this.game.getAdjustedDrawDeck(baseAge, baseExp)
  }

  return _doDraw.call(this, player, adjustedExp, adjustedAge, opts)
}


function _doDraw(player, exp, age, opts={}) {
  if (age > this.game.getMaxAge()) {
    const scores = this
      .game
      .players
      .all()
      .map(player => ({
        player,
        score: player.score(),
        achs: player.achievementCount().total,
      }))
      .sort((l, r) => {
        if (r.score !== l.score) {
          r.reason = 'high draw'
          l.reason = 'high draw'
          return r.score - l.score
        }
        else if (r.achs !== l.achs) {
          r.reason = 'high draw - tie breaker (achievements)'
          l.reason = 'high draw - tie breaker (achievements)'
          return r.achs - l.achs
        }
        else {
          this.game.youWin(player, 'Tied for points and achievements; player who drew the big card wins!')
        }
      })

    this.game.youWin(scores[0].player, scores[0].reason)
  }

  const source = this.zones.byDeck(exp, age)
  const hand = this.zones.byPlayer(player, 'hand')
  const card = source.peek()
  card.moveTo(hand)

  if (!opts.silent) {
    this.log.add({
      template: '{player} draws {card}',
      args: { player, card }
    })
  }

  // Stats
  _statsCardWasDrawn.call(this, card)

  this.acted(player)
  return card
}

function _statsCardWasDrawn(card) {
  util.array.pushUnique(this.game.stats.drawn, card.name)
}

function _determineBaseDrawExpansion(player) {
  // Query the expansion first, then mark the first base draw as consumed.
  // Order matters: getBaseDrawExpansion reads isFirstBaseDraw(), so the
  // mutation must happen after.
  const exp = this.game.getBaseDrawExpansion(player)
  if (player.isFirstBaseDraw()) {
    this.game.mSetFirstBaseDraw(player)
  }
  return exp
}

function _getAgeForDrawAction(player, isAction) {
  const karmaInfos = this.game.findKarmasByTrigger(player, 'top-card-value', { isAction })

  if (karmaInfos.length > 1) {
    throw new Error('Too many karma infos for top-card-value. I do not know what to do.')
  }

  const ageValues = this
    .game
    .util.colors()
    .map(color => {
      const zone = this.zones.byPlayer(player, color)
      if (zone.cardlist().length === 0) {
        return this.game.getMinAge()
      }

      const actionType = isAction ? 'draw' : 'other'
      const karmaMatches = (
        !this.game.isExecutingKarma()
        && karmaInfos.length === 1
        && karmaInfos[0].impl.matches(this, player, { action: actionType, color, isAction })
      )
      if (karmaMatches) {
        return this.game.withKarmaDepth(() => {
          return karmaInfos[0].impl.func(this, player, { color })
        })
      }
      else {
        return zone.cardlist()[0].getAge()
      }
    })

  return Math.max(...ageValues)
}



module.exports = {
  DrawAction,
}
