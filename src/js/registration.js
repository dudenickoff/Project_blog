var $ = require('jquery');
// var firebase = require('firebase');



// var auth = firebase.auth();
//     var storageRef = firebase.storage().ref();
//     function handleFileSelect(evt) {
//       evt.stopPropagation();
//       evt.preventDefault();
//       var file = evt.target.files[0];
//       var metadata = {
//         'contentType': file.type
//       };
//       // Push to child path.
//       // [START oncomplete]
//       storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
//         console.log('Uploaded', snapshot.totalBytes, 'bytes.');
//         console.log(snapshot.metadata);
//         var url = snapshot.metadata.downloadURLs[0];
//         console.log('File available at', url);
//         // [START_EXCLUDE]
//         document.getElementById('linkbox').innerHTML = '<a href="' +  url + '">Click For File</a>';
//         // [END_EXCLUDE]
//       }).catch(function(error) {
//         // [START onfailure]
//         console.error('Upload failed:', error);
//         // [END onfailure]
//       });
//       // [END oncomplete]
//     }

$("#buttons>li").on('click', function(event) {
    console.log(this);
  });