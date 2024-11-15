// Firebase Authentication and Firestore references
const auth = firebase.auth();
const db = firebase.firestore();

// Register a new user
function registerUser() {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            document.getElementById("authStatus").innerText = `Registered successfully with UID: ${user.uid}`;
            console.log("User registered:", user);
        })
        .catch((error) => {
            console.error("Error during registration:", error);
            document.getElementById("authStatus").innerText = `Registration error: ${error.message}`;
        });
}

// Login an existing user
function loginUser() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            document.getElementById("authStatus").innerText = `Logged in successfully with UID: ${user.uid}`;
            console.log("User logged in:", user);
        })
        .catch((error) => {
            console.error("Error during login:", error);
            document.getElementById("authStatus").innerText = `Login error: ${error.message}`;
        });
}

// Upload video metadata only (no actual video upload)
function uploadVideo() {
    const file = document.getElementById("videoFile").files[0];
    if (!file) {
        document.getElementById("uploadStatus").innerText = "Please select a video file.";
        return;
    }

    // Get file details and metadata
    const userId = firebase.auth().currentUser.uid;
    const metadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        userId: userId,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Save metadata to Firestore
    db.collection("videos").add(metadata)
        .then(() => {
            document.getElementById("uploadStatus").innerText = "Video metadata saved successfully!";
            console.log("Video metadata saved:", metadata);
            loadVideos(); // Refresh the video feed after uploading
        })
        .catch((error) => {
            console.error("Error saving metadata to Firestore:", error);
            document.getElementById("uploadStatus").innerText = `Error saving metadata: ${error.message}`;
        });
}

// Load video metadata from Firestore
function loadVideos() {
    const videoFeed = document.getElementById("videoFeed");
    videoFeed.innerHTML = "<p>Loading videos...</p>";

    // Fetch video metadata from Firestore
    db.collection("videos").orderBy("timestamp", "desc").get()
        .then((querySnapshot) => {
            videoFeed.innerHTML = ""; // Clear loading message
            querySnapshot.forEach((doc) => {
                const video = doc.data();
                const videoElement = document.createElement("div");
                videoElement.className = "video-item";
                videoElement.innerHTML = `
                    <h3>${video.name}</h3>
                    <p>Size: ${(video.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p>Type: ${video.type}</p>
                    <p>Uploaded by: ${video.userId}</p>
                    <p>Uploaded on: ${video.timestamp ? video.timestamp.toDate().toLocaleString() : "N/A"}</p>
                `;
                videoFeed.appendChild(videoElement);
            });
        })
        .catch((error) => {
            console.error("Error loading videos:", error);
            videoFeed.innerHTML = `<p>Error loading videos: ${error.message}</p>`;
        });
}

// Load videos when the page loads
document.addEventListener("DOMContentLoaded", loadVideos);
