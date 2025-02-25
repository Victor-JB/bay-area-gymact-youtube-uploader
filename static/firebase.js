import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Use environment variables from Flask
const firebaseConfig = {
  apiKey: window.env.FIREBASE_API_KEY,
  authDomain: window.env.FIREBASE_AUTH_DOMAIN,
  projectId: window.env.FIREBASE_PROJECT_ID,
  storageBucket: window.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: window.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: window.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Request Google Drive permissions
provider.addScope("https://www.googleapis.com/auth/drive.file");
provider.addScope("https://www.googleapis.com/auth/drive.metadata.readonly");

// Function to sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

// Function to load Google Picker
const loadGooglePicker = () => {
  return new Promise((resolve, reject) => {
    gapi.load("picker", { callback: resolve, onerror: reject });
  });
};

// Function to open Google Drive Picker
export const openGoogleDrivePicker = async () => {
  try {
    const oauthToken = gapi.auth.getToken().access_token;

    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.FOLDERS)
      .setOAuthToken(oauthToken)
      .setDeveloperKey(window.env.GOOGLE_API_KEY)
      .setCallback(async (data) => {
        if (data.action === google.picker.Action.PICKED) {
          const folderId = data.docs[0].id;
          console.log("Selected Folder ID:", folderId);

          // Fetch videos from folder
          fetchDriveVideos(folderId, oauthToken);
        }
      })
      .build();

    picker.setVisible(true);
  } catch (error) {
    console.error("Error opening Google Picker:", error);
  }
};

// Function to fetch files from a selected Google Drive folder
const fetchDriveVideos = async (folderId, accessToken) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents and mimeType='video/mp4'&fields=files(id,name,mimeType)`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = await response.json();
    console.log("Videos found:", data.files);

    // Upload each video to YouTube
    for (const video of data.files) {
      await uploadToYouTube(video.id, video.name, accessToken);
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
  }
};
