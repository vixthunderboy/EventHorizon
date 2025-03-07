import {events} from '../config/mongoCollections.js';
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as validation from '../validation.js';

let exportedMethods = {

create: async (eventOrganizer, eventOrganizerName, eventName, eventDate, eventDescription, eventLocation, eventCategory) => 

{
try{
const event = await events()

if (!eventCategory || eventCategory.length === 0) throw 'Please provide at least one category'
if (!eventDate) throw 'Please provide date'

eventName = validation.checkString(eventName, "Event Name")
eventDescription = validation.checkString(eventDescription, "Event Description")
eventLocation = validation.checkString(eventLocation, "Event Location")
eventCategory = validation.checkStringArray(eventCategory, "Event Category")

eventName = validation.validateEvent(eventName);
eventDescription = validation.validateDescription(eventDescription);
eventLocation = validation.validateLocation(eventLocation);

let newEvent = {eventName, eventOrganizer, eventOrganizerName, eventDate, eventDescription, eventLocation, eventCategory, eventComments : [], noOfComments : 0, avgRating : 0, noOfRatings : 0, verified: false}

const insertInfo = await event.insertOne(newEvent);
  
if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add event';

const newId = insertInfo.insertedId.toString();

const insertedEvent = await exportedMethods.get(newId);

return insertedEvent;
} catch(e){
    throw new Error(e);
  }

},

getAll : async () => {
    try{
    const event = await events()
  
    let eventList = await event.find({}).toArray();
    
    if (!eventList) throw 'Could not get all events';

    for (let i = 0; i<eventList.length; i++)
      {
        eventList[i].id = eventList[i]._id.toString()
      }
    
    /*
    eventList = eventList.map((element) => 
    
    {
    
    return {
    _id : element._id.toString(),
    eventName :  element.eventName
    };
  
    }
    
    );
    
    */
   
    return eventList;
  
} catch(e){
    throw new Error(e);
  }},


get : async(eventID) => 

{try{
    eventID = validation.checkId(eventID)

    const event = await events();
  
    const idno = ObjectId.createFromHexString(eventID);
    
    const ev = await event.findOne({_id: idno});
    
    if (!ev) throw 'Could not find event';
    
    //ev._id = idno.toString();
    
    return ev;
} catch(e){
    throw new Error(e);
  }
},

remove : async(eventID) => 

{try{

    eventID = validation.checkId(eventID)
      
    const event = await events();
    
    const idno = ObjectId.createFromHexString(eventID);
    
    const deletedEv = await event.findOneAndDelete({_id: idno});
    
    if (!deletedEv) throw 'Could not find event';
    
    return deletedEv.eventName + ' has been deleted';
} catch(e){
    throw new Error(e);
  }
},

update : async(eventID, eventName, eventDate, eventDescription, eventLocation, eventCategory) =>

{
try{
const event = await events()

eventID = validation.checkId(eventID)
if (!eventCategory || eventCategory.length === 0) throw 'Please provide at least one category'
if (!eventDate) throw 'Please provide date'

eventName = validation.checkString(eventName, "Event Name")
eventDescription = validation.checkString(eventDescription, "Event Description")
eventLocation = validation.checkString(eventLocation, "Event Location")
eventCategory = validation.checkStringArray(eventCategory, "Event Category")

const idno = ObjectId.createFromHexString(eventID);

let eventUpdate = {eventName, eventDate, eventDescription, eventLocation, eventCategory}

const updatedEvent = event.findOneAndUpdate({_id: idno},
    {$set: eventUpdate},
    {returnDocument: 'after'})


if (!updatedEvent) throw 'Could not update event'

//updatedEvent._id = idno.toString();
  
return updatedEvent;
} catch(e){
    throw new Error(e);
  }
},

search : async(terms) =>

{
try{
if (!terms) throw 'Text cannot be blank'

const event = await events()

if (!terms) //{orgTerms = validation.checkString(orgTerms, "Terms in Organizer Name")} else 
{terms = [""]}
else{

terms = terms.split(" ")

terms = terms.map(word => `(?=.*\\b${word}\\b)`).join("");}

let searchList = await event.find({eventDescription : new RegExp(terms, "i")
//, eventDate : {$gte : minDate, $lte : maxDate}
}).toArray()



for (let i = 0; i<searchList.length; i++)
  {
    searchList[i].id = searchList[i]._id.toString()
  }

if (!searchList) throw 'Could not get all events';
    
    /*
    searchList = searchList.map((element) => 
    
    {
    
    return {
    _id : element._id.toString(),
    eventName :  element.eventName
    };
  
    }
    
    );
    
    */
   
    return searchList;

} catch(e){
    throw new Error(e);
  }
}
}

export default exportedMethods;
