const Chirp = require('./chirpModel')
const User = require('../users/userModel')

class ChirpController {
    createChirp = async (req, res) => {
        try {
            const chirp = new Chirp({
                ...req.body,
                owner_id: req.user._id,
                ownerUsername: req.user.username,
                commentsCount: 0,
                retweetsCount: 0,
                likesCount: 0,
            })
            await chirp.save()
            res.send(chirp)
        } catch (e) {
            console.log(e)
            res.status(400).send()
        }
    }

    getCurrentUserChirpFeed = async (req, res) => {
        try {
            await req.user
                .populate({
                    path: 'relationships',
                    populate: [
                        {
                            path: 'chirps'
                        }, {
                            path: 'users',
                            justOne: true
                        }]
                },
                )
            const feed = []
            req.user.relationships.forEach(user => {
                const userChirps = [...user.chirps]
                feed.push(...userChirps)
            });
            feed.sort((a, b) => {
                return b.createdAt - a.createdAt
            })
            res.send({feed, likedChirps: req.user.likedChirps})
        } catch (e) {
            console.log(e)
            res.status(400).send()
        }
    }

    getUserChirps = async (req, res) => {
        try{
            const user = await User.findOne({username: req.params.username})
            await user.populate({
                path: 'chirps'
            })
            user.chirps.sort((a, b) => {
                return b.createdAt - a.createdAt
            })
            res.send({feed: user.chirps, likedChirps: req.user.likedChirps})
        } catch(e) {
            res.status(404).send()
        }
    }


}

module.exports = new ChirpController()