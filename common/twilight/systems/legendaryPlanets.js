const res = require('../res/index.js')

module.exports = function(Twilight) {

  ////////////////////////////////////////////////////////////////////////////////
  // State helpers (follow _isRelicReady/_exhaustRelic pattern)

  Twilight.prototype._isLegendaryAbilityReady = function(player, planetId) {
    // Player must control the planet
    if (this.state.planets[planetId]?.controller !== player.name) {
      return false
    }
    // Must not already be exhausted this round
    return !(this.state.exhaustedLegendaryAbilities?.[player.name] || []).includes(planetId)
  }

  Twilight.prototype._exhaustLegendaryAbility = function(player, planetId) {
    if (!this.state.exhaustedLegendaryAbilities) {
      this.state.exhaustedLegendaryAbilities = {}
    }
    if (!this.state.exhaustedLegendaryAbilities[player.name]) {
      this.state.exhaustedLegendaryAbilities[player.name] = []
    }
    this.state.exhaustedLegendaryAbilities[player.name].push(planetId)
  }


  ////////////////////////////////////////////////////////////////////////////////
  // End-of-turn: offer legendary planet abilities

  Twilight.prototype._offerLegendaryAbilities = function(player) {
    const legendaryPlanets = [
      { id: 'hopes-end', name: 'Imperial Arms Vault', execute: (p) => this._executeImperialArmsVault(p) },
      { id: 'primor', name: 'The Atrament', execute: (p) => this._executeTheAtrament(p) },
      { id: 'mallice', name: 'Exterrix Headquarters', execute: (p) => this._executeExterrixHeadquarters(p) },
      { id: 'mirage', name: 'Mirage Flight Academy', execute: (p) => this._executeMirageFlightAcademy(p) },
      // custodia-vigilia is passive/reactive, not end-of-turn exhaust
    ]

    const available = legendaryPlanets.filter(lp => this._isLegendaryAbilityReady(player, lp.id))
    if (available.length === 0) {
      return
    }

    const choices = ['Decline', ...available.map(lp => lp.name)]
    const sel = this.actions.choose(player, choices, {
      title: 'Legendary Planet Ability',
    })

    if (sel[0] === 'Decline') {
      return
    }

    const chosen = available.find(lp => lp.name === sel[0])
    if (chosen) {
      this._exhaustLegendaryAbility(player, chosen.id)
      chosen.execute(player)
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Hope's End — Imperial Arms Vault
  // Exhaust: Place 1 mech on any planet you control, OR draw 1 action card

  Twilight.prototype._executeImperialArmsVault = function(player) {
    const sel = this.actions.choose(player, ['Place 1 Mech', 'Draw 1 Action Card'], {
      title: "Imperial Arms Vault (Hope's End)",
    })

    if (sel[0] === 'Place 1 Mech') {
      const controlledPlanets = player.getControlledPlanets()
      if (controlledPlanets.length === 0) {
        return
      }

      let targetPlanet
      if (controlledPlanets.length === 1) {
        targetPlanet = controlledPlanets[0]
      }
      else {
        const planetSel = this.actions.choose(player, controlledPlanets, {
          title: 'Imperial Arms Vault: Place mech on which planet?',
        })
        targetPlanet = planetSel[0]
      }

      const systemId = this._findSystemForPlanet(targetPlanet)
      if (systemId) {
        this._addUnit(systemId, targetPlanet, 'mech', player.name)
      }

      this.log.add({
        template: "{player} uses Imperial Arms Vault (Hope's End): places 1 mech on {planet}",
        args: { player, planet: targetPlanet },
      })
    }
    else {
      this._drawActionCards(player, 1)
      this.log.add({
        template: "{player} uses Imperial Arms Vault (Hope's End): draws 1 action card",
        args: { player },
      })
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Primor — The Atrament
  // Exhaust: Place up to 2 infantry on Primor

  Twilight.prototype._executeTheAtrament = function(player) {
    const systemId = '65'  // Primor's system
    if (!this.state.units[systemId]) {
      return
    }

    this._addUnit(systemId, 'primor', 'infantry', player.name)
    this._addUnit(systemId, 'primor', 'infantry', player.name)

    this.log.add({
      template: '{player} uses The Atrament (Primor): places 2 infantry on Primor',
      args: { player },
    })
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Mallice — Exterrix Headquarters
  // Exhaust: Gain 2 trade goods, OR convert all commodities to trade goods

  Twilight.prototype._executeExterrixHeadquarters = function(player) {
    const sel = this.actions.choose(player, ['Gain 2 Trade Goods', 'Convert Commodities'], {
      title: 'Exterrix Headquarters (Mallice)',
    })

    if (sel[0] === 'Gain 2 Trade Goods') {
      player.tradeGoods += 2
      this.log.add({
        template: '{player} uses Exterrix Headquarters (Mallice): gains 2 trade goods',
        args: { player },
      })
    }
    else {
      const converted = player.commodities
      player.tradeGoods += player.commodities
      player.commodities = 0
      this.log.add({
        template: '{player} uses Exterrix Headquarters (Mallice): converts {count} commodities to trade goods',
        args: { player, count: converted },
      })
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Mirage — Mirage Flight Academy
  // Exhaust: Place up to 2 fighters in the Mirage system (space area)

  Twilight.prototype._executeMirageFlightAcademy = function(player) {
    const mirageSystemId = String(this.state.miragePlanet)
    if (!mirageSystemId || !this.state.units[mirageSystemId]) {
      return
    }

    this._addUnit(mirageSystemId, 'space', 'fighter', player.name)
    this._addUnit(mirageSystemId, 'space', 'fighter', player.name)

    this.log.add({
      template: '{player} uses Mirage Flight Academy (Mirage): places 2 fighters in Mirage system',
      args: { player },
    })
  }

} // module.exports
