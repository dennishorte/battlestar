import cardUtil from './cardUtil.js'


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
  const cards = cardUtil.parseCardlist(cube.cardlist)

  console.log(cards)
}

export default CubeUtil
