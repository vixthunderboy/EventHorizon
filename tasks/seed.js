import { dbConnection, closeConnection } from "../config/mongoConnections.js";
import users from '../data/users.js';
import events from '../data/events.js';

const db = await dbConnection();

await users.registerUser(
    'Kate', 
    'Choi',
    'kachoi',
    'katechoi@gmail.com',
    'Ez123456@!'
);

await users.loginUser(
    'kchoi',
    'Ez123456@!',
);

await users.registerUser(
    'Mandy',
    'Smooth',
    'imsosmooth',
    'mandysmooth@hotmail.com',
    'Isaiah6tyone@here'
);

await users.loginUser(
    'imsosmooth',
    'Isaiah6tyone@here',
)

console.log('Done seeding database');
await closeConnection();