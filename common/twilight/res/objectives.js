// Objectives for Twilight Imperium 4th Edition
//
// Stage I: worth 1 VP. Require basic achievements.
// Stage II: worth 2 VP. Require advanced achievements.
// Secret: worth 1 VP. Only the owning player knows the condition.

const publicObjectivesI = [
  {
    id: 'corner-the-market',
    name: 'Corner the Market',
    stage: 1,
    points: 1,
    type: 'public',
    condition: 'Control 4 planets that each have the same planet trait.',
    check: (player, game) => {
      const controlled = player.getControlledPlanets()
      const traits = { cultural: 0, hazardous: 0, industrial: 0 }
      for (const planetId of controlled) {
        const planet = game.res.getPlanet(planetId)
        if (planet && planet.trait && traits[planet.trait] !== undefined) {
          traits[planet.trait]++
        }
      }
      return Object.values(traits).some(c => c >= 4)
    },
  },
  {
    id: 'develop-weaponry',
    name: 'Develop Weaponry',
    stage: 1,
    points: 1,
    type: 'public',
    condition: 'Own 2 unit upgrade technologies.',
    check: (player) => {
      const techs = player.getTechIds()
      const res = require('./index.js')
      const upgrades = techs.filter(id => {
        const tech = res.getTechnology(id)
        return tech && tech.unitUpgrade
      })
      return upgrades.length >= 2
    },
  },
  {
    id: 'diversify-research',
    name: 'Diversify Research',
    stage: 1,
    points: 1,
    type: 'public',
    condition: 'Own 2 technologies in each of 2 colors.',
    check: (player) => {
      const prereqs = player.getTechPrerequisites()
      const colorsWithTwo = Object.values(prereqs).filter(c => c >= 2)
      return colorsWithTwo.length >= 2
    },
  },
  {
    id: 'erect-a-monument',
    name: 'Erect a Monument',
    stage: 1,
    points: 1,
    type: 'public',
    condition: 'Spend 8 resources.',
    // Spending objectives checked at scoring time
    check: () => false,
  },
  {
    id: 'expand-borders',
    name: 'Expand Borders',
    stage: 1,
    points: 1,
    type: 'public',
    condition: 'Control 6 planets in non-home systems.',
    check: (player, game) => {
      const controlled = player.getControlledPlanets()
      const nonHomePlanets = controlled.filter(pId => {
        const systemId = game._findSystemForPlanet(pId)
        return systemId && !systemId.includes('-home')
      })
      return nonHomePlanets.length >= 6
    },
  },
  {
    id: 'found-research-outposts',
    name: 'Found Research Outposts',
    stage: 1,
    points: 1,
    type: 'public',
    condition: 'Control 3 planets that have technology specialties.',
    check: (player, game) => {
      const controlled = player.getControlledPlanets()
      let count = 0
      for (const planetId of controlled) {
        const planet = game.res.getPlanet(planetId)
        if (planet && planet.techSpecialty) {
          count++
        }
      }
      return count >= 3
    },
  },
  {
    id: 'intimidate-council',
    name: 'Intimidate Council',
    stage: 1,
    points: 1,
    type: 'public',
    condition: 'Have 1 or more ships in 2 systems that are adjacent to Mecatol Rex.',
    check: (player, game) => {
      const mecatolAdj = game._getAdjacentSystems('18')  // System 18 = Mecatol Rex
      let systemsWithShips = 0
      for (const sysId of mecatolAdj) {
        const units = game.state.units[sysId]
        if (units && units.space.some(u => u.owner === player.name)) {
          systemsWithShips++
        }
      }
      return systemsWithShips >= 2
    },
  },
  {
    id: 'lead-from-the-front',
    name: 'Lead from the Front',
    stage: 1,
    points: 1,
    type: 'public',
    condition: 'Spend a total of 3 tokens from your tactic and/or fleet pools.',
    check: () => false,
  },
  {
    id: 'negotiate-trade-routes',
    name: 'Negotiate Trade Routes',
    stage: 1,
    points: 1,
    type: 'public',
    condition: 'Spend 5 trade goods.',
    check: () => false,
  },
  {
    id: 'sway-the-council',
    name: 'Sway the Council',
    stage: 1,
    points: 1,
    type: 'public',
    condition: 'Spend 8 influence.',
    check: () => false,
  },
]

const publicObjectivesII = [
  {
    id: 'centralize-galactic-trade',
    name: 'Centralize Galactic Trade',
    stage: 2,
    points: 2,
    type: 'public',
    condition: 'Spend 10 trade goods.',
    check: () => false,
  },
  {
    id: 'conquer-the-weak',
    name: 'Conquer the Weak',
    stage: 2,
    points: 2,
    type: 'public',
    condition: 'Control 1 planet that is in another player\'s home system.',
    check: (player, game) => {
      const controlled = player.getControlledPlanets()
      for (const planetId of controlled) {
        const systemId = game._findSystemForPlanet(planetId)
        if (systemId && systemId.includes('-home') && !systemId.startsWith(player.factionId)) {
          return true
        }
      }
      return false
    },
  },
  {
    id: 'form-galactic-brain-trust',
    name: 'Form Galactic Brain Trust',
    stage: 2,
    points: 2,
    type: 'public',
    condition: 'Control 5 planets that have technology specialties.',
    check: (player, game) => {
      const controlled = player.getControlledPlanets()
      let count = 0
      for (const planetId of controlled) {
        const planet = game.res.getPlanet(planetId)
        if (planet && planet.techSpecialty) {
          count++
        }
      }
      return count >= 5
    },
  },
  {
    id: 'found-a-golden-age',
    name: 'Found a Golden Age',
    stage: 2,
    points: 2,
    type: 'public',
    condition: 'Spend 16 resources.',
    check: () => false,
  },
  {
    id: 'galvanize-the-people',
    name: 'Galvanize the People',
    stage: 2,
    points: 2,
    type: 'public',
    condition: 'Spend a total of 6 tokens from your tactic and/or fleet pools.',
    check: () => false,
  },
  {
    id: 'manipulate-galactic-law',
    name: 'Manipulate Galactic Law',
    stage: 2,
    points: 2,
    type: 'public',
    condition: 'Spend 16 influence.',
    check: () => false,
  },
  {
    id: 'master-the-sciences',
    name: 'Master the Sciences',
    stage: 2,
    points: 2,
    type: 'public',
    condition: 'Own 2 technologies in each of 4 colors.',
    check: (player) => {
      const prereqs = player.getTechPrerequisites()
      const colorsWithTwo = Object.values(prereqs).filter(c => c >= 2)
      return colorsWithTwo.length >= 4
    },
  },
  {
    id: 'revolutionize-warfare',
    name: 'Revolutionize Warfare',
    stage: 2,
    points: 2,
    type: 'public',
    condition: 'Own 3 unit upgrade technologies.',
    check: (player) => {
      const techs = player.getTechIds()
      const res = require('./index.js')
      const upgrades = techs.filter(id => {
        const tech = res.getTechnology(id)
        return tech && tech.unitUpgrade
      })
      return upgrades.length >= 3
    },
  },
  {
    id: 'subdue-the-galaxy',
    name: 'Subdue the Galaxy',
    stage: 2,
    points: 2,
    type: 'public',
    condition: 'Control 11 planets in non-home systems.',
    check: (player, game) => {
      const controlled = player.getControlledPlanets()
      const nonHomePlanets = controlled.filter(pId => {
        const systemId = game._findSystemForPlanet(pId)
        return systemId && !systemId.includes('-home')
      })
      return nonHomePlanets.length >= 11
    },
  },
  {
    id: 'unify-the-colonies',
    name: 'Unify the Colonies',
    stage: 2,
    points: 2,
    type: 'public',
    condition: 'Control 6 planets that each have the same planet trait.',
    check: (player, game) => {
      const controlled = player.getControlledPlanets()
      const traits = { cultural: 0, hazardous: 0, industrial: 0 }
      for (const planetId of controlled) {
        const planet = game.res.getPlanet(planetId)
        if (planet && planet.trait && traits[planet.trait] !== undefined) {
          traits[planet.trait]++
        }
      }
      return Object.values(traits).some(c => c >= 6)
    },
  },
]

const secretObjectives = [
  // ---------------------------------------------------------------------------
  // Action Phase — Base Game (5)
  // ---------------------------------------------------------------------------
  {
    id: 'destroy-their-greatest-ship',
    name: 'Destroy Their Greatest Ship',
    stage: 'secret',
    phase: 'action',
    points: 1,
    type: 'secret',
    condition: 'Destroy another player\'s war sun or flagship.',
    check: () => false,  // tracked via game events
  },
  {
    id: 'make-an-example-of-their-world',
    name: 'Make an Example of Their World',
    stage: 'secret',
    phase: 'action',
    points: 1,
    type: 'secret',
    condition: 'Destroy the last of a player\'s ground forces on a planet during the bombardment step.',
    check: () => false,
  },
  {
    id: 'spark-a-rebellion',
    name: 'Spark a Rebellion',
    stage: 'secret',
    phase: 'action',
    points: 1,
    type: 'secret',
    condition: 'Win a combat against a player who has the most victory points.',
    check: () => false,
  },
  {
    id: 'turn-their-fleets-to-dust',
    name: 'Turn Their Fleets to Dust',
    stage: 'secret',
    phase: 'action',
    points: 1,
    type: 'secret',
    condition: 'Destroy the last of a player\'s non-fighter ships in the active system during the space cannon offense step.',
    check: () => false,
  },
  {
    id: 'unveil-flagship',
    name: 'Unveil Flagship',
    stage: 'secret',
    phase: 'action',
    points: 1,
    type: 'secret',
    condition: 'Win a space combat in a system that contains your flagship. You cannot score this objective if your flagship is destroyed in the combat.',
    check: () => false,
  },

  // ---------------------------------------------------------------------------
  // Action Phase — Prophecy of Kings (7)
  // ---------------------------------------------------------------------------
  {
    id: 'become-a-martyr',
    name: 'Become a Martyr',
    stage: 'secret',
    phase: 'action',
    points: 1,
    type: 'secret',
    condition: 'Lose control of a planet in a home system.',
    check: () => false,
  },
  {
    id: 'betray-a-friend',
    name: 'Betray a Friend',
    stage: 'secret',
    phase: 'action',
    points: 1,
    type: 'secret',
    condition: 'Win a combat against a player whose promissory note you had in your play area at the start of your tactical action.',
    check: () => false,
  },
  {
    id: 'brave-the-void',
    name: 'Brave the Void',
    stage: 'secret',
    phase: 'action',
    points: 1,
    type: 'secret',
    condition: 'Win a combat in an anomaly.',
    check: () => false,
  },
  {
    id: 'darken-the-skies',
    name: 'Darken the Skies',
    stage: 'secret',
    phase: 'action',
    points: 1,
    type: 'secret',
    condition: 'Win a combat in another player\'s home system.',
    check: () => false,
  },
  {
    id: 'demonstrate-your-power',
    name: 'Demonstrate Your Power',
    stage: 'secret',
    phase: 'action',
    points: 1,
    type: 'secret',
    condition: 'Have 3 or more non-fighter ships in the active system at the end of a space combat.',
    check: () => false,
  },
  {
    id: 'fight-with-precision',
    name: 'Fight With Precision',
    stage: 'secret',
    phase: 'action',
    points: 1,
    type: 'secret',
    condition: 'Destroy the last of a player\'s fighters in the active system during the anti-fighter barrage step.',
    check: () => false,
  },
  {
    id: 'prove-endurance',
    name: 'Prove Endurance',
    stage: 'secret',
    phase: 'action',
    points: 1,
    type: 'secret',
    condition: 'Be the last player to pass during a game round.',
    check: () => false,
  },

  // ---------------------------------------------------------------------------
  // Status Phase — Base Game (15)
  // ---------------------------------------------------------------------------
  {
    id: 'adapt-new-strategies',
    name: 'Adapt New Strategies',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Own 2 faction technologies. (Valefar Assimilator technologies do not count.)',
    check: (player) => {
      const techs = player.getTechIds()
      const res = require('./index.js')
      let factionCount = 0
      for (const techId of techs) {
        const tech = res.getTechnology(techId)
        if (tech && tech.faction && tech.faction === player.factionId) {
          factionCount++
        }
      }
      return factionCount >= 2
    },
  },
  {
    id: 'become-the-gatekeeper',
    name: 'Become the Gatekeeper',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Have 1 or more ships in a system that contains an alpha wormhole and 1 or more ships in a system that contains a beta wormhole.',
    check: (player, game) => {
      const res = require('./index.js')
      let hasAlpha = false
      let hasBeta = false
      for (const [systemId, systemUnits] of Object.entries(game.state.units)) {
        if (!systemUnits.space.some(u => u.owner === player.name)) {
          continue
        }
        const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
        if (tile && tile.wormholes) {
          if (tile.wormholes.includes('alpha')) {
            hasAlpha = true
          }
          if (tile.wormholes.includes('beta')) {
            hasBeta = true
          }
        }
      }
      return hasAlpha && hasBeta
    },
  },
  {
    id: 'control-the-region',
    name: 'Control the Region',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Have 1 or more ships in 6 systems.',
    check: (player, game) => {
      let count = 0
      for (const [, systemUnits] of Object.entries(game.state.units)) {
        if (systemUnits.space.some(u => u.owner === player.name)) {
          count++
        }
      }
      return count >= 6
    },
  },
  {
    id: 'cut-supply-lines',
    name: 'Cut Supply Lines',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Have 1 or more ships in the same system as another player\'s space dock.',
    check: (player, game) => {
      for (const [, systemUnits] of Object.entries(game.state.units)) {
        const hasOwnShips = systemUnits.space.some(u => u.owner === player.name)
        if (!hasOwnShips) {
          continue
        }
        for (const [, planetUnits] of Object.entries(systemUnits.planets)) {
          if (planetUnits.some(u => u.owner !== player.name && u.type === 'space-dock')) {
            return true
          }
        }
      }
      return false
    },
  },
  {
    id: 'establish-a-perimeter',
    name: 'Establish a Perimeter',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Have 4 PDS units on the game board.',
    check: (player, game) => {
      let count = 0
      for (const [, systemUnits] of Object.entries(game.state.units)) {
        for (const [, planetUnits] of Object.entries(systemUnits.planets)) {
          count += planetUnits.filter(u => u.owner === player.name && u.type === 'pds').length
        }
      }
      return count >= 4
    },
  },
  {
    id: 'forge-an-alliance',
    name: 'Forge an Alliance',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Control 4 cultural planets.',
    check: (player, game) => {
      const controlled = player.getControlledPlanets()
      let count = 0
      for (const planetId of controlled) {
        const planet = game.res.getPlanet(planetId)
        if (planet && planet.trait === 'cultural') {
          count++
        }
      }
      return count >= 4
    },
  },
  {
    id: 'form-a-spy-network',
    name: 'Form a Spy Network',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Discard 5 action cards.',
    check: () => false,  // spending objective
  },
  {
    id: 'fuel-the-war-machine',
    name: 'Fuel the War Machine',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Have 3 space docks on the game board.',
    check: (player, game) => {
      let count = 0
      for (const [, systemUnits] of Object.entries(game.state.units)) {
        for (const [, planetUnits] of Object.entries(systemUnits.planets)) {
          count += planetUnits.filter(u => u.owner === player.name && u.type === 'space-dock').length
        }
      }
      return count >= 3
    },
  },
  {
    id: 'gather-a-mighty-fleet',
    name: 'Gather a Mighty Fleet',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Have 5 dreadnoughts on the game board.',
    check: (player, game) => {
      let count = 0
      for (const [, systemUnits] of Object.entries(game.state.units)) {
        count += systemUnits.space.filter(u => u.owner === player.name && u.type === 'dreadnought').length
      }
      return count >= 5
    },
  },
  {
    id: 'learn-the-secrets-of-the-cosmos',
    name: 'Learn the Secrets of the Cosmos',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Have 1 or more ships in 3 systems that are each adjacent to an anomaly.',
    check: (player, game) => {
      let count = 0
      for (const [systemId, systemUnits] of Object.entries(game.state.units)) {
        if (!systemUnits.space.some(u => u.owner === player.name)) {
          continue
        }
        const adjacent = game._getAdjacentSystems(systemId)
        const res = require('./index.js')
        const adjToAnomaly = adjacent.some(adjId => {
          const tile = res.getSystemTile(adjId) || res.getSystemTile(Number(adjId))
          return tile && tile.anomaly
        })
        if (adjToAnomaly) {
          count++
        }
      }
      return count >= 3
    },
  },
  {
    id: 'master-the-laws-of-physics',
    name: 'Master the Laws of Physics',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Own 4 technologies of the same color.',
    check: (player) => {
      const prereqs = player.getTechPrerequisites()
      return Object.values(prereqs).some(c => c >= 4)
    },
  },
  {
    id: 'mine-rare-metals',
    name: 'Mine Rare Metals',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Control 4 hazardous planets.',
    check: (player, game) => {
      const controlled = player.getControlledPlanets()
      let count = 0
      for (const planetId of controlled) {
        const planet = game.res.getPlanet(planetId)
        if (planet && planet.trait === 'hazardous') {
          count++
        }
      }
      return count >= 4
    },
  },
  {
    id: 'monopolize-production',
    name: 'Monopolize Production',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Control 4 industrial planets.',
    check: (player, game) => {
      const controlled = player.getControlledPlanets()
      let count = 0
      for (const planetId of controlled) {
        const planet = game.res.getPlanet(planetId)
        if (planet && planet.trait === 'industrial') {
          count++
        }
      }
      return count >= 4
    },
  },
  {
    id: 'occupy-the-seat-of-the-empire',
    name: 'Occupy the Seat of the Empire',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Control Mecatol Rex and have 3 or more ships in its system.',
    check: (player, game) => {
      const mecatol = game.state.planets['mecatol-rex']
      if (!mecatol || mecatol.controller !== player.name) {
        return false
      }
      const mecUnits = game.state.units['18']
      if (!mecUnits) {
        return false
      }
      return mecUnits.space.filter(u => u.owner === player.name).length >= 3
    },
  },
  {
    id: 'threaten-enemies',
    name: 'Threaten Enemies',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Have 1 or more ships in a system that is adjacent to another player\'s home system.',
    check: (player, game) => {
      for (const [systemId, systemUnits] of Object.entries(game.state.units)) {
        if (!systemUnits.space.some(u => u.owner === player.name)) {
          continue
        }
        const adjacent = game._getAdjacentSystems(systemId)
        for (const adjId of adjacent) {
          if (typeof adjId === 'string' && adjId.includes('-home')) {
            // Check it's another player's home
            const homeOwner = game.players.all().find(p => adjId.startsWith(p.factionId))
            if (homeOwner && homeOwner.name !== player.name) {
              return true
            }
          }
        }
      }
      return false
    },
  },

  // ---------------------------------------------------------------------------
  // Status Phase — Prophecy of Kings (11)
  // ---------------------------------------------------------------------------
  {
    id: 'defy-space-and-time',
    name: 'Defy Space and Time',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Have units in the wormhole nexus.',
    check: () => false,  // wormhole nexus not yet implemented
  },
  {
    id: 'destroy-heretical-works',
    name: 'Destroy Heretical Works',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Purge 2 of your relic fragments of any type.',
    check: () => false,  // spending objective
  },
  {
    id: 'establish-hegemony',
    name: 'Establish Hegemony',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Control planets that have a combined influence value of at least 12.',
    check: (player) => {
      return player.getTotalInfluence() >= 12
    },
  },
  {
    id: 'foster-cohesion',
    name: 'Foster Cohesion',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Be neighbors with all other players.',
    check: (player, game) => {
      const others = game.players.all().filter(p => p.name !== player.name)
      return others.every(p => game.areNeighbors(player.name, p.name))
    },
  },
  {
    id: 'hoard-raw-materials',
    name: 'Hoard Raw Materials',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Control planets that have a combined resource value of at least 12.',
    check: (player) => {
      return player.getTotalResources() >= 12
    },
  },
  {
    id: 'mechanize-the-military',
    name: 'Mechanize The Military',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Have 1 mech on each of 4 planets.',
    check: (player, game) => {
      let planetsWithMech = 0
      for (const [, systemUnits] of Object.entries(game.state.units)) {
        for (const [, planetUnits] of Object.entries(systemUnits.planets)) {
          if (planetUnits.some(u => u.owner === player.name && u.type === 'mech')) {
            planetsWithMech++
          }
        }
      }
      return planetsWithMech >= 4
    },
  },
  {
    id: 'occupy-the-fringe',
    name: 'Occupy The Fringe',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Have 9 or more ground forces on a planet that does not contain 1 of your space docks.',
    check: (player, game) => {
      for (const [, systemUnits] of Object.entries(game.state.units)) {
        for (const [, planetUnits] of Object.entries(systemUnits.planets)) {
          const groundForces = planetUnits.filter(u =>
            u.owner === player.name && (u.type === 'infantry' || u.type === 'mech')
          )
          const hasOwnDock = planetUnits.some(u => u.owner === player.name && u.type === 'space-dock')
          if (groundForces.length >= 9 && !hasOwnDock) {
            return true
          }
        }
      }
      return false
    },
  },
  {
    id: 'produce-en-masse',
    name: 'Produce En Masse',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Have units with a combined PRODUCTION value of at least 8 in a single system.',
    check: (player, game) => {
      const res = require('./index.js')
      for (const [, systemUnits] of Object.entries(game.state.units)) {
        let production = 0
        // Check space units
        for (const unit of systemUnits.space) {
          if (unit.owner !== player.name) {
            continue
          }
          const stats = res.getUnitType(unit.type)
          if (stats && stats.production) {
            production += stats.production
          }
        }
        // Check planet units
        for (const [, planetUnits] of Object.entries(systemUnits.planets)) {
          for (const unit of planetUnits) {
            if (unit.owner !== player.name) {
              continue
            }
            const stats = res.getUnitType(unit.type)
            if (stats && stats.production) {
              production += stats.production
            }
          }
        }
        if (production >= 8) {
          return true
        }
      }
      return false
    },
  },
  {
    id: 'seize-an-icon',
    name: 'Seize An Icon',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Control a legendary planet.',
    check: (player, game) => {
      const controlled = player.getControlledPlanets()
      for (const planetId of controlled) {
        const planet = game.res.getPlanet(planetId)
        if (planet && planet.legendary) {
          return true
        }
      }
      return false
    },
  },
  {
    id: 'stake-your-claim',
    name: 'Stake your Claim',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Control a planet in a system that contains a planet controlled by another player.',
    check: (player, game) => {
      const controlled = player.getControlledPlanets()
      for (const planetId of controlled) {
        const systemId = game._findSystemForPlanet(planetId)
        if (!systemId) {
          continue
        }
        const systemUnits = game.state.units[systemId]
        if (!systemUnits) {
          continue
        }
        for (const [otherPlanetId] of Object.entries(systemUnits.planets)) {
          if (otherPlanetId === planetId) {
            continue
          }
          const ps = game.state.planets[otherPlanetId]
          if (ps && ps.controller && ps.controller !== player.name) {
            return true
          }
        }
      }
      return false
    },
  },
  {
    id: 'strengthen-bonds',
    name: 'Strengthen Bonds',
    stage: 'secret',
    phase: 'status',
    points: 1,
    type: 'secret',
    condition: 'Have another player\'s promissory note in your play area.',
    check: (player) => {
      const notes = player.getPromissoryNotes()
      return notes.some(n => n.owner !== player.name)
    },
  },

  // ---------------------------------------------------------------------------
  // Agenda Phase — Prophecy of Kings (2)
  // ---------------------------------------------------------------------------
  {
    id: 'dictate-policy',
    name: 'Dictate Policy',
    stage: 'secret',
    phase: 'agenda',
    points: 1,
    type: 'secret',
    condition: 'There are 3 or more laws in play.',
    check: (_player, game) => {
      return (game.state.activeLaws || []).length >= 3
    },
  },
  {
    id: 'drive-the-debate',
    name: 'Drive the Debate',
    stage: 'secret',
    phase: 'agenda',
    points: 1,
    type: 'secret',
    condition: 'You or a planet you control are elected by an agenda.',
    check: () => false,  // tracked via game events
  },
]

function getObjective(id) {
  const all = [...publicObjectivesI, ...publicObjectivesII, ...secretObjectives]
  return all.find(o => o.id === id)
}

function getPublicObjectivesI() {
  return [...publicObjectivesI]
}

function getPublicObjectivesII() {
  return [...publicObjectivesII]
}

function getSecretObjectives() {
  return [...secretObjectives]
}

module.exports = {
  getObjective,
  getPublicObjectivesI,
  getPublicObjectivesII,
  getSecretObjectives,
}
