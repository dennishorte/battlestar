const db = require('../../models/db.js')

const File = {}


File.update = async function(req, res) {
  console.log(0)
  const file = req.body.file

  if (!file._id) {
    throw new Error('Cannot update file with no _id field: ' + JSON.stringify(file, null, 2))
  }

  if (!['card', 'cube', 'deck'].includes(file.kind)) {
    throw new Error('Cannot update unknown file kind: ' + JSON.stringify(file, null, 2))
  }

  await db.magic[file.kind].save(file)
  res.json({
    status: 'success',
  })
}


module.exports = File
