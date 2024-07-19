//HomePage
exports.homepage = async(req,res) =>{
        const locals = {
            title: 'scribbleSpot - Home',
            description: 'A Notes App'
        }
        res.render('index', {
            locals,
            layout: '../views/layouts/front-page'
        })
}

//About
exports.about = async(req,res) =>{
        const locals = {
            title: 'scribbleSpot - About',
            description: 'A Notes App'
        }
        res.render('about', locals)
}