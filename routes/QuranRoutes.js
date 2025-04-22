const express = require("express")
const { getSurah, editAyah, getBookData, addBookData, getABookByJuzNo, getABookBySurahId, getJuz, } = require("../controller/QuranControllers")

const router = express.Router()

router.get("/surah/:id", getSurah) // FOR MOBILE AND WEB PORTAL
router.get("/juz/:id", getJuz) // CURRENTLY FOR MOBILE
router.get("/get_a_book/:id", getABookBySurahId) // CURRENTLY FOR MOBILE
router.get("/get_a_bookByJuz/:id", getABookByJuzNo) // CURRENTLY FOR MOBILE
router.get("/get_book/", getBookData)
router.post("/add_book_data/", addBookData)
router.put("/edit_ayah", editAyah),

module.exports = router