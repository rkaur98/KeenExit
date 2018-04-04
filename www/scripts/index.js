// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

jQuery(document).ready(function ($) {

    $("#btnlogin").click(function (event) {
        event.preventDefault();

        login();
    });

    $('#txtpassword').keypress(function (e) {
        if (e.which == 13) {
            $('#btnlogin').click();
        }
    });

    $("#btnsignup").click(function (event) {
        event.preventDefault();

        signup();
    });

    $('#pass2').keypress(function (e) {
        if (e.which == 13) {
            $('#btnsignup').click();
        }
    });

});

var firedata = firebase.database();

function login() {

    var auth = firebase.auth();

    //get elements

    const txtEmail = document.getElementById('txtemail');
    const txtPassword = document.getElementById('txtpassword');
    
    const email = txtEmail.value;
    const pass = txtPassword.value;

    //sign in
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        if (error) {
            document.getElementById('message').innerHTML = errorMessage;
        }

    });

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log(user);
            window.location = "home.html";
        }
        else {
            // No user is signed in.
            // document.getElementById("message").innerHTML = "Not a Member. <br/>Create an account to log in."
        }
    });


}

function signup() {

    var auth = firebase.auth();

    //get elements

    const txtemail = document.getElementById('txtemail');
    const pass1 = document.getElementById('pass1');
    const pass2 = document.getElementById('pass2');
    const username = document.getElementById('username').value;

    const email = txtemail.value;
    const p1 = pass1.value;
    const p2 = pass2.value;

    //sign up
    if (p1 == p2) {
        const promise = auth.createUserWithEmailAndPassword(email, p1);
        promise.catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            if (error) {
                document.getElementById('message').innerHTML = errorMessage;
            }
        });

    }
    else {
        document.getElementById('message').innerHTML = "Password does not match in both fields. Re-enter passwords.";
    }

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log(user.uid);

            if (user != null) {
                firedata.ref('users/' + user.uid).set({
                    Username: username,
                    Stage: '1',
                    ImageUrl: "https://firebasestorage.googleapis.com/v0/b/keenexit-b0c70.appspot.com/o/char1.png?alt=media&token=de6fb20f-a359-471c-a660-f6e42a6cf3e5"
                });
                firedata.ref('users/' + user.uid+'/Level1').set({
                    Time: 15,
                    Status: 'active'
                });
                firedata.ref('users/' + user.uid + '/Level2').set({
                    Time: 15,
                    Status: 'not active'
                });
                firedata.ref('users/' + user.uid + '/Level3').set({
                    Time: 15,
                    Status: 'not active'
                });
                firedata.ref('users/' + user.uid + '/Level4').set({
                    Time: 15,
                    Status: 'not active'
                });
            }

            window.location = "home.html";

        } else {
            // No user is signed in.
            // document.getElementById("message").innerHTML = "";
        }
    });


}

function logout() {


    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
    }, function (error) {
        console.error('Sign Out Error', error);
    });


    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.

        } else {
            // No user is signed in.
            window.location = "login.html";
            // document.getElementById("message").innerHTML = "";
        }
    });

}

function profile() {
    var firedata = firebase.database(); /* global firebase*/

    read();

    function read() {

        var username = document.getElementById("username");
        
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                
                if (user != null) {
                    firedata.ref('users/' + user.uid).once('value', function (snapshot) {
                        
                        username.innerHTML = snapshot.val().Username;
                        
                        path = snapshot.val().ImageUrl;
                        document.getElementById('profile').innerHTML = '<img src="' + path + '" />';

                    });
                    leaderboard();

                }

            } else {
                // No user is signed in.
                document.getElementById("message").innerHTML = "";
            }
        });

    }
}

function profileImage() {

    var firedata = firebase.database(); /* global firebase*/
    var path;

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            firedata.ref('users/' + user.uid).once('value', function (snapshot) {

                path = snapshot.val().ImageUrl;
                document.getElementById('profile').innerHTML = '<img src="' + path + '" />';

                var ch = document.getElementById("choice");
                var images = ch.getElementsByTagName("img");

                for (var i = 0; i < images.length; i++) {
                    if (images[i].src == path) {
                        $(images[i]).addClass("choosen");
                    }
                }
                
            });

            $(".choice div img").on('click', function () {
                $(".choice div img").removeClass("choosen");

                $(this).addClass("choosen");
                var src = $(this).attr('src');
                firedata.ref('users/' + user.uid + '/ImageUrl').set(src);

                profileImage();
            })

            
        } else {
            // No user is signed in.
            // document.getElementById("message").innerHTML = "";
        }
    });


}

function leaderboard() {

    var firedata = firebase.database(); /* global firebase*/
    
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            let score1array = [];
            let score2array = [];
            let score3array = [];
            let score4array = [];
            let user1array, user2array, user3array, user4array;
            let img1, img2, img3, img4;
            firedata.ref('users').once('value', function (snapshot) {
                
                snapshot.forEach(function (childSnapshot) {

                    
                    var level1 = childSnapshot.val().Level1.Time;
                    var level2 = childSnapshot.val().Level2.Time;
                    var level3 = childSnapshot.val().Level3.Time;
                    var level4 = childSnapshot.val().Level4.Time;
                    
                    score1array.push(level1);
                    score2array.push(level2);
                    score3array.push(level3);
                    score4array.push(level4);

                });
                
                findsmallest3();

                function findsmallest3() {
                    score1array.sort(function (a, b) {
                        if (a > b) { return 1; }
                        else if (a == b) { return 0; }
                        else { return -1; }
                    });
                    score2array.sort(function (a, b) {
                        if (a > b) { return 1; }
                        else if (a == b) { return 0; }
                        else { return -1; }
                    });
                    score3array.sort(function (a, b) {
                        if (a > b) { return 1; }
                        else if (a == b) { return 0; }
                        else { return -1; }
                    });
                    score4array.sort(function (a, b) {
                        if (a > b) { return 1; }
                        else if (a == b) { return 0; }
                        else { return -1; }
                    });
                }
                
                snapshot.forEach(function (childSnapshot) {
                    var level1 = childSnapshot.val().Level1.Time;
                    var level2 = childSnapshot.val().Level2.Time;
                    var level3 = childSnapshot.val().Level3.Time;
                    var level4 = childSnapshot.val().Level4.Time;

                    if (level1 == score1array[0]) {
                        user1array = childSnapshot.val().Username;
                        img1 = childSnapshot.val().ImageUrl;
                    }
                    if (level2 == score2array[0]) {
                        user2array = childSnapshot.val().Username;
                        img2 = childSnapshot.val().ImageUrl;
                    }
                    if (level3 == score3array[0]) {
                        user3array = childSnapshot.val().Username;
                        img3 = childSnapshot.val().ImageUrl;
                    }
                    if (level4 == score4array[0]) {
                        user4array = childSnapshot.val().Username;
                        img4 = childSnapshot.val().ImageUrl;
                    }
                    
                });
                console.log(img1);

                $("#l1 #user").html('<img class="thumb" src="'+img1+'"><p>'+user1array+'</p>');
                $("#l1 #time").html('<p>'+score1array[0]+'sec</p>');

                $("#l2 #user").html('<img class="thumb" src="' + img2 + '"><p>' + user2array + '</p>');
                $("#l2 #time").html('<p>' + score2array[0] + 'sec</p>');

                $("#l3 #user").html('<img class="thumb" src="' + img3 + '"><p>' + user3array + '</p>');
                $("#l3 #time").html('<p>' + score3array[0] + 'sec</p>');

                $("#l4 #user").html('<img class="thumb" src="' + img4 + '"><p>' + user4array + '</p>');
                $("#l4 #time").html('<p>' + score4array[0] + 'sec</p>');
                
            });

        } else {
            // No user is signed in.
            // document.getElementById("message").innerHTML = "";
        }
    });
    
}

function home() {
    var firedata = firebase.database(); /* global firebase*/

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            
            if (user != null) {
                firedata.ref('users/' + user.uid).once('value', function (snapshot) {
                    
                    path = snapshot.val().ImageUrl;
                    document.getElementById('profile').innerHTML = '<img src="' + path + '" />';

                });
                
            }

        } else {
            // No user is signed in.
            document.getElementById("message").innerHTML = "";
        }
    });
}