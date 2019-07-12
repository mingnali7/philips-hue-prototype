// request express
const express = require('express')
const app = express()
// request mustache
let mustacheExpress = require('mustache-express');
// request path
var path = require('path');
// request body parser
var bodyParser = require('body-parser')
// request postgresql
var { Client } = require('pg')

// request hue
var hue = require("node-hue-api"),
  HueApi = hue.HueApi,
  lightState = hue.lightState,
  hueScene = hue.scene;

let newCue = [];

// access the local database hue
var client = new Client({
  database: 'hue'
});



// mustache setup
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname);

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// express static to include stylesheet
app.use(express.static(__dirname + '/public'));

// connect to postgres database
client.connect();




// display hue results
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

// hue bridge username
var host = "192.168.1.136",
  username = "MLyxXervGUmxaOCnkQ0wOelUIoXRzEavSr6RC7Lz",
  api = new HueApi(host, username)

// turn light red
var redState = lightState.create().on().rgb(255, 0, 0).brightness(100),
  // turn light green
  greenState = lightState.create().on().rgb(0, 255, 0).brightness(100),
  // turn light blue
  blueState = lightState.create().on().rgb(0, 0, 255).brightness(100),
  // turn light white
  whiteState = lightState.create().on().rgb(255, 255, 255).brightness(100),
  // turn light off
  offstate = lightState.create(),
  // hue scene
  scene = hueScene.create(),
  // test scene
  whiteId = "2HEHYI-uc74MrbD",
  // a scene with red and green light
  redgreenId = "mnzEAJgtbs7m-Z6"


// TODO: display html from scene info results
// 

// home page, display cuesheet
app.get('/', function (req, res) {
  client.query("SELECT * FROM cues;", function (err, res1) {
    if (err) {
      console.log(err)
    }
    let cueSheet = res1.rows;
    // render cuesheet through mustache
    res.render('index', {
      cueSheet
    })
  })
});

//go to cue
app.post('/getCues', function (req, res) {
  let index = -1;
  let cueID;
  let showCue = req.body.retrieve
  let query = {
    text: 'SELECT message FROM cues WHERE id=($1)',
    values: [showCue],
    rowMode: 'array'
  }
  client.query(query, function (error, res1) {
    if (error) {
      console.log(error)
    }
    //save the selected cue number in a variable
    let cueNum = JSON.parse(res1.rows)
    //activate the selected scene
    api.activateScene(cueNum, function (err, result) {
      if (err) throw err;
      displayResults(result);
      console.log("cue activate success")
    });
  })
  // test to see all scenes
  // api.scenes(function (err, result) {
  //   if (err) throw err;
  //   // displayResults(result);
  //   // console.log(JSON.stringify(result, null, 2))
  //   for (let i = 0; i < result.length; i++) {
  //     let selectCue = result[i];
  //     if (selectCue.name === showCue) {
  //       index = i;
  //       cueId = result[i].id
  //     }

  //   }
  //   api.activateScene(cueId, function (err, result) {
  //     if (err) throw err;
  //     displayResults(result);
  //     console.log("cue activate success")
  //   });

  // });
  res.redirect("/")

})


// light sequence test
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
  // get scene id from button jquery and ajax
  let sceneId = req.body.id
  console.log(sceneId)
  // activate the scene
  api.activateScene(sceneId, function (err, result) {
    if (err) throw err;
  });

  res.redirect('/')
  console.log('scene activated')
})

// record a scene
app.post('/record', function (req, res) {
  let newLabel = req.body.label;
  //name of the scene
  //TODO: change withName string to newLabel
  scene.withName(newLabel)
    .withLights([1, 2, 4]);
  //save the scene
  api.createAdvancedScene(scene, function (err, result) {
    if (err) throw err;
    //save scene id number into a variable to save in database
    let newRec = JSON.stringify(result.id);
    //add scene id number and label in database
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
//change light4 to red
app.get('/red', function (req, res) {

  console.log("setting red");

  api.setLightState(4, redState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);

    console.log("red triggered");
  });
  res.redirect('/')

})

// change light4 to green
app.post('/green', function (req, res) {

  api.setLightState(4, greenState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

// change light 4 to blue
app.post('/blue', function (req, res) {

  api.setLightState(4, blueState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

// change light 4 to white
app.post('/white', function (req, res) {

  api.setLightState(4, whiteState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

// turn light 4 off
app.post('/off', function (req, res) {

  api.setLightState(4, offstate.off())
    .then(displayResult)
    .fail(displayError)
    .done();
  res.redirect('/')
  console.log('off')
})

///////////light2//////////////////

// change light 2 to red
app.post('/red2', function (req, res) {

  api.setLightState(2, redState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

// change light 2 to green
app.post('/green2', function (req, res) {

  api.setLightState(2, greenState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

// change light 2 to blue
app.post('/blue2', function (req, res) {

  api.setLightState(2, blueState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

// change light 2 to white
app.post('/white2', function (req, res) {

  api.setLightState(2, whiteState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

// turn light 2 to off
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

// change light 1 to red
app.post('/red1', function (req, res) {

  api.setLightState(1, redState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

// change light 1 to green
app.post('/green1', function (req, res) {

  api.setLightState(1, greenState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

// change light 1 to blue
app.post('/blue1', function (req, res) {

  api.setLightState(1, blueState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

// change light 1 to white
app.post('/white1', function (req, res) {

  api.setLightState(1, whiteState, function (err, lights) {
    if (err) throw err;
    displayResult(lights);
  });
  res.redirect('/')
  console.log('redirected')
})

// turn light 1 off
app.post('/off1', function (req, res) {

  api.setLightState(1, offstate.off())
    .then(displayResult)
    .fail(displayError)
    .done();
  res.redirect('/')
  console.log('off')
})

// express, listening on port 8000
app.listen(process.env.PORT || 8000, function () {
  console.log("listening on port 8000")
})