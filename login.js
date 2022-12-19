function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

/*setFormMessage(loginForm, "success", "you're logged in!");*/

function setInputError(inputElement, message){
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent=message;
}

function clearInputError(inputElement){
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent="";
}

document.addEventListener('DOMContentLoaded', () =>{
    const loginForm = document.querySelector('#login');
    const createAccountForm = document.querySelector('#createAccount');
  
    document.querySelector('#linkCreateAccount').addEventListener('click', e=> {
        e.preventDefault();
        loginForm.classList.add('form--hidden');
        createAccountForm.classList.remove('form--hidden');
        
    });

    document.querySelector('#linkLogin').addEventListener('click', e=> {
        e.preventDefault();
        loginForm.classList.remove('form--hidden');
        createAccountForm.classList.add('form--hidden');
        
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        //perform AJAX/fetch login

        setFormMessage(loginForm, "error", "invalid username or password");
    });

    document.querySelectorAll(".form__input").forEach(inputElement =>{
        inputElement.addEventListener("blur", e => {
            if(e.target.id === "username" && e.target.value.length>0 && e.target.value.length <5){
                setInputError(inputElement, "username must be atleast 5 character in length")
            }
            else if(e.target.id === "password" && e.target.value.length>0 && e.target.value.length <5){
                setInputError(inputElement, "Password must be atleast 5 character in length")
            }
        });
        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });

    });

  
});