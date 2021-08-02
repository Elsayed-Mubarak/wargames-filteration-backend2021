const Team = require('../team.model')
const catchAsync = require('../../../utils/catchAsync')
const { signup: signupSchema } = require('../team.validation')

signup = catchAsync(async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body)
    if (error)
      return res.status(400).json({ message: error.message.replace(/"/g, '') })

    let team = await Team.findOne().or([
      { email: value.email },
      { name: value.name }
    ])

    if (team && team.email === value.email)
      return res
        .status(409)
        .json({ message: 'Email already registered before', status: 409 })

    if (team && team.name === value.name)
      return res.status(409).json({ message: 'Team name is used', status: 409 })

    team = await Team.create(value)
    const token = team.signTempJWT()
    return res.status(200).send({ temp: token })
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' })
  }
})

module.exports = signup
