/**
 * Card Change Calculator
 *
 * Calculates the specific changes between two card versions and returns
 * a structured change object that can be stored in the database.
 */

/**
 * Calculates the changes between the current card data and the previous version
 * @param {Object} currentData - The new card data
 * @param {Object} previousData - The previous card data (from oldData in edit)
 * @returns {Object} Structured change information
 */
function calculateCardChanges(currentData, previousData) {
  if (!previousData) {
    // This is a new card creation
    return {
      type: 'creation',
      summary: 'Card created',
      changes: [],
      facesAdded: currentData.card_faces?.length || 0,
      facesRemoved: 0,
      fieldsChanged: 0
    }
  }

  const changes = []
  let fieldsChanged = 0

  // Get all root-level fields from both current and previous data (excluding card_faces)
  const allRootFields = new Set([
    ...Object.keys(currentData || {}),
    ...Object.keys(previousData || {})
  ])
  allRootFields.delete('card_faces') // Handle faces separately

  // Compare root-level fields
  for (const field of allRootFields) {
    const change = compareField(field, currentData[field], previousData[field], null)
    if (change) {
      changes.push(change)
      fieldsChanged++
    }
  }

  // Handle face changes
  const currentFaces = currentData.card_faces || []
  const previousFaces = previousData.card_faces || []

  const maxFaces = Math.max(currentFaces.length, previousFaces.length)

  // Track face additions/removals
  const facesAdded = Math.max(0, currentFaces.length - previousFaces.length)
  const facesRemoved = Math.max(0, previousFaces.length - currentFaces.length)

  // Compare existing faces
  for (let faceIndex = 0; faceIndex < maxFaces; faceIndex++) {
    const currentFace = currentFaces[faceIndex]
    const previousFace = previousFaces[faceIndex]

    if (!currentFace && previousFace) {
      // Face was removed
      changes.push({
        type: 'face_removed',
        faceIndex,
        field: null,
        oldValue: previousFace.name || `Face ${faceIndex}`,
        newValue: null,
        summary: `Removed face: ${previousFace.name || `Face ${faceIndex}`}`
      })
      fieldsChanged++
    }
    else if (currentFace && !previousFace) {
      // Face was added
      changes.push({
        type: 'face_added',
        faceIndex,
        field: null,
        oldValue: null,
        newValue: currentFace.name || `Face ${faceIndex}`,
        summary: `Added face: ${currentFace.name || `Face ${faceIndex}`}`
      })
      fieldsChanged++
    }
    else if (currentFace && previousFace) {
      // Get all face fields from both current and previous face
      const allFaceFields = new Set([
        ...Object.keys(currentFace || {}),
        ...Object.keys(previousFace || {})
      ])

      // Compare face fields
      for (const field of allFaceFields) {
        const change = compareField(field, currentFace[field], previousFace[field], faceIndex)
        if (change) {
          changes.push(change)
          fieldsChanged++
        }
      }
    }
  }

  // Generate summary
  const summary = generateChangeSummary(changes, facesAdded, facesRemoved, fieldsChanged)

  return {
    type: 'update',
    summary,
    changes,
    facesAdded,
    facesRemoved,
    fieldsChanged
  }
}

/**
 * Compares a single field between two values
 * @param {string} field - The field name
 * @param {*} currentValue - The current value
 * @param {*} previousValue - The previous value
 * @param {number|null} faceIndex - The face index (null for root fields)
 * @returns {Object|null} Change object or null if no change
 */
function compareField(field, currentValue, previousValue, faceIndex) {
  // Normalize values for comparison (case-insensitive)
  const currentNormalized = normalizeValue(currentValue)
  const previousNormalized = normalizeValue(previousValue)

  if (isEqual(currentNormalized, previousNormalized)) {
    return null
  }

  const changeType = faceIndex !== null ? 'face_field' : 'root_field'

  // Store original values for display, but use null for truly empty values
  const displayOldValue = (previousValue === undefined || previousValue === null ||
                          (typeof previousValue === 'string' && previousValue.trim() === '') ||
                          (Array.isArray(previousValue) && previousValue.length === 0)) ? null : previousValue
  const displayNewValue = (currentValue === undefined || currentValue === null ||
                          (typeof currentValue === 'string' && currentValue.trim() === '') ||
                          (Array.isArray(currentValue) && currentValue.length === 0)) ? null : currentValue

  return {
    type: changeType,
    faceIndex,
    field,
    oldValue: displayOldValue,
    newValue: displayNewValue,
    summary: generateFieldChangeSummary(field, displayOldValue, displayNewValue, faceIndex)
  }
}

/**
 * Normalizes values for comparison (handles undefined, null, empty strings, empty arrays, and case-insensitive strings)
 * @param {*} value - The value to normalize
 * @returns {*} Normalized value
 */
function normalizeValue(value) {
  if (value === undefined || value === null) {
    return null
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') {
      return null
    }
    // Convert to lowercase for case-insensitive comparison
    return trimmed.toLowerCase()
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null
    }
    // Normalize array elements recursively
    return value.map(item => normalizeValue(item))
  }

  if (typeof value === 'object' && value !== null) {
    // Normalize object values recursively
    const normalized = {}
    for (const [key, val] of Object.entries(value)) {
      normalized[key] = normalizeValue(val)
    }
    return normalized
  }

  return value
}

/**
 * Deep equality check for values
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean} True if values are equal
 */
function isEqual(a, b) {
  if (a === b) {
    return true
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false
    }
    return a.every((val, index) => isEqual(val, b[index]))
  }

  if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) {
      return false
    }

    return keysA.every(key => isEqual(a[key], b[key]))
  }

  return false
}

/**
 * Generates a human-readable summary for a field change
 * @param {string} field - The field name
 * @param {*} oldValue - The old value
 * @param {*} newValue - The new value
 * @param {number|null} faceIndex - The face index
 * @returns {string} Human-readable summary
 */
function generateFieldChangeSummary(field, oldValue, newValue, faceIndex) {
  const facePrefix = faceIndex !== null ? `Face ${faceIndex}: ` : ''
  const fieldName = formatFieldName(field)

  if (oldValue === null && newValue !== null) {
    return `${facePrefix}Added ${fieldName}: "${truncateValue(newValue)}"`
  }

  if (oldValue !== null && newValue === null) {
    return `${facePrefix}Removed ${fieldName}: "${truncateValue(oldValue)}"`
  }

  return `${facePrefix}Changed ${fieldName}: "${truncateValue(oldValue)}" → "${truncateValue(newValue)}"`
}

/**
 * Formats field names for display
 * @param {string} field - The field name
 * @returns {string} Formatted field name
 */
function formatFieldName(field) {
  const fieldNames = {
    'oracle_text': 'rules text',
    'type_line': 'type line',
    'mana_cost': 'mana cost',
    'flavor_text': 'flavor text',
    'image_uri': 'artwork',
    'color_indicator': 'color indicator',
    'produced_mana': 'mana production',
    'collector_number': 'collector number'
  }

  return fieldNames[field] || field.replace(/_/g, ' ')
}

/**
 * Truncates long values for display in summaries
 * @param {*} value - The value to truncate
 * @returns {string} Truncated string representation
 */
function truncateValue(value) {
  if (value === null || value === undefined) {
    return 'empty'
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  const str = String(value)
  return str.length > 50 ? str.substring(0, 47) + '...' : str
}

/**
 * Generates an overall summary of all changes
 * @param {Array} changes - Array of individual changes
 * @param {number} facesAdded - Number of faces added
 * @param {number} facesRemoved - Number of faces removed
 * @param {number} fieldsChanged - Total number of fields changed
 * @returns {string} Overall summary
 */
function generateChangeSummary(changes, facesAdded, facesRemoved, fieldsChanged) {
  if (fieldsChanged === 0) {
    return 'No changes detected'
  }

  const parts = []

  if (facesAdded > 0) {
    parts.push(`${facesAdded} face${facesAdded > 1 ? 's' : ''} added`)
  }

  if (facesRemoved > 0) {
    parts.push(`${facesRemoved} face${facesRemoved > 1 ? 's' : ''} removed`)
  }

  const fieldChanges = fieldsChanged - facesAdded - facesRemoved
  if (fieldChanges > 0) {
    parts.push(`${fieldChanges} field${fieldChanges > 1 ? 's' : ''} modified`)
  }

  if (parts.length === 0) {
    return `${fieldsChanged} change${fieldsChanged > 1 ? 's' : ''}`
  }

  return parts.join(', ')
}

/**
 * Calculates changes from the original version (for legacy cube display)
 * @param {Object} currentData - The current card data
 * @param {Object} originalData - The original card data from creation
 * @returns {Object} Changes from original version
 */
function calculateChangesFromOriginal(currentData, originalData) {
  if (!originalData) {
    return {
      type: 'no_original',
      summary: 'No original version available',
      changes: [],
      facesAdded: 0,
      facesRemoved: 0,
      fieldsChanged: 0
    }
  }

  const changeData = calculateCardChanges(currentData, originalData)

  return {
    ...changeData,
    type: 'from_original',
    summary: changeData.fieldsChanged > 0
      ? `Modified from original: ${changeData.summary}`
      : 'Unchanged from original'
  }
}

/**
 * Extracts the original card data from the edits array
 * @param {Array} edits - The edits array from the card document
 * @returns {Object|null} The original card data or null if not found
 */
function extractOriginalData(edits) {
  if (!edits || edits.length === 0) {
    return null
  }

  // Find the creation edit (should be first, but let's be safe)
  const creationEdit = edits.find(edit => edit.action === 'create')
  if (creationEdit) {
    // For creation, there's no oldData, so we need to reconstruct from the first update
    const firstUpdate = edits.find(edit => edit.action === 'update')
    return firstUpdate ? firstUpdate.oldData : null
  }

  // If no creation edit found, use the oldest update's oldData
  const oldestUpdate = edits
    .filter(edit => edit.action === 'update' && edit.oldData)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0]

  return oldestUpdate ? oldestUpdate.oldData : null
}

module.exports = {
  calculateCardChanges,
  calculateChangesFromOriginal,
  extractOriginalData,
}
