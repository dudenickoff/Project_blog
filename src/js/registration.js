var $ = require('jquery');
var firebase = require('firebase');


function register() {
    var email = $("#signup-email").val();
    var password = $("#signup-password").val();
    var username = $("#signup-username").val();
    Date.prototype.getMonthName = function() {
      var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return month[this.getMonth()];
    }

var today = new Date();
var year = today.getFullYear();
var month = today.getMonthName();
var day = today.getDate();

    ref.createUser({
        email, password
    }, function(error, userData) {
        if (error) {
            console.log("Error creating user:", error);
        } else {
            console.log("Successfully created user account with uid:", userData.uid);
            var usersRef = ref.child("users/" + userData.uid);
            usersRef.set(

                {
                    Username: username,
                    email: email,
                    uid: userData.uid,
                    dateReg: {"day": day, "month": month, "year": year}
                }

            );
        }
    });
};
function writeUserData(userId, name, email) {

  Date.prototype.getMonthName = function() {
    var month = ["January", "February", "March", "April",
      "May", "June", "July", "August", "September",
      "October", "November", "December"
    ];
    return month[this.getMonth()];
  }

  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonthName();
  var day = today.getDate();
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    userId: userId,
    dateReg: {
      "day": day,
      "month": month,
      "year": year
    }
  });
}

function handleSignUp() {
    var email = $("#signup-email").val();
    var password = $("#signup-password").val();
    var username = $("#signup-username").val();

    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });

  }
  // [END createwithemail]
  function reg(){
    console.log("REGISTRATION!!!")
  }