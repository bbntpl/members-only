const express = require('express');
const router = express.Router();

const {
	memberifyView,
	memberify,
	memberView,
	memberDeleteView,
	memberDelete,
	memberUpdateView,
	memberUpdate,
	matchUserHandler,
	isAdmin
} = require('../controllers/memberController');

router.get('/:id/memberify', isAdmin, memberifyView);

router.post('/:id/memberify', isAdmin, memberify);

router.get('/:id/delete', matchUserHandler, memberDeleteView);

router.post('/:id/delete', matchUserHandler, memberDelete);

router.get('/:id/update', matchUserHandler, memberUpdateView);

router.post('/:id/update', matchUserHandler, memberUpdate);

router.get('/:id', memberView);

module.exports = router;