// FirebaseUI config.
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    signInSuccessUrl: 'mainPage.html',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],

    /*
       tosUrl and privacyPolicyUrl accept either url string or a callback
       function.
       Terms of service url/callback.
     */

    tosUrl: 'mainPage.html',
    // Privacy policy url/callback.
    privacyPolicyUrl: function () {
        window.location.assign('mainPage.html');
    }
};
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);