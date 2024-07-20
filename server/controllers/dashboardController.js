const Note = require('../models/Notes')
const mongoose = require('mongoose')

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
                    createdAt: -1,
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
            { title: req.body.title, body: req.body.body}
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
