/*
 *@project: Fishing competition
 *@author: Qin Xu
 *@date: 6/9/2019
 *@description: js file for main page
 */

//Initialize variable
var mainApp = {};
var database;
var complist = document.getElementById('complist');
var tablelist = document.getElementById('listtable');

//listing the users' status
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

//logout function
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
    console.log("Access the database!");

    //get the data
    ref.on("value", gotData, errData);
    function gotData(data) {
         //remove the old contents
        var listings = document.getElementsByClassName('listing');    
        for (var i = listings.length - 1; i >= 0; i--) {
            listings[i].remove();
            console.log(listings[i]);
        }

        //get the competition data
        var competitions = data.val();
        console.log(competitions);
        var dic = new Array();
        var keys = Object.keys(competitions);
        
        //store the timestamp and the competition key for further sorting
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var timekey = translateDate(competitions[k].date,competitions[k].startTime);
            console.log('timekey: '+timekey);
            dic[timekey*1000+i] = k;
        }

        //sort the array to list the competition by time
        var sortlist = Object.keys(dic).sort();
        console.log(sortlist);
        var i = 1;
        
        //create elements for the competition
        for (var key in sortlist) {
            var k = dic[sortlist[key]];
            var compName = competitions[k].cname;
            var compDate = competitions[k].date;
            var status = competitions[k].cStatus;
            var time = competitions[k].startTime;
            var statusN;
            var li = document.createElement('li');
            // add id to li tag
            li.id = k;       
            var address = 'Competition.html?' + 'id=' + k + "&content=detail";
            var link = document.createElement('a');
            link.href = address;
            link.target = "_blank";
            link.innerHTML = compName; 

            //get the competition status
            switch (status) {
                case '3':
                    statusN = 'Finished';
                    break;
                case '2':
                    statusN = 'Waiting for the result......';
                    break;
                case '1':
                    statusN = 'In progress';
                    break;
                case '0':
                    statusN = 'Upcoming'
                    break;
            }
            
            //create a new row for the competition
            var tr = document.createElement('tr');
            tr.id = i;
            var th = document.createElement('th');
            var td = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            td2.id = i + 'date';
            td3.id = i + 'status';
            td.appendChild(link);
            th.scope = 'row';
            th.innerHTML = i;
            td2.innerHTML = compDate;
            td3.innerHTML = statusN;
            translateDate(compDate,time);
            tr.appendChild(th);
            tr.appendChild(td2);
            tr.appendChild(td);
            tr.appendChild(td3);
            tr.className = 'listing';
            listtable.appendChild(tr);
            i++;
            console.log(tr);
        }
    }

    function errData(err) {
        console.log('Error!');
        console.log(err);
    }

    //translate the date like 06/10/2019 to 20191006
    //translate the time like 8:00 to 800
    //finally, return 20191006800
    function translateDate(date,time){
      var nums1 = date.split('/');
      var nums2 = time.split(':');
      var time_trans = new Array(2);   
      var date_trans = new Array(3);
      date_trans=nums1[2]+nums1[1]+nums1[0];
      time_trans = nums2[0]+nums2[1];
      console.log('date translated: '+ Number(date_trans+time_trans));
      return Number(date_trans+time_trans);  
    }


})()