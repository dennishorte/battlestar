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
  {
    id: 'destroy-their-greatest-ship',
    name: 'Destroy Their Greatest Ship',
    stage: 'secret',
    points: 1,
    type: 'secret',
    condition: 'Destroy another player\'s war sun or flagship.',
    check: () => false,  // tracked via game events
  },
  {
    id: 'make-an-example-of-their-world',
    name: 'Make an Example of Their World',
    stage: 'secret',
    points: 1,
    type: 'secret',
    condition: 'Use BOMBARDMENT to destroy the last of a player\'s ground forces on a planet.',
    check: () => false,
  },
  {
    id: 'spark-a-rebellion',
    name: 'Spark a Rebellion',
    stage: 'secret',
    points: 1,
    type: 'secret',
    condition: 'Win a combat against a player who has the most victory points.',
    check: () => false,
  },
  {
    id: 'turn-their-fleets-to-dust',
    name: 'Turn Their Fleets to Dust',
    stage: 'secret',
    points: 1,
    type: 'secret',
    condition: 'Use SPACE CANNON to destroy the last of a player\'s ships in a system.',
    check: () => false,
  },
  {
    id: 'unveil-flagship',
    name: 'Unveil Flagship',
    stage: 'secret',
    points: 1,
    type: 'secret',
    condition: 'Win a space combat in a system that contains your flagship.',
    check: () => false,
  },
  {
    id: 'become-a-legend',
    name: 'Become a Legend',
    stage: 'secret',
    points: 1,
    type: 'secret',
    condition: 'Have units in 4 systems that contain legendary planets or are adjacent to an anomaly.',
    check: () => false,
  },
  {
    id: 'control-the-region',
    name: 'Control the Region',
    stage: 'secret',
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
