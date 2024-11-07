const { createHmac, randomBytes } = require('crypto');
const { Schema, model } = require('mongoose');
const {createTokenForUser , validateToken} = require("../services/authentication")

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: "/images/download.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });

// Middleware to hash the password before saving the user document
userSchema.pre("save", function (next) {
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // Generate a random salt
    const salt = randomBytes(16).toString("hex");
    // const salt = 'someRandomSalt';

    // Hash the password with the generated salt
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest("hex");

    // Set the salt and hashed password on the user
    user.salt = salt;
    user.password = hashedPassword;

    next();
});

userSchema.static('matchPassword', async function(email, password) {
    // Find the user by email and await the result
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    // Hash the provided password using the stored salt
    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest("hex");

    // Compare the hashed password with the stored hashed password
    if (hashedPassword !== userProvidedHash) throw new Error("Incorrect password");

    const token = createTokenForUser(user);
    return token;
});



const User = model('User', userSchema);  // Note: "User" is the collection name in the database

module.exports = User;
