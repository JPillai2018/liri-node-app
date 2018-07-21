//Code to read and set any environment variables with the dotenv package:
require("dotenv").config();
var request = require("request");
// Load the NPM Package inquirer
var inquirer = require("inquirer");

// Adding code to import the 'keys.js' file and store it in a variables
var keys = require("./keys.js");
// console.log("Keys= " + keys.twitter);
// console.log("Keys= " + keys.spotify);

// Random and log Text Files
var rfile = require("fs");
var lfile = require("fs");
var randomFile = "random.txt";
var logFile = "log.txt";

// Twitter
var Twitter =  require("twitter");
var tweets = new Twitter(keys.twitter);

// Spotify
var Spotify =  require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// Created a series of questions
inquirer.prompt([
        {
            type: "list",
            name: "choices",
            message: "Which of the choices below would you like to select?",
            choices: ["My-Tweets", "Spotify-This-Song", "Movie-This", "Do-What-It-Says"]
        },
    ]).then(function(user) {
        switch(user.choices){
            case "My-Tweets":
                myTweets();
                break;
            case "Spotify-This-Song":
                spotifySong();
                break;
            case "Movie-This":
                myMovieThis();
                break;
            case "Do-What-It-Says":
                doWhatItSays();
                break;
            default: console.log("\n" + "Type any command after 'node liril.js': " + "\n", 
                "my-tweets:" + "\n" + 
                "spotify-this song 'Any Song Title'" + "\n" + 
                "movie-this 'Any Movie Name'" + "\n" + 
                "do-what-it-says 'Anything goes'" + "\n" );
        }
});

// My Tweets Function begins
function myTweets(){
    var myTweets = "";
    console.log("My Recent Tweets!!!");
    console.log("===================");
    var params = { screen_name:"Piper05732141"};
    tweets.get("statuses/user_timeline", params , function(error, tweets, response){
        if (!error){
            lfile.appendFile(logFile, "\r\n" + "***************My Tweets**************" , function(err) {
                if (err) {
                    console.log(err);
                }
                else {

                }                
            });
            for (var i=0; i < tweets.length; i++){
                console.log(tweets[i].text);
                myTweets = myTweets + "\r\n" + tweets[i].text;
            };
            myTweets = myTweets + "\r\n*************End of my tweets****************" ;
            // Appending to Log file
            lfile.appendFile(logFile, myTweets, function(err) {
                // If an error was experienced we say it.
                if (err) {
                    console.log(err);
                }
                // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                else {

                }
            });
        }
        else{
            console.log("Error : " + err);
        }
    })
}

// Spotify Songs begin
function spotifySong(){
    inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Song/Artist Name Please..."
        },
    ]).then(function(user){
        var selection = user.name;
        selection = selection.split(" ");
        var songName = "";
        for (var i = 0; i < selection.length; i++) {
            if (i > 0 && i < selection.length) {
                songName = songName + "+" + selection[i];
            }
            else{
                songName += selection[i];
            }
        }
        spotifyThisSongs(songName);
    })
};

// Do What It Says begins
function doWhatItSays(){
    var song = "I Want it That Way";
    rfile.readFile(randomFile, "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        song  = data;
    });
    spotifyThisSongs(song);
};


//Spotify This Songs Begins
function spotifyThisSongs(song){
    
    //var selection = "I Want it That Way";
    var selection = song;
    //spotify.search({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);
    var logFile = "log.txt";
    spotify.search({ type: 'track', query: selection, limit:10 })
    .then(function(response) {
        for (var j = 0; j < response.tracks.items.length; j++){
            var artistlist = "";
            for (var i=0; i < response.tracks.items[j].album.artists.length ; i++){
                artistlist = artistlist + " " + response.tracks.items[j].album.artists[i].name;
            }
            //console.log("Num of Artists= " + response.tracks.items[0].album.artists.length);
            console.log("------------------------------------------------------------------------");
            console.log("Artists Name= " + artistlist);
            console.log("Song Name= " + response.tracks.items[j].name);
            console.log("Album Name= " + response.tracks.items[j].album.name);
            console.log("Preview link= " + response.tracks.items[j].preview_url);
            console.log("------------------------------------------------------------------------");
            var mySpotify = mySpotify + "\r\n..Spotify Logs.." ;
            mySpotify = "\r\n********************Spotify Music Search ***************************" + "\r\nArtists Name= " + artistlist 
            + "\r\nSong Name= " + response.tracks.items[j].name + "\r\nAlbum Name= " 
            + response.tracks.items[j].album.name + "Preview link= " + response.tracks.items[j].preview_url   
            + "\r\n*************************************************************"  ;
            // Appending to Log file
            lfile.appendFile(logFile, mySpotify, function(err) {
                // If an error was experienced we say it.
                if (err) {
                    console.log(err);
                }
                else {
    
                }
            });
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}

// Movie This begins
function myMovieThis(){
    inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Move Name Please..."
        },
    ]).then(function(user){
        var selection = user.name;
        selection = selection.split(" ");
        var movieName = "";
        for (var i = 0; i < selection.length; i++) {
            if (i > 0 && i < selection.length) {
                movieName = movieName + "+" + selection[i];
            }
            else{
                movieName += selection[i];
            }
        }
        // Then run a request to the OMDB API with the movie specified
        var queryUrl = "https://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
        // This line is just to help us debug against the actual URL.
        //console.log(queryUrl);
        request(queryUrl, function(error, response, body) {
            if  (JSON.parse(body).Response === "True"){
                if ((!error && response.statusCode === 200)) {
                    //console.log ("Rating??= " +  JSON.parse(body).Ratings.length);
                    // Parse the body of the site and recover just the imdbRating
                    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).

                    if (JSON.parse(body).Ratings.length > 1){
                        var movieDetail = "\r\nMovie Details  " + "\r\n*************  " + "\r\nTitle= " + JSON.parse(body).Title + "\r\nYear= " + JSON.parse(body).Year 
                        + "\r\nimdbRating= " + JSON.parse(body).imdbRating + "\r\nrotten Tomatoes Rating= " + JSON.parse(body).Ratings[1].Value + "\r\nCountry= " + JSON.parse(body).Country
                        + "\r\nLanguage= " + JSON.parse(body).Language + "\r\nPlot = " + JSON.parse(body).Plot + "\r\nActors= " + JSON.parse(body).Actors 
                        + "\r\n*******************************************************************************"  ;                       
                    }
                    else{
                        var movieDetail = "\r\nMovie Details  " + "\r\n*************  " + "\r\nTitle= " + JSON.parse(body).Title + "\r\nYear= " + JSON.parse(body).Year 
                        + "\r\nimdbRating= " + JSON.parse(body).imdbRating + "\r\nrotten Tomatoes Rating= " + "Not Available" + "\r\nCountry= " + JSON.parse(body).Country
                        + "\r\nLanguage= " + JSON.parse(body).Language + "\r\nPlot = " + JSON.parse(body).Plot + "\r\nActors= " + JSON.parse(body).Actors 
                        + "\r\n*******************************************************************************"  ;
                    }

                    console.log(movieDetail);
                    // Appending to Log file
                    lfile.appendFile(logFile, "\r\n" + movieDetail, function(err) {
                        // If an error was experienced we say it.
                        if (err) {
                            console.log(err);
                        }
                        else {
    
                        }
                    });
                }
                else{
                    console.log("Error!!!!! Try again!!!");
                }
            }
            else
            {
                console.log("Error!!!  Movie not found");
            }
        });
    })
};
