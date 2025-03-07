//Client-side validation

let registerForm = document.getElementById('signup-form');
let loginForm = document.getElementById('signin-form');
let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let email = document.getElementById('email');
let username = document.getElementById('username');
let password = document.getElementById('password');
let createEventForm = document.getElementById('create-event-form');
let eventName = document.getElementById('eventName');
let eventDescription = document.getElementById('eventDescription');
let date = document.getElementById('date');
let eventLocation = document.getElementById('eventLocation');
let category = document.getElementById('category');

if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let errorMessages = [];
        console.log(password.value);

        try {

            if (!firstName.value) {
                errorMessages.push('First name is missing!');
            }
            if (!lastName.value) {
                errorMessages.push('Last name is missing!');
            }  
            if (!email.value) {
                errorMessages.push('Email is missing!');
            }    
            if (!username.value) {
                errorMessages.push('Username is missing!');
            }
            if (!password.value) {
                errorMessages.push('First name is missing!');
            }
            if (!confirmPassword.value) {
                errorMessages.push('First name is missing!');
            }

            firstName.value = firstName.value.trim();
            lastName.value = lastName.value.trim();
            username.value = username.value.trim();
            email.value = email.value.trim();
            password.value = password.value.trim();
            confirmPassword.value = confirmPassword.value.trim();

            if (firstName.value.length < 2 || firstName.value.length > 25 || /\d/.test(firstName.value)) {
                errorMessages.push('FirstName should be 2-25 characters long or contain numbers!');
            }
            if (lastName.value.length < 2 || lastName.value.length > 25 || /\d/.test(lastName.value)) {
                errorMessages.push('lastName should be 2-25 characters long or contain numbers!');
            }
            if (! /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
                errorMessages.push('email should be valid!');
            }
            if (username.value.length < 5 || username.value.length > 10 || /\d/.test(username.value)) {
                errorMessages.push('Username must be 5-10 characters long and cannot contain numbers!');
            }
            if (password.value.length < 8 || 
                !/[A-Z]/.test(password.value) || !/\d/.test(password.value) || !/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) {
                    errorMessages.push('Password must be at least 8 characters, include at least one uppercase letter, one number, and one special character!');
            }
            if (password.value !== confirmPassword.value) {
                errorMessages.push('Passwords do not match!');
            }

        } catch (error) {
            errorMessages.push(error.message);
        }

        if (errorMessages.length > 0) {
            let errorString = errorMessages.join('\n');
            alert(errorString);
        } else {
            registerForm.submit();
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let errorMessages = [];

        try {
            if (!username.value) {
                errorMessages.push('Username is missing!');
            }
            if (!password.value) {
                errorMessages.push('Password is missing!');
            }
    
            if (username.value.length < 5 || username.value.length > 10 || /\d/.test(username.value)) {
                errorMessages.push('Username must be 5-10 characters long and cannot contain numbers!');
            }
            if (password.value.length < 8 || 
                !/[A-Z]/.test(password.value) || !/\d/.test(password.value) || !/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) {
                    errorMessages.push('Password must be at least 8 characters, include at least one uppercase letter, one number, and one special character!');
            }
        } catch (error) {
            errorMessages.push(error.message);
        }

        if (errorMessages.length > 0) {
            let errorString = errorMessages.join('\n');
            alert(errorString);
        } else {
            loginForm.submit();
        }
    });
}

if (createEventForm) {
    createEventForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let errorMessages = [];

        try {
            if (!eventName.value) {
                errorMessages.push('The event name is missing!');
            }
            if (!eventDescription.value) {
                errorMessages.push('The event description is missing!');
            }

            if (!eventLocation.value) {
                errorMessages.push('The event location is missing!');
            }

            eventName.value = eventName.value.trim();
            eventDescription.value = eventDescription.value.trim();
            eventLocation.value = eventLocation.value.trim();

            if (eventName.value.length === 0) {
                errorMessages.push('The event name cannot be an empty string or is just spaces!');
            }
            if (!isNaN(eventName.value)) {
                errorMessages.push('The event name cannot contain only digits!');
            }
            if (eventName.value.length < 2 || eventName.value.length > 25) {
                errorMessages.push('The length of the event cannot be less than 2 characters or over 25!');
            }
            if (eventDescription.value.length === 0) {
                errorMessages.push('The event description cannot be an empty string or is just spaces!');
            }
            if (!isNaN(eventDescription.value)) {
                errorMessages.push('The event description cannot contain only digits!');
            }
            if (eventDescription.value.length < 2 || eventDescription.value.length > 250) {
                errorMessages.push('The event description cannot be less than 2 characters or over 250!');
            }
            if (eventLocation.value.length === 0) {
                errorMessages.push('The event location cannot be an empty string or is just spaces!');
            }
            if (!isNaN(eventLocation.value)) {
                errorMessages.push('The event location cannot contain only digits!');
            }
            if (eventLocation.value.length < 2 || eventLocation.value.length > 25) {
                errorMessages.push('The location cannot be less than 2 or over 25 characters!');
            }

        } catch (error) {
            errorMessages.push(error.message);
        }

        if (errorMessages.length > 0) {
            let errorString = errorMessages.join('\n');
            alert(errorString);
        } else {
            createEventForm.submit();
        }
    });
}