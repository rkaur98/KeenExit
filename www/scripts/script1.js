
var table = document.getElementById("table");
var y = "";

for (var i = 0; i < 8; i++) {
    y += "<tr>";
    for (var j = 0; j < 8; j++) {
        y += "<td id='" + i + j + "'></td>";
    }
    y += "</tr>";
}

table.innerHTML = y;

var bt = ['01', '02', '03', '04', '05', '06', '07', '15', '21', '22', '27', '31', '33', '34', '36', '44', '50', '51', '55', '56', '57', '62', '63', '71', '73', '74'];

for (var i = 0; i < bt.length; i++) {
    jQuery('#' + bt[i]).addClass('bt');
}

var br = ['01', '03', '07', '10', '11', '12', '13', '14', '15', '16', '17', '23', '25', '27', '30', '31', '31', '32', '34', '35', '36', '37', '41', '42', '43', '46', '47', '53', '54', '56', '57', '60', '65', '66', '67', '71', '72', '75', '77'];

for (var i = 0; i < br.length; i++) {
    jQuery('#' + br[i]).addClass('br');
}

var bl = ['00', '10', '20', '30', '40', '50', '60', '70'];

for (var i = 0; i < bl.length; i++) {
    jQuery('#' + bl[i]).addClass('bl');
}

var bb = ['70', '71', '72', '73', '74', '75', '76'];

for (var i = 0; i < bb.length; i++) {
    jQuery('#' + bb[i]).addClass('bb');
}


// $('.navigation').on('touchmove', function (e) {

//     var target = document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY);

// });

var firedata = firebase.database(); /* global firebase*/

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.

        if (user != null) {
            firedata.ref('users/' + user.uid).once('value', function (snapshot) {

                path = snapshot.val().ImageUrl;
                document.getElementById('enter').innerHTML = '<img src="' + path + '" />';

            });

        }

    } else {
        // No user is signed in.
        document.getElementById("message").innerHTML = "";
    }
});

var status;
let array_with_duplcates = [];
let userarray = [];
let level1sol = ['00', '10', '20', '21', '22', '32', '42', '52', '51', '61', '62', '63', '64', '65', '55', '56', '66', '76', '77'];

function start() {
    $('#00').on('mousemove', function (event) {

        var target = document.elementFromPoint(event.pageX, event.pageY);
        console.log(target.id);
        if (target == 'td') {
            array_with_duplcates.push(target.id);

            document.getElementById(target.id).style.background = "#63b571";

            conti();
        }


    });

    $('table td').on('touchmove', function (event) {

        var target = document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY);
        console.log(target.id);

        if (target.tagName == 'TD') {
            array_with_duplcates.push(target.id);

            document.getElementById(target.id).style.background = "#63b571";

            conti();
        }
        

    });
}

function conti() {
    $('td').on('mousemove', function (event) {

        var target = document.elementFromPoint(event.pageX, event.pageY);
        console.log(target.tagName);
        if (target.tagName == 'TD') {
            array_with_duplcates.push(target.id);

            document.getElementById(target.id).style.background = "#63b571";
            
        }

    });

    $('table td').on('touchmove', function (event) {

        var target = document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY);
        console.log(target.id);
        
        if (target.tagName == 'TD') {
            array_with_duplcates.push(target.id);

            document.getElementById(target.id).style.background = "#63b571";

        }
    });
}

$('table').on('mouseleave', function (event) {
    init();
});

$('table').on('touchend', function (event) {
    init();
});

function init() {
    function removeDuplicates(arr) {
        let unique_array = []
        for (let i = 0; i < arr.length; i++) {
            if (unique_array.indexOf(arr[i]) == -1) {
                unique_array.push(arr[i])
            }
        }
        return unique_array
    }

    userarray = removeDuplicates(array_with_duplcates);
    console.log(userarray);
    run();

    if (run()) {
        status = "complete";
        console.log("complete");
        myStopFunction();
        result(status);
    }
    else {
        console.log("not complete");
    }
}

function run() {
    var status;
    for (var i = 0, j = 0; i < userarray.length, j < level1sol.length; i++, j++) {
            if (userarray[i] === level1sol[j]) {
                continue
            }
            else {
                return false;
            }
    }
    return true;
}

var time = 30;
var myVar = setInterval(function () { myTimer() }, 1000);

function myTimer() {
    time--;
    if (time < 1) {
        myStopFunction();
        run();
        
        if (run()) {
            status = "complete";
            console.log("complete");
        }
        else {
            status = "not complete";
            console.log("not complete");
        }
        result(status);
    }
    var t = time;
    if (time < 10 && time >= 0) {
        t = '0' + time;
    }
    document.getElementById("timer").innerHTML = '<p>00:'+t+'</p>';
}

function myStopFunction() {
    clearInterval(myVar);
}


function result(status) {
    $("#result").removeClass("hide");
    var ttaken = document.getElementById("timetaken");
    var res = document.getElementById("res");
    var buttons = document.getElementById("buttons");
    var completeTime = 30 - time;

    ttaken.innerHTML = 'Time Taken: ' + completeTime;

        var firedata = firebase.database();
        
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {

                console.log(user.uid);

                if (user != null) {
                    firedata.ref('users/' + user.uid + '/Level1/Time').set(completeTime);
                    firedata.ref('users/' + user.uid + '/Stage').set('2');

                    firedata.ref('users/' + user.uid).once('value', function (snapshot) {

                        var path = snapshot.val().ImageUrl;
                        document.getElementById('levelpro').innerHTML = '<img src="' + path + '" />';
                    });

                    if (status == "complete") {
                        res.innerHTML = "<img src='images/Congratspic.png' />";
                        buttons.innerHTML = buttons.innerHTML + '<a href="level2.html" class="grnbtn">Next Level</a>';
                    }
                    else {
                        res.innerHTML = "<img src='images/tryagain.png' />";
                        buttons.innerHTML = buttons.innerHTML + '<a href="level1.html" class="grnbtn">Try Again</a>';
                    }
                }


            } else {
                // No user is signed in.
                // document.getElementById("message").innerHTML = "";
            }
        });
    
}
