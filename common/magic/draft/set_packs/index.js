/**
 * Set-specific pack generators, keyed by Scryfall set code.
 *
 * Each factory takes (cards, options) and returns an openPack() function
 * that produces one pack as an array of MagicCard objects. Sets without an
 * entry here fall back to the default rarity-based generator in pack.js.
 */
module.exports = {
  fra: require('./reality_fracture.js').createPackGenerator,
}
