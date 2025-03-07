import {events} from '../config/mongoCollections.js';
import {users} from '../config/mongoCollections.js';
import { comments } from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as e from './events.js'
import validation from '../validation.js';

let exportedMethods = {

createComment: async (user, eventID, comment, rating) => 

{

comment = validation.checkString(comment, "Comment")

const comm = await comments()
const event = await events()
const ev = e.get(eventID)
const evID = ObjectId.createFromHexString(eventID);
let newCommentCount = ev.noOfComments + 1

if (typeof rating !== 'undefined'  && rating !== null) 

    {

    let total = ev.avgRating * ev.noOfRatings
    let newTotal = total + rating
    let newRatingCount = ev.noOfRatings + 1

    let newAvgRating = newTotal/newRatingCount

    const updatedRatingInEvent = await event.findOneAndUpdate({_id: evID}, {$set : {avgRating : newAvgRating, noOfRatings : newRatingCount}})

    if(!updatedRatingInEvent) throw 'Could not update rating in event'

    }

    const newComment = {user, eventID, comment, rating}

    const insertInfo = await comm.insertOne(newComment)

    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add event'

    const commentList = comm.find({}).toArray

    if (!commentList) throw 'Could not retrieve comments'

    let updatedEvent = await event.findOneAndUpdate({_id: evID}, {$set : {noOfComments : newCommentCount, eventComments : commentList}})

    if (!updatedEvent) throw 'Could not update event'

    const newId = insertInfo.insertedId.toString();

    const insertedComment = await get(newId);

    return insertedComment;



},

getAll : async () => {
    const comments = await comments()
    let commentList = await comments.find({}).toArray();
    if (!commentList) throw 'Could not get all comments';
   
    return commentList;
    },
  
  
  get : async(commentID) => {
    commentID = validation.checkId(commentID)
    const comments = await comments();
    const idno = ObjectId.createFromHexString(eventID);
    const comment = await comments.findOne({_id: idno});
    
    if (!comment) throw 'Could not find comment';
  
    return comment;
  
  },
  
  remove : async(commentID, eventID) => {
    commentID = validation.checkId(commentID)
    const comments = await comments();
    const event = await events();
    let ev = e.get(eventID)
    const idno = ObjectId.createFromHexString(commentID);
    const deletedComment = await comments.findOneAndDelete({_id: idno});
    
    if (!deletedComment) throw 'Could not find comment';

    const commentList = comments.find({}).toArray

    if (!commentList) throw 'Could not retrieve comments'

    let newCommentCount = ev.noOfComments - 1

    let updatedEvent = await event.findOneAndUpdate({_id: evID}, {$set : {noOfComments : newCommentCount, eventComments : commentList}})
    
    if (!updatedEvent) throw 'Event could not be updated'
    
    return deletedComment.comment + ' has been deleted';
  
  }

}

export default exportedMethods;
