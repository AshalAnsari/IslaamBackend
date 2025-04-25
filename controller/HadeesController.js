const sql = require("../utils/sqlDB")

const getHadees = async(req, res) => {
    try{

        const query = "select * from Hadees"

        sql.query(
            query,
            [],
            (err, result) => {
                if(err){
                    return res.status(400).json({success:false, Message: `Error while fetching data ${err}`})
                }

                if(result.length === 0){
                    return res.status(400).json({success:false, Message:"No Hadees found for the given category!"})
                }

                return res.status(200).json({success:true, Message: "Data Found Successfully!", Data: result})
            }
        )

    }catch(err){
        console.error("Caught Error While Getting Data:", err); // For your debug log
        return res.status(500).json({ 
            success: false, 
            message: err.message || "Unknown Error", 
            errorStack: err.stack 
        });
    }
}

const postHadees = async(req, res) => {
    try{
        const {
            hadeesNo,
            arabic,
            fiqh, 
            seerat, 
            akhlaq,
            fiqhText, 
            seeratText,
            akhlaqText,
            tashreeh,
            audioURL, 
            learningURL
        } = req.body;

        const categoryFlag = [fiqh, seerat, akhlaq].map(Number);
        const activeCategoryFlag = categoryFlag.filter(val => val === 1).length;
        console.log("Active flag: ",activeCategoryFlag)

        const categoryText = [fiqhText, seeratText, akhlaqText];
        const filteredCategoryText = categoryText.filter(item => item !=  '[]')
        const activeCategoryText = filteredCategoryText.filter(val => val && Object.keys(val).length > 0).length
        console.log("Active catergory text flag: ",activeCategoryText)

        if(hadeesNo ===0 || !hadeesNo){
            return res.status(400).json({success:false, Message:"Hadees No is missing"})
        }

        if (activeCategoryFlag !== 1 || activeCategoryText !== 1) {
            console.log("start 3:")
            return res.status(400).json({
                success: false,
                message: "Exactly one category (Fiqh, Seerat, Akhlaq) and its corresponding text must be provided."
            });
        }

        const isFiqhActive = fiqh === 1 && Object.keys(fiqhText).length > 0;
        const isSeeratActive = seerat === 1 && Object.keys(seeratText).length > 0;
        const isAkhlaqActive = akhlaq === 1 && Object.keys(akhlaqText).length > 0;

        if(!isFiqhActive && !isSeeratActive && !isAkhlaqActive){
            return res.status(400).json({success: false, Message:"You are entering fields incorrectly"})
        }

        if(Object.keys(arabic).length === 0){
            return res.status(400).json({success: false, Message: "Hadees is missing"})
        }

        const query = "insert into Hadees ( HadeesNo, Arabic, Fiqh, Seerat, Akhlaq, FiqhText, SeeratText, AkhlaqText, Tashreeh, AudioURL, LearningURL) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

        const values = [
                hadeesNo, 
                JSON.stringify(arabic), 
                fiqh, 
                seerat, 
                akhlaq, 
                JSON.stringify(fiqhText), 
                JSON.stringify(seeratText), 
                JSON.stringify(akhlaqText), 
                JSON.stringify(tashreeh),
                JSON.stringify(audioURL),
                JSON.stringify(learningURL)
            ];

        sql.query(
            query,
            values, 
            (err, result) => {
                if(err){
                    return res.status(400).json({success:false, Message: `An Error occured while processing i.e. ${err}` })
                }
                return res.status(201).json({success: true, Message:"Data Created Successfully!", Data:result})
            }
        )
        
    }catch(err){
        console.error("Caught Error:", err); // For your debug log
        return res.status(500).json({ 
            success: false, 
            message: err.message || "Unknown Error", 
            errorStack: err.stack 
        });
    }
}

const editHadees = async(req, res) => {
    try{
        const {
            hadeesNo,
            arabic,
            fiqh, 
            seerat, 
            akhlaq,
            fiqhText, 
            seeratText,
            akhlaqText,
            tashreeh,
            audioURL,
            learningURL
        } = req.body;
        
        const categoryFlag = [fiqh, seerat, akhlaq].map(Number);
        const activeCategoryFlag = categoryFlag.filter(val => val === 1).length;

        const categoryText = [fiqhText, seeratText, akhlaqText];
        const filteredCategoryText = categoryText.filter(item => item !=  '[]')
        const activeCategoryText = filteredCategoryText.filter(val => val && Object.keys(val).length > 0).length

        if(hadeesNo ===0 || !hadeesNo){
            return res.status(400).json({success:false, Message:"Hadees No is missing"})
        }

        if (activeCategoryFlag !== 1 || activeCategoryText !== 1) {
            return res.status(400).json({
                success: false,
                message: "Exactly one category (Fiqh, Seerat, Akhlaq) and its corresponding text must be provided."
            });
        }

        const isFiqhActive = fiqh === 1 && Object.keys(fiqhText).length > 0;
        const isSeeratActive = seerat === 1 && Object.keys(seeratText).length > 0;
        const isAkhlaqActive = akhlaq === 1 && Object.keys(akhlaqText).length > 0;

        if(!isFiqhActive && !isSeeratActive && !isAkhlaqActive){
            return res.status(400).json({success: false, Message:"You are entering fields incorrectly"})
        }

        if(Object.keys(arabic).length === 0){
            return res.status(400).json({success: false, Message: "Hadees is missing"})
        }

        const query = "update Hadees set Arabic = ?, Fiqh = ?, Seerat = ?, Akhlaq = ?, FiqhText = ?, SeeratText = ?, AkhlaqText = ?, Tashreeh = ? , AudioURL = ?, LearningURL = ? where HadeesNo = ?"

        const values = 
            [
                JSON.stringify(arabic), 
                fiqh, 
                seerat, 
                akhlaq, 
                JSON.stringify(fiqhText), 
                JSON.stringify(seeratText), 
                JSON.stringify(akhlaqText), 
                JSON.stringify(tashreeh), 
                JSON.stringify(audioURL),
                JSON.stringify(learningURL),
                hadeesNo
            ];

        sql.query(
            query,
            values,
            (err, result) => {
                if(err){
                    return res.status(400).json(
                        
                        {
                            success: false,
                            Message: "Error occured while updating", 
                            Error: err.message
                        })
                }

                return res.status(200).json(
                    {
                        success: true, 
                        Message:"Hadees updated successfully", 
                        Data: result
                    })
            }
        )
        
    }catch(err){
        console.error("Caught Error:", err); // For your debug log
        return res.status(500).json({ 
            success: false, 
            message: err.message || "Unknown Error", 
            errorStack: err.stack 
        });
    }
}

const deleteHadees = async(req, res) => {
    try{
        const { hadeesNo } = req.body;

        if(!hadeesNo){
            return res.status(400).json({success: false, Message:"No hadees No"})
        }

        const query = "delete from Hadees where HadeesNo = ?"

        sql.query(
            query,
            [hadeesNo],
            (err, result) => {
                if(err){
                    return res.status(400).json(
                        {
                            success: false,
                            Message: "Error occured while deleting", 
                            Error: err.message
                        })
                }

                if(result.affectedRows === 0){
                    return res.status(400).json({success: false, Message: "Either Hadees doesn't exist or it was already deleted"})
                }

                return res.status(200).json(
                    {
                        success: true, 
                        Message: "Hadees deleted successfully", 
                        Data: result
                    })
            }
        )
    }catch(err){
        console.error("Caught Error:", err); // For your debug log
        return res.status(500).json({ 
            success: false, 
            message: err.message || "Unknown Error", 
            errorStack: err.stack 
        });
    }
}

module.exports = {
    getHadees,
    postHadees,
    editHadees,
    deleteHadees,
}