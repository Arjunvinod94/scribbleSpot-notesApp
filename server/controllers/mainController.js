//HomePage
exports.homepage = async(req,res) =>{
        const locals = {
            title: 'Home - scribbleSpot',
            description: 'A Notes App',
            img: '/img/favicon.ico'
        }
        res.render('index', {
            locals,
            layout: '../views/layouts/front-page'
        })
}

//About
exports.about = async(req,res) =>{
        const locals = {
            title: 'About - scribbleSpot',
            description: 'A Notes App',
            img: '/img/favicon.ico'
        }
        res.render('about', locals)
}