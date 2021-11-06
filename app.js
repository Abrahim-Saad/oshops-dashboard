const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// app.use(express.json)
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/login.html'))
})


app.listen(port, () => console.log("The Server is Up and Running!!"))