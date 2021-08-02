const Time = require("../time.model");

async function getTime(req, res) {
  try {
    let dateFounded = await Time.findOne({});
    let challengeTime = new Date(dateFounded.date).toLocaleString();

    // let dateNow =  new Date(newDate.setTime(newDate.getTime() + (2 * 60 * 60 *1000))).toLocaleString();
    let currentTime = new Date().toLocaleString();

    return res.status(200).send({ challengeTime, currentTime });
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
}

module.exports = getTime;
