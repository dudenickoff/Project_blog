var $ = require("jquery");
var ref = new Firebase("https://chat-dudnikov.firebaseio.com");
var users = new Firebase("https://chat-dudnikov.firebaseio.com/users");
var rooms = new Firebase("https://chat-dudnikov.firebaseio.com/rooms");
console.log("reg loaded")
//login as ADMIN or get authdata
var email = "s.dudnikovv@gmail.com";
var password = "649108SK";
var username = 0;



ref.authWithPassword({
        email,
        password
    },
    function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
            //GET USERDATA from authData

            var authData = ref.getAuth();
            var usersRef = ref.child("users/" + authData.uid);
            usersRef.once("value", function(snapshot) {
                var data = snapshot.val();
                var arr = $.map(data, function(el) {
                    return el
                });
                // var arr = $.map(arr[0], function(el) {
                //     return el
                // });
                console.log("this is a username ->" + arr[0] + " & this is a email->" + arr[1]);
                username = arr[0];
                email = arr[1];
                //SET USERDATA TO BLOCK
                $(".userInfo").append('<li><p>Username: ' + username + '</p></li>');
                $(".userInfo").append('<li><p>User email: ' + email + '</p></li>');
                return username, authData.uid;
            });
                rooms.orderByValue().once("value", function(snapshot) {
                    snapshot.forEach(function(data) {
                        console.log("The roomname is ->" + data.key());
                        $("#rooms").prepend('<li><button type="button" class="roomsDisplay btn btn-default btn-lg btn-block" id="' +
                            data.key() + '">' + data.key() + '</button></li>');
                    })
                });
            // });
            return username;
            //END OF FUNCTION

        }
    }, {
        remember: "sessionOnly"
    });
var authData = ref.getAuth();



function login() {
    var email = $("#email-l").val();
    var password = $("#password-l").val();

    ref.authWithPassword({
            email, password
        },
        function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);

            }
        }, {
            remember: "sessionOnly"
        })
};

function reg1() {
    var email = $("#email-r").val();
    var password = $("#password-r").val();
    var username = $("#username").val();
    ref.createUser({
        email, password
    }, function(error, userData) {
        if (error) {
            console.log("Error creating user:", error);
        } else {
            console.log("Successfully created user account with uid:", userData.uid);
            var usersRef = ref.child("users/" + userData.uid);
            usersRef.push(

                {
                    Username: username,
                    email: email,
                }

            );
        }
    });
};

function reg() {
    var email = $("#email-r").val();
    var password = $("#password-r").val();
    var username = $("#username").val();
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
                }

            );
        }
    });
};

//WATCHERS

$(document).ready(function() {
  $(document).on("click", ".roomsDisplay", function() {
    var disp = this.id;
    // drawRooms();
    // setTimeout(document.getElementById(this.id).style.color = 'deepskyblue', 100000);
    displayRoom(this.id, email);
    roomName = this.id;
    // $('#main').css( "zIndex", 1 );
    // console.log("DisplayRoom, zIndex change to - > 1")
    
    
  });
});

$(document).ready(function() {
    $(document).on("click", "#sendMsg", function() {
        var message = $("#messageInput").val();

        sendMsg(roomName, message);
    });
});
$(document).ready(function() {
    $(document).on("click", ".getAvatar", function() {
        getAvatar(email);
    });
});

// $(document).ready(function() {
//     $(document).on("click", ".createRoom", function() {
//         createRoom();
//     });
// });
$(".navbar-collapse").click("button", function() {
    $(".navbar-collapse").collapse('hide');
    // $('#main').css( "zIndex", 1 );
    // console.log("navbar-collapse, zIndex change to - > 1")
    // $(".main").css("background-color", "red");
});

// $(document).ready(function() {
  // $(document).on("click", "#menu", function() {
    // $(".main").css( "zIndex", 0 );
    // console.log("navbar, zIndex change to - > 0")
  // });
// });

// $(".navbar-collapse").click(".navbar-collapse", function(){
    // $(".main").css( "zIndex", 0 );
    // $(".main").css("background-color", "pink");
// });

// $(".navbar").click("button", function(){
    // $("main").css( "zIndex", 0);
    // $(".main").css("background-color", "green");
// });

$('#messageInput').keypress(function (e) {
                        if (e.keyCode == 13) {
                        message = $("#messageInput").val();
                        return roomName, message;
                        sendMsg(roomName, message);
                        }
                        });

//MODAL WATCHERS

// Get the modal


// Get the button that opens the modal
// btn = document.getElementById("btn_for_modal");
// console.log("btn_for_modal " + btn);
// Get the <span> element that closes the modal
// span = document.getElementsByClassName("close")[0];
// console.log("This is span " + span);
//When the user clicks the button, open the modal 
// $(document).ready(function() {
//     modal = document.getElementById('myModal');
//     $(document).on('click', '#btn_for_modal', function() {
//         modal.style.display = "block";
//     });
// });


// When the user clicks on <span> (x), close the modal
// $(document).ready(function() {
//     $(document).on('click', '#close_modal', function() {
//         modal.style.display = "none";
//     });
// });

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }
// $(document).ready(function() {
//     $(document).on('click', '#add_users', function() {
//         users.once("value", function(snapshot) {
//         var data = snapshot.val();
//         console.log(data);
//         snapshot.forEach(function(data) {
//         console.log(data.key());
//         var userRef = users.child("/" + data.key());
//         userRef.once("value", function(snapshot){
//             var data = snapshot.val();
//             console.log(data.Username);
//             $("#Users_to_add").prepend('<li><button type="button" class= "rooms1" id="' +
//             data.Username + '">' + data.Username + '</button></li>');
//         })
        
//     });
//     }); }
// ) 
// });


// function createRoom() {
//     var roomName = prompt("Enter the roomname");
//     var msg = prompt("Write the first message");
//     console.log(roomName);
//     console.log(msg);
//     if (roomName == ("" || null)) {
//         alert("You must enter the room name!")
//     } else if (msg == ("" || null)) {
//         alert("You must add the first message to room!")
//     } else {
//         roomRef = ref.child("rooms/" + roomName);
//         roomRef.push(

//             {
//                 uId: authData.uid,
//                 Username: username,
//                 msg: msg,
//             }

//         );
//     }
// };

function displayRoom(roomName, email) {
    $(".main").empty();
    console.log("This is email -> " + email);
    var email = $.md5(email);
    console.log("This is email -> " + email);
    var srcAvatar = ("https://www.gravatar.com/avatar/" + email + "?s=32");
    console.log(srcAvatar);
    roomRef = rooms.child("/" + roomName);
    $(".navbar-brand").text(roomName);
    $(".navbar-brand").css("color", "#00bfff")
    roomRef.on("value", function(snapshot) {
        $(".main").empty();
                var data = snapshot.val();
                // console.log(data);
                snapshot.forEach(function(data) {
                    // console.log(data.key());
                var eachRoom = roomRef.child("/" + data.key());

                // console.log(eachRoom.key());
                eachRoom.once("value", function(snapshot) {
                                        var data = snapshot.val();
                                        
                                        $(".main").append($("<img />").attr({ src: srcAvatar, alt: data.Username + " says"}));
                                        $(".main").append('<p><i><strong>' + data.Username + ' says:</strong> ' + data.msg + '</p>');
                                        $(document).scrollTop($(document).height());
                                    });
                        });
            });
styleRooms(roomName);
};

function sendMsg(roomName, message) {
if (message !== ""){
    var authData = ref.getAuth();
    var usersRef = ref.child("users/" + authData.uid);
    usersRef.once("value", function(snapshot) {
                var data = snapshot.val();
                return username = data.Username;
            });
// console.log("Send msg to room-> " + roomName + " msg-> " + message);
    roomRef = ref.child("rooms/" + roomName);
    roomRef.push(

        {
            uId: authData.uid,
            Username: username,
            msg: message,
        }

    );
    $('#messageInput').val('');
} else {
    console.log("You don`t type your message!");
};
};
function displayUsers() {
    // users = new Firebase("https://docs-examples.firebaseio.com/web/saving-data/fireblog/users");
    users.once("value", function(snapshot) {
        data = snapshot.val();
        var arr = $.map(data, function(el) {
            return el
        });
        console.log("arr default->");
        console.log(arr);
        console.log("This is users->")
        var countUser = arr.length;
        for (var i = 0; i < countUser; i++) {
            arr1 = arr[i];
            arr1 = $.map(arr, function(el) {
                return el;
            });

            for (var i = 0; i < arr1.length; i++) {
                arr21 = arr1[i];
                arr211 = $.map(arr21, function(el) {
                    return el;
                });
                console.log("Username->" + arr211[0]);
                console.log("email->" + arr211[1]);
            };
        };

    })
}

function displayRoomForCurrentUser (username){
    var roomPermisson = new Firebase("https://chat-dudnikov.firebaseio.com/RoomPermission");
    var username = "ADMIN";
    currentUser = roomPermisson.child(username);
    console.log("this is CURRENT: " + currentUser);

    currentUser.on("value", function(snapshot) {
        var data = snapshot.val();
        var arr = $.map(data, function(el) {
            return el
        });
        var JQA = $.makeArray(data);
        var JQA1 = $.map(JQA, function(el) {
            return el
        });

        console.log("this is data#1 ->" + JQA1[0]);

        console.log("this is data#2 ->" + JQA1[1]);
        console.log("this is data-> " + data);
        console.log("this is arr-> " + arr);
    });
};

    // on("value", function(snapshot) {
    //     var data = snapshot.val();
        
    //     var countMsg = arr.length;
    //     // $(".main").empty();
    //     for (var i = 0; i < countMsg; i++) {
    //         var arr = $.map(data, function(el) {
    //         return el
    //     });
    //         console.log("This is room " + i + ":" + " " + arr[i]);

function addUserToRoom(){
    var usernameToAdd = "ADMIN";
    var currentUserToAddRef = new Firebase("https://chat-dudnikov.firebaseio.com/UserPermissionForRoom/" + usernameToAdd);
    console.log("This is current directory -> " + currentUserToAddRef);
    var testRoom = "testroom4msg";
    var userAdded = "TESTUSERNAME";

    
    currentUserToAddRef.push(

                {
                    roomname: testRoom,
                    userWhoAdded: userAdded,
                }

            );
    currentUserToAddRef.push(

                {
                    roomname: testRoom,
                    userWhoAdded: userAdded,
                }

            );
};

// function showModal(username){
//     var dialog, form, 
//     roomName_Modal = $("roomName_Modal"),
//     typePermission_Modal = $("typePermission_Modal"), 
//     usersToAdd_Modal = $("usersToAdd_Modal"),
//     userWhoCreate = username;

//     dialog = $("#dialog-form").dialog({
//       autoOpen: false,
//       // height: 300,
//       // width: 350,
//       // modal: true,
//       // buttons: {
//       //   "Create an account": CreateRoom,
//       //   Cancel: function() {
//       //     dialog.dialog( "close" );
//       //   }
//       // },
//       // close: function() {
//       //   form[ 0 ].reset();
//       //   allFields.removeClass( "ui-state-error" );
//       // }
//     });
// };
function drawRooms(){
    $(".rooms").empty();
    rooms.orderByValue().once("value", function(snapshot) {
                    snapshot.forEach(function(data) {
                        console.log("The roomname is ->" + data.key());

                        $(".rooms").prepend('<li><button type="button" class="roomsDisplay btn btn-default btn-lg btn-block" id="' +
                            data.key() + '">' + data.key() + '</button></li>');
                        $(".rooms").append($("<li><button></button></li>"));
                        // $(".rooms").("<li><button type="button" id="data.key"></li>").addClass("roomsDispaly btn btn-default btn-lg btn-block");
                        // $("<li></li>")
                        $(".main").append($("<img />").attr({ src: srcAvatar, alt: data.Username + " says"}));
                    })
                });
};
// function styleRooms(roomName) {
//     rooms.orderByValue().once("value", function(snapshot) {
//         snapshot.forEach(function(data) {
//             nowRoom = data.key();
//             if(nowRoom !== roomName){
//                 $(nowRoom).css("color", "white");
//                 console.log("Try to change color of ->" + nowRoom);
//             } else {
//                 $(nowRoom).css("color", "deepskyblue");
//                 console.log("Try to change roomName color -> " + roomName);
//             }
//             console.log("The roomname is ->" + data.key());
//             $(data.key()).css("color", "white");
//             });
//     });
//     $(roomName).css("color", "white");
//     console.log("StyleRooms -> " + roomName);
// };



function styleRooms(roomName) {
    // console.log("Roomname to display -> " + roomName + ", lastRoomName -> " + lastRoomName)
    rooms.orderByValue().once("value", function(snapshot) {
        snapshot.forEach(function(data) {
            nowRoom = data.key();
            if(nowRoom == roomName){
                document.getElementById(nowRoom).style.color = "deepskyblue";
                // console.log("Try to change color of ->" + nowRoom);
            } else {
                document.getElementById(nowRoom).style.color = "#333";
                // console.log("Try to change roomName color -> " + roomName);
            }
            // console.log("The roomname is ->" + data.key());
            $(data.key()).css("color", "white");
            });
    });
    // console.log("StyleRooms -> " + roomName);
};

function CreateRoom(roomName_Modal, typePermission_Modal, usersToAdd_Modal, userWhoCreate){
var msg = userWhoCreate + " created room"
if (roomName_Modal == ("" || null)) {
        alert("You must enter the room name!")
    } else if (msg == ("" || null)) {
        alert("You must add the first message to room!")
    } else {
        roomRef = ref.child("rooms/" + roomName_Modal);
        roomRef.push(

            {
                uId: authData.uid,
                Username: username,
                msg: msg,
            }

        );
    }

}


function getAvatar(email, username){
    console.log("Username from getA -> " + username);
    var email = $.md5(email);
    console.log("This is email -> " + email);
    var srcAvatar = ("https://www.gravatar.com/avatar/" + email + "?s=32");
    console.log(srcAvatar);
    $(".modal-content").prepend($("<img />").attr({ src: srcAvatar, alt: username + " says"})
    );
    // $.("modal-content").prepend("<img src='https://www.gravatar.com/avatar'" + email + '.jpg'"");
// $.("modal-content").prepend("<img src="https://www.gravatar.com/avatar/ce5331746d7dc5584bef5d7a9c1deea4.jpg"></img>");
}