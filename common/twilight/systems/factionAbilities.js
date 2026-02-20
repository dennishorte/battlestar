const { GameProxy } = require('../../lib/game/GameProxy.js')


class FactionAbilities {
  constructor(game) {
    this.game = game
    return GameProxy.create(this)
  }

  // ---------------------------------------------------------------------------
  // Shared helper
  // ---------------------------------------------------------------------------

  _hasAbility(player, abilityId) {
    return player.faction?.abilities?.some(a => a.id === abilityId) ?? false
  }


  // ---------------------------------------------------------------------------
  // A. Passive Modifiers — pure value queries, no mutation
  // ---------------------------------------------------------------------------

  getCombatModifier(player) {
    let modifier = 0
    if (this._hasAbility(player, 'fragile')) {
      modifier += 1
    }
    if (this._hasAbility(player, 'unrelenting')) {
      modifier -= 1
    }
    return modifier
  }

  getStatusPhaseTokenBonus(player) {
    return this._hasAbility(player, 'versatile') ? 1 : 0
  }

  canTradeWithNonNeighbors(player) {
    return this._hasAbility(player, 'guild-ships')
  }

  getTechPrerequisiteSkips(player, tech) {
    if (this._hasAbility(player, 'analytical') && !tech.unitUpgrade) {
      return 1
    }
    return 0
  }


  // ---------------------------------------------------------------------------
  // B. Component Actions — data-driven registry
  // ---------------------------------------------------------------------------

  _componentActionHandlers = [
    {
      id: 'orbital-drop',
      name: 'Orbital Drop',
      abilityId: 'orbital-drop',
      isAvailable: (player) => player.commandTokens.tactics >= 1,
      execute: '_orbitalDrop',
    },
    {
      id: 'stall-tactics',
      name: 'Stall Tactics',
      abilityId: 'stall-tactics',
      isAvailable: (player) => (player.actionCards || []).length > 0,
      execute: '_stallTactics',
    },
  ]

  getAvailableComponentActions(player) {
    return this._componentActionHandlers
      .filter(h => this._hasAbility(player, h.abilityId) && h.isAvailable(player))
      .map(h => ({ id: h.id, name: h.name }))
  }

  executeComponentAction(player, actionId) {
    const handler = this._componentActionHandlers.find(h => h.id === actionId)
    if (handler) {
      this[handler.execute](player)
    }
  }

  _orbitalDrop(player) {
    // Spend 1 command token from tactics
    player.commandTokens.tactics -= 1

    // Choose a planet you control
    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    const selection = this.actions.choose(player, controlledPlanets, {
      title: 'Choose planet for Orbital Drop',
    })
    const targetPlanet = selection[0]
    const systemId = this.game._findSystemForPlanet(targetPlanet)

    if (systemId) {
      // Place 2 infantry
      this.game._addUnitToPlanet(systemId, targetPlanet, 'infantry', player.name)
      this.game._addUnitToPlanet(systemId, targetPlanet, 'infantry', player.name)

      this.log.add({
        template: '{player} uses Orbital Drop: 2 infantry on {planet}',
        args: { player, planet: targetPlanet },
      })
    }
  }

  _stallTactics(player) {
    const cards = player.actionCards || []
    if (cards.length === 0) {
      return
    }

    const choices = cards.map(c => c.id)
    const selection = this.actions.choose(player, choices, {
      title: 'Discard Action Card (Stall Tactics)',
    })

    const cardId = selection[0]
    player.actionCards = cards.filter(c => c.id !== cardId)

    this.log.add({
      template: '{player} uses Stall Tactics: discards an action card',
      args: { player },
    })
  }


  // ---------------------------------------------------------------------------
  // C. Combat Triggers — event-driven, called from space combat flow
  // ---------------------------------------------------------------------------

  onSpaceCombatStart(systemId, attacker, defender) {
    this._mentakAmbush(systemId, attacker, defender)
  }

  _mentakAmbush(systemId, attacker, defender) {
    const systemUnits = this.state.units[systemId]

    // Both sides can potentially be Mentak
    for (const [shooter, target] of [[attacker, defender], [defender, attacker]]) {
      const shooterPlayer = this.players.byName(shooter)
      if (!this._hasAbility(shooterPlayer, 'ambush')) {
        continue
      }

      // Check that Mentak has non-fighter ships in this system
      const hasShips = systemUnits.space.some(u => u.owner === shooter && u.type !== 'fighter')
      if (!hasShips) {
        continue
      }

      // Roll 2 dice, 9+ each destroy 1 non-fighter ship
      let hits = 0
      for (let i = 0; i < 2; i++) {
        const roll = Math.floor(this.game.random() * 10) + 1
        if (roll >= 9) {
          hits++
        }
      }

      if (hits > 0) {
        this.log.add({
          template: '{shooter} Ambush scores {hits} hits',
          args: { shooter, hits },
        })

        // Destroy non-fighter ships (auto-assign: cheapest first)
        for (let i = 0; i < hits; i++) {
          const nonFighters = systemUnits.space
            .filter(u => u.owner === target && u.type !== 'fighter')
            .sort((a, b) => {
              const defA = this.game._getUnitStats(a.owner, a.type)
              const defB = this.game._getUnitStats(b.owner, b.type)
              return (defA?.cost || 0) - (defB?.cost || 0)
            })

          if (nonFighters.length > 0) {
            const toDestroy = nonFighters[0]
            const idx = systemUnits.space.indexOf(toDestroy)
            if (idx !== -1) {
              systemUnits.space.splice(idx, 1)
            }
          }
        }
      }
    }
  }


  // ---------------------------------------------------------------------------
  // D. Transaction Triggers — called after trade completes
  // ---------------------------------------------------------------------------

  onTransactionComplete(transactionPlayer) {
    this._mentakPillage(transactionPlayer)
  }

  _mentakPillage(transactionPlayer) {
    // Find any Mentak player who is a neighbor of the transaction player
    for (const mentakCandidate of this.players.all()) {
      if (mentakCandidate.name === transactionPlayer.name) {
        continue
      }
      if (!this._hasAbility(mentakCandidate, 'pillage')) {
        continue
      }
      if (!this.game.areNeighbors(mentakCandidate.name, transactionPlayer.name)) {
        continue
      }

      // Transaction player must have trade goods or commodities to steal
      if (transactionPlayer.tradeGoods <= 0 && transactionPlayer.commodities <= 0) {
        continue
      }

      const choices = ['Pass']
      if (transactionPlayer.tradeGoods > 0) {
        choices.unshift('Steal Trade Good')
      }
      if (transactionPlayer.commodities > 0) {
        choices.unshift('Steal Commodity')
      }

      const selection = this.actions.choose(mentakCandidate, choices, {
        title: `Pillage ${transactionPlayer.name}?`,
      })

      if (selection[0] === 'Steal Trade Good') {
        transactionPlayer.spendTradeGoods(1)
        mentakCandidate.addTradeGoods(1)
        this.log.add({
          template: '{mentak} pillages 1 trade good from {target}',
          args: { mentak: mentakCandidate, target: transactionPlayer },
        })
      }
      else if (selection[0] === 'Steal Commodity') {
        transactionPlayer.commodities -= 1
        mentakCandidate.addTradeGoods(1)  // commodities become TG
        this.log.add({
          template: '{mentak} pillages 1 commodity from {target}',
          args: { mentak: mentakCandidate, target: transactionPlayer },
        })
      }
    }
  }
}


module.exports = { FactionAbilities }
