const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const port=3000
const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

mongoose.connect('mongodb://localhost:27017/login-app-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/change-password', async (req, res) => {
    const { token, newpassword: plainTextPassword } = req.body

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }

    if (plainTextPassword.length < 5) {
        return res.json({
            status: 'error',
            error: 'Password too small. Should be atleast 6 characters'
        })
    }

    try {
        const user = jwt.verify(token, JWT_SECRET)

        const _id = user.id

        const password = await bcrypt.hash(plainTextPassword, 10)

        await User.updateOne(
            { _id },
            {
                $set: { password }
            }
        )
        res.json({ status: 'ok' })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: ';))' })
    }
})

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username }).lean()

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid username/password' })
    }

    if (await bcrypt.compare(password, user.password)) {


        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            JWT_SECRET
        )

        return res.json({ status: 'ok', data: token })
    }

    res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/register', async (req, res) => {
    const { username, password: plainTextPassword } = req.body

    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'Invalid username' })
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }

    if (plainTextPassword.length < 5) {
        return res.json({
            status: 'error',
            error: 'Password too small. Should be atleast 6 characters'
        })
    }

    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        const response = await User.create({
            username,
            password
        })
        console.log('User created successfully: ', response)
    } catch (error) {
        if (error.code === 11000) {
            return res.json({ status: 'error', error: 'Username already in use' })
        }
        throw error
    }

    res.json({ status: 'ok' })
})
app.use(bodyParser.urlencoded({extended:true}))
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/js",express.static(__dirname+'/js'));
app.use(express.static('public'))
app.get('/',((req, res) => {
    res.sendFile(__dirname+'/home.html')
}))
app.get('/home',((req, res) => {
    res.sendFile(__dirname+'/home.html')
}))
app.get('/games',((req, res) => {
    res.sendFile(__dirname+'/games.html')
}))
app.get('/home',((req, res) => {
    res.sendFile(__dirname+'/home.html')
}))
app.get('/cinema',((req, res) => {
    res.sendFile(__dirname+'/cinema.html')
}))
app.get('/music',((req, res) => {
    res.sendFile(__dirname+'/music.html')
}))
app.get('/index',((req, res) => {
    res.sendFile(__dirname+'/index.html')
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/exp',((req, res) => {
    res.sendFile(__dirname+'/exp.html')
}))
app.post('/cinema',(req, res) => {
        let cinemaG=req.body.crypto;
        let api="3555a76b4788127f37bff3ab69d8bf00"
        let url="https://api.themoviedb.org/3/discover/movie?api_key="+api+"&with_genres="+cinemaG+"&units=metric&mode=json"
        https.get(url,(response)=>{
            response.on('data', (d) => {
                let json=JSON.parse(d)
                let rate=json.results[0].original_title
                var score=json.results[0].vote_average
                let rate1=json.results[1].original_title
                var score1=json.results[1].vote_average
                let rate2=json.results[2].original_title
                var score2=json.results[2].vote_average
                let rate3=json.results[3].original_title
                var score3=json.results[3].vote_average
                res.send("First movie is "+rate+"with score "+score+"; Second gmovie is "+rate1+"with score "+score1+"; Third movie is "+rate2+"with score "+score2+"; And fourth movie is "+rate3+"with score "+score3)
            });
        })
    }
);
app.post('/games',(req, res) => {
    let crypto = req.body.crypto
    const options = {
        method: 'GET',
        url: 'https://steam2.p.rapidapi.com/search/' + crypto + '/page/1',
        headers: {
            'X-RapidAPI-Host': 'steam2.p.rapidapi.com',
            'X-RapidAPI-Key': 'ff03032b4emsh64468f3e989e341p1c6ca8jsnb0673548dd37',
            useQueryString: true
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let json=JSON.parse(body)
        let game1=json[0].title;
        let image1=json[0].imgUrl;
        var audioUrl = '"'+ image1+  '"';
        let game2=json[1].title;
        let image2=json[1].imgUrl;
        let game3=json[2].title;
        let image3=json[2].imgUrl;
        let game4=json[3].title;
        let image4=json[3].imgUrl;
        res.send("First game is "+game1+"; Second game is "+game2+"; Third game is "+game3+"; And fourth game is "+game4)
    });

});
const axios = require("axios");
const https = require("https");
app.post('/music', (req, res) => {
    let musice=req.body.currency;
    const options1 = {

        method: 'GET',
        url: 'https://spotify23.p.rapidapi.com/search/',
        params: {
            q: musice,
            type: 'multi',
            offset: '0',
            limit: '10',
            numberOfTopResults: '5'
        },
        headers: {
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
            'X-RapidAPI-Key': 'ff03032b4emsh64468f3e989e341p1c6ca8jsnb0673548dd3'
        }
    };

    axios.request(options1).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });
    request(options1, function (error, response, body) {
        if (error) throw new Error(error);
        let json = JSON.parse(body)
        console.log(json);
        let music1 = json.playlists.items[0].name;
        console.log(music1);
        res.send("First game is " + music1)
    });
});
app.listen(port, function () {
    console.log(`app launched at address: http://localhost:${port}`)
})

