const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    googleId: String,
    githubId: String,
    email: String
});
userSchema.statics.findOneOrCreate = async function(query) {
    let user = await this.findOne(query);
    if (!user) {
        user = await this.create(query);
    }
    return user;
};
module.exports = mongoose.model('User', userSchema);
