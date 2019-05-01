var mainApp ={};
var database;
var complist = document.getElementById('complist');

(function() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            uid = user.uid;
        }else{
            //redirect to login page
            uid = null;
            window.location.replace("login.html")
        }
    });

    function logOut(){
        firebase.auth().signOut().then(function() {
            console.log("User sign out!");
        }, function(error) {
            console.log("User sign out error!");
        })
    }
    mainApp.logOut = logOut;

    database =firebase.database();   
    var ref = database.ref('Competitions');
    console.log("Access the database!");
    ref.on("value",gotData, errData);

    function gotData(data){
        // console.log(data.val());
        var competitions = data.val();
        var keys = Object.keys(competitions);
        // console.log(keys);
        for (var i=0;i<keys.length;i++){
            var k = keys[i];
            var compName=competitions[k].cname;
            var compDate=competitions[k].date;
            console.log(compName,compDate);
            var li = document.createElement('li');
            // add id to li tag
            li.id=k;
            console.log(li);
            // add a button
            var btn = document.createElement('button');
            btn.textContent=k;
            btn.addEventListener('click',function(){
                alert("hello wrold");
            },false)

            var address = 'Competition.html?'+'id='+k+"&content=detail";
            // add a reference
            // li.innerHTML="<a href='Competition.html' target='_blank'>"
            //                         +compDate+'-'+compName+"</a>";          
            var link = document.createElement('a');
            link.href = address;
            link.innerHTML=compDate+'-'+compName;
            li.appendChild(link);      
            // li.appendChild(btn);       
            document.getElementById('complist').appendChild(li);
            
        }
    }
    
    function errData(err){
        console.log('Error!');
        console.log(err);
    }
    
    function showDetail(){
        console.log(this.html());
    }

})()

