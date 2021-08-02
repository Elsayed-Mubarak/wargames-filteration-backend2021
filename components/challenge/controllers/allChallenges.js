const Challenge = require('../challenge.model');
const Time = require('../../time/time.model');
const Solution = require('./../../team/solution.model')

async function getAllChallenges(req, res) {
	try {
		let currentTime = new Date();
		let wargamesStartTime = await Time.findOne({});
		wargamesStartTime = new Date(wargamesStartTime.date);
		let wargamesEndTime = ((wargamesStartTime.getTime() / 1000) + 24 * 60 * 60) - (currentTime.getTime() / 1000);

		let startGame = (wargamesStartTime.getTime() / 1000) - (currentTime.getTime() / 1000);

		if (wargamesEndTime <= 0)
			return res.status(400).json({ message: "The filtration phase has ended" });

		if (startGame > 0)
			return res.status(409).json({ message: "The filtration phase not started yet" });

		let allChallenges = await Challenge.find({}, 'title points level description category externalLink').lean();
		allChallenges = JSON.parse(JSON.stringify(allChallenges));

		let challengesCount = await Challenge.find({}).countDocuments();

		let _challenges = [];
		for (let i in allChallenges) {
			
			solved = await Solution.findOne({ team: req.userData._id, challenge: allChallenges[i]._id });
			solved ? allChallenges[i]['solved'] = true : allChallenges[i]['solved'] = false
			// console.log(allChallenges[i]);
			_challenges.push(allChallenges[i])
		}

		// let web = [];
		// let crypto = [];
		// let forensic = [];
		// let reverse = [];
		// let machines = [];
		// for (let challenge in _challenges) {
		// 	switch (_challenges[challenge]['category']) {
		// 		case 'web':
		// 			web.push(_challenges[challenge]);
		// 			break;
		// 		case 'crypto':
		// 			crypto.push(_challenges[challenge]);
		// 			break;
		// 		case 'forensic':
		// 			forensic.push(_challenges[challenge]);
		// 			break;
		// 		case 'reverse':
		// 			reverse.push(_challenges[challenge]);
		// 			break;
		// 		case 'machines':
		// 			machines.push(_challenges[challenge]);
		// 			break;
		// 	}
		// }

		// let challenges = {
		// 	web: web,
		// 	crypto: crypto,
		// 	forensic: forensic,
		// 	reverse: reverse,
		// 	machines: machines,
		// };

		return res.status(200).json({ count: challengesCount, challenges: _challenges});
	} catch (e) {
		console.log(e.message);
		return res.status(500).json({ message: 'Internal server error' });
	}
}

module.exports = getAllChallenges;
