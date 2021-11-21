module.exports = {
  evaluateEffect,
}

function evaluateEffect(game, effect) {
  const kind = (typeof effect === 'string') ? effect : effect.kind

  if (kind === 'assignTitle') {
    throw new Error('not implemented')
  }

  else if (kind === 'choice') {
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

  else if (kind === 'conditional') {
    throw new Error('not implemented')
  }

  else if (kind === 'counter') {
    const { counter, amount } = effect
    game.mAdjustCounterByName(counter, amount)
  }

  else if (kind === 'cylonActivation') {
    const { activationKind } = effect
    game.aActivateCylonShips(activationKind)
  }

  else if (kind === 'damageGalactica') {
    game.aDamageGalactica()
  }

  else if (kind === 'damageReserveVipers') {
    throw new Error('not implemented')
  }

  else if (kind === 'damageSpaceVipers') {
    throw new Error('not implemented')
  }

  else if (kind === 'deploy') {
    game.aDeployShips(effect.ships)
  }

  else if (kind === 'discardSkills') {
    const { actor, count } = effect

    let players = []
    if (actor === 'each') {
      players = game.getPlayerAll().map(p => ({
        player: p.name,
        count,
      }))
    }
    else {
      players.push({
        player: game.getPlayerByDescriptor(actor).name,
        count: count
      })
    }
    return {
      push: {
        transition: 'discard-skill-cards',
        payload: {
          countsByPlayer: players
        }
      }
    }
  }

  else if (kind === 'drawSkills') {
    throw new Error('not implemented')
  }

  else if (kind === 'move') {
    const { actor, location } = effect
    const player = game.getPlayerByDescriptor(actor)
    const locationZone = game.getZoneByLocationName(location)
    game.mMovePlayer(player, locationZone)
  }

  else if (kind === 'sendPlayerToBrig') {
    throw new Error('not implemented')
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

  else if (kind === 'viewLoyalty') {
    const { viewer, target, count } = effect
    const viewerPlayer = game.getPlayerByDescriptor(viewer)
    const targetPlayer = game.getPlayerByDescriptor(target)
    game.aRevealLoyaltyCards(targetPlayer, viewerPlayer, count)
  }

  ////////////////////////////////////////////////////////////
  // Special cases

  else if (kind === 'aTraitorAccused') {
    return {
      push: {
        transition: 'choose-player-to-send-to-brig',
        payload: {
          playerName: game.getPlayerCurrentTurn().name,
        },
      }
    }
  }

  else if (kind === 'besieged') {
    const spaceZone = game.getZoneSpaceByIndex(5)
    const raiders = spaceZone.cards.filter(c => c.kind === 'ships.raiders')
    for (let i = 0; i < 4; i++) {
      game.aActivateRaider({
        card: raiders[i],
        zoneName: spaceZone.name,
      })
    }
  }

  else if (kind === 'destroyColonialOne') {
    game.aDestroyColonialOne()
  }

  else if (kind === 'fulfillerOfProphecy') {
    throw new Error('not implemented')
  }

  else if (kind === 'returnAllVipers') {
    game.aReturnAllVipersToSupply()
  }

  else if (kind === 'tacticalStrike') {
    for (let i = 0; i < 2; i++) {
      game.aDamageViperInReserve()
    }
  }

  else {
    console.log(game.getCrisis())
    throw new Error(`Unhandled script kind: ${kind}`)
  }
}
