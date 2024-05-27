const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// connecting to db...
mongoose.connect('mongodb+srv://ninja123:ninja123@web3.ywyvt3x.mongodb.net/paytm', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to mongodb...')
    })
    .catch((error) => {
        console.log('Error connecting:', error);
    })


// User..............
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    password: String,
    amount: Number
})

// can use pre to listen to event 'save' , whenever pswrd save hashing it before saving.
userSchema.methods.createHash = async function (pswrd) {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(pswrd, salt);
}

userSchema.methods.verifyHash = async function (pswrd) {
    return bcrypt.compare(pswrd, this.password);
}

const User = mongoose.model('user', userSchema);

// Accounts...........
const accountSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: 'user'
    },
    balance: Number
})
const Account = mongoose.model('account', accountSchema);
module.exports = { User, Account };