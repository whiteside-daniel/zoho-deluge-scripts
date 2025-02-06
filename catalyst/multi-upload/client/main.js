function showProfile() {
//The catalyst.auth.isUserAuthenticated() method allows only authenticated users, i.e., the users who are logged in, to access the pages
//You can load this method in the body of your page to allow only authenticated users to access a particular page
catalyst.auth.isUserAuthenticated().then(result => {
    //If the user is logged in, these contents of the page will be displayed to the user
    //console.log(result.content);
    document.body.style.visibility = "visible";
//    const first_name = "First Name: " + result.content.first_name;
//    document.getElementById("fname").innerHTML = first_name;
//    const last_name = "Last Name: " + result.content.last_name;
//    document.getElementById("lname").innerHTML = last_name;
    const mailid = "Email Address: " + result.content.email_id;
    document.getElementById("mailid").innerHTML = mailid;
    const tzone = "Time Zone: " + result.content.time_zone;
    document.getElementById("tzone").innerHTML = tzone;
    const created_time = " Joined On: " + result.content.created_time;
    document.getElementById("ctime").innerHTML = created_time;
    const orgID = "Org ID: " + result.content.org_id;
    document.getElementById("org-id").innerHTML = orgID;
}).catch(err => {
    //If the user is not logged in, this will be displayed to the user and they will be redirected to the login page
    document.body.style.visibility = "visible";
    document.body.innerHTML = 'You are not logged in. Please log in to continue. Redirecting you to the login page..';
    setTimeout(function () {
       window.location.href = "/__catalyst/auth/login";
    }, 5000);
});
 
}
function logout() {
//The signOut method is used to sign the user out of the application
const redirectURL = location.protocol +"//"+ location.hostname + "/__catalyst/auth/login";
catalyst.auth.signOut(redirectURL);
}
function getLogFile() {
    const apiUrl = '/server/bulk-upload/logFile';
    window.location.href = apiUrl;
}
function mouseWaiting() {
    document.body.style.cursor = 'wait';
    const submitButton = document.getElementById("submit-button");
    submitButton.style.visibility = 'hidden';
}