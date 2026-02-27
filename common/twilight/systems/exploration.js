const res = require('../res/index.js')

module.exports = function(Twilight) {

  Twilight.prototype._initExplorationDecks = function() {
    if (this.state.explorationDecks) {
      return
    }

    this.state.explorationDecks = {}
    for (const trait of ['cultural', 'hazardous', 'industrial', 'frontier']) {
      const cards = res.getExplorationCards(trait)
      this._shuffle(cards)
      this.state.explorationDecks[trait] = cards
    }
  }

  Twilight.prototype._drawExplorationCard = function(trait) {
    this._initExplorationDecks()

    const deck = this.state.explorationDecks[trait]
    if (!deck || deck.length === 0) {
      return null
    }

    return deck.pop()
  }

  Twilight.prototype._explorePlanet = function(planetId, ownerName) {
  // Only explore planets with traits (not home system planets or Mecatol Rex)
    const planet = res.getPlanet(planetId)
    if (!planet || !planet.trait) {
      return
    }

    // Only explore once per planet
    if (this.state.exploredPlanets[planetId]) {
      return
    }

    this.state.exploredPlanets[planetId] = true

    const player = this.players.byName(ownerName)

    // Draw exploration card(s) — Naaz-Rokha distant-suns draws extra with mech
    const bonusCards = this.factionAbilities.getExplorationBonus(player, planetId)
    const cards = []
    const mainCard = this._drawExplorationCard(planet.trait)
    if (mainCard) {
      cards.push(mainCard)
    }
    for (let i = 0; i < bonusCards; i++) {
      const extra = this._drawExplorationCard(planet.trait)
      if (extra) {
        cards.push(extra)
      }
    }

    let card
    if (cards.length === 0) {
      return
    }
    else if (cards.length === 1) {
      card = cards[0]
    }
    else {
    // Player chooses which card to keep
      const cardChoices = cards.map(c => c.name || c.id)
      const selection = this.actions.choose(player, cardChoices, {
        title: 'Choose exploration card to keep',
      })
      card = cards.find(c => (c.name || c.id) === selection[0]) || cards[0]
    }

    this.log.add({
      template: '{player} explores {planet}: {card}',
      args: { player: ownerName, planet: planetId, card: card.name },
    })

    // Ensure planet state exists
    if (!this.state.planets[planetId]) {
      this.state.planets[planetId] = { controller: null, exhausted: false, attachments: [] }
    }

    // Resolve based on card type
    if (card.type === 'attach') {
    // Attach to planet — apply bonuses
      if (!this.state.planets[planetId].attachments) {
        this.state.planets[planetId].attachments = []
      }
      this.state.planets[planetId].attachments.push(card.id)

      this.log.add({
        template: '{card} attached to {planet}',
        args: { card: card.name, planet: planetId },
      })
    }
    else if (card.type === 'fragment') {
    // Give relic fragment to player
      if (!player.relicFragments) {
        player.relicFragments = []
      }
      player.relicFragments.push(card.fragmentType)

      this.log.add({
        template: '{player} gains a {type} relic fragment',
        args: { player: ownerName, type: card.fragmentType },
      })
    }
    else if (card.type === 'action') {
    // Resolve immediate effect
      if (card.resolve) {
        card.resolve(player)
      }
    }

    // Titans terragenesis: offer sleeper placement after exploration
    const systemId = this._findSystemForPlanet(planetId)
    if (systemId) {
      this.factionAbilities.afterExploration(player, planetId, systemId)
    }
  }

} // module.exports
