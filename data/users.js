import {bookmarks, comments, users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb'
import * as validation from '../validation.js';
import bcrypt from 'bcryptjs';


//TODO: Add object id stuff
export const registerUser = async (
    firstName,
    lastName,
    username,
    email,
    password,
  ) => {
    let userCollection = undefined;
    try{
      userCollection = await users();
      // Check if a user exists with the same username or email
      const existingUser = await userCollection.findOne({
        $or: [{ username: username }, { email: email }]
      });      
      
      if (existingUser) {
        console.log('existing user')
        throw new Error('There is already an existing user with that username or email.');
      }

      firstName = validation.validateName(firstName);
      lastName = validation.validateName(lastName);
      email = validation.validateEmail(email);
      username = validation.validateUsername(username);
      password = validation.validatePassword(password);
    } catch(e){
      throw new Error(`Error during user registeration: ${e.message}`);
    }
    let bookmarks = [];
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insertResult = await userCollection.insertOne({
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: hashedPassword,
        bookmarks: bookmarks,
    });

    if (insertResult.insertedCount === 0) {
        throw new Error('User registration failed');
    }
    return { signupCompleted: true };
  };


  
  export const loginUser = async (username, password) => {
    let user = undefined
    try{
      username = validation.validateUsername(username);
      password = validation.validatePassword(password);
  
      const userCollection = await users();

      user = await userCollection.findOne({username: username});
      if(!user){
        throw new Error('User not found.');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
      throw new Error('Either the username or password is invalid')
      }
      return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email : user.email,
        username: user.username,
        bookmarks: user.bookmarks,
        comments: user.comments,
      };
  
    }catch(e){
      throw new Error(e)
    }
};

export const getUserById = async (id) => {
  let user = undefined;
  try {
    id = validation.checkId(id);

    const userCollection = await users();
    user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new Error('User not found.');
    }
    return {
      userID: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      bookmarks: bookmarks,
    }
  } catch (e) {
    throw new Error(e)
  }
};

const exportedMethods = {
  registerUser,
  loginUser,
  getUserById,
};

export default exportedMethods;
