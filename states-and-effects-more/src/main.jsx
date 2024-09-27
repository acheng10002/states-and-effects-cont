// React
import { StrictMode } from "react";
// React DOM - React's library to talk to web browsers
import { createRoot } from "react-dom/client";
import {
  App,
  TaskApp,
  Form,
  AppOne,
  FormOne,
  Picture,
  PictureOne,
  PictureTwo,
  EditProfile,
  EditProfileOne,
  EditProfileTwo,
  Accordion,
  SyncedInputs,
  FilterableList,
  Game,
  AppTwo,
  AppThree,
  AppFour,
  AppFive,
  AppSix,
  AppSeven,
  AppEight,
  Scoreboard,
  ScoreboardOne,
  ScoreboardTwo,
  Messenger,
  MessengerOne,
  AppNine,
  AppTen,
  AppEleven,
  ContactManager,
  Gallery,
  ContactListTwo,
  Person,
} from "./App.jsx";
// styles for my components
import "./index.css";

/* below, components created in App.js

this file is the bridge between components created in App.jsx 
and the web browser

remainder of this file injects the file product into index.html 
in the public folder

updating a page full of different forms like this one... 
adding a new UI element or a new interaction would require checking
all existing code to make sure I haven't introduced a bug 
ex. forgetting to show or hide something

React solves this problem */
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = "none";
}

function show(el) {
  el.style.display = "";
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === "istanbul") {
        resolve();
      } else {
        reject(new Error("Good guess but a wrong answer. Try again!"));
      }
    }, 1500);
  });
}

let form = document.getElementById("form");
let textarea = document.getElementById("textarea");
let button = document.getElementById("button");
let loadingMessage = document.getElementById("loading");
let errorMessage = document.getElementById("error");
let successMessage = document.getElementById("success");
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;

/* React doesn't directly manipulate UI
I don't enable, disable, show, or hide componentes directly
instead I declare what I want to show, and React figures out how to update the UI  

Thinking about UI declaratively

Step 1. Identidy my component's different visual states
- EMPTY - form has a disabled "Submit" button
- TYPING - form has an enabled "Submit" button
- SUBMITTING - form is completely disabled. spinner is shown
- SUCCESS - "thank you" message is shown instead of a form
- ERROR - same as typing state, but with an extra error message

I will want to create "mocks" for the different states before I add logic
 
Step 2. Determine what triggers those state changes
I can trigger state updates in response to two kinds of inputs:
- human inputs: clicking a button, typing in a field, navigating a link
- computer inputs: a network response arriving, a timeout completing, an image loading 

in both cases, I must set up state variables to update the UI */

/* Step 3. Represent the state in memory with useState
useState - hook/function used to represent the visual states of my component in memory

Each piece of state is a "moving piece", and I want as few "moving pieces" as possible!
*/

/* Step 4. Remove any non-essential state variables
I want to prevent cases where the state in memory doesn't represent any valid UI I'd
want a user to see
ex. I never want to show an error message and disable the input at the same time 
questions to ask about my state variables:
- Does this state cause a paradox?
- Is the same information available in another state variable already?
- Can I get the same information from the inverse of another state variable?

- to remove the "impossible" state, I can combine isTyping and isSubmitting into a status
  that must be one of three values: 'typing', 'submittting', or 'success'
- I can remove isEmpty and instead check answer.length = 0
- isError is not needed because I can check error !== null instead 

const [answer, setAnswer] = useState("");
const [error, setError] = useState(null); 
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false); 

these 7 can be reduced down to 3!
const [answer, setAnswer] = useState("");
const [error, setError] = useState(null); 
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'

I know these are essential because I can't remove any of them without 
breaking the functionality 
to model state more precisely, I can extract it into a reducer
reducers let me unify multiple state variables into a single object
*/

// Step 5. Connect the event handlers to set and update state

function handleFormSubmitOne(e) {
  e.preventDefault();
  if (editButton.textContent === "Edit Profile") {
    editButton.textContent = "Save Profile";
    hideOne(firstNameText);
    hideOne(lastNameText);
    showOne(firstNameInput);
    showOne(lastNameInput);
  } else {
    editButton.textContent = "Edit Profile";
    hideOne(firstNameInput);
    hideOne(lastNameInput);
    showOne(firstNameText);
    showOne(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent =
    "Hello " + firstNameInput.value + " " + lastNameInput.value + "!";
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent =
    "Hello " + firstNameInput.value + " " + lastNameInput.value + "!";
}

function hideOne(el) {
  el.style.display = "none";
}

function showOne(el) {
  el.style.display = "";
}

let formOne = document.getElementById("formOne");
let editButton = document.getElementById("editButton");
let firstNameInput = document.getElementById("firstNameInput");
let firstNameText = document.getElementById("firstNameText");
let lastNameInput = document.getElementById("lastNameInput");
let lastNameText = document.getElementById("lastNameText");
let helloText = document.getElementById("helloText");
formOne.onsubmit = handleFormSubmitOne;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <TaskApp />
    <Form />
    <AppOne />
    <FormOne />
    <Picture />
    <PictureOne />
    <PictureTwo />
    <EditProfile />
    <EditProfileOne />
    <EditProfileTwo />
    <Accordion />
    <SyncedInputs />
    <FilterableList />
    <Game />
    <AppTwo />
    <AppThree />
    <AppFour />
    <AppFive />
    <AppSix />
    <AppSeven />
    <AppEight />
    <Scoreboard />
    <ScoreboardOne />
    <ScoreboardTwo />
    <Messenger />
    <MessengerOne />
    <AppNine />
    <AppTen />
    <AppEleven />
    <ContactManager />
    <Gallery />
    <ContactListTwo />
    <Person />
  </StrictMode>
);
