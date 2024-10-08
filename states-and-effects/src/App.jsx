import { useState } from "react";
import "./App.css";

/* 
How to structure state
  What should I keep in mind while declaring state?
    *I should not put values in state that can be calculated using existing values, state, and/or props
    *states should not be mutated, to change state, I should always use the setState function
How state updates
  Why should I always use setState to update my state?
    because otherwise, state should be treated as immutable
  What does "state as a snapshot" mean? 
    state stays the same through the current render of a component
    the setState call triggers a component re-render
    THEN the person state is updated to a new value
    - React renders/calls my component
    - the JSX returned from my component is an interactive snapshot of the UI in time
      *the component's props, event handlers, and local variables were all calculated
       using its state at the time of the render
  What's the difference between passing a value vs a callback to the
    setState function?
      passing a value, replaces the current state with the value I passed in
      passing a callback ensures the latest state is passed in as an argument
        to the callback
  Why should I always provide a new Object to setState?
    otherwise, the page may not re-render
Learn about controlled components
  Why would I want to control a component? 
    when I would like to control the value of native HTML elements that 
    maintain their own internal state
*/

function Person() {
  const [person, setPerson] = useState({ name: "John", age: 100 });

  // BAD - Don't do this
  /*
  const handleIncreaseAge = () => {
    // mutating the current state object
    person.age = person + 1;
    setPerson(person);
  };
  */

  // GOOD - Do this!
  const handleIncreaseAge = () => {
    /* create a new object and then 
     copy the existing person object into the new object
     while updating the age property */
    const newPerson = { ...person, age: person.age + 1 };

    /* setPerson must be provided a new object to trigger a
    re-render of the page 
    *be careful when using nested objects and arrays, as state
    gets tricky fast */
    setPerson(newPerson);
  };

  return (
    <>
      <h1>States and Effects</h1>
      <h1>{person.name}</h1>
      <h2>{person.age}</h2>
      <button onClick={handleIncreaseAge}>Increase age</button>
    </>
  );
}

function PersonOne() {
  const [person, setPerson] = useState({ name: "John", age: 100 });

  /* when handleIncreaseAge is invoked by clicking button, logs 
  before and after setPerson print the same value */
  const handleIncreaseAge = () => {
    console.log("in handleIncreaseAge (before setPerson call): ", person);
    /* whenever I call setState, React will apply the update in 
    the next component render 
    bc state variables aren't reactive, components are */
    setPerson({ ...person, age: person.age + 1 });
    // I've called setPerson, surely person has updated? nope
    console.log("in handleIncreaseAge (after setPerson call): ", person);
  };

  // this console.log runs every time the component renders
  /* only when the component re-renders, does the person state variable
  get updated to { name: 'John', age: 101 } */
  console.log("during render: ", person);

  /* 
  const handleIncreaseAgeOne = () => {
    // replaces the current render's person with an increase in age by 1 
    setPerson({ ...person, age: person.age + 1 });
    setPerson({ ...person, age: person.age + 1 });
  };
  */

  const handleIncreaseAgeTwo = () => {
    /* passing a callback to setState, ensures that the latest state is 
    passed in as an argument to the callback */
    setPerson((prevPerson) => ({ ...prevPerson, age: prevPerson.age + 1 }));
    setPerson((prevPerson) => ({ ...prevPerson, age: prevPerson.age + 1 }));
  };

  console.log("during render");

  return (
    <>
      <h1>{person.name}</h1>
      <h2>{person.age}</h2>
      <button onClick={handleIncreaseAgeTwo}>Increase age</button>
    </>
  );
}

/* 
function Component() {
  const [count, setCount] = useState(0);

  // calling the setState function will trigger a re-rendering 
  // and is recursive because a re-rendering will call the 
  // setState function again, and so on and so forth 
  setCount(count + 1);

  return <h1>{count}</h1>;
} 
*/

function CustomInput() {
  const [value, setValue] = useState("");

  /* I type into an input, and it updates its own value on every keystroke 
  instead of letting the input maintain its own state, I can define my
  own state using the useState hook 
  set the value prop of the input to the state variable 
  update the state variable on every onChange event
  this way, every time the user types something in the input,
  React ensures I have the latest input in value */
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

/* 
How setting state triggers re-renders
  1. a event handler executes
  2. state updates and queues a render
  3. React re-renders the component according to the new state
  (the state is changed for the next render, not this one)
When and how state updates
  event handler executes, and setting state changes it for the NEXT render
  1. I tell React to update the state
  2. React updates the state value
  3. React passes a snapshot of the state value into the component for the NEXT render
Why state does not update immediately after I set it
  what happens first is a re-render
  React stores state outside of my component  
How event handlers access a "snapshot" of the state
  State gets updated, React re-renders a component:
  1. React calls my component/function again
  2. My component returns/calculates a new JSX snapshot
  3. React then updates the screen/DOM tree to match the snapshot my component returned
     React connects the event event handlers
     (so pressing a button triggers the click handler from my JSX)

setting state does not change the state variable I already have, 
it triggers a re-render

so for an interface to react to an event, I need to update the state
*/

function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState("Hi");
  if (isSent) {
    return <h1>Your message is on its way!</h1>;
  }

  /* when "send" is pressed
  1. onSubmit event handler executes
  2. setIsSent(true) sets isSent to true and queues a new render
  3. React re-renders the component/UI according to the new isSent value */
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setIsSent(true);
        sendMessage(message);
      }}
    >
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}

/* state actually "lives" in React itself outside of my function 
when React calls my component,
it gives me a snapshot of the state for that render
my component returns a snapshot of the UI with a 
  fresh set of props and event handlers in its JSX
  all calculated using the state values from that render!
*/

function Counter() {
  const [number, setNumber] = useState(0);

  /* number only increments once per click
  because setting state only changes it for the next render 
  in this render's event handler, number is always 0, 
  so I set state to 1 three times */
  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(number + 1);
          setNumber(number + 1);
          setNumber(number + 1);
        }}
      >
        +3
      </button>
    </>
  );
}

/* 
  onClick={() => {
    setNumber(number + 5); // triggers a re-render, number is still 0
    alert(number); // alert (0)
                   // once I close out the alert box, number is 5
  }}
*/
function CounterOne() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(number + 5);
          alert(number);
        }}
      >
        +5
      </button>
    </>
  );
}

function CounterTwo() {
  const [number, setNumber] = useState(0);

  /* here, the state stored in React may have changed by the time the alert runs,
  but the alert was scheduled using a snapshot of the state at the time the user
  interacted with it, when it was still 0 */
  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(number + 5);
          setTimeout(() => {
            alert(number);
          }, 3000);
        }}
      >
        +5
      </button>
    </>
  );
}

/* a state variable's value never changes within a render 
the state variable's value is fixed for that render when React 
takes a snapshot of the UI by calling my component */
function FormOne() {
  const [to, setTo] = useState("Alice");
  const [message, setMessage] = useState("Hello");

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  /* if I press the send button, sending Hello to Alice,
  and before the 5 sec delay, change the value of the To field to Bob
  the alert still displays You said Hello to Alice 
  
  React keeps the state values "fixed" within one render's event handlers */
  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{" "}
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

/* variables and event handlers don't survive re-renders
every render has its own event handler
every render and functions inside it, will always see the snapshot of 
  the state that React gave to that render 
event handlers created in the past have state values from the render
  in which they were created */

function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);

    /* alert can go after or before setWalk, that render's value of walk is fixed
    calling setWalk will only change the value of walk for the next render 
      it won't affect the event handler from the previous render */
    alert(walk ? "Stop is next" : "Walk is next");
  }

  return (
    <>
      <button onClick={handleClick}>Change to {walk ? "Stop" : "Walk"}</button>
      <h1
        style={{
          color: walk ? "darkgreen" : "darkred",
        }}
      >
        {walk ? "Walk" : "Stop"}
      </h1>
    </>
  );
}

/* group related state 
  When to use a single vs multiple state variables
  Group related state: 
  if I always update two or more state variables at the same time,
  I should merge them into a single state variable
What to avoid when organizing state
  - avoid contradictions in state
  - avoid redundant state
    (information that can be calculated from the component's props or its 
    existing state variables during rendering should not be put into state)
  - avoid duplication in state
  - avoid deeply nested state
  *goal is to make state easy to update without introducing mistakes
   removing redundant and duplicate data is similar to how a database engineer 
   might want to normalize the database structure to reduce the chance of bugs

How to fix common issues with the state structure */
/* 
const [x, setX] = useState(0);
const [y, setY] = useState(0);

/* if two state variables always change together, probably a good idea to
unify them into a single state variable 
const [position, setPosition] = useState({ x: 0, y: 0 });
*/
function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  /* onPointerMove - part of the Pointer Events API (for handling multiple
  types of input- touch, mouse, and stylus), prop that is an event handler
  triggered when a pointing device moves over a target element 
  
  moving the cursor updates both coordinates of the red dot */
  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        });
      }}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          position: "absolute",
          backgroundColor: "red",
          borderRadius: "50%",
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  );
}

/* also group data into an object or array when I don't know how many pieces
of state I'll need ex. helpful to have a form where a user can add custom fields 

** remember that if my state variable is an object, I can't update only one
field in it without explicitly copying the other fields, 
so no to setPosition({ x: 100 }}, instead setPosition({ ...postion, x: 100 }} 
or split them into two state variables and do setX(100) 

avoid contradictions in state */
function FeedbackForm() {
  const [text, setText] = useState("");
  /* 
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  this leaves door open to impossible state:
  ex. both isSending and isSent being true at the same time
  isSending and isSent should never be true at the same time
  better to replace them with one status state variable that 
  may take one of three valid states, 'typing', 'sending', 
  'sent'
  */
  const [status, setStatus] = useState("typing");

  async function handleSubmit(e) {
    e.preventDefault();
    // setIsSending(true);
    setStatus("sending");
    await sendMessageOne(text);
    // setIsSending(false);
    // setIsSent(true);
    setStatus("sent");
  }

  const isSending = status === "sending";
  const isSent = status === "sent";

  if (isSent) {
    return <h1>Thanks for feedback!</h1>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button disabled={isSending} type="submit">
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message
function sendMessageOne(text) {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
}

// avoid redundant state
function FormTwo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  /* fullName can always be calculated from firstName and lastName during render,
  so it should be removed from state 
  // const [fullName, setFullName] = useState("");
  
  // fullName can be calculated during render 
  // when I call setFirstName or setLastName, I trigger a re-render, and
  // then the next fullName will be calculated from the fresh data */
  const fullName = firstName + " " + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    // setFullName(e.target.value + "" + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    // setFullName(firstName + "" + e.target.value);
  }

  return (
    <>
      <h2>Let's check you in</h2>
      <label>
        First name: <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name: <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}

/* a version of redundant state...mirroring props in state
 */

function MessageOne({ initialColor }) {
  /* a color state variable is initialized to the messageColor prop
 **becomes a problem if the parent component passes a different value
 of messageColor later, the color state varaible would not be updated 
 state then is only initialized during the rest render 
 */
  // const [color, setColor] = useState(messageColor);
  // instead use the messageColor prop directly in my code
  // const color = messageColor;

  /* only "mirror" props into state when I want to ignore all updates 
  for a specific prop 
  start the prop name with initial or default to clarify that its 
    new values are ignored */
  const [color, setColor] = useState(initialColor);
}

/* avoid duplication in state */
const initialItems = [
  { title: "pretzels", id: 0 },
  { title: "crispy seaweed", id: 1 },
  { title: "granola bar", id: 2 },
];

// lets you choose a single travel snack out of several
function Menu() {
  const [items, setItems] = useState(initialItems);
  /* contents of selectedItem is the same object as one of 
  the items inside the items list */
  const [selectedItem, setSelectedItem] = useState(items[0]);

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.title}{" "}
            <button
              onClick={() => {
                setSelectedItem(item);
              }}
            >
              Choose
            </button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}

function MenuOne() {
  const [items, setItems] = useState(initialItems);
  /* contents of selectedItem is the same object as one of 
  the items inside the items list 
  
  if I first click "Choose" and then edit, input will update
  but the label at the bottom won't reflect the edits */
  const [selectedItem, setSelectedItem] = useState(items[0]);

  /* e - event object
         when I use an event handler in React, e is automatically
          passed to the function 
         e contains info about the event that occurred:
         the type of event, the element that triggered the event, and 
          associated data
     e.target - HTML element that triggered the event 
     e.target.value - currrent value of the input field 
  */
  function handleItemChange(id, e) {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            title: e.target.value,
          };
        } else {
          return item;
        }
      })
    );
  }

  /* user types into the input field:
  - user interaction: onChange event is triggered
                      e is passed to handleItemChange function
  - handling the event: e.target.value retrieves the current text
                        entered by the user
  - updating state: function checks if the item.id matches the id passed
                    to the function
                    if a match is found, the obejct is updated with the
                    new title using e.target.value 
  this updates the items array with the new title
  which re-renders the component with the updated input values 
  */
  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={(e) => {
                handleItemChange(item.id, e);
              }}
            />{" "}
            <button
              onClick={() => {
                setSelectedItem(item);
              }}
            >
              Choose
            </button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}

/* instead of a selectedItem object (which created a duplication 
with objects inside items), 
hold the seelctedId in state
and then get the selectedItem by searching the items array for 
an item with that ID */
function MenuTwo() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  /* if I edit the selected item, <p> tag below will update immediately
  setItems triggers a re-render 
  and items.find(...) would find the item with the updated title 
  
  // this is where selectedItem is updated
  <button
    onClick={() => {
    // sets the currently selected item when user clicks the Choose button
    // that triggers a state update, which triggers re-renders the component
    // durin re-render, the <p> tag displays the updated title of the selected item 
    setSelectedId(item.id);
    }}
  >

  I don't need to hold the selected item in state, 
  because only the selected id is essential
  the rest can be calculated during render
  */
  const selectedItem = items.find((item) => item.id === selectedId);

  function handleItemChange(id, e) {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            title: e.target.value,
          };
        } else {
          return item;
        }
      })
    );
  }
  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={(e) => {
                handleItemChange(item.id, e);
              }}
            />{" "}
            <button
              onClick={() => {
                setSelectedId(item.id);
              }}
            >
              Choose
            </button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}

/* the state used to be duplicated like this: 
items = [{ id: 0, title: 'pretzels'}, ...]
selectedItem = {id: 0, title: 'pretzels'}

now, it's this:
items = [{ id: 0, title: 'pretzels'}, ...]
selectedId = 0
*/

/* avoid deeply nested state 
updating nested state involves making copies of objects all teh way
up from the part that changed
deleting a deeply nested place would involve copying its entire parent
place chain 
*/

/* if the state is too nested to update easily, I should make it "flat" 
instead of having each place with an array of its child places,
have each place hold an array of its child place IDs,
then store a map from each place ID to the corresponding place */

// object used as the initial state for the plan state variable
const initialTravelPlan = {
  0: {
    id: 0,
    title: "(Root)",
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: "Earth",
    childIds: [2, 10, 19, 26, 34],
  },
  2: {
    id: 2,
    title: "Africa",
    childIds: [3, 4, 5, 6, 7, 8, 9],
  },
  3: {
    id: 3,
    title: "Botswana",
    childIds: [],
  },
  4: {
    id: 4,
    title: "Egypt",
    childIds: [],
  },
  5: {
    id: 5,
    title: "Kenya",
    childIds: [],
  },
  6: {
    id: 6,
    title: "Madagascar",
    childIds: [],
  },
  7: {
    id: 7,
    title: "Morocco",
    childIds: [],
  },
  8: {
    id: 8,
    title: "Nigeria",
    childIds: [],
  },
  9: {
    id: 9,
    title: "South Africa",
    childIds: [],
  },
  10: {
    id: 10,
    title: "Americas",
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: "Argentina",
    childIds: [],
  },
  12: {
    id: 12,
    title: "Brazil",
    childIds: [],
  },
  13: {
    id: 13,
    title: "Barbados",
    childIds: [],
  },
  14: {
    id: 14,
    title: "Canada",
    childIds: [],
  },
  15: {
    id: 15,
    title: "Jamaica",
    childIds: [],
  },
  16: {
    id: 16,
    title: "Mexico",
    childIds: [],
  },
  17: {
    id: 17,
    title: "Trinidad and Tobago",
    childIds: [],
  },
  18: {
    id: 18,
    title: "Venezuela",
    childIds: [],
  },
  19: {
    id: 19,
    title: "Asia",
    childIds: [20, 21, 22, 23, 24, 25],
  },
  20: {
    id: 20,
    title: "China",
    childIds: [],
  },
  21: {
    id: 21,
    title: "India",
    childIds: [],
  },
  22: {
    id: 22,
    title: "Singapore",
    childIds: [],
  },
  23: {
    id: 23,
    title: "South Korea",
    childIds: [],
  },
  24: {
    id: 24,
    title: "Thailand",
    childIds: [],
  },
  25: {
    id: 25,
    title: "Vietnam",
    childIds: [],
  },
  26: {
    id: 26,
    title: "Europe",
    childIds: [27, 28, 29, 30, 31, 32, 33],
  },
  27: {
    id: 27,
    title: "Croatia",
    childIds: [],
  },
  28: {
    id: 28,
    title: "France",
    childIds: [],
  },
  29: {
    id: 29,
    title: "Germany",
    childIds: [],
  },
  30: {
    id: 30,
    title: "Italy",
    childIds: [],
  },
  31: {
    id: 31,
    title: "Portugal",
    childIds: [],
  },
  32: {
    id: 32,
    title: "Spain",
    childIds: [],
  },
  33: {
    id: 33,
    title: "Turkey",
    childIds: [],
  },
  34: {
    id: 34,
    title: "Oceania",
    childIds: [35, 36, 37, 38, 39, 40, 41],
  },
  35: {
    id: 35,
    title: "Australia",
    childIds: [],
  },
  36: {
    id: 36,
    title: "Bora Bora (French Polynesia)",
    childIds: [],
  },
  37: {
    id: 37,
    title: "Easter Island (Chile)",
    childIds: [],
  },
  38: {
    id: 38,
    title: "Fiji",
    childIds: [],
  },
  39: {
    id: 40,
    title: "Hawaii (the USA)",
    childIds: [],
  },
  40: {
    id: 40,
    title: "New Zealand",
    childIds: [],
  },
  41: {
    id: 41,
    title: "Vanuatu",
    childIds: [],
  },
  42: {
    id: 42,
    title: "Moon",
    childIds: [43, 44, 45],
  },
  43: {
    id: 43,
    title: "Rheita",
    childIds: [],
  },
  44: {
    id: 44,
    title: "Piccolomini",
    childIds: [],
  },
  45: {
    id: 45,
    title: "Tycho",
    childIds: [],
  },
  46: {
    id: 46,
    title: "Mars",
    childIds: [47, 48],
  },
  47: {
    id: 47,
    title: "Corn Town",
    childIds: [],
  },
  48: {
    id: 48,
    title: "Green Hill",
    childIds: [],
  },
};

/* recursive component that displays current place and if there
are child places, recursively renders each child 

id is id of current place being rendered
placesById is the initialTravelPlan object passed as plan */
function PlaceTree({ id, parentId, placesById, onComplete }) {
  // extracts the place object
  const place = placesById[id];

  // childIds array contains IDs of the children of current place
  /* component maps over childIds and calls PlaceTree for each child 
  
  props passed to PlaceTree
  key={childId} - unique key to help React efficiently update the DOM
  id={childId} - current child's id's is passed as a prop
  placesById={plan} - entire travel plan is passed so PlaceTree can access
                      and render child places
  <PlaceTree key={childId} id={childId} placesById={placesById} />
  */
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button
        onClick={() => {
          onComplete(parentId, id);
        }}
      >
        Complete
      </button>
      {childIds.length > 0 && (
        <ol>
          {childIds.map((childId) => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      )}
    </li>
  );
}

/* with the state "flat", updating nested items becomes easier

to remove a place now, I only need to update two levels of state 
- updated version of its parent place should exclude the removed ID from its childIDs array
- updated version of the root table object should include the updated version of the parent place */
function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    /* creates a new version of the parent place that doesn't 
    include this child ID */
    const nextParent = {
      ...parent,
      childIds: parent.childIds.filter((id) => id !== childId),
    };

    // update the root state object...
    setPlan({
      ...plan,
      // ...so that it has the updated parent
      [parentId]: nextParent,
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planetIds.map((id) => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

/* ideally, I would want to remove the deleted items and their 
children from the table object to improve memory usage */
let nextId = 3;

const startingItems = [
  { id: 0, title: "Warm socks", packed: true },
  { id: 1, title: "Travel journal", packed: false },
  { id: 2, title: "Watercolors", packed: false },
];

function AddItem({ onAddItem }) {
  const [title, setTitle] = useState("");

  /* the state variables below are redundant bc they can be
  calculated from the items array itself
  const [total, setTotal] = useState(3);
  const [packed, setPacked] = useState(1); */
  return (
    <>
      <input
        placeholder="Add item"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() => {
          setTitle("");
          onAddItem(title);
        }}
      >
        Add
      </button>
    </>
  );
}

function PackingList({ items, onChangeItem, onDeleteItem }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={(e) => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked,
                });
              }}
            />{" "}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

function TravelPlanOne() {
  const [items, setItems] = useState(startingItems);

  /* item counts will now be calculated during the next 
  render from items, so they are always up-to-date */
  const total = items.length;
  const packed = items.filter((item) => item.packed).length;

  /* now the event handlers are only concerned with calling
  setItems after the redundant code is removed */
  function handleAddItem(title) {
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false,
      },
    ]);
  }

  function handleChangeItem(nextItem) {
    setItems(
      items.map((item) => {
        if (item.id === nextItem.id) {
          return nextItem;
        } else {
          return item;
        }
      })
    );
  }

  function handleDeleteItem(itemId) {
    setItems(items.filter((item) => item.id !== itemId));
  }

  /* footer shows how many items are packed 
  and how many items are packed */
  return (
    <>
      <AddItem onAddItem={handleAddItem} />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>
        {packed} out of {total} packed!
      </b>
    </>
  );
}

const initialLetters = [
  {
    id: 0,
    subject: "Ready for adventure?",
    isStarred: true,
  },
  {
    id: 1,
    subject: "Time to check in!",
    isStarred: false,
  },
  {
    id: 2,
    subject: "Festival Begins in Just SEVEN Days!",
    isStarred: false,
  },
];

/* simple email client where users can:
- hover over a letter to highlight it
- star/unstar a letter by clicking the button next to it

state for highlighting and starring letter is managed by useState
state is updated with event handlers, handleHover and handleStar */

/* Letter component has four custom props (data that would be passed from
parent component to child component) 
letter - object passed from parent MailClient component
isHighlighted - boolean for whether letter should be highlighted
onHover - function to handle event and highlight letter when user hovers over letter
onToggleStar - function to toggle the start status of the letter */
function Letter({ letter, isHighlighted, onHover, onToggleStar }) {
  /* isHighlighted - if true, li tag will have highlighted CSS tag
  onFocus and onPointerMove - events that trigger the onHover function 
  (onHover passes the letter.id to the parent via onHover(letter.id) 
  
  onClick - when button is clicked, onToggleStar is called with letter's id 
  isStarred - if the letter's isStarred property is true, button text content is
    "Unstar", otherwise "Star" 
    
  .subject - displays the subject of the letter inside the <li> */
  return (
    <li
      className={isHighlighted ? "highlighted" : ""}
      onFocus={() => {
        onHover(letter.id);
      }}
      onPointerMove={() => {
        onHover(letter.id);
      }}
    >
      <button
        onClick={() => {
          onToggleStar(letter.id);
        }}
      >
        {letter.isStarred ? "Unstar" : "Star"}
      </button>
      {letter.subject}
    </li>
  );
}

function MailClient() {
  /* initializes state with initialLEtters and id of letter currently being highlighted (null) */
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedLetterId, setHighlightedLetterId] = useState(null);

  /* handleHover updates the highlightedLetterId state when a letter is hovered 
  the function is passed as the onHover prop from the parent MailClient component
  to the child Letter component */
  function handleHover(letterId) {
    setHighlightedLetterId(letterId);
  }

  // handleStar toggles the isStarred status
  function handleStar(starredId) {
    // updates the letters state
    setLetters(
      /* iterates through all the letters and for the letter with id matching 
      starredId passed in, toggles the isStarred property */
      letters.map((letter) => {
        if (letter.id === starredId) {
          return {
            ...letter,
            isStarred: !letter.isStarred,
          };
          // if the letter's id doesn't match starredId, letter is returned unchanged
        } else {
          return letter;
        }
      })
    );
  }

  /* {letters.map((letter) => ( // iterates through letters array and renders a Letter component for each
      <Letter // props get passed to Letter
          key={letter.id} // unique key for each key
          letter={letter} // letter object passed to the Letter component
          isHighlighted={letter.id === highlightedLetterId} // checks if the current letter's id matches
                                                               state's highlighted letter id
          onHover={handleHover} // passes handleHover function to handle highlighting on hover
          onToggleStar={handleStar} // passes the handleStart function to handle toggling the star status
      />
  */
  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map((letter) => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={letter.id === highlightedLetterId}
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}

/* LetterOne component has three props
letter - object passed from the parent MailClientOne component 
onToggle - function passed in as a prop, that toggles selection status of letter
isSelected - boolean for whether a letter is selected 
*/
function LetterOne({ letter, onToggle, isSelected }) {
  /* onChange - event that triggers the onToggle function 
  (onToggle passes the letter.id to the parent via onToggle(letter.id) */
  return (
    <li className={isSelected ? "selected" : ""}>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  );
}

function MailClientOne() {
  const [selectedIds, setSelectedIds] = useState([]);

  function handleToggle(toggledId) {
    /* setSelectedIds state updater function uses a function as an 
    argument instead of a direct value 
    
    the function inside the state updater takes the previous state, prevSelected 
    I am passsing into the state updater, a function that receives the previous state */
    setSelectedIds((prevSelected) => {
      // checks if the toggledId is already in the prevSelected array
      if (prevSelected.includes(toggledId)) {
        // if yes, then I'm deselecting it, return a new array that excludes the toggledId
        return prevSelected.filter((letterId) => letterId != toggledId);
      } else {
        /* if no, then I'm selecting it, 
        spread operator ...prevSelected, is used to create a new array that includes
        all the previous selections plus the toggledId */
        return [...prevSelected, toggledId];
      }
    });
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {initialLetters.map((letter) => (
          <LetterOne
            key={letter.id}
            letter={letter}
            isSelected={
              // TODO: allow multiple selection
              selectedIds.includes(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>You selected {selectedIds.length} letters</b>
        </p>
      </ul>
    </>
  );
}

/* React batches state updates asynchronously
when state updates depend on the previous state, I should use the functional form
of setState to avoid issues where the state might bot have been updated yet 

Responding to Events

event handlers - my custom functions that will be triggered in response to interactions
                 like clicking, hovering, focusing form inputs, etc.
*/

function Button() {
  /* handleClick is an event handler, event handlers are
  - defined inside my components 
  - have names that start with handle followed by the name of the event */
  // logic that shows a message when user clicks
  function handleClick() {
    alert("You clicked me!");
  }

  // define a function, pass it as a prop to appropriate JSX tag, and that adds an event handler
  /* the event handler could alternatively be defined inline,
  <button onClick={() => {
    alert("You clicked me!");
  }}>Click me</button>
  
  functions passed to event handlers must be passed, not called */
  return <button onClick={handleClick}>Click me</button>;
}

/* Different ways to write an event handler
How to pass event handling logic from a parent component
How events propagate and how to stop them */

/* reading props in event handlers... 
bc event handlers are declared inside a component, they have access to the component's props */
function AlertButton({ message, children }) {
  // when this button is clicked, an alert with the component's message prop is shown
  return <button onClick={() => alert(message)}>{children}</button>;
}

function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">Play Movie</AlertButton>
      <AlertButton message="Uploading!">Upload Image</AlertButton>
    </div>
  );
}

/* passing event handler props... 
I will often want the parent component to specify a child's event handler 

here the onClick prop is passed, the child components receive it from their parent Button */
function ButtonOne({ onClick, children }) {
  /* Toolbar component renders a PlayButton and an UploadButton first
  
  then Button component accepts a onClick prop,
  it passes it to the built-in browser <button> 
  this tells React to call the passed function on click */
  return <button onClick={onClick}>{children}</button>;
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }
  // PlayButton component passes handlePlayClick as the onClick prop to ButtonOne
  return <ButtonOne onClick={handlePlayClick}>Play "{movieName}"</ButtonOne>;
}

function UploadButton({ movieName }) {
  return (
    // UploadButton passes its own function as the onClick prop to ButtonOne
    <ButtonOne onClick={() => alert("Uploading!")}>Upload Image</ButtonOne>
  );
}

function ToolbarOne() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}

/* when I'm building my own components, I can name their event handler props any way I want 
event handler props should start with "on" followed by a capital letter 

ButtonTwo's onClick prop could have been called onSmash */
function ButtonTwo({ onSmash, children }) {
  // <button> still needs a prop called onClick
  return <button onClick={onSmash}>{children}</button>;
}

function ToolbarTwo() {
  return (
    <div>
      <ButtonTwo onSmash={() => alert("Playing!")}>Play Movie</ButtonTwo>
      <ButtonTwo onSmash={() => alert("Uploading!")}>Upload Image</ButtonTwo>
    </div>
  );
}

/* App component does not need to know what Toolbar will do with 
onPlayMovie or onUploadImage */
function App() {
  return (
    <ToolbarThree
      onPlayMovie={() => alert("Playing!")}
      onUploadImage={() => alert("Uploading!")}
    />
  );
}

/* event handler functions are inside the component, and are named
starting with "handle" followed by the name of the event they handle

event handler props are passed to JSX elements, to assign the event
handler functions to certain DOM events, and they start with "on" 
followed by the event name 

when my component supports multiple interacts, I may name 
event handler props for app-specific concepts 
ToolbarThree receives onPlayMovie and onUploadImage event handlers */
function ToolbarThree({ onPlayMovie, onUploadImage }) {
  /* ToolbarThree passes onPlayMovie and onUploadImage down as 
  onClick handlers to its ButtonThrees, and it can trigger them
  on a keyboard shortcut */
  return (
    <div>
      <ButtonFour onClick={onPlayMovie}>Play Movie</ButtonFour>
      <ButtonFour onClick={onUploadImage}>Upload Image</ButtonFour>
    </div>
  );
}

function ButtonFour({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}

/* Event propagation
an event bubbles or propagates up a tree:
event handlers catch events from any children my component might have 
*** all events propagate in React except onScroll */
function ToolbarFour() {
  /* click on either button, its onClick will run first followed by
  the parent div's onClick */
  return (
    <div
      className="Toolbar"
      onClick={() => {
        alert("You clicked on the toolbar!");
      }}
    >
      <button onClick={() => alert("Playing!")}>Play Movie</button>
      <button onClick={() => alert("Uploading!")}>Upload Image</button>
    </div>
  );
}

/* event handlers receive an event object as their only argument 
call e.stopPropagation() to prevent an event from reaching parent components */
function ButtonFive({ onClick, children }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

function ToolbarFive() {
  /* 1. React calls the onClick handler passed to the button
     2. that handler calls e.stopPropagation(e) and then 
        calls the onClick function passed as a prop from the Toolbar 
     3. that function displays the button's own alert 
     4. the parent div's onClick handler does not run */
  return (
    <div
      className="Toolbar"
      onClick={() => {
        alert("You clicked on the toolbar!");
      }}
    >
      <ButtonFive onClick={() => alert("Playing!")}>Play Movie</ButtonFive>
      <ButtonFive onClick={() => alert("Uploading!")}>Upload Image</ButtonFive>
    </div>
  );
}

function ButtonSix({ onClick, children }) {
  return (
    /* more code can be added to this onClick handler before 
    calling the parent onClick event handler 
    
    passing handlers as alternative to propogation
    lets the child component handle the event, while also letting
    the parent specify some additional behavior */
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

/* some browser events have default behavior

here, a <form> submit event, happens when a button inside of it
is clicked, will reload the whole page by default 

calling e.preventDefault() on the event object stops this from
happening*/
function Signup() {
  return (
    <form
      onSubmit={() => {
        e.preventDefault();
        alert("Submitting!");
      }}
    >
      <input />
      <button>Send</button>
    </form>
  );
}

/* e.stopPropagation() stops event handlers to the tags above from firing
e.preventDefault() prevents default browser behavior for the few events that have it 

event handlers are the best places for side effects
(rendering functions need to be pure, so they can't have side effects) 
exs of side effects:
- change an input's value in reponse to typing
- change a list in response to a button press */

function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === "black") {
      bodyStyle.backgroundColor = "white";
    } else {
      bodyStyle.backgroundColor = "black";
    }
  }

  return <button onClick={handleClick}>Toggle the lights</button>;
}

/* queueing a series of state updates
setting state queues re-render
sometimes, I may want to perform multiple operations on the value before queueing the next render 

What "batching" is and how React uses to process multiple state updates
batching - React waits until all code in the event handlers has run before 
           processing state updates 
           this makes React run much faster
           ***React does not batch across multiple intentional events like clicks 
              each click is handled separately
How to apply several updates to the same state variable in a row 
use the functional form of the state setter/updater

React batches state updates 
***React waits until all code in the event handlers has run before 
processing state updates 
- re-render only happens after all event handler-related function calls
- this way, I can update multiple state variables, potentially from multiple
  components, without triggering too many re-renders */

/* Updating the same state multiple times before the next render 
I can do that by passing a function that calculates the next state 
based on the previous one in the queue 
this is a way of telling React to "do something with the state value" instead
of just replacing it */
function CounterThree() {
  const [number, setNumber] = useState(0);
  /* functional form of state setter
  n => n + 1 is an updater function
  updater function - when passed to a state setter
                     1. React queues the function to be processed after all other 
                        code in the event handler has run 
                     2. during next render, React goes through the queue and gives
                        me the final updated state 
  while executing the event handler, React adds each setNumber() line to a queue 
  at the end, React stores 3 as the final result and returns it from useState */
  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber((n) => n + 1);
          setNumber((n) => n + 1);
          setNumber((n) => n + 1);
        }}
      >
        +3
      </button>
    </>
  );
}

/* What happens if I update state after replacing it */
function CounterFour() {
  const [number, setNumber] = useState(0);

  /* 1. React adds "replace with 5" to its queue
     2. React adds the updater function to its queue 
  React will store 6 as the final result and return it from useState */
  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(number + 5);
          setNumber((n) => n + 1);
        }}
      >
        Increase the number
      </button>
    </>
  );
}

// What happens if I replace state after updating it
function CounterFive() {
  const [number, setNumber] = useState(0);

  /* 1. React adds replace with 5 to its queue
     2. React adds the updater function to its queue
     3. Reacts adds replace with 42 to its queue 
  React stores 42 as the final result and returns it from useState 
  
   how to think about what I pass to the state setter:
- any updater function gets added to the queue
- any other value adds the replacement to the queue, 
  ignoring what's already queued */
  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(number + 5);
          setNumber((n) => n + 1);
          setNumber(42);
        }}
      >
        Increase the number
      </button>
    </>
  );
}

function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    /* pass updater functions to increment or decrement 
    the counters in relation to the latest state rather
    than what the state was at the time of the click */
    setPending((pending) => pending + 1);
    await delay(3000);
    setPending((pending) => pending - 1);
    setCompleted((completed) => completed + 1);
  }

  return (
    <>
      <h3>Pending: {pending}</h3>
      <h3>Completed: {completed}</h3>
      <button onClick={handleClick}>Buy</button>
    </>
  );
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getFinalState(baseState, queue) {
  let finalState = baseState;
  for (let update of queue) {
    if (typeof update === "function") {
      finalState = increment(finalState);
    } else {
      finalState = update;
    }
  }
  return finalState;
}

function increment(n) {
  return n + 1;
}
increment.toString = () => "n => n+1";

function AppOne() {
  return (
    <>
      <TestCase baseState={0} queue={[1, 1, 1]} expected={1} />
      <hr />
      <TestCase
        baseState={0}
        queue={[increment, increment, increment]}
        expected={3}
      />
      <hr />
      <TestCase baseState={0} queue={[5, increment]} expected={6} />
      <hr />
      <TestCase baseState={0} queue={[5, increment, 42]} expected={42} />
    </>
  );
}

function TestCase({ baseState, queue, expected }) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>
        Base state: <b>{baseState}</b>
      </p>
      <p>
        Queue: <b>[{queue.join(", ")}]</b>
      </p>
      <p>
        Expected result: <b>{expected}</b>
      </p>
      <p
        style={{
          color: actual === expected ? "green" : "red",
        }}
      >
        Your result: <b>{actual}</b> (
        {actual === expected ? "correct" : "wrong"})
      </p>
    </>
  );
}

/* Updating Objects in State
State can hold JS objects, but I shouldn't change objects that
  I hold in React state
instead, I need to create a new one or make a copy of an 
  existing one and then set the state to use that copy */

/* numbers, strings, and booleans, these JS values are immutable,
read-only
I can trigger a re-render to replace a value */
// const [x, setX] = useState(0);
// setX(5);
/* technically, the number 0 itself did not change, it's not 
possible to make any changes to built-in primitives */

/* How to correctly update an object in React state
What's a mutation? 
mutation - change to the contents of an object iself */
// const [position, setPosition] = useState({ x: 0, y: 0 });
// position.x = 5;

/* Treat state as read-only
  What immutability is, and how not to break it 
  instead of mutating objects, I should always replace them 
  ***treat any JS object that I put into state as read-only */
function MovingDotOne() {
  // the object in state represents the current pointer position
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  /* here, React has no idea that object has changed, so React
does not do anything in response
  return (
    <div
      onPointerMove={(e) => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}

  this would actually trigger a re-render 
  a new object is created and passed to the state setting function 
  setPosition, tells React
  - replace position with this new object
  - and render this component again */
  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        });
      }}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          position: "absolute",
          backgroundColor: "red",
          borderRadius: "50%",
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  );
}
/* local mutation - mutating a fresh object I have just created is fine 
                    because no other code references it yet, and changing
                    it isn't going to impact something that depends on it
// mutation is only a problem with I change existing objects 
// that are already in state 
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);

when I store objects in state, mutating them will not trigger renders
and will change the state in previous  render "snapshots"
use {...obj, something: 'newValue'} object spread syntax to create copies of objects
*/

/* Copying objects with the spread syntax
again, I need to create a new object and pass it to the updater function 
... spread syntax is shallow and only copies things one level deep 
if I want a nested property, I'll have to use the spread syntax more than once */
function FormThree() {
  /* I didn't declare a separate state variable for each input
  for large forms, keep all data grouped in an object is convenient */
  const [person, setPerson] = useState({
    firstName: "Barbara",
    lastName: "Hepworth",
    email: "bhepworth@sculpture.com",
  });

  // I want to also copy existing data into it bc only one field has changed
  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value,
    });
  }
  // I want to also copy existing data into it bc only one field has changed
  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value,
    });
  }

  // I want to also copy existing data into it bc only one field has changed
  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value,
    });
  }

  return (
    <>
      <label>
        First name:
        <input value={person.firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={person.lastName} onChange={handleLastNameChange} />
      </label>
      <label>
        Email:
        <input value={person.email} onChange={handleEmailChange} />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
    </>
  );
}

function FormFour() {
  const [person, setPerson] = useState({
    firstName: "Barbara",
    lastName: "Hepworth",
    email: "bhepworth@sculpture.com",
  });

  function handleChange(e) {
    setPerson({
      ...person,
      /* [ ] can be used inside my object definition
      to specify a property with dynamic name
      now the example has only one event handler instead
      of three different event handlers 
      e.target.name refers to the name property given to 
      the input DOM element */
      [e.target.name]: e.target.value,
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input name="email" value={person.email} onChange={handleChange} />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
    </>
  );
}

/* Updating a nested object
  nested objects aren't actually nested
  they're actually separate objects "pointing" at each other with properties
  How to update a nested object without mutating it 
  
  to update a nested object, I need to create copies all the way up from
  the place I am updating */
function FormFive() {
  const [person, setPerson] = useState({
    name: "Niki de Saint Phalle",
    artwork: {
      title: "Blue Nana",
      city: "Hamburg",
      image: "https://i.imgur.com/Sd1AgUOm.jpg",
    },
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value,
    });
  }

  // updating a nested object in a single function call
  function handleTitleChange(e) {
    setPerson({
      ...person, // Copy other fields
      artwork: {
        // but replace the artwork
        ...person.artwork, // with the same one
        title: e.target.value, // but in New Delhi
      },
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value,
      },
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value,
      },
    });
  }

  return (
    <>
      <label>
        Name:
        <input value={person.name} onChange={handleNameChange} />
      </label>
      <label>
        Title:
        <input value={person.artwork.title} onChange={handleTitleChange} />
      </label>
      <label>
        City:
        <input value={person.artwork.city} onChange={handleCityChange} />
      </label>
      <label>
        Image:
        <input value={person.artwork.image} onChange={handleImageChange} />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {" by "}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img src={person.artwork.image} alt={person.artwork.title} />
    </>
  );
}

/* Write a concise update logic with Immer */
function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: "Ranjani",
    lastName: "Shettar",
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value,
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>{" "}
        <button onClick={handlePlusClick}>+1</button>
      </label>
      <label>
        First name:
        <input value={player.firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={player.lastName} onChange={handleLastNameChange} />
      </label>
    </>
  );
}

function Background({ position }) {
  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
        width: 250,
        height: 250,
        backgroundColor: "rgba(200, 200, 0, 0.2)",
      }}
    />
  );
}

function Box({ children, color, position, onMove }) {
  const [lastCoordinates, setLastCoordinates] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: "grab",
        backgroundColor: color,
        position: "absolute",
        border: "1px solid black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >
      {children}
    </div>
  );
}

const initialPosition = {
  x: 0,
  y: 0,
};

function Canvas() {
  const [shape, setShape] = useState({
    color: "orange",
    position: initialPosition,
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      },
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value,
    });
  }

  return (
    <>
      <select value={shape.color} onChange={handleColorChange}>
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background position={initialPosition} />
      <Box color={shape.color} position={shape.position} onMove={handleMove}>
        Drag me!
      </Box>
    </>
  );
}

/* Updating arrays in state
like with objects, if I want to update an array stored in state, I need to
create a new one or making a copy of an existing one, and then set state to
use the new array

Updating arrays without mutation
for updating an array, pass a new array to the state setting function
I can create a new array from the original array in my state by calling non-mutating
methods like filter() and map(), then set my state to the resulting new array
avoid push and unshift for adding - prefer concat and [...arr]
avoid pop, shift, and splice for removing - prefer filter and slice
splice - mutates to insert or delete items  slice - lets me copy an array or a part of it
(In React, I will use slice a lot more often than splice)
avoid splice and arr[i] = ... for replacing - prefer map
avoid reverse and sort for sorting - prefer copying the array first 

I can put arrays into state, but I can't change them
instead of mutating an array, I need to create new version of it, and update the state to it

How to add, remove, or change items in an array in React state
Adding to an array
*/
let theNextId = 0;

function List() {
  const [name, setName] = useState("");
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => {
          // create a new array which contains the existing
          // items and a new item at the end
          setArtists(
            // replace the state
            [
              // with a new array
              ...artists, // that contains all the old items
              { id: theNextId++, name: name },
            ]
          ); // and one new item at the end
          // setArtists([ // or I can prepend an item by placing it before the original array
          // </>{ id: nextId++, name: name },
          // ...artists // Put old items at the end
          // ]);
        }}
      >
        Add
      </button>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
/* spread can do the job of both push() by adding to the end of an 
array and unshift() by adding to the beginning of an array 

I can use [...arr, newItem] array spread syntax to create arrays with new items */

/* Removing from an array
easiest way to remove an item from an array is to filter it out */
let initialArtists = [
  { id: 0, name: "Marta Colvin Andrade" },
  { id: 1, name: "Lamidi Olonade Fakeye" },
  { id: 2, name: "Louise Nevelson" },
];

function ListOne() {
  const [artists, setArtists] = useState(initialArtists);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>
            {artist.name}{" "}
            <button
              onClick={() => {
                /* clicking with create an array that consists of those artists 
                whose IDs are different from artist.id 
                and then request a re-render with the resulting array */
                setArtists(artists.filter((a) => a.id !== artist.id));
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

// Transforming an array
// I can use filter() and map() to create new arrays with
// filtered or transformed items
let initialShapes = [
  { id: 0, type: "circle", x: 50, y: 100 },
  { id: 1, type: "square", x: 150, y: 100 },
  { id: 2, type: "circle", x: 250, y: 100 },
];

function ShapeEditor() {
  const [shapes, setShapes] = useState(initialShapes);

  function handleClick() {
    /* to change some or all items of an array, 
    map() creates a new nextShapes array */
    const nextShapes = shapes.map((shape) => {
      if (shape.type === "square") {
        // No change
        return shape;
      } else {
        // Return a new circle 50px below
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Re-render with the new array
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>Move circles down!</button>
      {shapes.map((shape) => (
        <div
          key={shape.id}
          style={{
            background: "purple",
            position: "absolute",
            left: shape.x,
            top: shape.y,
            borderRadius: shape.type === "circle" ? "50%" : "",
            width: 20,
            height: 20,
          }}
        />
      ))}
    </>
  );
}

/* Replacing items in an array
to replace an item, create a new array with map */
let initialCounters = [0, 0, 0];

function CounterList() {
  const [counters, setCounters] = useState(initialCounters);

  function handleIncrementClick(index) {
    // inside my map call, receive the item index as the second argument
    const nextCounters = counters.map((c, i) => {
      // or do something else
      if (i === index) {
        // Increment the clicked counter
        return c + 1;
        // use it to decide whether to return the original item (the first argument)
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button
            onClick={() => {
              handleIncrementClick(i);
            }}
          >
            +1
          </button>
        </li>
      ))}
    </ul>
  );
}

/* Inserting into an array */
let thisNextId = 3;
const theInitialArtists = [
  { id: 0, name: "Marta Colvin Andrade" },
  { id: 1, name: "Lamidi Olonade Fakeye" },
  { id: 2, name: "Louise Nevelson" },
];

function ListTwo() {
  const [name, setName] = useState("");
  const [artists, setArtists] = useState(theInitialArtists);

  function handleClick() {
    // insert button will always insert at index 1
    const insertAt = 1; // Could be any index
    const nextArtists = [
      // spread the slice ofitems before the insertion point:
      ...artists.slice(0, insertAt),
      // New item:
      /* thisNextId++ post-increment, current value of thisNextId, 3, 
      is assigned to the id field of the new artist
      after that, thisNextId is incremented */
      { id: thisNextId++, name: name },
      // Items after the insertion point:
      ...artists.slice(insertAt),
    ];
    setArtists(nextArtists);
    setName("");
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleClick}>Insert</button>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}

/* Making other changes to an array 
JS reverse() and sort() mutate the original array, so I can't use
them directly, but I can copy the array first and then make changes to it */
const thisInitialList = [
  { id: 0, title: "Big Bellies" },
  { id: 1, title: "Lunar Landscape" },
  { id: 2, title: "Terracotta Army" },
];

export default function ListThree() {
  const [list, setList] = useState(thisInitialList);

  function handleClick() {
    // copy the array first
    /* even if I copy the array, I can't mutate existing
    items inside of it directly bc copying is shallow
    the new array will contain the same items as the original one 
    I can solve this issue by doing what I did 
    to update nested JS objects, by copying individual items
    I want to change instead of mutating them */
    const nextList = [...list];
    // use the mutating method
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>Reverse</button>
      <ul>
        {list.map((artwork) => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}

/* How to update an object inside of an array
Updating objects inside arrays 
objects aren't really "inside" arrays
each object in an array is a separate value to which the array "points"
another array may "point" to the same object
when updating nested state, I need to create copies from the 
point where I want to update, and all the way up to the top level */

let thatNextId = 3;
const thatInitialList = [
  { id: 0, title: "Big Bellies", seen: false },
  { id: 1, title: "Lunar Landscape", seen: false },
  { id: 2, title: "Terracotta Army", seen: true },
];

function BucketList() {
  const [myList, setMyList] = useState(thatInitialList);
  const [yourList, setYourList] = useState(thatInitialList);

  function handleToggleMyList(artworkId, nextSeen) {
    /* myNextList array is new, but the items themselves 
    are the same as in the myList array,
    so changing artwork.seen changes the original artwork item
    const myNextList = [...myList];
    const artwork = myNextList.find(a => a.id === artworkId);
    artwork.seen = nextSeen; // Problem: mutates an existing item
    setMyList(myNextList); 
    */
    /* map substitutes an old item with its updated version 
    without mutation */
    setMyList(
      myList.map((artwork) => {
        if (artwork.id === artworkId) {
          // Create a *new* object with changes
          // ... object spread syntax creates a copy of the objects
          // none of the existing state items are being mutated
          return { ...artwork, seen: nextSeen };
        } else {
          // No changes
          return artwork;
        }
      })
    );
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(
      yourList.map((artwork) => {
        if (artwork.id === artworkId) {
          // Create a *new* object with changes
          return { ...artwork, seen: nextSeen };
        } else {
          // No changes
          return artwork;
        }
      })
    );
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList artworks={myList} onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList artworks={yourList} onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map((artwork) => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={(e) => {
                onToggle(artwork.id, e.target.checked);
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}

/* I should only mutate objects that I have just created 
if I'm dealing with something that's already in state, I need to make a copy */

const initialProducts = [
  {
    id: 0,
    name: "Baklava",
    count: 1,
  },
  {
    id: 1,
    name: "Cheese",
    count: 5,
  },
  {
    id: 2,
    name: "Spaghetti",
    count: 2,
  },
];

function ShoppingCart() {
  const [products, setProducts] = useState(initialProducts);

  function handleIncreaseClick(productId) {
    setProducts(
      // iterates through products array
      products.map((product) => {
        // if product.id matches productId
        if (product.id === productId) {
          // returns a new updated product object
          return {
            ...product,
            count: product.count + 1,
          };
          // otherwise, return product
        } else {
          return product;
        }
      })
    );
  }

  function handleDecreaseClick(productId) {
    setProducts(
      products
        // iterates through products array
        .map((product) => {
          // if product.id matches productId and the product.count is greater than 0
          if (product.id === productId && product.count > 0) {
            // return a new updated product object
            return {
              ...product,
              // Decrease the count if it's greater than 1
              count: product.count - 1,
            };
          }
          // otherwise, return object
          return product;
        })
        // remove the product if product.id matches productId and its count is 0
        .filter((product) => !(product.id === productId && product.count === 0))
    );
  }

  /* 
  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }
  */

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.name} (<b>{product.count}</b>)
          <button
            onClick={() => {
              handleIncreaseClick(product.id);
            }}
          >
            +
          </button>
          <button
            onClick={() => {
              handleDecreaseClick(product.id);
            }}
          >
            –
          </button>
        </li>
      ))}
    </ul>
  );
}

function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState("");
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() => {
          setTitle("");
          onAddTodo(title);
        }}
      >
        Add
      </button>
    </>
  );
}

function TaskList({ todos, onChangeTodo, onDeleteTodo }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <Task todo={todo} onChange={onChangeTodo} onDelete={onDeleteTodo} />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={(e) => {
            onChange({
              ...todo,
              title: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={(e) => {
          onChange({
            ...todo,
            done: e.target.checked,
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </label>
  );
}

let hereNextId = 3;
const initialTodos = [
  { id: 0, title: "Buy milk", done: true },
  { id: 1, title: "Eat tacos", done: false },
  { id: 2, title: "Brew tea", done: false },
];

function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([...todos, { id: hereNextId++, title: title, done: false }]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(
      todos.map((todo) => {
        if (todo.id === nextTodo.id) {
          return nextTodo;
        } else {
          return todo;
        }
      })
    );

    function handleDeleteTodo(todoId) {
      setTodos(todos.filter((todo) => todo.id !== todoId));
    }

    return (
      <>
        <AddTodo onAddTodo={handleAddTodo} />
        <TaskList
          todos={todos}
          onChangeTodo={handleChangeTodo}
          onDeleteTodo={handleDeleteTodo}
        />
      </>
    );
  }
}

export {
  Person,
  PersonOne,
  CustomInput,
  Form,
  Counter,
  CounterOne,
  CounterTwo,
  FormOne,
  TrafficLight,
  MovingDot,
  FeedbackForm,
  FormTwo,
  Menu,
  MenuOne,
  MenuTwo,
  TravelPlan,
  TravelPlanOne,
  MailClient,
  MailClientOne,
  Button,
  Toolbar,
  ToolbarOne,
  ToolbarTwo,
  ToolbarThree,
  ToolbarFour,
  ToolbarFive,
  Signup,
  LightSwitch,
  CounterThree,
  CounterFour,
  CounterFive,
  RequestTracker,
  AppOne,
  MovingDotOne,
  FormThree,
  FormFour,
  FormFive,
  Scoreboard,
  Canvas,
  List,
  ListOne,
  ShapeEditor,
  CounterList,
  ListTwo,
  ListThree,
  BucketList,
  ShoppingCart,
  TaskApp,
};
