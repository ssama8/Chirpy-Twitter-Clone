const User = require('./userModel')
const Relationship = require('../relationships/relationshipModel')
const Chirp = require('../chirps/chirpModel')

class UserController {
    createNewUser = async (req, res) => {
        try {
            const user = new User(req.body)
            const relationship = new Relationship({
                following_id: user._id,
                user_id: user._id
            })
            const token = await user.generateAuthToken()
            await relationship.save()
            await user.save()
            res.status(201).send({ user, token })
        } catch (e) {
            res.status(400).send(e)
        }
    }

    login = async (req, res) => {
        try {
            const user = await User.findByCredentials(req.body.username, req.body.password)
            const token = await user.generateAuthToken()
            await user.save()
            res.status(201).send({ user, token })
        } catch (e) {
            res.status(400).send()
        }
    }

    authenticatePersistentLogin = async (req, res) => {
        try {
            res.status(200).send({ username: req.user.username })
        } catch (e) {
            res.status(404).send()
        }
    }

    logout = async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((token) => req.token !== token.token)
            await req.user.save()
            res.send()
        } catch (e) {
            res.status(500).send()
        }
    }

    logoutAll = async (req, res) => {
        try {
            req.user.tokens = []
            await req.user.save()
            res.send()
        } catch (e) {
            res.status(500).send()
        }
    }
    likeChirp = async (req, res) => {
        try {
            if (!req.body._id) throw new Error('Cannot provide null value')
            const startingLength = req.user.likedChirps.length
            req.user.likedChirps.addToSet(req.body._id)
            if (startingLength !== req.user.likedChirps.length) {
                await req.user.save()
                await Chirp.findOneAndUpdate({ _id: req.body._id }, { $inc: { likesCount: 1 } })
                await Chirp.updateMany({ 'rechirp.original_id': req.body._id }, { $inc: { likesCount: 1 } })
            }
            res.status(202).send({
                likedChirps: req.user.likedChirps,
                retweetedChirps: req.user.retweetedChirps
            })
        } catch (e) {
            console.log(e.message)
            res.status(400).send()
        }
    }

    unlikeChirp = async (req, res) => {
        try {
            if (!req.body._id) throw new Error('Cannot provide null value')
            const startingLength = req.user.likedChirps.length
            req.user.likedChirps.pull({ _id: req.body._id })
            // console.log(req.user.likedChirps)
            if (startingLength !== req.user.likedChirps.length) {
                await req.user.save()
                await Chirp.findOneAndUpdate({ _id: req.body._id }, { $inc: { likesCount: -1 } })
                await Chirp.updateMany({ 'rechirp.original_id': req.body._id }, { $inc: { likesCount: -1 } })
            }
            res.status(202).send({
                likedChirps: req.user.likedChirps,
                retweetedChirps: req.user.retweetedChirps
            })
        } catch (e) {
            console.log(e.message)
            res.status(400).send()
        }
    }

    deleteUser = async (req, res) => {
        try {
            await req.user.deleteOne()
            res.send(req.user)
        } catch (e) {
            res.status(500).send(e)
        }
    }
}

module.exports = new UserController()