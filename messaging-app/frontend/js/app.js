import * as errControl from "/./errControl.js";
import * as apiManager from "/./apiManager.js";

document.addEventListener("DOMContentLoaded", init);

//
function manageErrors(error){
    const errorContainer = document.querySelector("#error");
    if (error){

    }
}

// 
function init(){
    let login = new Promise((resolve, reject) => {
        
    });
    const username = document.querySelector("#username");
    const pwd = document.querySelector("#pwd");
    try{
        errControl.validateLogin(username.value, pwd.value)
        if(apiManager.userExists(username.value, pwd.value)){

        }
        else{
            manageErrors("Nombre de usuario o contraseña incorrectos.")
        }
    }
    catch(error){
        manageErrors(error);
    }
}