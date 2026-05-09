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
