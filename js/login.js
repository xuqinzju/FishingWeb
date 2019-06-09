/*
 *@project: Fishing competition
 *@author: Qin Xu
 *@date: 6/9/2019
 *@description: js file for login page
 */

// FirebaseUI config.
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    signInSuccessUrl: 'mainPage.html',
    signInOptions: [
        //use the email to login
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],

    tosUrl: 'mainPage.html',
    // Privacy policy url/callback.
    privacyPolicyUrl: function () {
        window.location.assign('mainPage.html');
    }
};
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);