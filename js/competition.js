/*
 *@project: Fishing competition
 *@author: Qin Xu
 *@date: 6/9/2019
 *@description: js file for competition page
 */

//Initialize variable
var mainApp = {};
var database;
var key;
var content;
var arr = [];

// listening the user's login status
(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            uid = user.uid;
        } else {
            //redirect to login page
            uid = null;
            window.location.replace("login.html")
        }
    });

// logout function
    function logOut() {
        firebase.auth().signOut().then(function () {
            console.log("User sign out!");
        }, function (error) {
            console.log("User sign out error!");
        })
    }
    mainApp.logOut = logOut;

    //initialize the database
    database = firebase.database();
    var ref = database.ref('Competitions');
    console.log("Access the Competition database!");

    //obtain data stored in the database
    ref.on("value", gotData, errData);
    key = getQueryString("id");
    content = getQueryString("content");

    function gotData(data) {
        //remove the old contents
        var listings = document.getElementsByClassName('listing');
        for (var i = listings.length - 1; i >= 0; i--) {
            listings[i].remove();
            console.log(listings[i]);
        }

        //get data
        var address = 'Competition.html?' + 'id=' + key;
        var competitions = data.val();
        var attendants = arr.concat(competitions[key].attendants);
        var description = competitions[key].cDescription;
        var status = competitions[key].cStatus;
        var compname = competitions[key].cname;
        var date = competitions[key].date;
        var result = competitions[key].results;
        var reward = competitions[key].reward;
        var startT = competitions[key].startTime;
        var stopT = competitions[key].stopTime;
        var winner = competitions[key].winner;
        var typeNum = competitions[key].compType;
        var status = competitions[key].cStatus;
        
        //create elements
        var title = document.getElementById('title');
        var ul = document.getElementById('content');
        var head = document.getElementById('head');
        var table = document.getElementById('table');

        //match the page's content to the theme
        switch (content) {

            //"detail" page
            case 'detail':
            //get the users' information
            var refUser = firebase.database().ref("Users");
            console.log("Access the user database");
            refUser.once("value").then(function (snapshot) {
                var name = snapshot.child(winner).child('displayName').val();
                //modify the head of the page
                head.innerHTML = "Competition Detail";
                var tr = document.createElement('tr');
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row'>" + 'Competition Name' + "</th>" +
                    "<td>" + compname + "</td>";
                console.log(tr);
                table.appendChild(tr);
                var tr = document.createElement('tr'); 
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row'>" + 'Description' + "</th>" +
                    "<td>" + description + "</td>";
                console.log(tr);
                table.appendChild(tr);
                var tr = document.createElement('tr'); 
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row'>" + 'Time' + "</th>" +
                    "<td>" + date + "</td>";
                console.log(tr);
                table.appendChild(tr);
                var typeClass;
                
                //switch to the competition type
                switch (typeNum) {
                    case 0:
                        typeClass = 'By Single Fish Length';
                        break;
                    case 1:
                        typeClass = 'By Single Fish Width';
                        break;
                    case 2:
                        typeClass = 'By Single Fish Weight';
                        break;
                    case 3:
                        typeClass = 'By Total Fish Weight';
                        break;
                    case 4:
                        typeClass = 'By Fish Species';
                        break;
                    case 5:
                        typeClass = 'By Fish Quantity';
                        break;
                }
                var tr = document.createElement('tr'); 
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row'>" + 'Competition Type' + "</th>" +
                    "<td>" + typeClass + "</td>";
                console.log(tr);
                table.appendChild(tr);
                //create element for the start time
                var tr = document.createElement('tr'); 
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row' >" + 'Start Time' + "</th>" +
                    "<td>" + startT + "</td>";
                console.log(tr);
                table.appendChild(tr);
                //create element for the stop time
                var tr = document.createElement('tr'); 
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row'>" + 'Stop Time' + "</th>" +
                    "<td>" + stopT + "</td>";
                console.log(tr);
                table.appendChild(tr);
                //create element for the reward price
                var tr = document.createElement('tr'); 
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row'>" + 'Reward Price' + "</th>" +
                    "<td>" + reward + "</td>";
                console.log(tr);
                table.appendChild(tr);

                //if the competition is finished
                if (status == '3') {
                    var tr = document.createElement('tr'); 
                    //create element for the winner
                    tr.className = 'listing';
                    tr.innerHTML = "<th scope='row'>" + 'Winner' + "</th>" +
                        "<td>" + name + "</td>";
                    console.log(tr);
                    table.appendChild(tr);
                    //create element for the result
                    var tr = document.createElement('tr'); 
                    tr.className = 'listing';
                    tr.innerHTML = "<th scope='row'>" + 'Result' + "</th>" +
                        "<td>" + result + "</td>";
                    console.log(tr);
                    table.appendChild(tr);
                }
            })
                break;

            //"attendance" page
            case 'attendance':
                head.innerHTML = "Competition Attendance";
                var refUser = firebase.database().ref("Users");
                console.log("Access the user database");
                refUser.once("value").then(function (snapshot) {
                    if (attendants[0] == null) {
                        // no on registering reminding
                        var text = document.createElement('h2');
                        text.innerHTML = 'No one has registered yet.';
                        text.className = 'listing';
                        text.align = 'center';
                        text.style.font = "italic 30px arial,serif";
                        document.getElementById('container').appendChild(text);
                    } else {
                        //create the table
                        //add table head
                        var thead = document.createElement('thead');
                        thead.className = 'listing';
                        var tr = document.createElement('tr');
                        tr.innerHTML = "<th scope='col'>" + '#' + "</th>" +
                            "<th scope='col'>" + 'User Name' + "</th>";
                        thead.appendChild(tr);
                        document.getElementById('maintable').appendChild(thead);

                        //add row for the table
                        for (var i = 0; i < attendants.length; i++) {
                            var uid = attendants[i];
                            console.log(uid);
                            var name = snapshot.child(uid).
                                child('displayName').val();
                            //create element to display the users' information
                            var tr = document.createElement('tr'); 
                            tr.className = 'listing';
                            tr.id = i + uid;
                            tr.innerHTML = "<th scope='row'>" + (i + 1) + 
                                "</th>" + "<td>" + name + "</td>";
                            console.log(tr);
                            table.appendChild(tr);
                        }
                    }
                })
                break;

            //"post" page
            case 'post':
                console.log(status);
                head.innerHTML = "Competition Posts";

                //for upcoming competition, post page is not open
                if (status == '0') {
                    var sentence = document.createElement('h3');
                    sentence.innerHTML = "The game has not started yet."
                    var cont = document.getElementById('container');
                    cont.appendChild(sentence);
                } else {

                    //for competitions in other status
                    var storageRef = firebase.storage().
                        ref('Images/Competitions');
                    console.log("Access the Storage");
                }
                break;
        }


        //set button
        var detailBtn = document.getElementById('detail');
        var attBtn = document.getElementById('attendance');
        var postBtn = document.getElementById('post');
        var mapBtn = document.getElementById('map');

        //redirecting
        detailBtn.onclick = function () {
            window.location.replace(address += "&content=detail")
        }
        attBtn.onclick = function () {
            window.location.replace(address += "&content=attendance")
        }
        postBtn.onclick = function () {           
            if (status != '0') {
                window.location.assign('Post.html?id=' + key);
            } else {
                alert("The competition has not started yet!")
            }
        }
        mapBtn.onclick = function () {
            window.location.assign('Map.html?id=' + key);
        }
    }

    function errData(err) {
        console.log('Error!');
        console.log(err);
    }

    //split the string
    //used to get user id and theme of the page
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }


})()