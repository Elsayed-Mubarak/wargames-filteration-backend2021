let path = require('path');
const fs = require('fs');
const Time = require('../../time/time.model');

const { fileName: fileNameValidation } = require('../challenge.validate');

async function downloadFile(req, res) {
    try {
        req.body.fileName = req.params.name;
        const { error, value } = fileNameValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });
        
        let currentTime = new Date();
        let wargamesStartTime = await Time.findOne({});
        wargamesStartTime = new Date(wargamesStartTime.date);
        let wargamesEndTime = ((wargamesStartTime.getTime() / 1000) + 24 * 60 * 60) - (currentTime.getTime() / 1000);
    
        let startGame = (wargamesStartTime.getTime() / 1000) - (currentTime.getTime() / 1000);
    
        if (wargamesEndTime <= 0)
          return res.status(400).json({ message: "The filtration phase has ended" });
    
        if (startGame > 0)
          return res.status(409).json({ message: "The filtration phase not started yet" });

        const fileName = value.fileName;
        const file = path.join(__dirname, '../../../', 'downloads/' + fileName);

        fs.access(file, fs.F_OK, (err) => {
            if (err) return res.status(404).json({ error: 'file not here' });
            // file exists
            res.download(file); // Set disposition and send it.
        });
    } catch (err) {
        return res.status(500).send({ message: "Internal server error" });
    }
};

module.exports = downloadFile;