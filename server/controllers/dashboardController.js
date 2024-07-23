const Note = require('../models/Notes')
const User = require('../models/Users')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//Dashboard
exports.dashboard = async(req,res, next) => {

    let perPage = 12;
    let page = req.query.page || 1;

    const locals = {
        title: 'scribbleSpot - Dashboard',
        description: 'A Notes App'
    }

    try {
        const notes = await Note.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.userId)
                }
            },
            {
                $sort: {
                    updatedAt: -1
                }
            },
            {
                $project: {
                    title: { $substr: ['$title', 0, 30] },
                    body: { $substr: ['$body', 0, 100] }
                }
            },
            {
                $skip: perPage * (page - 1)
            },
            {
                $limit: perPage
            }
        ]);

        const count = await Note.countDocuments({ user: req.user.userId });

        res.render('dashboard/index', {
            userName: req.user.name,
            locals,
            notes,
            layout: '../views/layouts/dashboard',
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}


exports.dashboardViewNote = async (req, res, next) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user.userId });
        
        if (note) {
            res.render('dashboard/view-note', {
                noteID: req.params.id,
                note,
                layout: '../views/layouts/dashboard'
            });
        } else {
            res.send("Something went wrong");
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.dashboardUpdateNote = async (req, res, next) => {
    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
        );

        if (note) {
            res.redirect('/dashboard');
        } else {
            res.send("Something went wrong");
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.dashboardDeleteNote = async (req, res, next) => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.userId });

        if (note) {
            res.redirect('/dashboard');
        } else {
            res.send("Something went wrong");
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.dashboardAddNote = async (req, res, next) => {
    try {
        res.render('dashboard/add', {
            layout: '../views/layouts/dashboard'
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.dashboardAddNoteSubmit = async (req, res, next) => {
    try {
        await Note.create({
            title: req.body.title,
            body: req.body.body,
            user: req.user.userId,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.dashboardSearch = async (req, res, next) => {
    try {
        res.render('dashboard/search', {
            searchResults: '',
            layout: '../views/layouts/dashboard'
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.dashboardSearchSubmit = async (req, res, next) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        const searchResults = await Note.find({
            user: req.user.userId,
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChars, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChars, 'i') } }
            ]
        });

        res.render('dashboard/search', {
            searchResults,
            layout: '../views/layouts/dashboard'
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.userLogin = async(req,res) =>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error);
    }
}

exports.userRegisterSumit = async(req,res) =>{
    try {
        const {name, email, password, confirmPassword} = req.body

        const user = await User.findOne({email: email})
        if(user) {
            res.render('login', {message: 'User already exist', errorMessage: "Couldn't create account, try again"})
        } else {

            if(password !== confirmPassword) {
                res.render('login', {message: "Password doesn't match", errorMessage: "Couldn't create account, try again"})
            } else {
                
                const saltRounds = 10
                const hashPassword = await bcrypt.hash(password, saltRounds)
                
                
                const newUser = new User({
                    name,
                    email,
                    password : hashPassword,
                    is_verified: 1
                })

                await newUser.save()
                res.render('login',{Message:'Account successfully created'})

            }

        }

    } catch (error) {
        console.log(error);
    }
}

exports.userLoginSubmit = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.render('login', {errorMessage: 'Account not found. Create new account'})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.cookie('token', token, { httpOnly: true });
            res.redirect('/dashboard');
        } else {
            res.render('login', {errorMessage: 'Invalid email or password'})
        }

    } catch (error) {
        console.log(error);
    }
};


exports.userLogout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
}
