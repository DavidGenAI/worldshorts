// Function to test Firebase Authentication
function testFirebaseAuth() {
    firebase.auth().signInAnonymously()
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("Anonymous user signed in with UID:", user.uid);
        })
        .catch((error) => {
            console.error("Error during anonymous sign-in:", error);
        });
}

// Call the function to test Firebase Authentication
testFirebaseAuth();
