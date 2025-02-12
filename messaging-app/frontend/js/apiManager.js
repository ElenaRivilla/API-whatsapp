import {responseValid} from "./errControl.js"; // Import all functions from error control module

// Function to check if a user exists by sending a POST request with username and password
export function userExists(username, password) {
    const domain = "http://127.0.0.1:8000/login";
    /* const domain = "http://localhost:";
    const port = 8000;
    const endpoint = "/login";  */// API endpoint URL
    
    // Construct the URL with query parameters (if needed)
    /* const url = `${domain}${port}${endpoint}`; */
    const url = `${domain}`;

    // Perform the GET request using fetch
    return new Promise((resolve, reject) => {
        fetch(url, { 
            method: "POST", // Use POST method for sending data
            headers: {
                "Content-Type": "application/json", // Set content type to JSON
                "Accept": "application/json" // Accept JSON response
            },
            mode: 'cors',
            body: JSON.stringify({
                'USERNAME': username, // Include username in the request body
                'PASSWORD': password // Include password in the request body
            }) 
        }).then((response) => {
            // Validate the response using the error control module
            responseValid(response).then(() => {
               resolve(response.json()); // Resolve the promise with the JSON response
            }).catch((error) => {
                 reject(error); // Reject the promise if there's an error
            });
        }).catch((error) => {
            reject(error); // Reject the promise if there's an error with the fetch request
        });
    });
}

export function getUsersHome() {
    const domain = "http://127.0.0.1:8000/home";
    const url = `${domain}`;

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            mode: 'cors',
            credentials: "include"
        }).then((response) => {
            responseValid(response).then(() => {
                resolve(response.json());
            }).catch((error) => {
                reject(error);
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

export function getMessagesUser(user1, user2, loadSize) {
    const domain = `http://127.0.0.1:8000/getMessages/${loadSize}/${user1}/${user2}`;
    const url = `${domain}`;

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            mode: 'cors',
            credentials: 'include'
        }).then((response) => {
            responseValid(response).then(() => {
                resolve(response.json());
            }).catch((error) => {
                reject(error);
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

export function getContacts(user) {
    const domain = `http://127.0.0.1:8000/getFriends/${user}`;
    const url = `${domain}`;

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            mode: 'cors',
            credentials: "include"
        }).then((response) => {
            responseValid(response).then(() => {
                resolve(response.json());
            }).catch((error) => {
                reject(error);
            });
        }).catch((error) => {
            reject(error);
        });
    });
}


export function createGroup(user) {
    const domain = `http://127.0.0.1:8000/createGroup`;
    const url = `${domain}`;

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            mode: 'cors',
            credentials: "include"
        }).then((response) => {
            responseValid(response).then(() => {
                resolve(response.json());
            }).catch((error) => {
                reject(error);
            });
        }).catch((error) => {
            reject(error);
        });
    });
}