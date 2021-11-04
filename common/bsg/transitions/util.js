export function evaluateEffect(game, effect) {
  const kind = (typeof effect === 'string') ? effect : effect.kind

  if (kind === 'choice') {
    return {
      push: {
        transition: 'make-choice',
        payload: {
          playerName: game.getPlayerPresident().name,
          options: effect.options,
        }
      }
    }
  }

  else if (kind === 'civilianDestroyed') {
    const civilianBag = game.getZoneByName('decks.civilian')
    for (let i = 0; i < effect.count; i++) {
      if (civilianBag.cards.length > 0) {
        const civilian = civilianBag.cards[0]
        game.aDestroyCivilian(civilian)
      }
    }
  }

  else if (kind === 'counter') {
    const { counter, amount } = effect
    game.rk.sessionStart(() => {
      game.mAdjustCounterByName(counter, amount)
    })
  }

  else if (kind === 'deploy') {
    game.aDeployShips(effect.ships)
  }

  else if (kind === 'discardSkills') {
    const { actor, count } = effect
    const player = game.getPlayerByDescriptor(actor)
    return {
      push: {
        transition: 'discard-skill-cards',
        payload: {
          playerName: player.name,
          count: count,
        }
      }
    }
  }

  else if (kind === 'move') {
    const { actor, location } = effect
    const player = game.getPlayerByDescriptor(actor)
    const locationZone = game.getZoneByLocationName(location)
    game.mMovePlayer(player, locationZone)
  }

  else if (kind === 'title') {
    const { title, assignTo } = effect
    const player = game.getPlayerByDescriptor(assignTo)
    if (title === 'Admiral') {
      game.aAssignAdmiral(player)
    }
    else if (title === 'President') {
      game.aAssignPresident(player)
    }
    else {
      throw new Error(`Unknown title: ${name}`)
    }
  }

  else {
    throw new Error(`Unhandled script kind: ${kind}`)
  }
}
