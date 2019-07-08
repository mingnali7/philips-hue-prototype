const express = require('express')
const app = express()
let mustacheExpress = require('mustache-express');
var path = require('path');
var bodyParser = require('body-parser')
var { Client } = require('pg')


let meowCue = [];
let newCue = [];

var client = new Client({
  database: 'hue'
});

// const socket = require('socket.io');
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname);
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));



client.connect();






var hue = require("node-hue-api"),
  HueApi = hue.HueApi,
  lightState = hue.lightState,
  hueScene = hue.scene;


var displayResult = function (result) {
  console.log(JSON.stringify(result, null, 2));
};

var displayResult = function (result) {
  console.log(result);
};

var displayError = function (err) {
  console.error(err);
};
var displayResults = function (result) {
  console.log(JSON.stringify(result, null, 2));
};
var host = "192.168.1.136",
  username = "MLyxXervGUmxaOCnkQ0wOelUIoXRzEavSr6RC7Lz",
  api = new HueApi(host, username),
  redState = lightState.create().on().rgb(255, 0, 0).brightness(100),
  greenState = lightState.create().on().rgb(0, 255, 0).brightness(100),
  blueState = lightState.create().on().rgb(0, 0, 255).brightness(100),
  whiteState = lightState.create().on().rgb(255, 255, 255).brightness(100),
  offstate = lightState.create(),
  scene = hueScene.create(),
  sceneId = "Gx6i3OPr0Eqbgd7";
whiteId = "2HEHYI-uc74MrbD";
redgreenId = "mnzEAJgtbs7m-Z6"


app.get('/', function (req, res) {
  // res.sendFile(path.join(__dirname + '/index.html'));
  client.query("SELECT * FROM cues;", function (err, res1) {
    if (err) {
      console.log(err)
    }
    let cueSheet = res1.rows;

    // client.end()
    res.render('index', {
      cueSheet
    })
  })
});

//check all scenes
app.post('/getCues', function (req, res) {
  let showCue = req.body.retrieve
  console.log(showCue);
  let query = {
    text: 'SELECT message FROM cues WHERE id=($1)',
    values: [showCue],
    rowMode: 'array'
  }
  client.query(query, function (error, res1) {
    if (error) {
      console.log(error)
    }
    let wow = JSON.parse(res1.rows)
    // console.log(wow)
    // console.log(wow)
    api.activateScene(wow, function (err, result) {
      if (err) throw err;
      displayResults(result);
      console.log("activate success")
    });
  })
  api.scenes(function (err, result) {
    if (err) throw err;
    // console.log(json.stringify(result));
    // console.log(result.length)
    // for (let i = 0; i < result.length; i++) {
    meowCue = result;
    // dog = document.createElement("BUTTON");
    // console.log(result)

    // let newRec = result[result.length - 1].id);

  });
  // res.render('<button>hello</button>')
  res.redirect("/")
  console.log("triggered")
  // client.end()

})

// api.scenes(function (err, result) {
//   if (err) throw err;
//   console.log(result);
// });

// light sequence
app.post('/sequence', function (req, res) {
  api.activateScene(whiteId)
    .then(displayResults)
    .done();
  setTimeout(function () { meow(); }, 2000);

  console.log("sequence triggered")

  res.redirect('/')

})
function meow() {
  api.activateScene(redgreenId)
    .then(displayResults)
    .done()
}

// activate a scene
app.post('/activate', function (req, res) {
  api.activateScene(newCue[0].id)
    .then(displayResults)
    .done();

  res.redirect('/')
  console.log('activated')
})

// record a scene
app.post('/record', function (req, res) {
  let newLabel = req.body.label;
  //name of the scene
  scene.withName("newScene")
    .withLights([1, 2, 4])
    // .withTransitionTime(50)
    ;
  //create new scene
  // api.createAdvancedScene(scene)
  //   .then(displayResults)
  //   .done();
  api.createAdvancedScene(scene, function (err, result) {
    if (err) throw err;
    // consolek.log((JSON.stringify(result)).id)
    // newCue.push(result)
    let newRec = JSON.stringify(result.id);
    // console.log("no stringify", result.id)
    // console.log(result.id);
    // displayResults(result);
    client.query('INSERT INTO cues (message,label) VALUES ($1,$2)', [newRec, newLabel], function (error, res1) {
      if (error) {
        console.log(error)
      }
      console.log("record succeed")
      res.redirect('/')
    })
  });


})

///////light4///////////
app.get('/red', function (req, res) {

  console.log("setting red");

  api.setLightState(4, redState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);

    console.log("red triggered");
  });
  res.redirect('/')

})

// api.setLightState(4, redState, function (err, lights) {
//   if (err) throw err;
//   displayResult(lights);

app.post('/green', function (req, res) {

  api.setLightState(4, greenState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

app.post('/blue', function (req, res) {

  api.setLightState(4, blueState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})
app.post('/white', function (req, res) {

  api.setLightState(4, whiteState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

app.post('/off', function (req, res) {

  api.setLightState(4, offstate.off())
    .then(displayResult)
    .fail(displayError)
    .done();
  res.redirect('/')
  console.log('off')
})

///////////light2//////////////////

app.post('/red2', function (req, res) {

  api.setLightState(2, redState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})
app.post('/green2', function (req, res) {

  api.setLightState(2, greenState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

app.post('/blue2', function (req, res) {

  api.setLightState(2, blueState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})
app.post('/white2', function (req, res) {

  api.setLightState(2, whiteState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

app.post('/off2', function (req, res) {
  console.log(req.body)
  api.setLightState(2, offstate.off())
    .then(displayResult)
    .fail(displayError)
    .done();
  res.redirect('/')
  console.log('off')
})


//////////light1///////////
app.post('/red1', function (req, res) {

  api.setLightState(1, redState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})
app.post('/green1', function (req, res) {

  api.setLightState(1, greenState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

app.post('/blue1', function (req, res) {

  api.setLightState(1, blueState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})
app.post('/white1', function (req, res) {

  api.setLightState(1, whiteState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

app.post('/off1', function (req, res) {

  api.setLightState(1, offstate.off())
    .then(displayResult)
    .fail(displayError)
    .done();
  res.redirect('/')
  console.log('off')
})

//display all scenes
// api.scenes()
//   .then(displayResults)
//   .done();

app.listen(process.env.PORT || 8000, function () {
  console.log("listening on port 8000")
})