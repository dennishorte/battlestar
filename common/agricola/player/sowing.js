const { AgricolaPlayer } = require('../AgricolaPlayer.js')
const res = require('../res/index.js')

AgricolaPlayer.prototype.getFieldCount = function() {
  let count = 0
  for (let row = 0; row < res.constants.farmyardRows; row++) {
    for (let col = 0; col < res.constants.farmyardCols; col++) {
      if (this.farmyard.grid[row][col].type === 'field') {
        count++
      }
    }
  }
  // Sown pasture virtual fields (Love for Agriculture) count as fields for scoring
  for (const vf of this.virtualFields) {
    if (vf.countsAsFieldForScoring && vf.crop && vf.cropCount > 0) {
      count++
    }
  }
  return count
}

// For prerequisites, field cards should also be counted.
// Returns total fields including both field tiles and field cards.
AgricolaPlayer.prototype.getFieldCountForPrereqs = function() {
  let count = this.getFieldCount()
  // Add field cards (cards with isField: true property)
  for (const cardId of this.playedMinorImprovements) {
    const card = this.cards.byId(cardId)
    if (card && card.isField) {
      count++
    }
  }
  return count
}

AgricolaPlayer.prototype.getFieldSpaces = function() {
  const fields = []
  for (let row = 0; row < res.constants.farmyardRows; row++) {
    for (let col = 0; col < res.constants.farmyardCols; col++) {
      if (this.farmyard.grid[row][col].type === 'field') {
        fields.push({ row, col, ...this.farmyard.grid[row][col] })
      }
    }
  }
  return fields
}

AgricolaPlayer.prototype.getEmptyFields = function() {
  const fields = this.getFieldSpaces().filter(f => !f.crop || f.cropCount === 0)
  // Include empty virtual fields
  for (const vf of this.getEmptyVirtualFields()) {
    fields.push({ isVirtualField: true, virtualFieldId: vf.id, ...vf })
  }
  return fields
}

AgricolaPlayer.prototype.getSowableFields = function() {
  const fields = this.getFieldSpaces()
  // Include empty virtual fields (virtual fields don't support replanting)
  for (const vf of this.getEmptyVirtualFields()) {
    fields.push({ isVirtualField: true, virtualFieldId: vf.id, ...vf })
  }
  return fields
}

AgricolaPlayer.prototype.getSownFields = function() {
  const fields = this.getFieldSpaces().filter(f => f.crop && f.cropCount > 0)
  // Include sown virtual fields
  for (const vf of this.getSownVirtualFields()) {
    fields.push({ isVirtualField: true, virtualFieldId: vf.id, ...vf })
  }
  return fields
}

AgricolaPlayer.prototype.getGrainInFields = function() {
  return this.getSownFields()
    .filter(f => f.crop === 'grain')
    .reduce((sum, f) => sum + f.cropCount, 0)
}

AgricolaPlayer.prototype.getVegetablesInFields = function() {
  return this.getSownFields()
    .filter(f => f.crop === 'vegetables')
    .reduce((sum, f) => sum + f.cropCount, 0)
}

// Get fields with at least 3 grain and no vegetable underneath (for Heresy Teacher)
AgricolaPlayer.prototype.getFieldsWithGrainNoVegetable = function() {
  return this.getFieldSpaces().filter(f => {
    const space = this.getSpace(f.row, f.col)
    return f.crop === 'grain' && f.cropCount >= 3 && !space.underCrop
  })
}

// Add a vegetable underneath the grain in a field (for Heresy Teacher)
AgricolaPlayer.prototype.addVegetableToField = function(row, col) {
  const space = this.getSpace(row, col)
  if (!space || space.type !== 'field') {
    return false
  }
  if (space.crop !== 'grain' || space.cropCount < 3 || space.underCrop) {
    return false
  }
  space.underCrop = 'vegetables'
  space.underCropCount = 1
  return true
}

AgricolaPlayer.prototype.canPlowField = function(row, col) {
  // Must be empty
  if (!this.isSpaceEmpty(row, col)) {
    return false
  }

  // Future Building Site restriction
  if (this.isRestrictedByFutureBuildingSite(row, col)) {
    return false
  }

  // First field can go anywhere
  const existingFields = this.getFieldSpaces()
  if (existingFields.length === 0) {
    return true
  }

  // Additional fields must be adjacent to existing field
  const neighbors = this.getOrthogonalNeighbors(row, col)
  return neighbors.some(n => {
    const space = this.getSpace(n.row, n.col)
    return space && space.type === 'field'
  })
}

AgricolaPlayer.prototype.getValidPlowSpaces = function() {
  const valid = []
  for (const space of this.getEmptySpaces()) {
    if (this.canPlowField(space.row, space.col)) {
      valid.push(space)
    }
  }
  return valid
}

AgricolaPlayer.prototype.hasFieldsInLShape = function() {
  const fields = this.getFieldSpaces()
  if (fields.length < 3) {
    return false
  }
  const fieldSet = new Set(fields.map(f => `${f.row},${f.col}`))
  for (const f of fields) {
    // Check if this field has field neighbors in both horizontal AND vertical axes
    const hasHorizontal = fieldSet.has(`${f.row},${f.col - 1}`) || fieldSet.has(`${f.row},${f.col + 1}`)
    const hasVertical = fieldSet.has(`${f.row - 1},${f.col}`) || fieldSet.has(`${f.row + 1},${f.col}`)
    if (hasHorizontal && hasVertical) {
      return true
    }
  }
  return false
}

AgricolaPlayer.prototype.plowField = function(row, col) {
  if (!this.canPlowField(row, col)) {
    return false
  }
  this.setSpace(row, col, { type: 'field', crop: null, cropCount: 0 })
  return true
}

AgricolaPlayer.prototype.canSow = function(cropType) {
  // Must have the seed
  if (this[cropType] < 1) {
    return false
  }

  // Check regular fields (any field can be sown, including those with existing crops)
  if (this.getFieldSpaces().length > 0) {
    return true
  }

  // Check virtual fields that accept this crop type
  for (const vf of this.getEmptyVirtualFields()) {
    if (!vf.cropRestriction || vf.cropRestriction === cropType) {
      return true
    }
  }

  return false
}

AgricolaPlayer.prototype.isFieldAdjacentToPasture = function({ row, col }) {
  const pastureSpaces = new Set()
  for (const pasture of this.farmyard.pastures) {
    for (const s of pasture.spaces) {
      pastureSpaces.add(`${s.row},${s.col}`)
    }
  }
  const neighbors = [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]
  return neighbors.some(([r, c]) => pastureSpaces.has(`${r},${c}`))
}

AgricolaPlayer.prototype.sowField = function(row, col, cropType) {
  const space = this.getSpace(row, col)
  if (!space || space.type !== 'field') {
    return false
  }

  if (this[cropType] < 1) {
    return false
  }

  // Take 1 from supply, place on field with bonus
  this.removeResource(cropType, 1)

  let totalCrops = cropType === 'grain'
    ? res.constants.sowingGrain
    : res.constants.sowingVegetables

  // Apply card modifications to sow amount
  for (const card of this.getActiveCards()) {
    if (card.hasHook('modifySowAmount')) {
      totalCrops = card.callHook('modifySowAmount', this.game, this, totalCrops, { row, col, cropType })
    }
  }

  space.crop = cropType
  space.cropCount = totalCrops
  return true
}

AgricolaPlayer.prototype.harvestFields = function() {
  const harvested = { grain: 0, vegetables: 0, wood: 0, stone: 0 }
  const virtualFieldHarvests = []  // Track virtual field harvests for callbacks
  const lastCropHarvests = []  // Track fields that became empty (for onHarvestLastCrop)
  this._lastHarvestedFields = []

  // Harvest regular fields
  for (const field of this.getFieldSpaces().filter(f => f.crop && f.cropCount > 0)) {
    if (field.cropCount > 0) {
      const cropType = field.crop
      harvested[cropType] += 1
      this._lastHarvestedFields.push({ row: field.row, col: field.col })
      const space = this.getSpace(field.row, field.col)
      space.cropCount -= 1
      if (space.cropCount === 0) {
        // If there's an underCrop, promote it to the primary crop
        if (space.underCrop) {
          space.crop = space.underCrop
          space.cropCount = space.underCropCount
          delete space.underCrop
          delete space.underCropCount
        }
        else {
          // Field became empty - track for onHarvestLastCrop hook
          lastCropHarvests.push(cropType)
          space.crop = null
        }
      }
    }
  }

  // Harvest virtual fields
  for (const vf of this.getSownVirtualFields()) {
    const crop = vf.crop
    harvested[crop] += 1
    vf.cropCount -= 1

    const isLast = vf.cropCount === 0
    if (isLast) {
      vf.crop = null
    }

    // Track for callbacks
    virtualFieldHarvests.push({
      fieldId: vf.id,
      cardId: vf.cardId,
      crop,
      amount: 1,
      isLast,
      onHarvest: vf.onHarvest,
      onHarvestLast: vf.onHarvestLast,
    })
  }

  this.addResource('grain', harvested.grain)
  this.addResource('vegetables', harvested.vegetables)
  this.addResource('wood', harvested.wood)
  this.addResource('stone', harvested.stone)

  return { harvested, virtualFieldHarvests, lastCropHarvests }
}

AgricolaPlayer.prototype.getHarvestedFieldsAdjacentToHouse = function() {
  if (!this._lastHarvestedFields || this._lastHarvestedFields.length === 0) {
    return 0
  }

  let count = 0
  for (const field of this._lastHarvestedFields) {
    const neighbors = this.getOrthogonalNeighbors(field.row, field.col)
    if (neighbors.some(n => this.getSpace(n.row, n.col).type === 'room')) {
      count++
    }
  }
  return count
}

AgricolaPlayer.prototype.getTotalGoodsInFields = function() {
  let total = 0
  for (const field of this.getFieldSpaces()) {
    if (field.crop && field.cropCount > 0) {
      total += field.cropCount
    }
  }
  return total
}

AgricolaPlayer.prototype.hasAdjacentUnusedSpaces = function(count) {
  if (count <= 0) {
    return true
  }
  const unused = []
  for (let row = 0; row < res.constants.farmyardRows; row++) {
    for (let col = 0; col < res.constants.farmyardCols; col++) {
      const space = this.getSpace(row, col)
      // Unused = empty, no stable, not in a pasture (same as scoring)
      if (space.type === 'empty' && !space.hasStable && !this.getPastureAtSpace(row, col)) {
        unused.push({ row, col })
      }
    }
  }
  if (count === 1) {
    return unused.length >= 1
  }
  // Check for pairs of adjacent unused spaces
  for (const space of unused) {
    const neighbors = this.getOrthogonalNeighbors(space.row, space.col)
    if (neighbors.some(n => {
      const ns = this.getSpace(n.row, n.col)
      return ns.type === 'empty' && !ns.hasStable && !this.getPastureAtSpace(n.row, n.col)
    })) {
      return true
    }
  }
  return false
}

