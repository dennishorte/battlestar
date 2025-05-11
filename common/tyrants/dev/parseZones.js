const readlines = require('n-readlines')


function inputFileName() {
  return process.argv[2]
}

function blankZone() {
  return {
    name: '',
    short: '',
    region: 0,
    size: 0,
    neutrals: 0,
    points: 0,
    start: false,
    control: {
      influence: 0,
      points: 0,
    },
    totalControl: {
      influence: 0,
      points: 0,
    },
    neighbors: [],
  }
}

function parseGroups(filename) {
  const routeLines = []
  const locationGroups = []
  let group = []

  const lineReader = new readlines(filename)
  let line
  let mode
  while ((line = lineReader.next()) !== false) {
    line = line.toString('utf-8').trim()

    if (line === '# Routes') {
      mode = 'routes'
    }

    else if (line === '# Locations') {
      mode = 'locations'
    }

    else if (line.startsWith('#')) {
      continue
    }

    else if (mode === 'routes') {
      if (line) {
        routeLines.push(line)
      }
    }

    else if (mode === 'locations') {
      if (line) {
        group.push(line)
      }
      else {
        locationGroups.push(group)
        group = []
      }
    }
  }

  if (group.length > 0) {
    locationGroups.push(group)
  }

  return {
    routeLines,
    locationGroups,
  }
}

function convertLineToRouteZone(line) {
  const hasNeutral = line.endsWith('*')
  if (hasNeutral) {
    line = line.slice(0, -1)
  }

  const zone = blankZone()
  zone.name = line
  zone.short = line
  zone.size = 1
  zone.neutrals = hasNeutral ? 1 : 0

  return zone
}

function convertLinesToLocationZones(lines) {
  const numbers = lines[2].split('').map(num => parseInt(num))

  const zone = blankZone()
  zone.name = lines[0]
  zone.short = lines[1]
  zone.region = numbers[0]
  zone.size = numbers[1]
  zone.neutrals = numbers[2]
  zone.points = numbers[3]
  zone.start = lines[3] === 'start'

  if (lines[3].startsWith('control') || zone.start) {
    // do nothing
  }
  else {
    zone.neighbors.push(lines[4])
  }

  lines.slice(5).forEach(line => zone.neighbors.push(line))

  return zone
}

function routeZones(lines) {
  return lines.map(line => convertLineToRouteZone(line))
}

function locationZones(groups) {
  return groups.map(group => convertLinesToLocationZones(group))
}

function insertNeighbors(zones) {
  const zoneMap = {}
  zones.forEach(zone => zoneMap[zone.short] = zone)

  for (const zone of zones) {

    // All routes have zero points and all locations already have their neighbors listed.
    if (zone.points === 0) {
      if (zone.name.endsWith(' a') || zone.name.endsWith(' b') || zone.name.endsWith(' c')) {
        const prefix = zone.name.slice(0, -2)
        const suffix = zone.name.slice(-1)
        const steps = zones.filter(zone => zone.name.startsWith(prefix))

        const route = prefix.split('-')

        if (suffix === 'a') {
          zone.neighbors.push(zoneMap[route[0]].name)
          zone.neighbors.push(zoneMap[prefix + ' b'].name)
        }

        else if (suffix === 'b') {
          if (steps.length === 2) {
            zone.neighbors.push(zoneMap[route[1]].name)
            zone.neighbors.push(zoneMap[prefix + ' b'].name)
          }
          else if (steps.length === 3) {
            zone.neighbors.push(zoneMap[prefix + ' a'].name)
            zone.neighbors.push(zoneMap[prefix + ' c'].name)
          }
          else {
            throw new Error(`Unexpected number of route steps: ${steps.length}`)
          }
        }

        else if (suffix === 'c') {
          zone.neighbors.push(zoneMap[route[1]].name)
          zone.neighbors.push(zoneMap[prefix + ' b'].name)
        }

        else {
          throw new Error(`Unknown route suffix: ${suffix}`)
        }
      }

      else {
        const route = zone
          .name
          .split('-')

        zone.neighbors.push(zoneMap[route[0]].name)
        zone.neighbors.push(zoneMap[route[1]].name)
      }
    }
  }
}

function processFile(filename) {
  const { routeLines, locationGroups } = parseGroups(filename)
  const zones = [
    ...routeZones(routeLines),
    ...locationZones(locationGroups),
  ]

  insertNeighbors(zones)

  return zones
}

const zones = processFile(inputFileName())

console.log(JSON.stringify(zones, null, 2))
