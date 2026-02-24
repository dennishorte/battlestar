module.exports = {
  componentActions: [
    {
      id: 'keleres-hero',
      name: 'Keleres Hero',
      abilityId: 'the-tribunii',  // reuse faction ability ID for availability gate
      isAvailable: function(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  onTurnStart(player, ctx) {
    if (!ctx.state.activeLaws || ctx.state.activeLaws.length === 0) {
      return
    }
    if (player.getTotalInfluence() < 1) {
      return
    }

    const choice = ctx.actions.choose(player, ['Blank Laws', 'Pass'], {
      title: "Law's Order: Spend 1 influence to blank all laws this turn?",
    })

    if (choice[0] === 'Blank Laws') {
      ctx.game._payInfluence(player, 1)
      ctx.state.lawsBlankedByPlayer = player.name

      ctx.log.add({
        template: "{player} uses Law's Order: all laws blanked this turn",
        args: { player },
      })
    }
  },

  onStrategyPhaseStart(player, ctx) {
    player.replenishCommodities()
    player.addTradeGoods(1)

    ctx.log.add({
      template: '{player} replenishes commodities and gains 1 TG (Council Patronage)',
      args: { player },
    })
  },

  // ---------------------------------------------------------------------------
  // Hero — Keleres heroes vary by sub-faction
  // Mentak: Harka Leeds — ERWAN'S COVENANT
  //   ACTION: Reveal cards from action card deck until 3 with component
  //   actions found. Draw those, shuffle rest back. Purge.
  // Argent: Kuuasi Aun Jalatai — OVERWING ZETA
  //   At start of space combat round in system with controlled planet:
  //   Place flagship + up to 2 cruisers/destroyers from reinforcements. Purge.
  // Xxcha: Odlynn Myrr — OPERATION ARCHON
  //   After agenda revealed: Cast up to 6 extra votes, predict outcome.
  //   For each wrong voter, gain 1 TG + 1 command token. Purge.
  // ---------------------------------------------------------------------------

  keleresHero(ctx, player) {
    const subFaction = player.keleresSubFaction

    if (subFaction === 'mentak-coalition') {
      this._harkaLeedsHero(ctx, player)
    }
    else if (subFaction === 'argent-flight') {
      this._kuuasiHero(ctx, player)
    }
    else if (subFaction === 'xxcha-kingdom') {
      this._odlynnHero(ctx, player)
    }
    else {
      // Fallback: just purge
      player.purgeHero()
      ctx.log.add({
        template: '{player} purges Keleres hero (unknown sub-faction)',
        args: { player: player.name },
      })
    }
  },

  // Harka Leeds (Mentak variant): Reveal action cards until 3 with component
  // actions are found. Draw those, shuffle rest back.
  _harkaLeedsHero(ctx, player) {
    ctx.game._initActionCardDeck()

    const componentActionCards = []
    const otherCards = []
    const deck = ctx.state.actionCardDeck

    // Reveal cards from the deck until 3 with component actions
    while (deck.length > 0 && componentActionCards.length < 3) {
      const card = deck.pop()
      if (card.componentAction) {
        componentActionCards.push(card)
      }
      else {
        otherCards.push(card)
      }
    }

    // Add found component action cards to player's hand
    if (!player.actionCards) {
      player.actionCards = []
    }
    for (const card of componentActionCards) {
      player.actionCards.push(card)
    }

    // Shuffle other cards back into deck
    for (const card of otherCards) {
      deck.push(card)
    }
    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(ctx.game.random() * (i + 1))
      const tmp = deck[i]
      deck[i] = deck[j]
      deck[j] = tmp
    }

    ctx.log.add({
      template: "Erwan's Covenant: {player} draws {count} action cards with component actions",
      args: { player: player.name, count: componentActionCards.length },
    })

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Harka Leeds',
      args: { player: player.name },
    })
  },

  // Kuuasi Aun Jalatai (Argent variant): Place flagship + up to 2
  // cruisers/destroyers from reinforcements in the active system.
  _kuuasiHero(ctx, player) {
    // Find systems with controlled planets where space combat could occur
    const eligibleSystems = []
    for (const [systemId, _systemData] of Object.entries(ctx.state.systems)) {
      const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
      if (!tile || !tile.planets) {
        continue
      }
      const hasControlledPlanet = tile.planets.some(
        pId => ctx.state.planets[pId]?.controller === player.name
      )
      if (hasControlledPlanet) {
        eligibleSystems.push(systemId)
      }
    }

    if (eligibleSystems.length === 0) {
      player.purgeHero()
      ctx.log.add({
        template: '{player} purges Kuuasi Aun Jalatai but no eligible systems',
        args: { player: player.name },
      })
      return
    }

    let targetSystem
    if (eligibleSystems.length === 1) {
      targetSystem = eligibleSystems[0]
    }
    else {
      const selection = ctx.actions.choose(player, eligibleSystems, {
        title: 'Overwing Zeta: Choose system',
      })
      targetSystem = selection[0]
    }

    // Place flagship
    ctx.game._addUnit(targetSystem, 'space', 'flagship', player.name)

    // Place up to 2 cruisers or destroyers
    for (let i = 0; i < 2; i++) {
      const choices = ['cruiser', 'destroyer', 'Done']
      const unitChoice = ctx.actions.choose(player, choices, {
        title: `Overwing Zeta: Place ship ${i + 1}/2`,
      })
      if (unitChoice[0] === 'Done') {
        break
      }
      ctx.game._addUnit(targetSystem, 'space', unitChoice[0], player.name)
    }

    ctx.log.add({
      template: 'Overwing Zeta: {player} places flagship and ships in {system}',
      args: { player: player.name, system: targetSystem },
    })

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Kuuasi Aun Jalatai',
      args: { player: player.name },
    })
  },

  // Odlynn Myrr (Xxcha variant): Cast up to 6 extra votes, predict outcome.
  // For each player that voted wrong, gain 1 TG + 1 command token.
  _odlynnHero(ctx, player) {
    // This hero triggers "after an agenda is revealed" — as a component action
    // we simulate it by allowing the player to predict and gain resources
    const extraVotes = ctx.actions.choose(player, ['1 vote', '2 votes', '3 votes', '4 votes', '5 votes', '6 votes'], {
      title: 'Operation Archon: Cast how many extra votes? (up to 6)',
    })
    const votes = parseInt(extraVotes[0])

    ctx.log.add({
      template: 'Operation Archon: {player} casts {votes} extra votes',
      args: { player: player.name, votes },
    })

    // Gain resources for wrong voters (simplified: gain TG + command tokens)
    // In a real implementation this would be resolved after agenda voting
    // For now, just grant a base bonus
    const otherPlayers = ctx.game.players.all().filter(p => p.name !== player.name)
    player.addTradeGoods(otherPlayers.length)
    player.commandTokens.tactics += otherPlayers.length

    ctx.log.add({
      template: 'Operation Archon: {player} gains {tg} TG and {tokens} command tokens',
      args: { player: player.name, tg: otherPlayers.length, tokens: otherPlayers.length },
    })

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Odlynn Myrr',
      args: { player: player.name },
    })
  },

  // ---------------------------------------------------------------------------
  // Mech — Omniopiares: Other players must spend 1 influence to commit ground
  // forces to the planet containing this unit.
  // This is a passive ability checked during invasion.
  // ---------------------------------------------------------------------------

  getInvasionInfluenceCost(player, ctx, { planetId, systemId, invadingPlayer }) {
    // Check if this player has a mech on the planet
    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits || !systemUnits.planets) {
      return 0
    }
    const planetUnits = systemUnits.planets[planetId] || []
    const hasMech = planetUnits.some(
      u => u.owner === player.name && u.type === 'mech'
    )
    if (!hasMech) {
      return 0
    }
    // The invading player is someone else
    if (invadingPlayer === player.name) {
      return 0
    }
    return 1  // 1 influence per ground force committed
  },
}
