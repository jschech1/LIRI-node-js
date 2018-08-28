require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");
var moment = require('moment');

var spotify = new Spotify(keys.spotify);

var userChoice = process.argv[2];

var search = "";


for (var i = 3; i < process.argv.length; i++) {

    if (i > 3 && i < process.argv.length) {

        search = search + "+" + process.argv[i];

    }

    else {

        search += process.argv[i];

    }
}
function switchChecker() {
    switch (userChoice) {
        case "concert-this":
            concert();
            break;

        case "spotify-this-song":
            song();
            break;

        case "movie-this":
            movie();
            break;

        case "do-what-it-says":
            command();
            break;
    }
}

function concert() {
    request("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log(JSON.parse(response[0].venue.name));

        }
    });
}


function movie() {
    console.log(search);
    request("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            //   console.log(JSON.parse(body));
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value[1]);
            console.log("Produced in: " + JSON.parse(body).Country);
            console.log("Language(s): " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Cast: " + JSON.parse(body).Actors);

        }

        // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'******************************************************************************************************************************
    });
}

function song() {
    spotify.search({ type: 'track', query: search }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }


        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Preview: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);

    });
}

// Default **************************************

function command() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        userChoice = dataArr[0];
        search = dataArr[1];
        switchChecker();

    });
}



switchChecker();