require('dotenv').config()

//new db connection
const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/scribbleSpot")


const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
const nocache = require('nocache');
// const connectDB = require('./server/config/db')
// const session = require('express-session')
// const passport = require('passport')
// const MongoStore = require('connect-mongo')

const app = express()
const port = 5000 || process.env.PORT

// app.use(passport.initialize())
// app.use(passport.session())

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(methodOverride("_method"))
app.use(cookieParser());

//Connect to DB
// connectDB()

//Static Files
app.use(express.static('public'))

//Template Engine
app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.use(nocache());

//Routes
app.use('/', require('./server/routes/index'))
app.use('/', require('./server/routes/dashboard'))

//Handle 404
app.get('*', (req,res)=>{
    res.status(404).render('404')
})

app.listen(port, ()=>{
    console.log(`Server started at ${port}`)
})