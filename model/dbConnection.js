
const mongoose = require('mongoose');
const uri = 'mongodb+srv://alannixon2520:alan2520@cluster0.me5d0p1.mongodb.net/AdminUser';

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

connectDB()


const userSchema = new mongoose.Schema({
    FName: String,
    LName: String,
    FullName: String,
    Email: String,
    Password: String,
    isAdmin: Boolean,
    isBlocked: Boolean
})


const User = mongoose.model('User', userSchema);


module.exports = { connectDB, User };