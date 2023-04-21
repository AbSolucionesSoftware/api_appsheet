const { Router } = require("express");
const router = Router();
//const auth = require("../middleware/auth");
const { postTest } = require("../controllers/Test.controllers");

router.route("/:id_table").post(postTest);


module.exports = router;