import db from '../../models/db.js'

export const fetchAll = async (req, res) => {
  try {
    const sets = await db.magic.sets.fetchAll()
    res.json({ status: 'success', sets })
  }
  catch (error) {
    console.error('Error fetching magic sets:', error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}

export const update = async (req, res) => {
  try {
    const result = await db.magic.sets.update()
    res.json({ status: 'success', message: 'Magic sets updated', ...result })
  }
  catch (error) {
    console.error('Error updating magic sets:', error)
    res.status(500).json({ status: 'error', message: error.message })
  }
}
