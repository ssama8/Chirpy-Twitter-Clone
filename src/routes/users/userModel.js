const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Relationship = require('../relationships/relationshipModel')
const Chirp = require('../chirps/chirpModel')

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(val) {
            if (val.length < 7) throw new Error("Passsword needs to be at least 7 characters")
            if (val.toLowerCase().includes("password")) throw new Error("Password cannot contain 'password'")
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    likedChirps: [{
        type: Schema.ObjectId
    }],
    retweetedChirps: [{
        type: Schema.ObjectId
    }]
}, {
    timestamps: true
})

UserSchema.virtual('relationships', {
    ref: 'Relationship',
    localField: '_id',
    foreignField: 'user_id'
})

UserSchema.virtual('chirps', {
    ref: 'Chirp',
    localField: 'username',
    foreignField: 'ownerUsername'
})

//Checks for login using email and password
UserSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ "username": { $regex : new RegExp(username, "i") } })
    if (!user) throw new Error('Unable to login')
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Unable to login')
    return user
}

//Generates login JWT token
UserSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)
    this.tokens = this.tokens.concat({ token })
    return token
}

//Deletes sensitive information before being sent back as response
UserSchema.methods.toJSON = function () {
    const userObj = this.toObject()
    delete userObj.password
    delete userObj.tokens
    delete userObj.createdAt
    delete userObj.updatedAt
    delete userObj.email
    delete userObj.__v
    return userObj
}


//Hashes password before being saved to DB
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

//Deletes all Relationships and Chirps if User is removed
UserSchema.pre('deleteOne', { document: true } , async function (next) {
    await Relationship.deleteMany({ user_id: this._id })
    await Chirp.deleteMany({owner_id: this._id})
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User