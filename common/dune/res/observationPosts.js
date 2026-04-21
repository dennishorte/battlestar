// Observation post definitions for the spy system.
// Each post connects to 1-3 adjacent board spaces, identified by letter A-M.
// A spy on a post can infiltrate or gather intelligence at connected spaces.

const observationPosts = [
  { id: 'A', spaces: ['arrakeen', 'spice-refinery'] },
  { id: 'B', spaces: ['spice-refinery', 'research-station'] },
  { id: 'C', spaces: ['research-station', 'sietch-tabr'] },
  { id: 'D', spaces: ['imperial-basin'] },
  { id: 'E', spaces: ['hagga-basin'] },
  { id: 'F', spaces: ['deep-desert'] },
  { id: 'G', spaces: ['accept-contract', 'shipping'] },
  { id: 'H', spaces: ['high-council', 'imperial-privilege', 'sword-master'] },
  { id: 'I', spaces: ['assembly-hall', 'gather-support'] },
  { id: 'J', spaces: ['sardaukar', 'dutiful-service'] },
  { id: 'K', spaces: ['heighliner', 'deliver-supplies'] },
  { id: 'L', spaces: ['espionage', 'secrets'] },
  { id: 'M', spaces: ['desert-tactics', 'fremkit'] },
]

module.exports = observationPosts
