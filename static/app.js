import { signInWithGoogle, openGoogleDrivePicker } from "./firebase.js"; // Correct path

// Ensure script runs only after DOM loads
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signInButton").addEventListener("click", async () => {
        console.log("Sign-in button clicked");
        await signInWithGoogle();
    });

    document.getElementById("pickFolderButton").addEventListener("click", async () => {
        console.log("Pick Folder button clicked");
        await openGoogleDrivePicker();
    });
});
