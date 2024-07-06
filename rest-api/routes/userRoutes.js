const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');

// Öffentliche Route für das Erstellen eines neuen Benutzers
router.route('/')
  .post(usersController.createNewUser);

// Geschützte Routen für die anderen Operationen
router.use(verifyJWT);

router.route('/')
  .get(usersController.getAllUsers)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
