const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  user = req.user
  res.json({
    user
  });
});

module.exports = router;