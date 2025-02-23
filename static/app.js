import { signInWithGoogle, openGoogleDrivePicker } from "./firebase.js"; // Correct path

// Attach event listeners to buttons
document.getElementById("signInButton").addEventListener("click", async () => {
    console.log("Sign-in button clicked");
    await signInWithGoogle();
});

document.getElementById("pickFolderButton").addEventListener("click", async () => {
    console.log("Pick Folder button clicked");
    await openGoogleDrivePicker();
});
