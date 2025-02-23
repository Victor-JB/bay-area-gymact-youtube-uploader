import { signInWithGoogle, openGoogleDrivePicker } from "../src/firebase.js";

// Attach event listeners to buttons
document.getElementById("signInButton").addEventListener("click", async () => {
    await signInWithGoogle();
});

document.getElementById("pickFolderButton").addEventListener("click", async () => {
    await openGoogleDrivePicker();
});
