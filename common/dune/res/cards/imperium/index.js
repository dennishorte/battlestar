'use strict'

const bloodlines = require('./bloodlines')
const uprising = require('./uprising')
const base = require('./base')
const immortality = require('./immortality')
const promo = require('./promo')
const riseOfIx = require('./riseOfIx')

const imperiumCards = [...bloodlines, ...uprising, ...base, ...immortality, ...promo, ...riseOfIx]

module.exports = imperiumCards
