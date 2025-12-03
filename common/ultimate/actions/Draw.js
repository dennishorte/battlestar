function DrawAction(player, opts={}) {
  const { age, isAction } = opts

  if (isAction) {
    const karmaKind = this.game.aKarma(player, 'draw-action', opts)
    if (karmaKind === 'would-instead') {
      this.acted(player)
      return
    }
  }

  // Expansion the user should draw from, before looking at empty decks.
  const baseExp = opts.exp || _determineBaseDrawExpansion.call(this, player)

  // If age is not specified, draw based on player's current highest top card.
  const highestTopAge = _getAgeForDrawAction.call(this, player, isAction)
  const baseAge = age !== undefined ? (age || 1) : (highestTopAge || 1)

  // Adjust age based on empty decks.
  let [ adjustedAge, adjustedExp ] = _adjustedDrawDeck.call(this, baseAge, baseExp)

  const karmaKind = this.game.aKarma(player, 'draw', { ...opts, age: adjustedAge })
  if (karmaKind === 'would-instead') {
    this.acted(player)
    return
  }
  else if (karmaKind === 'would-first') {
    // Some effects junk decks, which might affect the draw age.
    [ adjustedAge, adjustedExp ] = _adjustedDrawDeck.call(this, baseAge, baseExp)
  }

  return _doDraw.call(this, player, adjustedExp, adjustedAge, opts)
}


function _doDraw(player, exp, age, opts={}) {
  if (age > 11) {
    const scores = this
      .game
      .players
      .all()
      .map(player => ({
        player,
        score: this.game.getScore(player),
        achs: this.game.getAchievementsByPlayer(player).total,
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

  this.acted(player)
  return card
}

function _adjustedDrawDeck(age, exp) {
  if (age > 11) {
    return [12, 'base']
  }

  const baseDeck = this.zones.byDeck('base', age)
  if (baseDeck.cardlist().length === 0) {
    return _adjustedDrawDeck.call(this, age + 1, exp)
  }

  if (exp === 'base') {
    return [age, 'base']
  }

  const expDeck = this.zones.byDeck(exp, age)
  if (expDeck.cardlist().length === 0) {
    return [age, 'base']
  }

  return [age, exp]
}

// Determine which expansion to draw from.
// If playing with more than one of Figures, Echoes, and The Unseen, the draw
// rule for Figures is checked first, then Echoes, then Unseen.
function _determineBaseDrawExpansion(player) {
  // Whether the player ends up drawing echoes, unseen, or base, this counts as their
  // first base draw, and so following draws won't draw unseen cards.
  const isFirstBaseDraw = this.game.checkIsFirstBaseDraw(player)
  if (isFirstBaseDraw){
    this.game.mSetFirstBaseDraw(player)
  }

  if (this.game.settings.version < 5) {
    if (this.game.getExpansionList().includes('echo')) {
      const topAges = this
        .cards
        .tops(player)
        .map(c => c.getAge())
        .sort((l, r) => l - r)
        .reverse()

      if (topAges.length === 1 || (topAges.length > 1 && topAges[0] != topAges[1])) {
        return 'echo'
      }
    }
    if (this.game.getExpansionList().includes('usee')) {
      if (isFirstBaseDraw) {
        return 'usee'
      }
    }
    return 'base'
  }
  else {
    let exp = 'base'

    if (this.game.getExpansionList().includes('echo')) {
      const topAges = this
        .cards
        .tops(player)
        .map(c => c.getAge())
        .sort((l, r) => l - r)
        .reverse()

      if (topAges.length === 1 || (topAges.length > 1 && topAges[0] != topAges[1])) {
        exp = 'echo'
      }
    }
    if (this.game.getExpansionList().includes('usee')) {
      if (isFirstBaseDraw) {
        exp = 'usee'
      }
    }
    return exp
  }
}

function _getAgeForDrawAction(player, isAction) {
  const karmaInfos = this.game.getInfoByKarmaTrigger(player, 'top-card-value', { isAction })

  if (karmaInfos.length > 1) {
    throw new Error('Too many karma infos for top-card-value. I do not know what to do.')
  }

  const ageValues = this
    .game
    .util.colors()
    .map(color => {
      const zone = this.zones.byPlayer(player, color)
      if (zone.cardlist().length === 0) {
        return 1
      }

      const actionType = isAction ? 'draw' : 'other'
      const karmaMatches = (
        !this.game.checkInKarma()
        && karmaInfos.length === 1
        && karmaInfos[0].impl.matches(this, player, { action: actionType, color, isAction })
      )
      if (karmaMatches) {
        this._karmaIn()
        const result = karmaInfos[0].impl.func(this, player, { color })
        this._karmaOut()
        return result
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
