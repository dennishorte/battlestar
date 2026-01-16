/**
 * Card Change Calculator
 *
 * Calculates the specific changes between two card versions and returns
 * a structured change object that can be stored in the database.
 */

interface CardFace {
  name?: string
  [key: string]: unknown
}

interface CardData {
  card_faces?: CardFace[]
  [key: string]: unknown
}

interface Change {
  type: string
  faceIndex: number | null
  field: string | null
  oldValue: unknown
  newValue: unknown
  summary: string
}

interface ChangeResult {
  type: string
  summary: string
  changes: Change[]
  facesAdded: number
  facesRemoved: number
  fieldsChanged: number
}

interface Edit {
  action: string
  oldData?: CardData
  date?: string | Date
}

/**
 * Calculates the changes between the current card data and the previous version
 */
function calculateCardChanges(currentData: CardData, previousData: CardData | null): ChangeResult {
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

  const changes: Change[] = []
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
 */
function compareField(field: string, currentValue: unknown, previousValue: unknown, faceIndex: number | null): Change | null {
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
 * Normalizes values for comparison
 */
function normalizeValue(value: unknown): unknown {
  if (value === undefined || value === null) {
    return null
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') {
      return null
    }
    return trimmed.toLowerCase()
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null
    }
    return value.map(item => normalizeValue(item))
  }

  if (typeof value === 'object' && value !== null) {
    const normalized: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      normalized[key] = normalizeValue(val)
    }
    return normalized
  }

  return value
}

/**
 * Deep equality check for values
 */
function isEqual(a: unknown, b: unknown): boolean {
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
    const keysA = Object.keys(a as Record<string, unknown>)
    const keysB = Object.keys(b as Record<string, unknown>)

    if (keysA.length !== keysB.length) {
      return false
    }

    return keysA.every(key => isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]))
  }

  return false
}

/**
 * Generates a human-readable summary for a field change
 */
function generateFieldChangeSummary(field: string, oldValue: unknown, newValue: unknown, faceIndex: number | null): string {
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
 */
function formatFieldName(field: string): string {
  const fieldNames: Record<string, string> = {
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
 */
function truncateValue(value: unknown): string {
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
 */
function generateChangeSummary(changes: Change[], facesAdded: number, facesRemoved: number, fieldsChanged: number): string {
  if (fieldsChanged === 0) {
    return 'No changes detected'
  }

  const parts: string[] = []

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
 */
function calculateChangesFromOriginal(currentData: CardData, originalData: CardData | null): ChangeResult {
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
 */
function extractOriginalData(edits: Edit[] | null | undefined): CardData | null {
  if (!edits || edits.length === 0) {
    return null
  }

  // Find the creation edit (should be first, but let's be safe)
  const creationEdit = edits.find(edit => edit.action === 'create')
  if (creationEdit) {
    // For creation, there's no oldData, so we need to reconstruct from the first update
    const firstUpdate = edits.find(edit => edit.action === 'update')
    return firstUpdate ? firstUpdate.oldData || null : null
  }

  // If no creation edit found, use the oldest update's oldData
  const oldestUpdate = edits
    .filter(edit => edit.action === 'update' && edit.oldData)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())[0]

  return oldestUpdate ? oldestUpdate.oldData || null : null
}

module.exports = {
  calculateCardChanges,
  calculateChangesFromOriginal,
  extractOriginalData,
}

export {
  calculateCardChanges,
  calculateChangesFromOriginal,
  extractOriginalData,
  CardData,
  Change,
  ChangeResult,
}
