import {responseValid} from "./errControl.js"; // Import all functions from error control module

const domain = "http://127.0.0.1:8000/";
// Function to check if a user exists by sending a POST request with username and password
export function userExists(username, password) {
    const url = `${domain}login`;

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
    const url = `${domain}home`;

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
    const url = `${domain}getMessages/${loadSize}/${user1}/${user2}`;

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
    const url = `${domain}getFriends/${user}`;

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

export function createGroup(name, description, userList, admin) {
    const url = `${domain}createGroup`;

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            mode: 'cors',
            credentials: "include",
            body: JSON.stringify({
                'NAME': name, // Include name in the request body for the group
                'DESCRIPTION': description, // Include description in the request body for the group
                'USERS': userList, // Include users for the group
                'ADMIN': admin // Include admin for the group
            }) 
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

export function sendMessage(message){
    const url = `${domain}sendMessage`;

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            mode: 'cors',
            credentials: "include",
            body: JSON.stringify(message)
        }).then((response) => {
            responseValid(response).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

export function updateUserProfile(updateUser) {
    const url = `${domain}updateProfile`;

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            mode: 'cors',
            credentials: "include",
            body: JSON.stringify(updateUser)
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