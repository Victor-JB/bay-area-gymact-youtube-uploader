import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Load environment variables
if (typeof process !== "undefined") {
  require("dotenv").config();
}

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
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
    await loadGooglePicker();

    const oauthToken = gapi.auth.getToken().access_token;

    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.FOLDERS)
      .setOAuthToken(oauthToken)
      .setDeveloperKey(process.env.REACT_APP_GOOGLE_API_KEY) // Set your API key
      .setCallback(async (data) => {
        if (data.action === google.picker.Action.PICKED) {
          const folderId = data.docs[0].id;
          console.log("Selected Folder ID:", folderId);

          // Fetch files in the selected folder
          fetchDriveFiles(folderId, oauthToken);
        }
      })
      .build();

    picker.setVisible(true);
  } catch (error) {
    console.error("Error loading Google Picker:", error);
  }
};

// Function to fetch files from a selected Google Drive folder
const fetchDriveFiles = async (folderId, accessToken) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    console.log("Files in selected folder:", data.files);
  } catch (error) {
    console.error("Error fetching files:", error);
  }
};
