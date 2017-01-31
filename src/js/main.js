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
var stack_log = [];
var uid = "";
var counter = 0;
var token = [];
Date.prototype.getMonthName = function() {
    var month = ["January", "February", "March", "April",
      "May", "June", "July", "August", "September",
      "October", "November", "December"
    ];
    return month[this.getMonth()];
  }
  // Initialize Firebase

function save_edited_comment() {
  var comment = $('#modal-comment').val();
  var keys = $(".comment-edit").attr('class').split(" ");
  var key1 = keys[2];
  var key2 = keys[1];
  firebase.database().ref('/comments/' + key1 + "/" + key2).once('value').then(function(snapshot) {
    var data = snapshot.val();

    var postData = {
      authorID: data.authorID,
      comment_text: comment,
      date: data.date,
      username: data.username
    };
    updates = {};
    updates['/comments/' + key1 + "/" + key2] = postData;
    return firebase.database().ref().update(updates);
    window.location.reload();
  });
}

function edit_comment_post(key1, key2) {
  $('.cd-user-modal').addClass('is-visible');
  $('.cd-switcher').remove();
  $('#cd-login').remove();
  $('#cd-signup').remove();
  $('#cd-userinfo').removeClass('is-selected');
  $('#cd-create-post').removeClass('is-selected');
  $('#cd-comment-edit').addClass('is-selected');
  return firebase.database().ref('/comments/' + key1 + "/" + key2).once('value').then(function(snapshot) {
    var data = snapshot.val();
    $("#modal-comment").val(data.comment_text);
    $(".comment-edit").addClass(key2).addClass(key1);
  });
}

$(".post_comments").on('click', 'img.edit_comment', function(event) {
  event.preventDefault();
  key1 = $(".active").attr('class').split(" ")[0];
  key2 = $(this).attr('class').split(" ")[1];
  edit_comment_post(key1, key2);
});

$(".buttons").on('click', 'li', function(event) {
  event.preventDefault();
  $(".active").removeClass('active');
  var key = $(this).attr('class').split(" ")[0];
  $(this).addClass('active');
  post_load(key);
});

$(".post_comments").on('click', 'img.delete_comment', function(event) {
  event.preventDefault();
  var key1 = $(".active").attr('class').split(" ")[0];
  var key2 = ($(this)).attr('class').split(" ")[1];
  delete_comment_from_post(key1, key2);
});

function edit_post() {
  var active_post = $(".active").attr('class').split(" ")[0];
  $('.cd-user-modal').addClass('is-visible');
  $('.cd-switcher').remove();
  $('#cd-login').remove();
  $('#cd-signup').remove();
  $('#cd-userinfo').removeClass('is-selected');
  $('#cd-comment-edit').removeClass('is-selected');
  $('#cd-create-post').addClass('is-selected');
  $('.new-post').text("Edit post");
  firebase.database().ref('/posts/' + active_post).once('value').then(function(snapshot) {
    data = snapshot.val();
    $('#modal-post-theme').val(data.post_theme);
    $('#modal-post-text').text(data.post_text);
    $('#add_post').css("display", "none");
    $('#edit_post').css("display", "block");
  });
};

function save_edited_post() {
  var active_post = $(".active").attr('class').split(" ")[0];
  firebase.database().ref('/posts/' + active_post).once('value').then(function(snapshot) {
    data = snapshot.val();
    var new_post_theme = $('#modal-post-theme').val();
    var new_post_text = $('#modal-post-text').text();
    firebase.database().ref('posts/' + active_post).set({
      autor_info: {
        userid: data.autor_info.userid,
        username: data.autor_info.username
      },
      date: {
        date: data.date.date,
        time: data.date.time
      },
      post_text: new_post_text,
      post_theme: new_post_theme
    });
  });
};

function delete_comment_from_post(key1, key2) {
  var ansver = confirm("Delete this comment?");
  if (ansver === true) {
    firebase.database().ref("/comments/" + key1 + "/" + key2).remove();
  } else {
    return;
  }
}

function delete_post() {
  var ansver = confirm("Delete this post?");
  if (ansver === true) {
    var key = $(".active").attr('class').split(" ")[0];
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref("/comments/" + key).remove();
    firebase.database().ref("/postkeys/" + key).remove();
    firebase.database().ref("/posts/" + key).remove();
    firebase.database().ref("/userposts/" + uid + "/" + key).remove();
    $('.post_wrapper').css("display", "none");
    $('.comments').css("display", "none");
  } else {
    return;
  }
}

function get_uid() {
  return firebase.auth().currentUser.uid;
};

function set_user_avatar(uid, place) {
  $(place).attr({
    src: "/src/img/loading.gif"
  });
  storageRef.child('images/' + uid + "/avatar.jpg").getDownloadURL().then(function(url) {
    $(place).attr({
      src: url
    }).css("visibility", "visible");
  });
};

function set_author_name(uid, place) {
  firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
    var user = snapshot.val();
    $(place).text(user.username);
  });
};

function userinfo_load() {
  var user = firebase.auth().currentUser;
  var formModal = $('.cd-user-modal');
  formModal.removeClass('is-visible');
  var uid = get_uid();
  return firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
    var username = snapshot.val().username;
    $(".main-nav ul li").css("display", "inline-block");
    $(".user_nickname").text(username);
    place1 = "#cd-logo a img";
    place2 = ".avatar a img";
    set_user_avatar(uid, place1);
    set_user_avatar(uid, place2);
    $(".user_nickname").css("visibility", "visible");
    $(".cd-signin, .cd-signup").css("display", "none");
    $(".cd-signout, .cd-create-post").css("display", "block");
  });
};
function add_post_to_list(key){
  firebase.database().ref('/posts/' + key).once('value').then(function(snapshot) {
        var button = $("<li></li>").text(snapshot.val().post_theme).addClass(snapshot.key);
        $('#buttons').append(button);
      });
}
function posts_load() {
  return firebase.database().ref('/postkeys').on('value', function(snapshot) {
    var data = snapshot.val();
    var mass = Object.keys(data);
    $("#buttons").empty();
    for (var i = 0; i <= mass.length - 1; i++) {
      var key = mass[i];
      add_post_to_list(key);
    }
  });
};

function post_load(key) {
  firebase.database().ref('/posts/' + key).once('value').then(function(snapshot) {
    var data = snapshot.val();
    $('.comments, .post_wrapper').css("display", "block");
    var uid = data.autor_info.userid;
    var place = ".author_avatar a img";
    set_user_avatar(uid, place);
    set_author_name(uid, '.author_name')
    $('.post_title').text(data.post_theme);
    $('.post_date').text(data.date.date + " " + data.date.time);
    $('.post_text').text(data.post_text);
  });
  comments_load(key);
};

function comments_load(key) {
  return firebase.database().ref('/comments/' + key).on('value', function(snapshot) {
    $(".post_comments").empty();
    $("#comment_input").val("");
    var data = snapshot.val();
    if (data !== null) {
      var mass = Object.keys(data);
      for (var i = 0; i <= mass.length - 1; i++) {
        var key2 = mass[i];
        var key = $('.active').attr('class').split(" ")[0];
        var path = '/comments/' + key + "/" + key2;
        comment_load(path);
      }

    } else {
      return;
    }
  });
}

function comment_load(path) {

  firebase.database().ref(path).once('value').then(function(snapshot) {
    var data = snapshot.val();
    key = snapshot.key;
    var html1 = "<div class=\"post_comment_wrapper " + key + "\"</div>";
    var html2 = "<div class=\"comment_author_avatar " + key + "\"><a href=\"#0\"><img src=\"/src/img/loading.gif\"></a></div>";
    var html3 = "<div class=\"userinfo_comment_wrapper " + key + "\"</div>"
    var html4 = "<h2 class=\"comment_author " + key + "\"></h2>";
    var html5 = "<p class=\"comment_text " + key + "\"></p>";
    var html6 = "<p class=\"comment_date " + key + "\"></p>";
    var images = "<img class=\"edit_comment " + key + "\" src=\"/src/img/pencil.png\" />" + "<img class=\"delete_comment " + snapshot.key + "\" src=\"/src/img/cross.png\" />"
    $('.post_comments').append(html1);
    post_comment_wrapper = ".post_comment_wrapper." + key;
    $(post_comment_wrapper).append(html2, html3, images);
    var comment_author_avatar = '.comment_author_avatar.' + key + " " + "a img";
    var comment_author_name = '.comment_author.' + key;
    var uid = data.authorID;
    set_user_avatar(uid, comment_author_avatar);
    set_author_name(uid, comment_author_name);
    var userinfo_comment_wrapper = '.userinfo_comment_wrapper.' + key;
    $(userinfo_comment_wrapper).append(html3, html4, html5, html6)
    var comment_text = ".comment_text." + key;
    $(comment_text).text(data.comment_text);
    var comment_date = ".comment_date." + key;
    $(comment_date).text(data.date.date + " " + data.date.time);
  });
}


$(document).ready(function() {
  $(".delete_post").on('click', delete_post);
  $(".edit_post").on('click', edit_post);
  $('#edit_comment').on('click', save_edited_comment);
  $('#edit_post').on('click', save_edited_post);


  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      userinfo_load();
      posts_load();

    } else {
      $(".main-nav ul li").css("display", "inline-block");
      $(".cd-signout, .cd-create-post").css("display", "none");
      $(".cd-signin, .cd-signup").css("display", "block");
    }
  });
});
$(document).ready(function($) {
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

  mainNav.on('click', function(event) {
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
  formModal.on('click', function(event) {
    if ($(event.target).is(formModal) || $(event.target).is('.cd-close-form')) {
      formModal.removeClass('is-visible');
    }
  });
  //close modal when clicking the esc keyboard button
  $(document).keyup(function(event) {
    if (event.which == '27') {
      formModal.removeClass('is-visible');
    }
  });

  //switch from a tab to another
  formModalTab.on('click', function(event) {
    event.preventDefault();
    ($(event.target).is(tabLogin)) ? login_selected(): signup_selected();
  });

  //hide or show password
  $('.hide-password').on('click', function() {
    var togglePass = $(this),
      passwordField = togglePass.prev('input');

    ('password' == passwordField.attr('type')) ? passwordField.attr('type', 'text'): passwordField.attr('type', 'password');
    ('Hide' == togglePass.text()) ? togglePass.text('Show'): togglePass.text('Hide');
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

  $(".add_comment").click(add_comment_to_post);


  function login_selected() {
    mainNav.children('ul').removeClass('is-visible');
    formModal.addClass('is-visible');
    formLogin.addClass('is-selected');
    formSignup.removeClass('is-selected');
    formForgotPassword.removeClass('is-selected');
    tabLogin.addClass('selected');
    tabSignup.removeClass('selected');
  }

  function signup_selected() {
    mainNav.children('ul').removeClass('is-visible');
    formModal.addClass('is-visible');
    formLogin.removeClass('is-selected');
    formSignup.addClass('is-selected');
    formForgotPassword.removeClass('is-selected');
    tabLogin.removeClass('selected');
    tabSignup.addClass('selected');
  }

  function userinfo_selected() {
    formModal.addClass('is-visible');
    formModalTab.remove();
    formLogin.remove();
    formSignup.remove();
    $('#cd-userinfo').addClass('is-selected');
    $('#cd-comment-edit').removeClass('is-selected');
    $('#cd-create-post').removeClass('is-selected');

    var uid = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
      var user = snapshot.val();
      $("#modal-username").val(user.username);
      $("#modal-city").val(user.city);
    });
  }

  function add_post_selected() {
    formModal.addClass('is-visible');
    formModalTab.remove();
    formLogin.remove();
    formSignup.remove();
    $('#modal-post-theme').val("");
    $('#modal-post-text').text("");
    $('#cd-userinfo').removeClass('is-selected');
    $('#cd-comment-edit').removeClass('is-selected');
    $('#cd-create-post').addClass('is-selected');
    $('.new-post').text("Create a new post");
    $('#add_post').css("display", "block");
    $('#edit_post').css("display", "none");

  }


});

function register() {
  var email = $("#signup-email").val();
  var password = $("#signup-password").val();
  var username = $("#signup-username").val();

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
      writeUserData(user.uid, username, email);
      var formModal = $('.cd-user-modal')
      formModal.removeClass('is-visible');
    } else {
      console.log("NOT LOGGED IN");
    }
  });

};

function writeUserData(userId, name, email) {



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
    },
    city: "Kiev"
  });
}

function login_func() {
  var email = $("#signin-email").val();
  var password = $("#signin-password").val();


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

};

function avatar_uploader(avatar) {
  file = avatar[0];
  var user = firebase.auth().currentUser;
  var uid = firebase.auth().currentUser.uid;
  var metadata = {
    contentType: 'image/jpeg'
  };
  var uploadTask = storageRef.child('images/' + uid + "/" + "avatar.jpg").put(file, metadata);

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
    },
    function(error) {
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
    },
    function() {
      // Upload completed successfully, now we can get the download URL
      var uploadedURL = uploadTask.snapshot.downloadURL;
      $("#cd-logo a img, .avatar").attr({
        src: uploadedURL
      });
      var user_profile_pic = 'images/' + uid + "/" + "avatar.jpg"
      return firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
        var user = snapshot.val();
        firebase.database().ref('users/' + uid).set({
          username: user.username,
          email: user.email,
          userId: user.userId,
          dateReg: user.dateReg,
          city: user.city,
          profile_picture: user_profile_pic
        });
      });

    });
};

function save_changes() {
  var uid = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
    var user = snapshot.val();

    user.username = $("#modal-username").val();
    user.city = $("#modal-city").val();
    firebase.database().ref('users/' + uid).set({
      username: user.username,
      email: user.email,
      userId: user.userId,
      dateReg: user.dateReg,
      profile_picture: user.profile_picture,
      city: user.city
    });
    window.location.reload();
  });
}

function write_post_to_server() {

  var uid = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
    var user = snapshot.val();
    var today = new Date();
    var date = today.getDate() + " " + today.getMonthName() + " " + today.getFullYear();
    var minutes = today.getMinutes();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    var post_theme = $('#modal-post-theme').val();
    var post_text = $('#modal-post-text').val();
    var newPostKey = firebase.database().ref().child('posts').push().key;

    firebase.database().ref('posts/' + newPostKey).set({
      post_theme: post_theme,
      post_text: post_text,
      autor_info: {
        username: user.username,
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

function add_comment_to_post() {

  var today = new Date();
  var date = today.getDate() + " " + today.getMonthName() + " " + today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var comment = $('#comment_input').val();
  $('#comment_input').val("");
  var key = $(".active").attr('class').split(" ")[0];
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var user = snapshot.val()
    firebase.database().ref('comments/' + key).push({
      authorID: userId,
      username: user.username,
      date: {
        time: time,
        date: date
      },
      comment_text: comment
    });
  });
}
$(".avatar_upl").change(function() {
  stack_log.push(this.files[0]);
});
$(".avatar_to_server").on('click', function(event) {
  event.preventDefault();
  avatar_uploader(stack_log);
});

$("#save_changes").on('click', function(event) {
  event.preventDefault();
  save_changes();
});
$(".cd-signout").on('click', function(event) {
  event.preventDefault();
  firebase.auth().signOut().then(function() {
    console.log("Sign-out successful");
    $("#cd-logo a img").attr({
      src: ""
    }).css("visibility", "hidden");
    $(".user_nickname").css("visibility", "hidden");
    window.location.reload();
  }, function(error) {
    // An error happened.
  });
});