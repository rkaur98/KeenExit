var stage;


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log(user.uid);
        
        if (user != null) {
            firedata.ref('users/' + user.uid).once('value', function (snapshot) {

                var path = snapshot.val().ImageUrl;
                document.getElementById('levelpro').innerHTML = '<img src="' + path + '" />';

                stage = snapshot.val().Stage;
                console.log(Number(stage));
                
                for (var i = 1; i < 5; i++) {
                    if (i <= stage) {
                        $("#"+i).addClass('active');
                    }
                    else {
                        
                    }   
                }
                
                for (var i = 1; i <= stage; i++) {
                    jQuery("#" + i).addClass("active");
                }

                $(".active").on('click', function () {
                    var id = $(this).attr('id');
                    var p = '';
                    var player = document.getElementById('players');
                    var buttons = document.getElementById('buttons');
                    
                    $("#levelaccess").removeClass('hide');

                    document.getElementById('levelname').innerHTML = '<p>Level ' + id + '</p>';
                    buttons.innerHTML = buttons.innerHTML + '<a href="level' + id + '.html" class="grnbtn">Play</a>';

                    let scorearray = [];
                    let user1array = [];
                    let imgarray = [];

                    firedata.ref('users').once('value', function (snapshot) {
                        var level1;
                        p += '<table>';

                        snapshot.forEach(function (childSnapshot) {

                            if (id == 1) {
                                level1 = childSnapshot.val().Level1.Time;
                            }
                            else if (id == 2) {
                                level1 = childSnapshot.val().Level2.Time;
                            }
                            else if (id == 3) {
                                level1 = childSnapshot.val().Level3.Time;
                            }
                            else {
                                level1 = childSnapshot.val().Level4.Time;
                            }
                            scorearray.push(level1);

                        });
                        console.log(scorearray);
                        findsmallest3();

                        function findsmallest3() {
                            scorearray.sort(function (a, b) {
                                if (a > b) { return 1; }
                                else if (a == b) { return 0; }
                                else { return -1; }
                            });
                        }
                        console.log(scorearray);
                        snapshot.forEach(function (childSnapshot) {
                            var level;
                            if (id == 1) {
                                level = childSnapshot.val().Level1.Time;
                            }
                            else if (id == 2) {
                                level = childSnapshot.val().Level2.Time;
                            }
                            else if (id == 3) {
                                level = childSnapshot.val().Level3.Time;
                            }
                            else {
                                level = childSnapshot.val().Level4.Time;
                            }

                            for (var i = 0; i <= 2; i++) {
                                console.log(scorearray[i]);
                                if (level == scorearray[i]) {
                                    user1array[i] = childSnapshot.val().Username;
                                    imgarray[i] = childSnapshot.val().ImageUrl;
                                }
                            }
                            
                        });
                        console.log(user1array);
                        for (var j = 0; j <= 2; j++) {
                            console.log(user1array[j]);
                            p += '<tr><td class="user"><img class="thumb" src="' + imgarray[j] + '"><p>' + user1array[j] + '</p></td><td><p>' + scorearray[j] + ' sec</p></td></tr>';
                        }

                        p += '</table>';
                        player.innerHTML = player.innerHTML + p;
                        
                    });
                    
                    
                });

            });
        }
        
    } else {
        // No user is signed in.
        // document.getElementById("message").innerHTML = "";
    }
});
