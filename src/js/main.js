var $ = require('jquery');
var firebase = require('firebase');
var storage = require('firebase/storage');
var config = {
    apiKey: "AIzaSyAzn1X37VOET1I1x8_cndzMBwVKjyxHKaI",
    authDomain: "blog-dudnikov.firebaseapp.com",
    databaseURL: "https://blog-dudnikov.firebaseio.com",
    storageBucket: "blog-dudnikov.appspot.com",
    messagingSenderId: "236563489436"
  };
  firebase.initializeApp(config);
  var storageRef = firebase.storage().ref();
// console.log(storageRef);
var stack_log = [];
var uid = "";
// Initialize Firebase
// $('textarea').autoResize();
// console.log(ref);
$(document).ready(function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    var user = firebase.auth().currentUser;
    // console.log(user);
    // console.log(user.uid);
    var formModal = $('.cd-user-modal');
    formModal.removeClass('is-visible');
    var userId = firebase.auth().currentUser.uid;
return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  var username = snapshot.val().username;
  $(".main-nav ul li").css("display", "inline-block");
  $(".user_nickname").text(username);
  var src_avatar = snapshot.val().profile_picture;
  $("#cd-logo a img").attr({src: src_avatar}).css("visibility", "visible");
  $(".user_nickname").css("visibility", "visible");
  $(".cd-signin, .cd-signup").css("display", "none");
  $(".cd-signout").css("display", "block");
  return firebase.database().ref('/postkeys').on('value', function(snapshot) {
  var data = snapshot.val();
  // console.log(typeof data);
  var mass = Object.keys(data);
  console.log(mass);


  for (var i=0; i<mass.length-1; i++) {
    // console.log("mass i->" + mass[i])
    var key = mass[i];
    firebase.database().ref('/posts/' + key).once('value').then(function(snapshot) {
      // console.log(snapshot.val());
      // console.log(snapshot.key);
      // console.log("key->" + key);
      var text = "<li class=" + "'" + snapshot.key + "'>"+ snapshot.val().post_theme + "</li>";
      console.log("text->" + text);
      $('#buttons').append(text);
      $("ul#buttons > li").on('click', function(event) {
        event.stopPropagation();
        event.preventDefault();
  console.log($(this).attr('class'));
}); 
});
  };

  
});
});


} else {
    // console.log("NOT LOGGED IN");
    $(".main-nav ul li").css("display", "inline-block");
    $(".cd-signout").css("display", "none");
    $(".cd-signin, .cd-signup").css("display", "block");
  }
});
});
$(document).ready(function($){
  var formModal = $('.cd-user-modal'),
    formLogin = formModal.find('#cd-login'),
    formSignup = formModal.find('#cd-signup'),
    formUserinfo = formModal.find("#cd-userinfo"),
    formForgotPassword = formModal.find('#cd-reset-password'),
    formModalTab = $('.cd-switcher'),
    tabLogin = formModalTab.children('li').eq(0).children('a'),
    tabSignup = formModalTab.children('li').eq(1).children('a'),
    mainNav = $('.main-nav');
    createAcc = $("#create_account");
    login = $("#login");

  mainNav.on('click', function(event){
    $(event.target).is(mainNav) && mainNav.children('ul').toggleClass('is-visible');
  });

  //open sign-up form
  mainNav.on('click', '.cd-signup', signup_selected);
  //open login-form form
  mainNav.on('click', '.cd-signin', login_selected);
  //open userinfo form
  $('.user_nickname').on('click', userinfo_selected);
    // open create post form 
  $('.cd-create-post').on('click', add_post_selected);
  //save post to server button
  $('#add_post').on('click', write_post_to_server);
  //close modal
  formModal.on('click', function(event){
    if( $(event.target).is(formModal) || $(event.target).is('.cd-close-form') ) {
      formModal.removeClass('is-visible');
    } 
  });
  //close modal when clicking the esc keyboard button
  $(document).keyup(function(event){
      if(event.which=='27'){
        formModal.removeClass('is-visible');
      }
    });

  //switch from a tab to another
  formModalTab.on('click', function(event) {
    event.preventDefault();
    ( $(event.target).is( tabLogin ) ) ? login_selected() : signup_selected();
  });

  //hide or show password
  $('.hide-password').on('click', function(){
    var togglePass= $(this),
      passwordField = togglePass.prev('input');
    
    ( 'password' == passwordField.attr('type') ) ? passwordField.attr('type', 'text') : passwordField.attr('type', 'password');
    ( 'Hide' == togglePass.text() ) ? togglePass.text('Show') : togglePass.text('Hide');
    //focus and move cursor to the end of input field
    passwordField.putCursorAtEnd();
  });


  createAcc.on('click', function(event) {
    event.preventDefault();
    register();
  });

  login.on('click', function(event) {
    // event.preventDefault();
    login_func();
  });

  function login_selected(){
    mainNav.children('ul').removeClass('is-visible');
    formModal.addClass('is-visible');
    formLogin.addClass('is-selected');
    formSignup.removeClass('is-selected');
    formForgotPassword.removeClass('is-selected');
    tabLogin.addClass('selected');
    tabSignup.removeClass('selected');
  }

  function signup_selected(){
    mainNav.children('ul').removeClass('is-visible');
    formModal.addClass('is-visible');
    formLogin.removeClass('is-selected');
    formSignup.addClass('is-selected');
    formForgotPassword.removeClass('is-selected');
    tabLogin.removeClass('selected');
    tabSignup.addClass('selected');
  }

  function userinfo_selected(){
    // console.log("button");
    formModal.addClass('is-visible');
    formModalTab.remove();
    formLogin.remove();
    formSignup.remove();
    // formUserinfo.addClass('is-visible');
    $('#cd-userinfo').addClass('is-selected');
    $('#cd-create-post').removeClass('is-selected');
    var uid = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
    var user = snapshot.val();
    console.log(user);
    $("#modal-username").val(user.username);
    console.log(user.username);
    $("#modal-city").val(user.city);
    console.log(user.city);
  });
  }
  function add_post_selected(){
    // console.log("button");
    formModal.addClass('is-visible');
    formModalTab.remove();
    formLogin.remove();
    formSignup.remove();
    $('#cd-userinfo').removeClass('is-selected');
    $('#cd-create-post').addClass('is-selected');

  }

  //REMOVE THIS - it's just to show error messages 
  // formLogin.find('input[type="submit"]').on('click', function(event){
  //   event.preventDefault();
  //   formLogin.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
  // });
  // formSignup.find('input[type="submit"]').on('click', function(event){
  //   event.preventDefault();
  //   formSignup.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
  // });


  //IE9 placeholder fallback
  //credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
  if(!Modernizr.input.placeholder){
    $('[placeholder]').focus(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
        }
    }).blur(function() {
      var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
        input.val(input.attr('placeholder'));
        }
    }).blur();
    $('[placeholder]').parents('form').submit(function() {
        $(this).find('[placeholder]').each(function() {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
          input.val('');
        }
        })
    });
  }
 
});
$("ul#buttons > li").on('click', function(event) {
        event.stopPropagation();
        event.preventDefault();
  console.log($(this).attr('class'));
});

//credits http://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
$.fn.putCursorAtEnd = function() {
  return this.each(function() {
      // If this function exists...
      if (this.setSelectionRange) {
          // ... then use it (Doesn't work in IE)
          // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
          var len = $(this).val().length * 2;
          this.focus();
          this.setSelectionRange(len, len);
      } else {
        // ... otherwise replace the contents with itself
        // (Doesn't work in Google Chrome)
          $(this).val($(this).val());
      }
  });
};



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

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode == 'auth/weak-password') {
    alert('The password is too weak.');
  } else {
    alert(errorMessage);
  }
  console.log(error);
}); 
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    var user = firebase.auth().currentUser;
    console.log(user);
    console.log(user.uid);
    writeUserData(user.uid, username, email);
    var formModal = $('.cd-user-modal')
    formModal.removeClass('is-visible');
  } else {
    console.log("NOT LOGGED IN");
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

function login_func(){
  var email = $("#signin-email").val();
  var password = $("#signin-password").val();
  // console.log(email+password);


  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
  // Handle Errors here.
  console.log(error);
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === 'auth/wrong-password') {
    alert('Wrong password.');
  } else {
    alert(errorMessage);
  }

});
// console.log("login");

};
function avatar_uploader(avatar){
  // var file = $(".avatar_upl");
  console.log("avatar_upload_func");
  file = avatar[0];
  // console.log(file);
  // $("#cd-logo a img").value = file;
  var user = firebase.auth().currentUser;
  console.log(user);
  var uid = firebase.auth().currentUser.uid;
  // console.log(uid);
  var metadata = {
  contentType: 'image/jpeg'
};
  var uploadTask = storageRef.child('images/' + uid + "/"+ file.name).put(file, metadata);

  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  function(snapshot) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;

    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
  }
}, function() {
  // Upload completed successfully, now we can get the download URL
  var uploadedURL = uploadTask.snapshot.downloadURL;
  $("#cd-logo a img").attr({src: uploadedURL
  });
  return firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
  var user = snapshot.val();
  console.log(user);
  firebase.database().ref('users/' + uid).set({
    username: user.username,
    email: user.email,
    userId: user.userId,
    dateReg: user.dateReg,
    city: user.city,
    profile_picture : uploadedURL
  });
});
  
});
};
function save_changes(){
  var uid = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
  var user = snapshot.val();
  console.log(user);

  user.username = $("#modal-username").val();
  user.city = $("#modal-city").val();
  firebase.database().ref('users/' + uid).set({
    username: user.username,
    email: user.email,
    userId: user.userId,
    dateReg: user.dateReg,
    profile_picture : user.profile_picture,
    city: user.city
  });
  window.location.reload();
});
}

function write_post_to_server(){
  Date.prototype.getMonthName = function() {
    var month = ["January", "February", "March", "April",
      "May", "June", "July", "August", "September",
      "October", "November", "December"
    ];
    return month[this.getMonth()];
  }
  var uid = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
  var user = snapshot.val();

  console.log(user);
  var today = new Date();
  var date = today.getDate() + " " + today.getMonthName() + " " + today.getFullYear();
  console.log(date);
  var minutes = today.getMinutes();
  if(minutes.length == 1){
    minutes = "0" + minutes; 
  }
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  var post_theme = $('#modal-post-theme').val();
  var post_text = $('#modal-post-text').val();
  // console.log(time + "Date - " + day + month + year);
  console.log(post_theme);
  console.log(post_text);
var newPostKey = firebase.database().ref().child('posts').push().key;

  firebase.database().ref('posts/' + newPostKey).set({
    post_theme: post_theme,
    post_text: post_text,
    autor_info:{
      username: user.username,
      user_avatar: user.profile_picture,
      userid: uid
    },
    date: {
      time: time,
      date: date
    }
  });
  firebase.database().ref('userposts/' + uid).push({
    postKey: newPostKey
  });
  firebase.database().ref('postkeys/' + newPostKey).set({
    true: true
  })
  });
}

$(".avatar_upl").change(function () {
      stack_log.push(this.files[0]);
});
$(".avatar_to_server").on('click', function(event) {
  event.preventDefault();
  avatar_uploader(stack_log);
});

$("#save_changes").on('click', function(event) {
  event.preventDefault();
  save_changes();
  // window.location.reload();
});
$(".cd-signout").on('click', function(event) {
  event.preventDefault();
  firebase.auth().signOut().then(function() {
  console.log("Sign-out successful");
  $("#cd-logo a img").attr({src: ""
  }).css("visibility", "hidden");
  $(".user_nickname").css("visibility", "hidden");
  window.location.reload();
}, function(error) {
  // An error happened.
});
});
