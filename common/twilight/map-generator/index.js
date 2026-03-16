'use strict'

const MapGenerator = require('./MapGenerator')
const tileData = require('./data/tileData')
const boardData = require('./data/boardData')
const raceData = require('./data/raceData')
const adjacencyData = require('./data/adjacencyData')

module.exports = {
  MapGenerator,
  generateMap: MapGenerator.generate,
  tileData,
  boardData,
  raceData,
  adjacencyData,
}
