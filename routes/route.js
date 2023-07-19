const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public/index.html'))
    console.log(__dirname)
    return;
})

router.get('*', (req, res, next) => {
    res.status(404);
    
    // HTML
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '../public/error.html'))
    } else if (req.accepts('json')) {
        res.sendFile(path.join(__dirname, '../public/error.hbs'))
    } else
        res.type('txt').send('404 not found')
    
})

module.exports = router

// ////////////////////////////////////////////////////////////////////////////////////////////
