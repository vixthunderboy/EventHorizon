import { Router } from "express";
const router = Router();
import * as users from "../data/users.js";
import * as e from "../data/events.js";
import { validateUsername, validatePassword, validateEmail } from "../validation.js";
import { ObjectId } from "mongodb";
import xss from "xss";


router.route("/")
.get(async (req, res) => {
  if(!req.session.user){
    return res.redirect('/login')
  } else{

    let allEvents = await e.default.getAll()

    if (!allEvents) throw 'failed to get all events'

    console.log(allEvents)

    return res.render("home", {
      session : req.session,
      loggedIn: req.session.loggedIn,
      user: req.session.user,
    allEvents: allEvents});
  }
});

router
.route("/home")
.get(async (req, res) => {
  if(!req.session.user){
    return res.redirect('/login')
  } else{


    let allEvents = await e.default.getAll()

    if (!allEvents) throw 'failed to get all events'

    console.log(allEvents)

    return res.render("home", {
      session : req.session,
      loggedIn: req.session.loggedIn,
      user: req.session.user,
      allEvents : allEvents
    });
  }
})

;

router
  .route("/register")
  .get(async (req, res) => {
    res.render("register", { title: "Register" });
  })
  .post(async (req, res) => {
    // checking if firstname is supplied

    if (!req.body.firstName) {
      return res.status(400).render("register", {
        title: "Register",
        error: "Error: firstName is missing",
      });
    }
    // checking if lastname is supplied
    if (!req.body.lastName) {
      return res.status(400).render("register", {
        title: "Register",
        error: "Error: lastName is missing",
      });
    }
    // checking if username is supplied
    if (!req.body.username) {
      return res.status(400).render("register", {
        title: "Register",
        error: "Error: username is missing",
      });
    }
    // checking if email is given
    if (!req.body.email) {
      return res.status(400).render("register", {
        title: "Register",
        error: "Error: email is missing",
      });
    }
    // checking if password is supplied
    if (!req.body.password) {
      return res.status(400).render("register", {
        title: "Register",
        error: "Error: password is missing",
      });
    }

    let username = xss(req.body.username);
    let password = xss(req.body.password);

    // input validation
    username = validateUsername(username);
    // password = validatePassword(password);

    req.body.password = password;

    try {
      let newUser = await users.registerUser(
        req.body.firstName,
        req.body.lastName,
        req.body.username,
        req.body.email,
        req.body.password
      );
      if (newUser.signupCompleted) {
        return res.redirect("/login");
      } else {
        return res.status(500).render("register", {
          title: "Register",
          error: "Error: Internal Server Error",
        });
      }
    } catch (e) {
      return res.status(400).render("register", {
        title: "Register",
        error: e,
      });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    if(req.session.user){
      return res.redirect('/home');
    }else {
      return res.render("login", { title: "Login" });
    }
  })
  .post(async (req, res) => {
    if (!req.body.username) {
      return res.status(400).render("login", {
        title: "Login",
        error: "Error: username should be supplied.",
      });
    }
    if (!req.body.password) {
      return res.status(400).render("login", {
        title: "Login",
        error: "Error: password should be supplied.",
      });
    }
    let username = xss(req.body.username);
    let password = xss(req.body.password);
    username = validateUsername(username);
    password = validatePassword(password);

    try {
      const user = await users.loginUser(username, password);
      if (!user) {
        throw new Error('Invalid username or password.'); 
      }
      req.session.user = user;
      req.session.loggedIn = true;

      res.cookie('AuthenticationState', 'authToken', {
        httpOnly: true,
        secure: false,
      });
      res.redirect('/home');

    } catch (e) {
      return res.status(400).render("login", {
        title: "Login",
        error: e,
      });
    }
  });

router.route("/user").get(async (req, res) => {
  try {
    if (req.session.user) {
      return res.render("user", {
        currentTime: new Date().toLocaleTimeString(),      
        session : req.session,
        loggedIn: req.session.loggedIn, 
        user: req.session.user
      });
    }
  } catch (e) {
    res.render("login");
  }
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  res.render("logout", { title: "Logout" });
});

router.route("/create-event").get(async (req, res) => {
  if(req.session.user){
    res.render("create_event", {
      session : req.session,
      loggedIn: req.session.loggedIn,
      user: req.session.user});
  }else{
    res.redirect('/login');
  }
})
  .post(async (req, res) => {
  try{

    let eventID = req.session.user.id

    let eventOrganizer = eventID.toString()
    let eventOrganizerName = req.session.user.firstName + " " + req.session.user.lastName
    let eventName = req.body.eventName
    let eventDate = req.body.eventDate
    let eventDescription = eventOrganizerName + " has created event titled " + eventName + " which will be at the location: " + req.body.eventLocation + ". Event Description : " + req.body.eventDescription
    let eventLocation = req.body.eventLocation
    let eventCategory = req.body.category

    let newEvent = await e.default.create(eventOrganizer, eventOrganizerName, eventName, eventDate, eventDescription, eventLocation, eventCategory)
    let newNewEvent = newEvent._id.toString()
    if (!newEvent) throw 'Event could not be created'
    console.log(newEvent)
    res.redirect('/event/' + newNewEvent)

  }catch(e){
    return res.status(400).render("create_event", {
      title: "Create Event",
      error: e,
    })

  }

});;

router.route("/verify-organizer").get(async (req, res) => {
  if(req.session.user){
  res.render("verify_organizer", {
    session : req.session,
    loggedIn: req.session.loggedIn,
    user: req.session.user});
  } else{
    res.redirect('/login');
  }
});

router.route("/search").get(async (req, res) => {
  if(req.session.user){
    res.render("search", {
      session : req.session,
      loggedIn: req.session.loggedIn,
      user: req.session.user});
  } else{
    res.redirect('/login')
  }
  
})
  .post(async(req,res) => {

  try{

let terms = req.body.terms

console.log(terms)

let searchList = await e.default.search(terms)

if (!searchList) throw 'Could not search'

console.log(searchList)

res.render('search', {searchList : searchList, id: searchList.id, loggedIn: req.session.loggedIn})

  }catch(e){

  return res.status(400).render("create_event", {
    title: "Create Event",
    error: e,
  })

}}
);

router.route("/calendar").get(async (req, res) => {
  if(req.session.user){
    res.render("calendar", {
      session : req.session,
      loggedIn: req.session.loggedIn,
      user: req.session.user});
  } else{
    res.redirect('/login');
  }
});

router.route("/bookmarks").get(async (req, res) => {
  if(req.session.user){
    res.render("bookmarks", {
      session : req.session,
      loggedIn: req.session.loggedIn,
      user: req.session.user});
  } else{
    res.redirect('/login');
  }

});

router.route("/create-comment").get(async (req, res) => {
})
.post(async (req, res) => {
  if(req.body.comment){
    res.redirect("/event/:id", {
      session : req.session,
      loggedIn: req.session.loggedIn,
      user: req.session.user,
      comment: req.session.newComment});
  } else{
    res.redirect('/login');
  }
});



/*
router.get("/home", (req, res) => {
  res.render("home", {
    session : req.session,
    loggedIn: req.session.loggedIn,
    user: req.session.user});
});
*/
router.get("/event", async(req, res) => {
  if(req.session.user){
    res.render("event", {
      session : req.session,
      loggedIn: req.session.loggedIn,
      user: req.session.user});
  }else{
    res.redirect('/login');
  }
});

router.get('/event/:id', async (req,res) => {
  if(!req.session.user){
    return res.redirect('/login');
  }

  try{
    const event = await e.default.get(req.params.id);
    if(!event){
      return res.status(404).render('error', {
        title: 'Event Not Found',
        error: 'No event found with the provided ID',
        loggedIn: req.session.loggedIn
      });
    }
    return res.render('event', {
      session: req.session,
      loggedIn: req.session.loggedIn,
      eventId: event._id,
      user: req.session.user,
      eventName: event.eventName,
      eventTime: event.eventDate,
      eventLocation: event.eventLocation,
      eventDescription: event.eventDescription
    })
  }catch(e){
    return res.status(404).render('error', {
      title: 'Error fetching event',
      error: 'Error fetching event',
      loggedIn: req.session.loggedIn
  });
  }
});

router.get('/api/events', async (req, res) => {
  try {
      const events = await e.default.getAll();
      res.json(events);
  } catch (error) {
      res.status(500).send(error.toString());
  }
});



export default router;
