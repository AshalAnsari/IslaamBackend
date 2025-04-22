const sql = require("../utils/sqlDB")

const getSurah = async (req, res) => {
    try{
        const {id} = req.params
        if(!id){
            return res.status(500).json({Success:false, Message: "id is missing"})
        }
        const query = "Select * from QURAN where SurahId = ? "

        // console.log("surahId: ", id)

        sql.query(query, [id], (err, data) => {
            if (err) {
                return res.status(500).json({Success:false, Error: err });  
            }
            return res.status(200).json({Success:true, Data: data });  
        })
    }catch(err){
        return res.status(500).json({Success:false, Error: err})
    }
}

const getJuz = async (req, res) => {
    try{
        const {id} = req.params
        if(!id){
            return res.status(500).json({Success:false, Message: "Juz No is missing"})
        }
        const query = "Select * from QURAN where JuzNo = ? "

        // console.log("surahId: ", id)

        sql.query(query, [id], (err, data) => {
            if (err) {
                return res.status(500).json({Success:false, Error: err });  
            }
            return res.status(200).json({Success:true, Data: data });  
        })
    }catch(err){
        return res.status(500).json({Success:false, Error: err})
    }
}


const editAyah = async (req, res) => {
    try{
        const {
            juzNo,
            surahId,
            ayatNo,
            audioURL,
            learningURL,
        } = req.body;

        // console.log("editing ", juzNo, surahId, ayatNo, audioURL, learningURL)

        if(!juzNo || !surahId){
            return res.status(400).json({Success:false, Message: "Missing juzNo, surahId, ayatNo"})
        }

        const query = "update QURAN set AudioURL = ?, LearningURL = ? where JuzNo = ? and SurahId = ? and AyatNo = ?"

        sql.query(
            query, 
            [JSON.stringify(audioURL), JSON.stringify(learningURL), juzNo, surahId, ayatNo], 
            (err, data) => {
            if(err){
                return res.status(500).json({Success:false, Error: "Error occured while editing data i.e. " + err})
            }
            return res.status(200).json({Success:true, Message:"Successfully edited the ayat", Data: data})
        })
        
    }catch(err){
        return res.status(500).json({Success:false, Message:"Error occured while editing i.e " + err})
    }
}

const getABookBySurahId = async (req, res) => {
    try{
        const { id } = req.params;
        console.log(id)

        if(!id){
            return res.statur(404).json({Success: false, Error: "Surah No is Missing"})
        }

        const query = "Select * from Book where SurahId = ?";

        sql.query(
            query,
            [id],
            (err, data) => {
                if(err){
                    return res.status(404).json({Success:false, Error: err})
                }
                return res.status(200).json({Success:true, Data: data})
            }
        )
    }catch(err){
        return res.status(500).json({Success: false, Error: err})
    }
}

const getABookByJuzNo = async (req, res) => {
    try{
        const { id } = req.params;
        console.log(id)

        if(!id){
            return res.statur(404).json({Success: false, Error: "Juz No is Missing"})
        }

        const query = "Select * from Book where JuzNo = ?";

        sql.query(
            query,
            [id],
            (err, data) => {
                if(err){
                    return res.status(404).json({Success:false, Error: err})
                }
                return res.status(200).json({Success:true, Data: data})
            }
        )
    }catch(err){
        return res.status(500).json({Success: false, Error: err})
    }
}


const getBookData = async (req, res) => {
    try{
        const {
            juzNo,
            surahId,
            ayatNo,
        } = req.query

        if(!juzNo || !surahId){
            return res.status(400).json({Success:false, Message: "Missing juzNo, surahId, ayatNo"})
        }

        const query = "Select * from Book where JuzNo = ? and SurahId = ? and AyatNo = ?"

        sql.query(
            query,
            [juzNo, surahId, ayatNo],
            (err, data) => {

                if(err){
                    return res.status(500).json({Success:false, Error: "Error occured while getting ayat data i.e. " + err})
                }
                return res.status(200).json({Success:true, Message:"Successfully got the ayat", Data: data})
            }  
            )

    }catch(err){
        return res.status(500).json({Success: false, Error: err})
    }
}

const addBookData = async (req, res) => {
    try {
        const {
            juzNo,
            surahId,
            ayatNo,
            languages,
            mafaheem,
            tafseer,
            stories
        } = req.body;

        // Validation checks
        if (!juzNo || !surahId || !ayatNo) {
            return res.status(400).json({ Success: false, Message: "Missing juzNo, surahId, or ayatNo" });
        }

        if (
            !languages ||
            !mafaheem ||
            !tafseer ||
            !stories ||
            (Array.isArray(languages) && languages.length === 0) ||
            (Array.isArray(mafaheem) && mafaheem.length === 0) ||
            (Array.isArray(tafseer) && tafseer.length === 0) ||
            (Array.isArray(stories) && stories.length === 0)
        ) {
            return res.status(400).json({ Success: false, Message: "You haven't entered all required fields" });
        }

        // Check if data already exists
        const checkQuery = "SELECT * FROM Book WHERE JuzNo = ? AND SurahId = ? AND AyatNo = ?";

        sql.query(checkQuery, [juzNo, surahId, ayatNo], (err, result) => {
            if (err) {
                return res.status(500).json({ Success: false, Error: "Error checking existing data: " + err });
            }

            const values = [
                JSON.stringify(languages),
                JSON.stringify(mafaheem),
                JSON.stringify(tafseer),
                JSON.stringify(stories),
                juzNo,
                surahId,
                ayatNo
            ];

            if (result.length > 0) {
                // Update existing
                const updateQuery = `
                    UPDATE Book 
                    SET Languages = ?, Mafaheem = ?, Tafaseer = ?, Stories = ? 
                    WHERE JuzNo = ? AND SurahId = ? AND AyatNo = ?
                `;

                sql.query(updateQuery, values, (err, updateResult) => {
                    if (err) {
                        return res.status(500).json({ Success: false, Error: "Error updating data: " + err });
                    }

                    return res.status(200).json({ Success: true, Message: "Data updated successfully", Data: updateResult });
                });

            } else {
                // Insert new
                const insertQuery = `
                    INSERT INTO Book (JuzNo, SurahId, AyatNo, Languages, Mafaheem, Tafaseer, Stories)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                const insertValues = [
                    juzNo,
                    surahId,
                    ayatNo,
                    JSON.stringify(languages),
                    JSON.stringify(mafaheem),
                    JSON.stringify(tafseer),
                    JSON.stringify(stories)
                ];

                sql.query(insertQuery, insertValues, (err, insertResult) => {
                    if (err) {
                        return res.status(500).json({ Success: false, Error: "Error inserting data: " + err });
                    }

                    return res.status(201).json({ Success: true, Message: "Data inserted successfully", Data: insertResult });
                });
            }
        });

    } catch (err) {
        return res.status(500).json({ Success: false, Error: err.message });
    }
};

module.exports = {
    getSurah,
    getJuz,
    editAyah,
    getBookData,
    addBookData,
    getABookBySurahId,
    getABookByJuzNo
}

