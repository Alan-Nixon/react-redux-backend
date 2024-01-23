const { User } = require("../../model/dbConnection")

const adminDashboard = (req, res, next) => {
    res.status(200).json({ isLoggedIn: true })
}

const adminAuthenticated = (req, res) => {
    res.status(200).json({ isLoggedIn: true })
}

const getUsers = async (req, res) => {
    let users = await User.find();
    res.status(200).json({ users });
};

const blockuser = async (req, res) => {
    console.log(req.query.userId);
    try {
        const user = await User.findById(req.query.userId)
        user.isBlocked = !user.isBlocked
        await user.save()
    } catch (e) {
        console.error(e);
    }
    res.status(200).json()
}

const searchuser = async (req, res) => {
    try {
        const users = await User.find({
            $or: [
                { FullName: { $regex: new RegExp(`^${req.query.search}`, 'i') } },
                { Email: { $regex: new RegExp(`^${req.query.search}`, 'i') } },
                { FName: { $regex: new RegExp(`^${req.query.search}`, 'i') } },
                { LName: { $regex: new RegExp(`^${req.query.search}`, 'i') } }
            ]
        })
        res.status(200).json({ users })
    } catch (e) {
        res.status(200).json({ users: [] })
    }
}

module.exports = {
    adminDashboard, adminAuthenticated, getUsers, blockuser, searchuser
}