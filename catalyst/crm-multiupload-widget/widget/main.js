// YOUR JAVASCRIPT CODE FOR INDEX.HTML GOES HERE

//TEST MODE CODE
localMode = false;

const modeDiv = document.getElementById('test-dev-mode');
let uploadUrl;
if(localMode) {
    uploadUrl = 'http://127.0.0.1:3001/server/bulk-upload/upload';
    modeDiv.innerHTML = 'Test Mode';
} else {
    uploadUrl = "https://bravosync-719523417.development.catalystserverless.com/server/bulk-upload/upload";
}
//PAGE CONTROL
document.body.style.visibility = "visible";
const submitButton = document.getElementById("submit-button");

let zohoUser = {};
ZOHO.embeddedApp.on("PageLoad", async function (data) {
    console.log("data from Client Script", data);
    zohoUser = data.zohoUser;
    console.log(`zohouser: ${zohoUser}`);
    // Populate the hidden email field
    const emailField = document.getElementById('zohoUser');
    if (emailField && zohoUser) {
        emailField.value = zohoUser;
    }
    else {
        emailField.value = 'unknown';
    }
});

document.getElementById('pacingPlan').addEventListener('change', function() {
    const uploadLabel = document.getElementById('form-upload-label');
    
    if (this.checked) {
        uploadLabel.textContent = 'Upload ZIP Files';
    } else {
        uploadLabel.textContent = 'Upload CSV Files';
    }
});
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent normal form submission
    //make mouse wait 
    document.body.style.cursor = 'wait';
    
    submitButton.style.visibility = 'hidden';
    
    const formData = new FormData(e.target);
    const statusDiv = document.getElementById('status');

    statusDiv.textContent = 'Uploading...';

    try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    const data = await response.json(); // Server needs to send JSON

    if (data.success) {
      statusDiv.textContent = 'Upload successful!';
        document.body.style.cursor = 'auto';
    } else {
      statusDiv.textContent = 'Error: ' + data.message;
        document.body.style.cursor = 'auto';
        submitButton.style.visibility = 'visible';
    }
    } catch (error) {
    statusDiv.textContent = 'Upload failed: ' + error.message;
        document.body.style.cursor = 'auto';
        submitButton.style.visibility = 'visible';
    }
});
// Initialize when the script loads
ZOHO.embeddedApp.init();