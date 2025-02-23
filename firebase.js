import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Load environment variables (for local development)
if (typeof process !== "undefined") {
  require("dotenv").config();
}

// Firebase configuration using environment variables
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
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
});

// Request Google Drive permissions
provider.addScope("https://www.googleapis.com/auth/drive.file");
provider.addScope("https://www.googleapis.com/auth/drive.metadata.readonly");

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User signed in:", user);

    // Store user data in Firestore
    await saveUserData(user);

    return user;
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

// Function to store user data in Firestore
const saveUserData = async (user, folderId = null) => {
  try {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: user.displayName,
      folderId: folderId || null
    });
    console.log("User data saved.");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

// Load Google Picker API
const loadGooglePicker = () => {
  return new Promise((resolve, reject) => {
    gapi.load("picker", { callback: resolve, onerror: reject });
  });
};

// Function to open the Google Drive Picker
const openGoogleDrivePicker = async () => {
  try {
    // Ensure gapi is loaded
    await loadGooglePicker();

    const oauthToken = gapi.auth.getToken().access_token;

    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.FOLDERS)
      .setOAuthToken(oauthToken)
      .setDeveloperKey(process.env.GOOGLE_API_KEY) // Ensure this is set in env variables
      .setCallback(async (data) => {
        if (data.action === google.picker.Action.PICKED) {
          const folderId = data.docs[0].id;
          console.log("Selected Folder ID:", folderId);

          const user = auth.currentUser;
          if (user) {
            await saveUserData(user, folderId);
          }
        }
      })
      .build();

    picker.setVisible(true);
  } catch (error) {
    console.error("Error loading Google Picker:", error);
  }
};

// Export functions
export { auth, signInWithGoogle, openGoogleDrivePicker };
