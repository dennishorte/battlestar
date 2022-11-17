const CubeUtil = {}

function Cube(data) {
  this.data = data
}




CubeUtil.Cube = Cube

CubeUtil.deserialize = function(data, cardLookup) {
  const cube = new Cube()

  cube._id = data._id
  cube.userId = data.userId
  cube.name = data.name
  cube.path = data.path
  cube.cardlist = data.cardlist
  cube.createdTimestamp = data.createdTimestamp
  cube.updatedTimestamp = data.updatedTimestamp


}

CubeUtil.generateCubeBreakdown = function(cube) {
  const cards = parseCardList(cube.cardlist)

  console.log(cards)
}

CubeUtil.parseCardlist = function(cardlist) {
  const cards = []

  for (let line of cardlist.toLowerCase().split('\n')) {
    line = line.trim()

    if (line.length > 1) {
      zone.push(parseCardlistLine(line))
    }
  }

  return cards
}

function parseCardlistLine(line) {
  const tokens = line.split(' ')
  const output = {
    name: line,
    setCode: null,
    collectorNumber: null,
  }

  if (tokens.length < 3) {
    return output
  }

  const lastToken = tokens[tokens.length - 1]
  if (!util.isDigit(lastToken.charAt(0))) {
    return output
  }

  const penultimateToken = tokens[tokens.length - 2]
  if (penultimateToken.slice(0, 1) === '(' && penultimateToken.slice(-1) === ')') {
    output.name = tokens.slice(0, -2).join(' ')
    output.setCode = penultimateToken.slice(1, -1)
    output.collectorNumber = lastToken
  }

  return output
}

export default CubeUtil
