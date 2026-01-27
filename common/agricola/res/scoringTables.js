// Agricola Scoring Tables and Functions

// Scoring thresholds for each category
// Format: { count: points } where count is the minimum to get those points
const scoringTables = {
  // Fields: -1 for 0-1, 1 for 2, 2 for 3, 3 for 4, 4 for 5+
  fields: {
    thresholds: [
      { min: 0, points: -1 },
      { min: 2, points: 1 },
      { min: 3, points: 2 },
      { min: 4, points: 3 },
      { min: 5, points: 4 },
    ],
  },

  // Pastures: -1 for 0, 1 for 1, 2 for 2, 3 for 3, 4 for 4+
  pastures: {
    thresholds: [
      { min: 0, points: -1 },
      { min: 1, points: 1 },
      { min: 2, points: 2 },
      { min: 3, points: 3 },
      { min: 4, points: 4 },
    ],
  },

  // Grain: -1 for 0, 1 for 1-3, 2 for 4-5, 3 for 6-7, 4 for 8+
  grain: {
    thresholds: [
      { min: 0, points: -1 },
      { min: 1, points: 1 },
      { min: 4, points: 2 },
      { min: 6, points: 3 },
      { min: 8, points: 4 },
    ],
  },

  // Vegetables: -1 for 0, 1 for 1, 2 for 2, 3 for 3, 4 for 4+
  vegetables: {
    thresholds: [
      { min: 0, points: -1 },
      { min: 1, points: 1 },
      { min: 2, points: 2 },
      { min: 3, points: 3 },
      { min: 4, points: 4 },
    ],
  },

  // Sheep: -1 for 0, 1 for 1-3, 2 for 4-5, 3 for 6-7, 4 for 8+
  sheep: {
    thresholds: [
      { min: 0, points: -1 },
      { min: 1, points: 1 },
      { min: 4, points: 2 },
      { min: 6, points: 3 },
      { min: 8, points: 4 },
    ],
  },

  // Wild Boar: -1 for 0, 1 for 1-2, 2 for 3-4, 3 for 5-6, 4 for 7+
  boar: {
    thresholds: [
      { min: 0, points: -1 },
      { min: 1, points: 1 },
      { min: 3, points: 2 },
      { min: 5, points: 3 },
      { min: 7, points: 4 },
    ],
  },

  // Cattle: -1 for 0, 1 for 1, 2 for 2-3, 3 for 4-5, 4 for 6+
  cattle: {
    thresholds: [
      { min: 0, points: -1 },
      { min: 1, points: 1 },
      { min: 2, points: 2 },
      { min: 4, points: 3 },
      { min: 6, points: 4 },
    ],
  },
}

// Score a category based on count
function scoreCategory(category, count) {
  const table = scoringTables[category]
  if (!table) {
    throw new Error(`Unknown scoring category: ${category}`)
  }

  // Work backwards through thresholds to find applicable score
  const thresholds = table.thresholds
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (count >= thresholds[i].min) {
      return thresholds[i].points
    }
  }

  return thresholds[0].points
}

// Fixed point values
const fixedScoring = {
  // Points per unused farmyard space
  unusedSpace: -1,

  // Points per fenced stable
  fencedStable: 1,

  // Points per room type
  roomPoints: {
    wood: 0,
    clay: 1,
    stone: 2,
  },

  // Points per family member
  familyMember: 3,

  // Points per begging card
  beggingCard: -3,
}

// Calculate room points
function scoreRooms(roomCount, roomType) {
  const pointsPerRoom = fixedScoring.roomPoints[roomType] || 0
  return roomCount * pointsPerRoom
}

// Calculate family points
function scoreFamilyMembers(count) {
  return count * fixedScoring.familyMember
}

// Calculate unused space penalty
function scoreUnusedSpaces(count) {
  return count * fixedScoring.unusedSpace
}

// Calculate fenced stable bonus
function scoreFencedStables(count) {
  return count * fixedScoring.fencedStable
}

// Calculate begging card penalty
function scoreBeggingCards(count) {
  return count * fixedScoring.beggingCard
}

// Calculate total score for a player state
function calculateTotalScore(playerState) {
  let total = 0

  // Category scoring
  total += scoreCategory('fields', playerState.fields || 0)
  total += scoreCategory('pastures', playerState.pastures || 0)
  total += scoreCategory('grain', playerState.grain || 0)
  total += scoreCategory('vegetables', playerState.vegetables || 0)
  total += scoreCategory('sheep', playerState.sheep || 0)
  total += scoreCategory('boar', playerState.boar || 0)
  total += scoreCategory('cattle', playerState.cattle || 0)

  // Fixed scoring
  total += scoreRooms(playerState.rooms || 0, playerState.roomType || 'wood')
  total += scoreFamilyMembers(playerState.familyMembers || 0)
  total += scoreUnusedSpaces(playerState.unusedSpaces || 0)
  total += scoreFencedStables(playerState.fencedStables || 0)
  total += scoreBeggingCards(playerState.beggingCards || 0)

  // Card points (from improvements and occupations)
  total += playerState.cardPoints || 0

  // Bonus points (from specific cards)
  total += playerState.bonusPoints || 0

  return total
}

// Get a breakdown of scoring for display
function getScoreBreakdown(playerState) {
  return {
    fields: {
      count: playerState.fields || 0,
      points: scoreCategory('fields', playerState.fields || 0),
    },
    pastures: {
      count: playerState.pastures || 0,
      points: scoreCategory('pastures', playerState.pastures || 0),
    },
    grain: {
      count: playerState.grain || 0,
      points: scoreCategory('grain', playerState.grain || 0),
    },
    vegetables: {
      count: playerState.vegetables || 0,
      points: scoreCategory('vegetables', playerState.vegetables || 0),
    },
    sheep: {
      count: playerState.sheep || 0,
      points: scoreCategory('sheep', playerState.sheep || 0),
    },
    boar: {
      count: playerState.boar || 0,
      points: scoreCategory('boar', playerState.boar || 0),
    },
    cattle: {
      count: playerState.cattle || 0,
      points: scoreCategory('cattle', playerState.cattle || 0),
    },
    rooms: {
      count: playerState.rooms || 0,
      type: playerState.roomType || 'wood',
      points: scoreRooms(playerState.rooms || 0, playerState.roomType || 'wood'),
    },
    familyMembers: {
      count: playerState.familyMembers || 0,
      points: scoreFamilyMembers(playerState.familyMembers || 0),
    },
    unusedSpaces: {
      count: playerState.unusedSpaces || 0,
      points: scoreUnusedSpaces(playerState.unusedSpaces || 0),
    },
    fencedStables: {
      count: playerState.fencedStables || 0,
      points: scoreFencedStables(playerState.fencedStables || 0),
    },
    beggingCards: {
      count: playerState.beggingCards || 0,
      points: scoreBeggingCards(playerState.beggingCards || 0),
    },
    cardPoints: playerState.cardPoints || 0,
    bonusPoints: playerState.bonusPoints || 0,
    total: calculateTotalScore(playerState),
  }
}

module.exports = {
  scoringTables,
  fixedScoring,
  scoreCategory,
  scoreRooms,
  scoreFamilyMembers,
  scoreUnusedSpaces,
  scoreFencedStables,
  scoreBeggingCards,
  calculateTotalScore,
  getScoreBreakdown,
}
