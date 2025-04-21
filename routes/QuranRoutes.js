const express = require("express")
const { getSurah, editAyah, getBookData, addBookData, } = require("../controller/QuranControllers")

const router = express.Router()

router.get("/surah/:id", getSurah)
router.get("/get_book/", getBookData)
router.post("/add_book_data/", addBookData)
router.put("/edit_ayah", editAyah),

module.exports = router