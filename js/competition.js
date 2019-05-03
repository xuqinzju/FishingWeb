var mainApp = {};
var database;
var key;
var content;
var today = new Date();


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

    function logOut() {
        firebase.auth().signOut().then(function () {
            console.log("User sign out!");
        }, function (error) {
            console.log("User sign out error!");
        })
    }
    mainApp.logOut = logOut;

    database = firebase.database();
    var ref = database.ref('Competitions');
    console.log("Access the Competition database!");
    ref.on("value", gotData, errData);

    key = getQueryString("id");
    content = getQueryString("content");

    function gotData(data) {
        // console.log(data.val());
        var address = 'Competition.html?' + 'id=' + key;
        var competitions = data.val();
        var attendants = competitions[key].attendants;
        var description = competitions[key].cDescription;
        var status = competitions[key].cStatus;
        var name = competitions[key].cname;
        var date = competitions[key].date;
        var result = competitions[key].results;
        var reward = competitions[key].reward;
        var startT = competitions[key].startTime;
        var stopT = competitions[key].stopTime;
        var winner = competitions[key].winner;
        //console.log(description+' '+ date+' '+startT +' '+ stopT);
        var title = document.getElementById('title');
        var head = document.createElement('h1');
        var ul = document.getElementById('content');
        title.appendChild(head);
        //TODO: make current content tab "active"
        
        switch (content) {
            case 'detail':
                //TODO: add an if-else function for upcoming competition
                //result and winner information shouldn't be shown
                head.innerHTML = "Competition Detail";

                var compName = document.createElement('li');
                compName.className = "list-group-item";
                compName.innerHTML = 'Competition Name: ' + name;
                ul.appendChild(compName);

                var compDcp = document.createElement('li');
                compDcp.className = "list-group-item";
                compDcp.innerHTML = 'Description: ' + description;
                ul.appendChild(compDcp);

                var compDate = document.createElement('li');
                compDate.className = "list-group-item";
                compDate.innerHTML = 'Time: ' + date;
                ul.appendChild(compDate);

                var compT1 = document.createElement('li');
                compT1.className = "list-group-item"
                compT1.innerHTML = 'Start Time: ' + startT;
                ul.appendChild(compT1);

                var compT2 = document.createElement('li');
                compT2.className = "list-group-item";
                compT2.innerHTML = 'Stop Time: ' + stopT;
                ul.appendChild(compT2);

                var compReward = document.createElement('li');
                compReward.className = "list-group-item";
                compReward.innerHTML = 'Reward Price: ' + reward;
                ul.appendChild(compReward);

                var compWinner = document.createElement('li');
                compWinner.className = "list-group-item";
                compWinner.innerHTML = 'Winner: ' + winner;
                ul.appendChild(compWinner);

                var compResult = document.createElement('li');
                compResult.className = "list-group-item";
                compResult.innerHTML = 'Result: ' + result;
                ul.appendChild(compResult);
                break;

            case 'attendance':
                head.innerHTML = "Competition Attendance";
                var refUser = firebase.database().ref("Users");
                console.log("Access the user database");
                refUser.once("value").then(function (snapshot) {
                    for (var i = 0; i < attendants.length; i++) {
                        var uid = attendants[i];
                        console.log(uid);
                        var name = snapshot.child(uid).child('displayName').val();
                        console.log(name);

                        var li = document.createElement('li');
                        li.className = "list-group-item"
                        li.innerHTML = (i + 1) + '. ' + name;
                        ul.appendChild(li);
                    }
                })
                break;

            case 'post':
                //TODO: add if-else function
                //posts is not available for upcoming comeptition
                head.innerHTML = "Competition Posts";
                var storageRef = firebase.storage().ref('Images/Competitions');
                console.log("Access the Storage");
                // var compStorage = storageRef.child(key);
                // console.log("Access the Comptition's directory");
                // console.log(compStorage);
                // for(var i=0; i<attendants.length;i++){
                //     console.log(compStorage.child(attendants[i]).child(''));
                // }

                break;
        }


        //set button
        var detailBtn = document.getElementById('detail');
        var attBtn = document.getElementById('attendance');
        var postBtn = document.getElementById('post');
        var mapBtn = document.getElementById('map');

        detailBtn.onclick = function () {
            //console.log('detail');
            //this.className
            window.location.replace(address += "&content=detail")
        }

        attBtn.onclick = function () {
            //console.log('attendance');
            window.location.replace(address += "&content=attendance")
        }

        postBtn.onclick = function () {
            //console.log('post');

            window.location.replace(address += "&content=post")
        }

        mapBtn.onclick = function () {
            //console.log('map');
            window.location.assign('Map.html?id=' + key);
        }
    }

    function errData(err) {
        console.log('Error!');
        console.log(err);
    }

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    //TODO: function, judge whether it's a upcoming competition
    function upcomingComp(date1, date2) {
        return false
    }


})()