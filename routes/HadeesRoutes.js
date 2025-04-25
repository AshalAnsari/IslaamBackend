const express = require("express")
const { postHadees, getHadees, editHadees, deleteHadees } = require("../controller/HadeesController")


const router = express.Router()

router.get("/get_hadees", getHadees)
router.post("/add_hadees", postHadees)
router.put("/edit_hadees", editHadees)
router.delete("/delete_hadees", deleteHadees)

module.exports = router