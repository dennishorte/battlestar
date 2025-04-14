const { ObjectId } = require('mongodb')
const latestVersion = require('../version.js')
const { BadRequestError } = require('../utils/errors')

/*
   By coercing all ids into ObjectId, we make sure that they are all handled the same inside
   the app, regardless of whether or not they came from the database or the user.
 */
function coerceMongoIds(req, res, next) {
  function _coerceIdsRecurse(obj) {
    if (obj === undefined || obj === null) {
      return
    }

    for (const [key, value] of Object.entries(obj)) {
      const lowKey = key.toLowerCase()

      if (value === undefined || value === null) {
        continue
      }

      else if (typeof value === 'object' && !Array.isArray(value)) {
        _coerceIdsRecurse(value)
      }

      else if (lowKey.endsWith('id') || lowKey.endsWith('ids')) {
        if (Array.isArray(value)) {
          // Modify in place
          for (let i = 0; i < value.length; i++) {
            value[i] = _tryConvertToObjectId(key, value[i])
          }
        }
        else {
          obj[key] = _tryConvertToObjectId(key, value)
        }
      }

      else if (Array.isArray(value)) {
        for (const elem of value) {
          if (typeof elem === 'object') {
            _coerceIdsRecurse(elem)
          }
        }
      }
    }
  }

  function _tryConvertToObjectId(key, value) {
    if (
      typeof value === 'string'
      && value.length === 24
      && /^[0-9a-f]*$/.test(value)
    ) {
      return new ObjectId(value)
    }
    else {
      return value
    }
  }

  _coerceIdsRecurse(req.body)
  next()
}

function ensureVersion(req, res, next) {
  if (!req.body.appVersion || req.body.appVersion != latestVersion) {
    res.status(409).json({
      code: 'version_mismatch',
      currentVersion: req.body.appVersion,
      latestVersion,
    })
  }
  else {
    next()
  }
}

/**
 * Middleware generator for validating request data
 * @param {Object} schema - The Joi schema with body, params, and/or query validators
 * @returns {Function} Express middleware
 */
function validate(schema) {
  return (req, res, next) => {
    if (!schema) {
      return next()
    }

    const validationErrors = {}
    let errorMessage = 'Validation error'

    // Validate request body
    if (schema.body && req.body) {
      const { error } = schema.body.validate(req.body, { 
        abortEarly: false,
        allowUnknown: true // Allow properties not defined in the schema
      })
      if (error) {
        const details = error.details.map(detail => detail.message)
        validationErrors.body = details
        errorMessage = details.join(', ')
      }
    }

    // Validate request params
    if (schema.params && req.params) {
      const { error } = schema.params.validate(req.params, { 
        abortEarly: false,
        allowUnknown: true // Allow properties not defined in the schema
      })
      if (error) {
        const details = error.details.map(detail => detail.message)
        validationErrors.params = details
        errorMessage = details.join(', ')
      }
    }

    // Validate request query
    if (schema.query && req.query) {
      const { error } = schema.query.validate(req.query, { 
        abortEarly: false,
        allowUnknown: true // Allow properties not defined in the schema
      })
      if (error) {
        const details = error.details.map(detail => detail.message)
        validationErrors.query = details
        errorMessage = details.join(', ')
      }
    }

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length > 0) {
      return next(new BadRequestError(errorMessage, validationErrors))
    }

    return next()
  }
}

module.exports = {
  coerceMongoIds,
  ensureVersion,
  validate
} 
