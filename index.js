const express = require('express')
const path = require('path')


const app = express()

//Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// Users route
app.use('/api/users', require('./routes/api/users'))


// Static Folder
app.use(express.static(path.join(__dirname, 'public', 'userPage')))

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`Server listening to PORT ${PORT}`)
})