// To host your site with Firebase Hosting, you need the Firebase CLI (a command line tool).

// Run the following npm command to install the CLI or update to the latest CLI version.

// npm install -g firebase-tools

var firebaseConfig = {
    apiKey: "AIzaSyCtmANKVpd54NQFKiWstwa10SkBUWgyNBM",
    authDomain: "train-scheduler-15c37.firebaseapp.com",
    databaseURL: "https://train-scheduler-15c37.firebaseio.com",
    projectId: "train-scheduler-15c37",
    storageBucket: "train-scheduler-15c37.appspot.com",
    messagingSenderId: "239524262180",
    appId: "1:239524262180:web:fb37525227ba5f849d03b1",
    measurementId: "G-45Q1T7F6DM"
};
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$("#submit").on("click", function (event) {
    event.preventDefault();
    var trainName = $("#trainName").val();
    // console.log("Train Name: " + trainName)
    var destination = $("#destination").val();
    // console.log("Destination: " + destination)
    var firstTrain = $("#firstTrain").val();
    // console.log("First Train Time: " + firstTrain);
    var frequency = $("#freq").val();
    // console.log("Frequency: " + frequency)

    var trainInfo = {
        name: trainName,
        destination: destination,
        first: firstTrain,
        frequency: frequency
    };
    console.log(trainInfo)

    database.ref("Train Info").push(trainInfo);

})
function createTable() {
    $("tbody").empty();
    database.ref("Train Info").on("child_added", function (childSnapshot) {
        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;
        var firstTrain = childSnapshot.val().first;
        console.log(trainName)

        // calculate next arrival, and time left
        console.log(firstTrain)
        var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);
        var currentTime = moment().format("hh:mm");
        console.log(currentTime)
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);
        var tMinutesTillTrain = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        // create new table row. add train info to row. append row to table
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(moment(nextTrain).format("LT")),
            $("<td>").text(tMinutesTillTrain)
        );
        $("#schedule > tbody").append(newRow);
    });

}

$(document).ready(function(){createTable()});

// refresh every minute
setInterval(createTable, 60000);