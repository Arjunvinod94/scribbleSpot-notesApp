const Note = require('../models/Notes')
const User = require('../models/Users')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//Dashboard
exports.dashboard = async(req,res) =>{

    let perPage = 12
    let page = req.query.page || 1

    const locals = {
        title: 'scribbleSpot - Dashboard',
        description: 'A Notes App'
    }

    try {
        const notes = await Note.aggregate([
            {
                $sort: {
                    updatedAt: -1,
                }
            },
            {
                $project: {
                    title: { $substr: ['$title', 0, 30] },
                    body: { $substr: ['$body', 0, 100] },
                }
            },
            {
                $skip: perPage * (page - 1)
            },
            {
                $limit: perPage
            }
        ]);
    
        const count = await Note.countDocuments();
    
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

exports.dashboardViewNote = async(req,res) =>{
    const note = await Note.findById({_id: req.params.id})
    
    if(note) {
        res.render('dashboard/view-note', {
            noteID: req.params.id,
            note,
            layout: '../views/layouts/dashboard'
        })
    } else {
        res.send("Something went wrong")
    }
}

exports.dashboardUpdateNote = async(req,res) =>{
    try {
        await Note.findOneAndUpdate(
            { _id: req.params.id },
            { title: req.body.title, body: req.body.body, updatedAt: Date.now()}
        )
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
    }
}

exports.dashboardDeleteNote = async(req,res)=>{
    try {
        
        await Note.deleteOne({_id: req.params.id})
        res.redirect('/dashboard')

    } catch (error) {
        console.log(error);
    }
}

exports.dashboardAddNote = async(req,res) =>{
    res.render('dashboard/add', {
        layout: '../views/layouts/dashboard'
    })
}

exports.dashboardAddNoteSubmit = async(req,res) =>{
    try {
        
        await Note.create(req.body)
        res.redirect('/dashboard')

    } catch (error) {
        console.log(error);
    }
}

exports.dashboardSearch = async(req,res) =>{
    try {
        res.render('dashboard/search', {
            searchResults: '',
            layout: '../views/layouts/dashboard'
        })
    } catch (error) {
        console.log(error);
    }
}

exports.dashboardSearchSubmit = async(req,res) =>{
    try {
        
        let searchTerm = req.body.searchTerm
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
            const searchResults = await Note.find({
                $or: [
                    {title: { $regex: new RegExp(searchNoSpecialChars, 'i')}},
                    {body: { $regex: new RegExp(searchNoSpecialChars, 'i')}},
                ]
            })
        
            res.render('dashboard/search', {
                searchResults,
                layout: '../views/layouts/dashboard'
            })


    } catch (error) {
        console.log(error);
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
            return res.status(400).send(`User already exist`);
        } else {

            if(password !== confirmPassword) {
                return res.status(400).send(`Password doesn't match`);
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
                res.redirect('/login')

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
            return res.status(400).send('Invalid username or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.cookie('token', token, { httpOnly: true });
            res.redirect('/dashboard');
        } else {
            return res.status(400).send('Invalid username or password');
        }

    } catch (error) {
        console.log(error);
    }
};


exports.userLogout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
}
