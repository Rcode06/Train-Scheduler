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
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTrainTime = moment($("#time-input").val().trim(), "HH:mm").subtract(1, "years").format("X");
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
 

});

  //adding trains to firebase
  database.on("child_added", function(childSnapshot){

  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var time = childSnapshot.val().time;
  var frequency = childSnapshot.val().frequency;


  var remainder = moment().diff(moment.unix(time),"minutes")%frequency;
  var minAway = frequency - remainder;
  var nextArrival = moment().add(minAway, "m").format("hh:mm A");

  console.log(remainder);
  console.log(minAway);
  console.log(nextArrival);

 

 
 // full list of items to the well
$("#directory > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");

 });



