/**
 * FarmyardMixin - Utility functions for farmyard operations
 *
 * These functions can be mixed into the game or player class
 * to provide farmyard-related helper functions.
 */

const res = require('../res/index.js')

const FarmyardMixin = {

  // Visualize farmyard as ASCII art for debugging
  visualizeFarmyard(player) {
    const lines = []
    lines.push(`Farmyard for ${player.name}:`)
    lines.push('+' + '---+'.repeat(res.constants.farmyardCols))

    for (let row = 0; row < res.constants.farmyardRows; row++) {
      let rowStr = '|'
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        const space = player.getSpace(row, col)
        let symbol = '   '

        if (space.type === 'room') {
          symbol = space.roomType === 'wood' ? ' W ' :
            space.roomType === 'clay' ? ' C ' : ' S '
        }
        else if (space.type === 'field') {
          if (space.crop === 'grain') {
            symbol = `G${space.cropCount} `
          }
          else if (space.crop === 'vegetables') {
            symbol = `V${space.cropCount} `
          }
          else {
            symbol = ' F '
          }
        }
        else if (space.type === 'pasture') {
          const pasture = player.getPastureAtSpace(row, col)
          if (pasture && pasture.animalCount > 0) {
            const typeChar = pasture.animalType[0].toUpperCase()
            symbol = `${typeChar}${pasture.animalCount} `
          }
          else {
            symbol = ' P '
          }
        }
        else if (space.hasStable) {
          symbol = ' s '
        }

        rowStr += symbol + '|'
      }
      lines.push(rowStr)
      lines.push('+' + '---+'.repeat(res.constants.farmyardCols))
    }

    return lines.join('\n')
  },

  // Get summary of farmyard state
  getFarmyardSummary(player) {
    return {
      rooms: player.getRoomCount(),
      roomType: player.roomType,
      fields: player.getFieldCount(),
      sownFields: player.getSownFields().length,
      pastures: player.getPastureCount(),
      stables: player.getStableCount(),
      fences: player.getFenceCount(),
      unusedSpaces: player.getUnusedSpaceCount(),
      pet: player.pet,
      animals: player.getAllAnimals(),
    }
  },

  // Check if space is on edge of farmyard
  isEdgeSpace(row, col) {
    return row === 0 || row === res.constants.farmyardRows - 1 ||
           col === 0 || col === res.constants.farmyardCols - 1
  },

  // Check if two spaces are adjacent
  areAdjacent(row1, col1, row2, col2) {
    const rowDiff = Math.abs(row1 - row2)
    const colDiff = Math.abs(col1 - col2)
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
  },

  // Get all spaces of a certain type
  getSpacesOfType(player, type) {
    const spaces = []
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        const space = player.getSpace(row, col)
        if (space.type === type) {
          spaces.push({ row, col, ...space })
        }
      }
    }
    return spaces
  },

  // Calculate total animal capacity
  calculateTotalAnimalCapacity(player) {
    let capacity = {
      total: 1, // Pet
      inHouse: 1,
      inPastures: 0,
      inUnfencedStables: 0,
    }

    // Pasture capacity
    for (const pasture of player.farmyard.pastures) {
      const pastureCapacity = player.getPastureCapacity(pasture)
      capacity.inPastures += pastureCapacity
      capacity.total += pastureCapacity
    }

    // Unfenced stable capacity
    capacity.inUnfencedStables = player.getUnfencedStableCapacity()
    capacity.total += capacity.inUnfencedStables

    return capacity
  },

  // Find contiguous groups of empty spaces (potential pastures)
  findContiguousEmptyGroups(player) {
    const visited = new Set()
    const groups = []

    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        const key = `${row},${col}`
        if (visited.has(key)) {
          continue
        }

        const space = player.getSpace(row, col)
        if (space.type !== 'empty' && space.type !== 'pasture') {
          visited.add(key)
          continue
        }

        // Flood fill to find connected spaces
        const group = []
        const queue = [{ row, col }]

        while (queue.length > 0) {
          const current = queue.shift()
          const currentKey = `${current.row},${current.col}`

          if (visited.has(currentKey)) {
            continue
          }
          visited.add(currentKey)

          const currentSpace = player.getSpace(current.row, current.col)
          if (currentSpace.type !== 'empty' && currentSpace.type !== 'pasture') {
            continue
          }

          group.push(current)

          // Add unvisited neighbors
          const neighbors = player.getOrthogonalNeighbors(current.row, current.col)
          for (const n of neighbors) {
            if (!visited.has(`${n.row},${n.col}`)) {
              queue.push(n)
            }
          }
        }

        if (group.length > 0) {
          groups.push(group)
        }
      }
    }

    return groups
  },

  // Calculate fences needed to enclose a group of spaces
  calculateFencesNeeded(player, spaces) {
    let fenceCount = 0
    const spaceSet = new Set(spaces.map(s => `${s.row},${s.col}`))

    for (const space of spaces) {
      const neighbors = player.getOrthogonalNeighbors(space.row, space.col)

      for (const n of neighbors) {
        const neighborKey = `${n.row},${n.col}`

        // If neighbor is outside our group, we need a fence
        if (!spaceSet.has(neighborKey)) {
          const neighborSpace = player.getSpace(n.row, n.col)
          // Only count if neighbor is not a room or field (which act as natural barriers)
          if (neighborSpace && neighborSpace.type !== 'room' && neighborSpace.type !== 'field') {
            // Check if fence already exists
            if (!player.hasFenceBetween(space.row, space.col, n.row, n.col)) {
              fenceCount++
            }
          }
        }
      }

      // Check board edges
      if (space.row === 0 || space.row === res.constants.farmyardRows - 1 ||
          space.col === 0 || space.col === res.constants.farmyardCols - 1) {
        // Edge spaces need fences on their outer edges
        if (space.row === 0) {
          fenceCount++
        }
        if (space.row === res.constants.farmyardRows - 1) {
          fenceCount++
        }
        if (space.col === 0) {
          fenceCount++
        }
        if (space.col === res.constants.farmyardCols - 1) {
          fenceCount++
        }
      }
    }

    // Each fence is counted twice (once from each side), so divide by 2
    // But edge fences are only counted once, so we need to handle that
    // This is a simplification - actual fence counting is more complex
    return Math.ceil(fenceCount / 2)
  },
}

module.exports = { FarmyardMixin }
