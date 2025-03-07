import { ObjectId } from "mongodb";

function checkId(id, varName) {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== "string") throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
}

function checkString(strVal, varName) {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (!isNaN(strVal))
    throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
  return strVal;
}

function checkStringArray(arr, varName) {
  //We will allow an empty array for this,
  //if it's not empty, we will make sure all tags are strings
  if (!arr || !Array.isArray(arr))
    throw `You must provide an array of ${varName}`;
  for (let i in arr) {
    if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
      throw `One or more elements in ${varName} array is not a string or is an empty string`;
    }
    arr[i] = arr[i].trim();
  }

  return arr;
}

function validateUsername(username) {
  if (
    !username ||
    typeof username !== "string" ||
    username.trim().length < 5 ||
    username.trim().length > 10 ||
    /\d/.test(username.trim())
  ) {
    throw new Error(
      "Username must be 5-10 characters long and cannot contain numbers."
    );
  }
  return username.toLowerCase().trim();
}

function validatePassword(password) {
  if (typeof password !== "string") {
    throw new Error("Password must be a string.");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must include at least one uppercase letter.");
  }
  if (!/\d/.test(password)) {
    throw new Error("Password must include at least one number.");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new Error("Password must include at least one special character.");
  }
  return password;
}

function validateField(field, minLength, maxLength, regex, errorMessage) {
  if (
    !field ||
    typeof field !== "string" ||
    field.trim().length < minLength ||
    field.trim().length > maxLength ||
    (regex && !regex.test(field.trim()))
  ) {
    throw new Error(errorMessage);
  }
  return field.trim();
}

function validateEmail(email) {
  if (!email || typeof email != "string") throw "Email must be a string";
  email = email.trim();
  if (email.length === 0) throw "Email should not be empty";
  email = email.toLowerCase();
  console.log(email)
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
    throw new Error("Invalid email");
  return email;
}

function validateName(name) {
  if (
    !name ||
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 25 ||
    /\d/.test(name.trim())
  ) {
    throw "Error: firstName or lastName must be 2-25 characters long and cannot contain numbers.";
  }
  return name.trim();
}

function validateEvent(event) {
  if (event.length < 2 || event.length > 25) {
    throw 'Error: the length of event cannot be less than 2 characters or over 25.'
  }
  return event;
}

function validateDescription(description) {
  if (description.length < 2 || description.length > 250) {
    throw 'Error: the description cannot be less than 2 characters or over 250.'
  }
  return description;
}

function validateLocation(location) {
  if (location.length < 2 || location.length > 25) {
    throw 'Error: the location cannot be less than 2 or over 25 characters.'
  }
  return location;
}

export {
  checkId,
  checkString,
  checkStringArray,
  validateUsername,
  validatePassword,
  validateField,
  validateEmail,
  validateName,
  validateEvent,
  validateDescription,
  validateLocation,
};
