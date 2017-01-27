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
Date.prototype.getMonthName = function() {
    var month = ["January", "February", "March", "April",
      "May", "June", "July", "August", "September",
      "October", "November", "December"
    ];
    return month[this.getMonth()];
  }
  // Initialize Firebase
$(document).ready(function() {
  function save_edited_comment() {
    var comment = $('#modal-comment').val();
    var keys = $(".comment-edit").attr('class').split(" ");
    var key1 = keys[2];
    var key2 = keys[1];
    console.log("active comment key 2->" + key2 + " active post key1->" + key1);
    firebase.database().ref('/comments/' + key1 + "/" + key2).once('value').then(function(snapshot) {
      var data = snapshot.val();
      console.log(data);

      var postData = {
        authorID: data.authorID,
        comment_text: comment,
        date: data.date,
        user_avatar: data.user_avatar,
        username: data.username
      };
      updates = {};
      updates['/comments/' + key1 + "/" + key2] = postData;
      return firebase.database().ref().update(updates);
      window.location.reload();
    });
  }

  function edit_comment_post() {
    $('.cd-user-modal').addClass('is-visible');
    $('.cd-switcher').remove();
    $('#cd-login').remove();
    $('#cd-signup').remove();
    $('#cd-userinfo').removeClass('is-selected');
    $('#cd-create-post').removeClass('is-selected');
    $('#cd-comment-edit').addClass('is-selected');
    var key = $(this).attr('class').split(" ")[1];
    var key2 = $(".active").attr('class').split(" ")[0];
    return firebase.database().ref('/comments/' + key2 + "/" + key).once('value').then(function(snapshot) {
      var data = snapshot.val();
      $("#modal-comment").val(data.comment_text);
      $(".comment-edit").addClass(key).addClass(key2);
    });
  }

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
      console.log(data);
      console.log(new_post_theme);
      console.log(new_post_text);
      firebase.database().ref('posts/' + active_post).set({
        autor_info: {
          user_avatar: data.autor_info.user_avatar,
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

  function delete_comment_from_post() {
    var ansver = confirm("Delete this comment?");
    if (ansver === true) {
      var key = $(".active").attr('class').split(" ")[0];
      var key2 = ($(this)).attr('class').split(" ")[1];
      firebase.database().ref("/comments/" + key + "/" + key2).remove();
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
    } else {
      return;
    }
  }
  $(".delete_post").on('click', delete_post);
  $(".edit_post").on('click', edit_post);
  $('#edit_comment').on('click', save_edited_comment);
  $('#edit_post').on('click', save_edited_post);
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var user = firebase.auth().currentUser;
      var formModal = $('.cd-user-modal');
      formModal.removeClass('is-visible');
      var userId = firebase.auth().currentUser.uid;
      return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        var username = snapshot.val().username;
        $(".main-nav ul li").css("display", "inline-block");
        $(".user_nickname").text(username);
        var src_avatar = snapshot.val().profile_picture;
        $("#cd-logo a img, .avatar a img").attr({
          src: src_avatar
        }).css("visibility", "visible");
        $(".user_nickname").css("visibility", "visible");
        $(".cd-signin, .cd-signup").css("display", "none");
        $(".cd-signout, .cd-create-post").css("display", "block");
        return firebase.database().ref('/postkeys').on('value', function(snapshot) {
          var data = snapshot.val();
          var mass = Object.keys(data);
          $("#buttons").empty();

          for (var i = 0; i < mass.length; i++) {
            var key = mass[i];
            firebase.database().ref('/posts/' + key).once('value').then(function(snapshot) {
              var cls = "#buttons >li." + snapshot.key;
              var text = "<li class=" + "'" + snapshot.key + "'>" + snapshot.val().post_theme + "</li>";
              $('#buttons').append(text);
              $(cls).click(function() {
                $(".active").removeClass('active');
                var key = $(this).attr('class').split(" ")[0];
                $(this).addClass('active');
                firebase.database().ref('/posts/' + key).once('value').then(function(snapshot) {
                  var data = snapshot.val();
                  $('.comments, .post_wrapper').css("display", "block");
                  $('.author_avatar a img').attr({
                    src: data.autor_info.user_avatar
                  }).css("visibility", "visible");
                  $('.author_name').text(data.autor_info.username);
                  $('.post_title').text(data.post_theme);
                  $('.post_date').text(data.date.date + " " + data.date.time);
                  $('.post_text').text(data.post_text);


                });
                return firebase.database().ref('/comments/' + key).on('value', function(snapshot) {
                  $(".post_comments").empty();
                  var data = snapshot.val();
                  if (data !== null) {
                    var mass1 = Object.keys(data);
                    for (var i = 0; i < mass1.length; i++) {
                      var key2 = mass1[i];
                      var key = $('.active').attr('class').split(" ")[0];
                      var path = '/comments/' + key + "/" + key2;
                      firebase.database().ref(path).once('value').then(function(snapshot) {
                        var data1 = snapshot.val();
                        key = snapshot.key;
                        var html1 = "<div class=\"post_comment_wrapper " + key + "\"</div>";
                        var html2 = "<div class=\"comment_author_avatar " + key + "\"><a href=\"#0\"><img src=\"\"></a></div>";
                        var html3 = "<div class=\"userinfo_comment_wrapper " + key + "\"</div>"
                        var html4 = "<h2 class=\"comment_author " + key + "\"></h2>";
                        var html5 = "<p class=\"comment_text " + key + "\"></p>";
                        var html6 = "<p class=\"comment_date " + key + "\"></p>";
                        var images = "<img class=\"edit_comment " + key + "\" src=\"/src/img/pencil.png\" />" + "<img class=\"delete_comment " + snapshot.key + "\" src=\"/src/img/cross.png\" />"
                        var edit_comment = ".edit_comment." + key;
                        var delete_comment = ".delete_comment." + key;
                        $('.post_comments').append(html1);
                        post_comment_wrapper = ".post_comment_wrapper." + key;
                        $(post_comment_wrapper).append(html2, html3, images);
                        $(edit_comment).on('click', edit_comment_post);
                        $(delete_comment).on('click', delete_comment_from_post);
                        var comment_author_avatar = '.comment_author_avatar.' + key + " " + "a img";
                        $(comment_author_avatar).attr({
                          src: data1.user_avatar
                        }).css("visibility", "visible");
                        var userinfo_comment_wrapper = '.userinfo_comment_wrapper.' + key;
                        $(userinfo_comment_wrapper).append(html3, html4, html5, html6)
                        var comment_author = ".comment_author." + key;
                        $(comment_author).text(data1.username);
                        var comment_text = ".comment_text." + key;
                        $(comment_text).text(data1.comment_text);
                        var comment_date = ".comment_date." + key;
                        $(comment_date).text(data1.date.date + " " + data1.date.time);

                      });
                    }
                  } else {
                    return;
                  }
                });
              });
            });
          };

        });
      });


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
  //edit comment
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
      console.log(user);
      $("#modal-username").val(user.username);
      console.log(user.username);
      $("#modal-city").val(user.city);
      console.log(user.city);
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
  console.log("avatar_upload_func");
  file = avatar[0];
  var user = firebase.auth().currentUser;
  console.log(user);
  var uid = firebase.auth().currentUser.uid;
  var metadata = {
    contentType: 'image/jpeg'
  };
  var uploadTask = storageRef.child('images/' + uid + "/" + file.name).put(file, metadata);

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
      console.log(uploadedURL);
      $("#cd-logo a img, .avatar").attr({
        src: uploadedURL
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
          profile_picture: uploadedURL
        });
      });

    });
};

function save_changes() {
  var uid = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
    var user = snapshot.val();
    // console.log(user);

    user.username = $("#modal-username").val();
    user.city = $("#modal-city").val();
    console.log(user);
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

    console.log(user);
    var today = new Date();
    var date = today.getDate() + " " + today.getMonthName() + " " + today.getFullYear();
    console.log(date);
    var minutes = today.getMinutes();
    if (minutes.length == 1) {
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
      autor_info: {
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
      // console.log(userId);
      // console.log(user);
    firebase.database().ref('comments/' + key).push({
      authorID: userId,
      username: user.username,
      user_avatar: user.profile_picture,
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
  // window.location.reload();
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