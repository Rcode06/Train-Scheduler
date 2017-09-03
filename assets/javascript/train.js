   console.log("hi");

  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCqemaM18WSMei1Qr3dsCvRf9G8eUVf1nA",
    authDomain: "train-scheduler-fb2a6.firebaseapp.com",
    databaseURL: "https://train-scheduler-fb2a6.firebaseio.com",
    projectId: "train-scheduler-fb2a6",
    storageBucket: "train-scheduler-fb2a6.appspot.com",
    messagingSenderId: "937777294636"
  };
  firebase.initializeApp(config);


 var database = firebase.database().ref();


   
// console.log(moment().format("HH:mm"));
$("#add-train").on("click", function(event) {
  console.log("inside click");
  // It helps to not refresh the page
  event.preventDefault();

  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var firstTrainTime = moment($("#time-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
  var frequency = $("#frequency-input").val().trim();
  
   //Test
   console.log(trainName);
   console.log(trainDestination);
   console.log(firstTrainTime);
   console.log(frequency);


   // Create local object to hold train data

   var newTrain = {
       name:        trainName,
       destination: trainDestination,
       time:        firstTrainTime,
       frequency:   frequency,
       //when the event happens
       dateAdded:firebase.database.ServerValue.TIMESTAMP
     }
    
  // Uploads train data to the database
  database.push(newTrain);
  console.log(newTrain.name);
  console.log(newTrain.destination);
 
  //Alert
  alert("New train added");

  //clear all of the boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
  $("#nextArrival").val();
  $("#minAway").val();

});


  database.on("child_added", function(childSnapshot){

  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrainTime =childSnapshot.val().firstTrainTime;
  var frequency =childSnapshot.val().frequency;


  var tFrequency = 5;
  var firstTime = "03:30";


  //first time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));


  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var minAway = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + minAway);

  // Next Train
  var nextArrival = moment().add(minAway, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));



 
 //full list of items to the well
$("#add-train-row >tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + firstTrainTime + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");

 });


function(errorObject) {
    // console.log("Errors handled: " + errorObject.code);
  };

