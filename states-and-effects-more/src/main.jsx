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
  Clock,
  ClockOne,
  ClockTwo,
  MyComponent,
  AdditionDisplay,
  AppTwelve,
  AppThirteen,
  MyComponentOne,
  AppFourteen,
  AppFifteen,
  AppEighteen,
  AppTwenty,
  AppTwentyOne,
  AppTwentyTwo,
  AppTwentyThree,
  AppTwentyFour,
  Page,
  PageOne,
  FormFour,
  TodoList,
  ProfilePage,
  ListOne,
  ListTwo,
  TodoListOne,
  TodoListTwo,
  TodoListThree,
  ContactManagerOne,
  FormSix,
  FormSeven,
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

/* side effects - interactions the outside world
exs. component querying data from a server/component sending data to a server/connect to my server and fetch messages to show for a users
     find or change the position of the component on the webpage
     updating document titles
     setting up event listeners
     (manually manipulating the DOM)
     setting up subscriptions
     making API requests
side effects let me run soe code to synchronize my component as
  necessary, on rendering or a reactive/state value change rather 
  than on a particular event 
  useEffect hook in React lets me use effects in my components
  
What are effects?
  side effects - interactions the outside world
useEffect(() => {
  // this runs after every render
});

useEffect(() => {
  // this runs only on mount (when the initial component renders)
}, []);

useEffect(() => {
  // this runs on mount *and also* if either a or b have changed since the last render
}, [a, b]);

useEffect(
() => {
  // execute side effect
  /* main part of the hook, function that contains the effect I want to run
     after the component renders or after certain state or props change
     callback is executed after the render phase, not during it
  return () => {
    // cleanup function on unmounting or re-rerunning effect 
    /* when the component is unmounted or just before the effect runs again (if
       dependencies change)
       this is useful for cleaning up things like subscriptions, timers, or event
       listeners that I want to remove when the component is no longer needed
       cleanup function prevents memory leaks and ensures that I properly clean up
       side effects
    }
  },
  // optional dependency array -
  /* controls when the effect is executed
     tells React to only re-run the effect when one or more of the dependencies change
     if no dependencies are provided, the effect will run after every render
     if an empty array is provided, the effect will run only once
  [/* 0 or more entries ]

How are effects used in React?
What are the different parts of a useEffect hook?
  callback function, array of dependencies, cleanup function
When should I use an effect? 
  What is the one question I can ask to know when to use an effect?
    Are there any external systems that need to be synced with, apart from props or state?
    if I need to sync my component with external systems like a server, API, or browser DOM, then yes
    unnecessary useEffects are code-smell (symptom in the source code of a program that may indicate
    a deeper problem), error-prone, and cause performance issues
    code-smell

    just like using a key on a list's item, adding a key to a component, based on the state on which it 
    should be reset creates a unique version of that component for each change in the value of the state
What is meant by lifting up the state?
  pulling state variables out of child components and onto a shared,
  common parent component 
  if I have issues with managing my state and want to use an effect to update the state of a parent or
  some non-child component, lift the state to the parent that has all of the components that need it 
  
Lifecycle of A Component
different stages at which rendering takes and the role of useEffect 
components mount, update, or unmount
effects either start synchronizing something or later stop synchronizing it 
  if my effects depends on props and state that change over time, this cycle can happen multiple times
  React has a linter rule to check that I've specified my effect's dependencies correctly, so that it's
  synchronized to the latest props and state 
  
How an effect's lifecycle is different from a component's life cycle
  component lifecycle:
  1. component mounts when it's added to the screen
  2. component updates when it receives new props or state, usually in response to an interaction
  3. a component unmounts when it's removed froms the screen

effects are reactive- they re-synchronize when the values I read inside them change
  event handlers run once per interaction, effects run whenever synchronization is necessary
I cannot choose my dependencies - my dependencies must include every reactive value
  the linter enforces this, but if I run into problems like infinite loops or my effect re-synchronizing
  too often, I can:
  - check that my effect represents an independent synchronization process
    if my effect doesn't synchronize anything, it might be unnecessary
    if it synchronizes several independent things, I can split it up
  - if I want to read the latest value of props or state without "reacting" to it, and re-synchronizing 
    the effect, I can split the effect into a reactive part and a non-reactive part (while I will
    extract into something called an effect event)
  - avoid relying on objects and functions as dependencies
    if I create objects and functions during rendering, and then read them from an effect,
    they will be different on every render
    this causes my effect to re-synchronize every time

How to think about each individual effect in isolation
  each effect has a separate lifecycle from the surrounding component
  each effect describes a separate synchronization process that can start and stop
  think about how to start and stop synchronization rather than from the component's
  perspective
When my Effect needs to be re-synchronize, and why
  Every time after your component re-renders, React will look at the array of dependencies 
  that you have passed. If any of the values in the array is different from the value at 
  the same spot that you passed during the previous render, React will re-synchronize your effect.
  if reactive values change, my effect needs to re-synchronize
How my Effect's dependencies are determined
  they're the values that are reactive, props, state, and values that I calculate from props and state
What it means for a value to be reactive
  they re-synchronize when the values I read inside them change
What an empty dependency array means
  it means my effect's code does not have any reactive values
How React verifies my dependencies are correct with a linter
  React will check that every reactive value used by my effect's code is declared as its dependency
  and will point out the bug in my code if it is not
What to do when I disagree with the linter 
  all errors flagged by the linter are legitimate, there's always a way to fix the code to not break
  the rules
*/

/* I Might Not Need an Effect
  effects are an escape hatches from the React paradigm
  they let me step outside of React to synchronize my components with 
  external systems like non-react widget, network, or the browser DOM
  if no external system is involved, like I just want to update a 
  component's state when props or state change, I shouldn't need an effect
  - I don't need effects to transform data for rendering
    ex. I want to filter a list before displaying it 
        when I update the state, React first calls my component 
        functions to calculate what should be on the screen
        React then "commits" these changes to the DOM, updating
          the screen
        then React will run my effects, which will restart the 
        process from scratch
    transform all the data at the top level of my componenets to
    avoid unnecessary render passes, and that code will automatically
      re-rerun whenever my props or state change
  - I don't need effects to handle user events 
    ex. I want to send an /api/buy POST request and show a notification 
        when the user buys a product
        in the Buy button click event handler, I know exactly what happened
          by the time an effect runs, I don't know what the user did (for ex.
          which button was clicked)
    so, I'll usually handle user events in the corresponding event handlers
  when I do need effects
  ex. write an effect that keeps a jQuery widget synchronized with the React state
  ex. write an effect that that synchronizes the search results with the current
      search query
How to remove unnecessary effectss
  Updating state based props or state
  Caching expensive calculations
  Resetting all state when a prop changes
    React normally preserves the state when the same component is rendered in the
      same spot
    by passing userId as a key to the Profile component, I'm asking React to treat 
      two Profile components with different userId as two different components that
      should not share any state
  Adjusting some state when a prop changes
    adjust the state directly during rendering
    most components shouldn't need thiss
    I should check whether I can reset all state with a key or calculate everything
      during rendering 
  Sharing logic between event handlers
    when I'm not sure whether some code should be in an effect or in an event handler, 
      ask myself WHY this code needs to run
    use effects only for code that should run BECAUSE the component was displayed to the
      user
  Sending a POST request
    Whether to put some logic into an event handler or an effect, question I need to
      answer is, what kind of logic is it from the user's perspective
    if the logic is caused by a particular interaction, keep it in the event handler
    if it's caused by the user seeing the component on the screenm keep it in the effect
  Chains of computations
    Avoid chains of effects that adjust the state solely to trigger each other
  Initializing the application
    avoid effects with logic that should only ever run once
    effects run twice in development, so my components should be resilent to being remounted, 
      including my top-level App component 
      doing so, makes it easier to move and reuse code
  Notifying parent components about state changes
    "lifting state up" lets the parent component fully control the child
      by toggling the parent's own state
    the parent will have to contain more logic, but there will be less state
      overall to worry about
  Passing data to the parent
    don't pass data to the parent in an effect
    have parent fetch the data and pass it down to the child instead
  Subscribing to an external store
  Fetching data
*/

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
    <Clock />
    <ClockOne />
    <ClockTwo />
    <MyComponent />
    <AdditionDisplay />
    <AppTwelve />
    <AppThirteen />
    <MyComponentOne />
    <AppFourteen />
    <AppFifteen />
    <AppEighteen />
    <AppTwenty />
    <AppTwentyOne />
    <AppTwentyTwo />
    <AppTwentyThree />
    <AppTwentyFour />
    <Page />
    <PageOne />
    <FormFour />
    <TodoList />
    <ProfilePage />
    <ListOne />
    <ListTwo />
    <TodoListOne />
    <TodoListTwo />
    <TodoListThree />
    <ContactManagerOne />
    <FormSix />
    <FormSeven />
  </StrictMode>
);
