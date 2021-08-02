const Time = require("../time.model");

const { timeValidation } = require("./../time.validation");
async function setTime(req, res) {
  try {
    const { error, value } = timeValidation.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.message.replace(/"/g, "") });

    await Time.deleteMany().exec();
    let newDate = new Date(value.date);
    newDate.setHours(value.hours, 0, 0);
    await Time.create({ date: newDate.toUTCString() });

    return res
      .status(200)
      .send({ hours: newDate.getHours(), date: newDate.getDate() });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
}

module.exports = setTime;
