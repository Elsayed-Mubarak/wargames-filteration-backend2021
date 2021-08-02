const mongoose = require('mongoose');

const Challenge = require('../challenge.model');
const Solution = require('../../team/solution.model');
const Time = require('../../time/time.model');

async function getChallenge(req, res) {
	try {
		let challengeID = req.params.challengeId;
		if (!mongoose.Types.ObjectId.isValid(challengeID))
			return res.status(400).json({ message: 'Invalid Challenge' });

		let currentTime = new Date();
		let wargamesStartTime = await Time.findOne({});
		wargamesStartTime = new Date(wargamesStartTime.date);
		let wargamesEndTime = ((wargamesStartTime.getTime() / 1000) + 24 * 60 * 60) - (currentTime.getTime() / 1000);

		let startGame = (wargamesStartTime.getTime() / 1000) - (currentTime.getTime() / 1000);

		if (wargamesEndTime <= 0)
			return res.status(400).json({ message: "The filtration phase has ended" });

		if (startGame > 0)
			return res.status(409).json({ message: "The filtration phase not started yet" });

		let solutions = await Solution.findOne({
			challenge: mongoose.Types.ObjectId(challengeID),
			team: mongoose.Types.ObjectId(req.userData._id),
		}).select('_id');

		let challenge = await Challenge.findById(challengeID, `title category points level description externalLink`);
		if (!challenge) return res.status(404).send({ message: 'challenge not exists' });

		challenge = JSON.parse(JSON.stringify(challenge));
		challenge['solved'] = false;

		if (solutions) challenge['solved'] = true;

		return res.status(200).send(challenge);
	} catch (e) {
		return res.status(500).json({ message: 'Internal server error' });
	}
}

module.exports = getChallenge;
