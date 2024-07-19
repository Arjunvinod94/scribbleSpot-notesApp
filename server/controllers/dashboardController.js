const Note = require('../models/Notes')
const mongoose = require('mongoose')

//Dashboard
exports.dashboard = async(req,res) =>{
    const locals = {
        title: 'scribbleSpot - Dashboard',
        description: 'A Notes App'
    }

    try {
        const notes = await Note.find({})
        
        res.render('dashboard/index', {
            locals,
            notes,
            layout: '../views/layouts/dashboard'
        })

    } catch (error) {
        console.log(error);
    }

}