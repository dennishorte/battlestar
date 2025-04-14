const express = require('express')
const router = express.Router()
const achievementController = require('../../../controllers/magic/achievement.controller')

/**
 * @route POST /api/magic/achievement/fetch_all
 * @desc Fetch all achievements for a cube
 * @access Private
 */
router.post('/fetch_all', achievementController.fetchAll)

/**
 * @route POST /api/magic/achievement/claim
 * @desc Claim an achievement for a user
 * @access Private
 */
router.post('/claim', achievementController.claim)

/**
 * @route POST /api/magic/achievement/delete
 * @desc Delete an achievement
 * @access Private
 */
router.post('/delete', achievementController.delete)

/**
 * @route POST /api/magic/achievement/link_filters
 * @desc Link filters to an achievement
 * @access Private
 */
router.post('/link_filters', achievementController.linkFilters)

/**
 * @route POST /api/magic/achievement/save
 * @desc Save an achievement
 * @access Private
 */
router.post('/save', achievementController.save)

module.exports = router 