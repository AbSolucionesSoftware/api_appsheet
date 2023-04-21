const { Router } = require("express");
const router = Router();
//const auth = require("../middleware/auth");
const { createProduct } = require("../controllers/Appsheet.controllers");

router.route("/create").post(createProduct);


module.exports = router;