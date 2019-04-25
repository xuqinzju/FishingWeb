var mainApp ={};

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
})()