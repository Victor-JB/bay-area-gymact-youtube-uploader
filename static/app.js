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

const uploadToYouTube = async (driveFileId, fileName, accessToken) => {
  try {
    // Step 1: Get Google Drive file as a blob
    const driveResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const fileBlob = await driveResponse.blob();

    // Step 2: Upload to YouTube
    const metadata = {
      snippet: {
        title: fileName,
        description: "Uploaded via Google Drive to YouTube",
        categoryId: "22", // "People & Blogs" category
      },
      status: {
        privacyStatus: "public", // Options: public, unlisted, private
      },
    };

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    formData.append("video", fileBlob);

    const youtubeResponse = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      }
    );

    const youtubeData = await youtubeResponse.json();
    console.log("Uploaded to YouTube:", youtubeData);
  } catch (error) {
    console.error("Error uploading video to YouTube:", error);
  }
};
