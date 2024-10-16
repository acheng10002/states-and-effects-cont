/* useState - React hook that I can call from my component 
              and it lets my component "remember" things */
import { useEffect, createContext, useContext, useState, useMemo } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

/* code in App.jsx creates components
component - piece of resuable code that represents a part of a UI 
            it renders, manages, and updates the UI elements in my app */

function App() {
  /* whatever comes after "return" is returned as a value to 
  the caller of the function */
  return (
    </* JSX elements -combo of JS code and HTML that describes
    what I want to display */>
      <h1>States and Effects More</h1>
    </>
  );
}

function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState("");
  return (
    </* placeholder, value, and onChange are all props
    props - properties */>
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

let nextId = 3;
const initialTodos = [
  { id: 0, title: "Buy milk", done: true },
  { id: 1, title: "Eat tacos", done: false },
  { id: 2, title: "Brew tea", done: false },
];

function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false,
      },
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(
      todos.map((t) => {
        if (t.id === nextTodo.id) {
          return nextTodo;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTodo(todoId) {
    setTodos(todos.filter((t) => t.id !== todoId));
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

/* Reacting to Input with State

React is a declarative way to manipulate the UI 
I describe the different states my React components can be in
and switch between the different states in response to user input 

How declarative UI programming differs from imperative UI programming
How to enumerate the different visual state my component can be in
How to trigger the changes between the different visual states from code 

- user types something into the form, "Submit" button becomes enabled
- user presses "Submit", both the form and button become disabled
- spinner appears
- if the network request succeeds, form gets hidden, and "Thank you" message appears
- if the network request fails, form becomes enabled again, and error message appears
each element is "commanded," the computer told how to update the UI 
*/

/* this mock is controlled by a prop called "status" with a 
default value of 'empty' 

mocking lets me quickly iterate on the UI before I wire up any logic 

try 'submitting', 'error', 'success' */
function Form({ status = "empty" }) {
  if (status === "success") {
    return <h1>That's right!</h1>;
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={status === "submitting"} />
        <br />
        <button disabled={status === "empty" || status === "submitting"}>
          Submit
        </button>
        {status === "error" && (
          <p className="Error">Good guess but a wrong answer. Try again!</p>
        )}
      </form>
    </>
  );
}

/* if a component has a lot of visual states, it can be convenient to
show them all on one page 
pages like this are called living styleguides or storybooks */
let statuses = ["empty", "typing", "submitting", "success", "error"];

function AppOne() {
  return (
    <>
      {statuses.map((status) => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}

/* I will need to change state in response to some different inputs:
***human inputs often require event handlers 
- changing the text input (human) should switch it from the Empty state to the 
  Typing state or back, depending on whether the text box is empty or not
- clicking the Submit button (human) should switch it to the Submitting state
- successful network response (computer) should switch it to the Success state
- failed network response (computer) should switch it to the Error state with
  the matching error message 
  
empty --(starting typing--> typing --(press submit)--> submitting
                            error <--(network error)--__|      |__--(network success)--> success
                          
sketch out flows this way and sort out bugs before implementation! 

start with the state that absolutely must be there 
exs. the answer for the input will need to be stored 
     error will store the last error 
const [answer, setAnswer] = useState("");
const [error, setError] = useState(null); */

/* I'll a state variable to represent each of the visual states I want to display
I will need to experiment with this 
start by adding enough state that I'm definitely sure that all the possible 
visual states are covered 
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false); */

/* this code is a lot less fragile than the imperative example 
- expressing all interctions as state changes lets me introduce 
  new visual state without breaking existing ones 
- I can also change what should be displayed in each state 
  without changing the logic of the interaction itself
  */
function FormOne() {
  // answer will hold the value typed into <textarea>
  const [answer, setAnswer] = useState("");
  // error stores any error that occurs during submission
  const [error, setError] = useState(null);
  /* status represents the current status of the form 
  "typing", "submitting", "success" */
  const [status, setStatus] = useState("typing");

  /* conditional rendering
  if status is "success", component immediately returns a heading
  and stops rendering the rest of the form */
  if (status === "success") {
    return <h1>That's right!</h1>;
  }

  async function handleSubmit(e) {
    // prevents the default form submission behavior
    e.preventDefault();

    // sets the status to submitting
    setStatus("submitting");
    try {
      // calls the async submitForm function
      await submitForm(answer);

      // if resolved, sets status to success
      setStatus("success");
    } catch (err) {
      // if an error occurs, revert status to typing
      setStatus("typing");

      // store the error message
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    // updates the "answer" state with the current value of the textarea
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>

      <form
        onSubmit={
          handleSubmit
        } /* submits the form data when the Submit button is clicked */
      >
        <textarea
          value={answer} /* binds the textarea value to the answer state */
          onChange={
            handleTextareaChange
          } /* updates the answer state when the user types */
          disabled={
            status === "submitting"
          } /* disables the form while the form is submitting */
        />
        <br />
        <button
          disabled={
            answer.length === 0 || status === "submitting"
          } /* disables the button 
        when answer is empty or form is submitting */
        >
          Submit
        </button>
        {
          /* displays an error message if error is not null */
          error !== null && <p className="Error">{error.message} </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // simulates a network request with a Promise
  return new Promise((resolve, reject) => {
    // delays the response by 1.5 seconds
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== "lima";
      // if lowercase answer is not "lima", reject the promise with an error message
      if (shouldError) {
        reject(new Error("Good guess but a wrong answer. Try again!"));
        // if the answer is correct, resolve the promise
      } else {
        resolve();
      }
    }, 1500);
  });
}
/* FormOne component handles a city quiz form where users submit an answer
useState manages form state (answer, error, and status)
the form behaves differently based on status ("typing", "submitting", or "success") 
  with conditional rendering and error handling
submitForm simulates an async check to see if the answer is correct
this is typical React form handling with validation and error management */
function Picture() {
  const [background, setBackground] = useState("background background--active");
  const [pictureBorder, setPictureBorder] = useState("picture");

  function handlePictureClick(e) {
    e.stopPropagation();
    if (background === "background background--active") {
      setBackground("background");
      setPictureBorder("picture picture--active");
    }
  }

  function handleBackgroundClick() {
    if (pictureBorder === "picture picture--active") {
      setBackground("background background--active");
      setPictureBorder("picture");
    } else {
      setBackground("background");
      setPictureBorder("picture picture--active");
    }
  }

  return (
    <div className={background} onClick={handleBackgroundClick}>
      <img
        className={pictureBorder}
        onClick={handlePictureClick}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}

/* clicking on the picture removes the purple background and highlights the picture border. 
Clicking outside the picture highlights the background, but removes the picture border highlight. */

function PictureOne() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = "background background--active";
  let pictureClassName = "picture";
  if (isActive) {
    backgroundClassName = "background";
    pictureClassName = "picture picture--active";
  }

  return (
    <div className={backgroundClassName} onClick={() => setIsActive(false)}>
      <img
        className={pictureClassName}
        onClick={(e) => {
          e.stopPropagation();
          setIsActive(true);
        }}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}

function PictureTwo() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    // I can return two separate chunks of JSX
    return (
      <div className="background" onClick={() => setIsActive(false)}>
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}

function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("Jane ");
  const [lastName, setLastName] = useState("Jacobs");

  let boldTextStyle = {};
  let inputStyle = { display: "none" };
  let buttonText = "Edit Profile";

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  if (isEditing) {
    boldTextStyle = { display: "none" };
    inputStyle = {};
    buttonText = "Save Profile";
  }

  return (
    <form>
      <label>
        First name: <b style={boldTextStyle}>{firstName}</b>
        <input
          style={inputStyle}
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name: <b style={boldTextStyle}>{lastName}</b>
        <input
          style={inputStyle}
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsEditing(!isEditing);
        }}
      >
        {buttonText}
      </button>
      <p>
        <i>
          Hello, {firstName} {lastName}!
        </i>
      </p>
    </form>
  );
}

function EditProfileOne() {
  /* setting two state variables, one of which is the
  fullName object */
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState({
    firstName: "Jane ",
    lastName: "Jacobs",
  });

  /* event handler that updates the fullName state
  object when the user types in either the firstName
  or lastName inputs 
  e is the onChange event */
  const handleNameChange = (e) => {
    /* e.target is the input that triggered the onChange event 
    { name, value } destructures e.target 
     name - name attribute of the input field 
     value - current value entered in the input field */
    const { name, value } = e.target;
    /* calls the state updater function full fullName to 
    create a new state object*/
    setFullName({
      /* spread copies all existing properties from the 
      furrent fullName state */
      ...fullName,
      /* uses the name extracted earlier as a key, either 
      firstName or lastName, and assigns it the value from
      the input */
      [name]: value,
    });
  };

  const toggleEditing = (e) => {
    e.preventDefault();
    setIsEditing(!isEditing);
  };

  return (
    <form>
      <label>
        First name:{" "}
        {isEditing ? (
          <input
            name="firstName"
            value={fullName.firstName}
            onChange={handleNameChange}
          />
        ) : (
          <b>{fullName.firstName}</b>
        )}
      </label>
      <label>
        Last name:{" "}
        {isEditing ? (
          <input
            name="lastName"
            value={fullName.lastName}
            onChange={handleNameChange}
          />
        ) : (
          <b>{fullName.lastName}</b>
        )}
      </label>
      <button onClick={toggleEditing}>
        {isEditing ? "Save Profile" : "Edit Profile"}
      </button>
      <p>
        <i>
          Hello, {fullName.firstName} {fullName.lastName}!
        </i>
      </p>
    </form>
  );
}

function EditProfileTwo() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("Jane");
  const [lastName, setLastName] = useState("Jacobs");

  return (
    /* prevents page reload on Submit */
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setIsEditing(!isEditing);
      }}
    >
      <label>
        First name:{" "}
        {isEditing ? (
          /* if isEditing is true, update firstName state
          variable to be the value of the onChange event target,
          have the same value be the input's value */
          <input
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
        ) : (
          /* if isEditing is false, don't display input
          and only show bolded firstName and lastName */
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{" "}
        {isEditing ? (
          <input
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button /* if isEditing is true, button text should be Save 
              otherwise, it should be Edit */
        type="submit"
      >
        {isEditing ? "Save" : "Edit"} Profile
      </button>
      <p>
        <i>
          Hello, {firstName} {lastName}!
        </i>
      </p>
    </form>
  );
}

/* const [isActive, setIsActive] = useState(false);

  let backgroundClassName = "background background--active";
  let pictureClassName = "picture";
  if (isActive) {
    backgroundClassName = "background";
    pictureClassName = "picture picture--active";
  }

  const [isEditing, setIsEditing] = useState(false);

  let boldTextStyle = {""};
  let inputStyle =  { display: "none"};
  let buttonText = "Edit Profile";

  if (isEditing) {
    boldTextStyle = { display: "none" };
    inputStyle =  {""};
    buttonText = "Save Profile";
  
  }

    is Editing false
    - <b> element, remove display: none
    - inputs, display: none
    - button, Edit Profile

   isEditing true
    - <b> element, display: none
    - inputs, remove display: none
    - button, Save Profile
*/

/* Sharing State Between Components
lifting state up - when I want the state of two components to always
                   change together:
                   - remove state from both of them
                   - move the state to their closest common parent
                   - then pass the state down to them via props 
How to share state between components by lifting it up
change the Accordion so that only one panel is expanded at any given time
to coordinate the two panels, I need to lift their state up to a parent
component:
1. remove state from the child components */
function Panel({ title, children, isActive, onShow }) {
  // 1. remove state from the child components
  //    parent component will pass isActive to Panel as a prop instead
  //    Panel's parent component can control isActive, and Panel now has
  //    no control over the value of isActive
  // const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {
        /* initially, Accordion's activeIndex is 0, so fist Panel 
        receives isActive = true
        when Accordion's activeIndex is 1, the second Panel
        receives isActive = true */
        isActive ? (
          <p>{children}</p>
        ) : (
          /* button uses Panel's onShow prop as its click event handler
        <button onClick={() => setIsActive(true)}>Show</button> */
          <button onClick={onShow}>Show</button>
        )
      }
    </section>
  );
}

function Accordion() {
  /* 3. add state to the common parent and pass it down together with the event handlers
        Accordion needs to keep track of which panel is the active one
        Accordion can use a number as the index of the active Panel for the state variable 
        
        using the active index here ensures that only one panel is active at a given time */
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    </* 2. pass hardcoded data from the common parent
           Accordion parent component will become "source of truth" for which
           panel is current active 
           Accordion now passes a hardcoded value of isActive to both panels 
      clicking Show button in either Panel needs to change the activeIndex in
      Accordion Panel itself can't directly set the activeIndex because it's
      defined inside Accordion 
      
      /* Accordion explicitly allow the Panels to change activeIndex by passing
      an event handler down as a prop */>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        /* passing down the onShow event handler to the Panel child allows 
        the child to change the parent's activeIndex state */
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest
        city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for
        "apple" and is often translated as "full of apples". In fact, the region
        surrounding Almaty is thought to be the ancestral home of the apple, and
        the wild <i lang="la">Malus sieversii</i> is considered a likely
        candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

/* What are controlled and uncontrolled components 
uncontrolled components - components with some local state 
ex. the original Panel component with an isActive state is uncontrolled because
    its parent can't influence whether the panel is active or not 
controlled components - componenets that has important information driven by 
                        props rather than its own local state 
ex. Panel component with the isActive prop controlled by the Accordion component 

uncontrolled componenets require less configuration, so they're easier to use 
within their parents, they're less flexible when I want to coordinate them together
controlled components require the parent component to fully configure them with props, 
they're maximally flexible

when writing a component, consider which information in it should be controlled via
props and which information should be uncontrolled via state 

client-side routing libraries (JS lirares that allow me to manage navigation and routing
within a Single Page Application on the client side, without requiring a full page reload)
are implemented by storing the current route in the React state, and passing it down by props 

client-side routing updates the URL and renders the necessary components dynamically 
within the browser */

/* control of text state is given to the SyncedInputs parent 
now SyncedInputs will pass text state to Input as a prop 
SyncedInputs is the "source of truth" for text that appears in the inputs */
function SyncedInputs() {
  const [text, setText] = useState("");

  function handleChange(e) {
    setText(e.target.value);
  }
  return (
    </* if first input has onChange event, text is set to the 
    value of the onChange event target */>
      <Input
        label="First input"
        onChange={handleChange}
        value={text}
        /* if second input has onChange event, text is set to the 
      value of the onChange event target 
      
      SyncedInputs explicitly allow the Input component to change the
      text state by passing event handler (handleChange function) 
      down as a prop */
      />
      <Input label="Second input" onChange={handleChange} value={text} />
    </>
  );
}

// text is a prop of Input
function Input({ label, value, onChange }) {
  return (
    <label /* <input> inside of Input uses the handleChange prop as 
    its change event handler */
    >
      {label} <input value={value} onChange={onChange} />
    </label>
  );
}

/* items is an array of objects where each object has a name property
query is a string representing the search query used to filter the items */
function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter((item) =>
    /* for each item, split its name value into an array of words 
    some() method checks whether at least one word in this array meets the
    condition: if lowercase word begins with the query string 
    if any lowercase word starts with query, some() returns true and that
    item is included in the final filtered array */
    item.name.split(" ").some((word) => word.toLowerCase().startsWith(query))
  );
}

const foods = [
  {
    id: 0,
    name: "Sushi",
    description:
      "Sushi is a traditional Japanese dish of prepared vinegared rice",
  },
  {
    id: 1,
    name: "Dal",
    description:
      "The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added",
  },
  {
    id: 2,
    name: "Pierogi",
    description:
      "Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water",
  },
  {
    id: 3,
    name: "Shish kebab",
    description:
      "Shish kebab is a popular meal of skewered and grilled cubes of meat.",
  },
  {
    id: 4,
    name: "Dim sum",
    description:
      "Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch",
  },
];

function FilterableList() {
  // lift query state up into FilterableList component
  const [query, setQuery] = useState("");
  // get the filtered list to pass down to the List
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }
  return (
    <>
      <SearchBar query={query} onChange={handleChange} />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search: <input value={query} onChange={onChange} />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map((food) => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* Preserving and Resetting State 
state is isolated between components
React keeps track of which state belongs to which component 
  based on their place in the UI tree 
I can control when to preserve state and when to reset it
  between re-renders 

When React chooses to preserve or reset the state
  - Same component at the same position preserves state
    - As long as the component is being rendered at its position
      in the UI tree, React will preserve its state 
    - if the component gets removed, or a different component
      gets rendered at the same position, React discardds it 
*/
function AppFive() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div /* whether isFancy is true or false, a CounterFive component
    is always the first child of the div returned from the root App
    component 
    ***updating the AppFive state does not reset the CounterFive because
    CounterFive stays in the same position */
    >
      {isFancy ? (
        <CounterFive isFancy={true} />
      ) : (
        <CounterFive isFancy={false} />
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          /* when the checkbox is checked or cleared, CounterFive state 
          does not get reset */
          onChange={(e) => {
            setIsFancy(e.target.checked);
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function CounterFive({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  /* hover state allows the counter to be highlighted 
  yellow when the pointer is on the div */
  if (hover) {
    className += " hover";
  }
  if (isFancy) {
    className += " fancy";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}

function AppSix() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    /* it's the position in the UI tree, not the
    JSX markup, that matters to React */
    return (
      <div>
        <CounterSix isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            /* I might expect the state to reset when I check 
            the checkbox, but it doesn't
            ***both the <CounterSix /> tags are rendered at the
            same position, so state isn't reset 
            all React sees is the true I return 
            in both cases here, AppSix returns a div with 
            CounterSix as a first child 
            the two counters have the same address, first child
            of the first child of the root */
            onChange={(e) => {
              setIsFancy(e.target.checked);
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <CounterSix isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={(e) => {
            setIsFancy(e.target.checked);
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function CounterSix({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }
  if (isFancy) {
    className += " fancy";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}

/* Different components at the same position reset state 

here, checking the checkbox replaces <Counter> with a <p>
and state is reset
*/
function AppSeven() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div /* isPaused is false, so initially the first child of
    the div container a CounterSeven component */
    >
      {isPaused ? <p>See you later!</p> : <CounterSeven />}
      <label>
        <input
          type="checkbox"
          /* checking the box makes isPaused true which then 
          swaps the CounterSeven component for a p, and React
          deletes the CounterSeven from the UI tree and
          destroys its state
          React adds <p>
          when switching back, <p> is deleted and CounterSeven
          is added */
          checked={isPaused}
          onChange={(e) => {
            setIsPaused(e.target.checked);
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function CounterSeven() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}

function AppEight() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div /* when I render a different component in the same 
        position, it resets the state of its entire subtree
        the counter state gets reset this time, first the first
        child of the div changes from a div to a section */
    >
      {isFancy ? (
        <div>
          <CounterEight isFancy={true} />
        </div>
      ) : (
        <section /* when the child div is removed from the DOM,
                the whole tree below it including the Counter 
                and its state get destroyed 
                when section changes to div, section is deleted
                and new div is added */
        >
          <CounterEight isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={(e) => {
            setIsFancy(e.target.checked);
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function CounterEight({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }
  if (isFancy) {
    className += " fancy";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}

/* if I want to preserve state between re-renders, structure of 
my tree needs to match up from one render to another 

***Always declare component functions at the top level, and don't
nest their definitions */

/* How to force React to reset component's state 
by default, React preserves state of a component while it stays
at the same position 
sometimes I will want to reset a component's state 
currently when I change the player, the score is preserved 
because the two CounterNine components appear in the same
position, and React sees them as the same CounterNine whose
person prop has changed */
function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <CounterNine person="Taylor" />
      ) : (
        <CounterNine person="Sarah" />
      )}
      <button
        onClick={() => {
          setIsPlayerA(!isPlayerA);
        }}
      >
        Next player!
      </button>
    </div>
  );
}

function CounterNine({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>
        {person}'s score: {score}
      </h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}

/* Resetting state at the same position
    Option 1: Rendering a component in different positions */
function ScoreboardOne() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div /* initially isPlayerA is true, so the first position
         contains a CounterNine and the second one is empty */
    >
      {isPlayerA && <CounterNine person="Taylor" />}
      {/* */ !isPlayerA && <CounterNine person="Sarah" />}
      <button /* when clicked, the first position clears and 
              the second one now contains a CounterNine */
        onClick={() => {
          setIsPlayerA(!isPlayerA);
        }}
      >
        Next player!
      </button>
    </div>
  );
}
/* each CounterNine's state gets destroyed each time it's removed
from the DOM */

/* Option 2: Resetting state with a key, giving each component
              an explicit identity 
keys get used for rendering lists...
they can also be used to make React distinguish between any components 
React uses order within the parent to discern between components
but keys let me tell React that this isn't just a first counter, or 
  a second counter, but a specific counter 
*/
function ScoreboardTwo() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        /* two CounterNines don't share state even though they 
        appear in the same place */
        <CounterNine key="Taylor" person="Taylor" />
      ) : (
        <CounterNine key="Sarah" person="Sarah" />
      )}
      <button
        onClick={() => {
          setIsPlayerA(!isPlayerA);
        }}
      >
        Next player!
      </button>
    </div>
  );
}
/* specifying a key tells React to use the key itself as a part
of the position, instead of their order within the parent 
every time a counter appears on the screen, its state is created
every time it is removed, its state is destroyed
toggling between them resets their state over and over 

keys are not globally unique, they only specify the position
within the parent 

Chat component contains the text input state 
when Chat is rendered, it gets passed the contact prop from MessengerOne 
the contact prop, {to} is the selected contact object */
function Chat({ contact }) {
  const [text, setText] = useState("");
  return (
    <section className="chat">
      <textarea
        // binds the text state to the textarea element
        value={text}
        placeholder={"Chat to " + contact.name}
        // updates text state when user types in textarea
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}

/* when ContactList is render, it gets passed selectedContact from MessengerOne
the selectedContact prop, {to}, is the selected contact object 
ContactList is also passed contacts from MessengerOne
the contacts prop, {contacts}, is a predefined array of contact objects
ContactList is also passed onSelect from MessengerOne
the onSelect prop, is defined inline in MessengerOne */
function ContactList({ selectedContact, contacts, onSelect }) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          // uses contact.id as the key prop
          <li key={contact.id}>
            <button
              /* calls onSelect function with the contact object when the 
              button is clicked, allowing onSelect to update the selected
              contact in the parent component */
              onClick={() => {
                onSelect(contact);
              }}
            >
              {contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={(contact) => setTo(contact)}
        /* input state is preserved because <Chat> is rendered
      at the same position in the tree */
      />
      <Chat contact={to} />
    </div>
  );
}

const contacts = [
  { id: 0, name: "Taylor", email: "taylor@mail.com" },
  { id: 1, name: "Alice", email: "alice@mail.com" },
  { id: 2, name: "Bob", email: "bob@mail.com" },
];

/* How keys and types affect whether the state is preserved 
Resetting a form with a key

however...I don't want to let the user send a message they 
already typed to a wrong person due to an accidental click 
add a key to fix this issue
*/

function MessengerOne() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        /* when a contact button is clicked, setTo(contact updates
        the to state to the selected contact */
        onSelect={(contact) => setTo(contact)}
        /* input state is preserved because <Chat> is rendered
        at the same position in the tree */

        /* adding a key ensures that when I select a different 
        recipient, the Chat component will be recreated from scratch,
        including any state in the tree below it
        React will also re-create the DOM elements instead of resusing them */
      />
      <Chat key={to.id} contact={to} />
    </div>
  );
}
/* ways to keep the state "alive" for a component that's no longer visible:
1. I can render all chats instead of just the current one, but hide all the
   others with CSS 
2. I can lift the state up and hold the pending message for each recipient
   in the parent component 
   this way, it doesn't matter when the child component gets removed because
   it's the parent that keeps the important information
3. I can use a different source in addition to React state
   I can have the Char component initialize its state by reading from the 
   localStorage, and save the drafts there too */
function AppNine() {
  const [showHint, setShowHint] = useState(false);
  const [text, setText] = useState("");

  if (showHint) {
    return (
      <div>
        <p>
          <i>Hint: Your favorite city?</i>
        </p>
        <FormTwo text={text} setText={setText} />
        <button
          onClick={() => {
            setShowHint(false);
          }}
        >
          Hide hint
        </button>
      </div>
    );
  }
  return (
    <div>
      <FormTwo text={text} setText={setText} />
      <button
        onClick={() => {
          setShowHint(true);
        }}
      >
        Show hint
      </button>
    </div>
  );
}

function FormTwo({ text, setText }) {
  return <textarea value={text} onChange={(e) => setText(e.target.value)} />;
}

function AppTen() {
  const [showHint, setShowHint] = useState(false);

  if (showHint) {
    return (
      <div /* here, FormThree is always rendered after the conditional
           Hint paragraph and before the button, so it's consistently
           the second child inside the div regardless of whether 
           showHint is true or false */
      >
        {showHint && (
          <p>
            <i>Hint: Your favorite city?</i>
          </p>
        )}
        <FormThree />
        {showHint ? (
          <button
            onClick={() => {
              setShowHint(false);
            }}
          >
            Hide hint
          </button>
        ) : (
          <button
            onClick={() => {
              setShowHint(true);
            }}
          >
            Show hint
          </button>
        )}
      </div>
    );
  }
}

function FormThree() {
  const [text, setText] = useState("");
  return <textarea value={text} onChange={(e) => setText(e.target.value)} />;
}

function AppEleven() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={(e) => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      </* key to both Field components in both fi and else branches
      tells React how to match up the correct state for either Field 
      even if their order within the parent changes */>
        <Field key="lastName" label="Last name" />
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" />
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState("");
  return (
    <label>
      {label}:{" "}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={(e) => setText(e.target.value)}
      />
    </label>
  );
}

function ContactListOne({ contacts, selectedId, onSelect }) {
  return (
    <section>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                onSelect(contact.id);
              }}
            >
              {contact.id === selectedId ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{" "}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{" "}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <button
        onClick={() => {
          const updatedData = {
            id: initialData.id,
            name: name,
            email: email,
          };
          onSave(updatedData);
        }}
      >
        Save
      </button>
      <button
        onClick={() => {
          setName(initialData.name);
          setEmail(initialData.email);
        }}
      >
        Reset
      </button>
    </section>
  );
}

function ContactManager() {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedId, setSelectedId] = useState(0);
  const selectedContact = contacts.find((c) => c.id === selectedId);

  function handleSave(updatedData) {
    const nextContacts = contacts.map((c) => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactListOne
        contacts={contacts}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  );
}

const initialContacts = [
  { id: 0, name: "Taylor", email: "taylor@mail.com" },
  { id: 1, name: "Alice", email: "alice@mail.com" },
  { id: 2, name: "Bob", email: "bob@mail.com" },
];

function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>Next</button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>{image.place}</p>
    </>
  );
}

let images = [
  {
    place: "Penang, Malaysia",
    src: "https://i.imgur.com/FJeJR8M.jpg",
  },
  {
    place: "Lisbon, Portugal",
    src: "https://i.imgur.com/dB2LRbj.jpg",
  },
  {
    place: "Bilbao, Spain",
    src: "https://i.imgur.com/z08o2TS.jpg",
  },
  {
    place: "Valparaíso, Chile",
    src: "https://i.imgur.com/Y3utgTi.jpg",
  },
  {
    place: "Schwyz, Switzerland",
    src: "https://i.imgur.com/JBbMpWY.jpg",
  },
  {
    place: "Prague, Czechia",
    src: "https://i.imgur.com/QwUKKmF.jpg",
  },
  {
    place: "Ljubljana, Slovenia",
    src: "https://i.imgur.com/3aIiwfm.jpg",
  },
];

// contact object is passed in as a prop from the parent ContactListTwo
function Contact({ contact }) {
  /* child contact component has expanded state variable
  that is initially set to false */
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p /* value of contact's name property */>
        <b>{contact.name}</b>
      </p>
      {
        /* if expanded state is true, then render value of 
        contact's email property */
        expanded && (
          <p>
            <i>{contact.email}</i>
          </p>
        ) /* when button is clicked, toggle setExpanded */
      }
      <button
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {
          /* if expanded state is true, "Hide" email text on 
        the button, otherwise "Show" email */
          expanded ? "Hide" : "Show"
        }{" "}
        email
      </button>
    </>
  );
}

function ContactListTwo() {
  /* parent contactlisttwo component has reverse state
  variable that is initially set to false */
  const [reverse, setReverse] = useState(false);

  // make a shallow copy of contactsTwo
  const displayedContacts = [...contactsTwo];

  /* if reverse state is true, reverse the elements
  in the shallow copy of contactsTwo */
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          /* value of input is whether reverse is
          true or false */
          value={reverse}
          /* if the checkbox is checked, reverse
          is set to true */
          onChange={
            (e) => {
              setReverse(e.target.checked);
            } /* {" "} is a space character, a common way to add
          whitespace between elements or text when working with 
          JSX */
          }
        />{" "}
        Show in reverse order
      </label>
      <ul /* for each contact in the displayedContacts array, 
          render a li item with corresponding key
          and inside the li item, render a contact component
          with contact object passed in as a prop */
      >
        {displayedContacts.map((contact) => (
          /* state is associated with tree position
          a key lets me specify a named position instead of 
          relying on order */
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        ))}
      </ul>
    </>
  );
}

const contactsTwo = [
  { id: 0, name: "Alice", email: "alice@mail.com" },
  { id: 1, name: "Bob", email: "bob@mail.com" },
  { id: 2, name: "Taylor", email: "taylor@mail.com" },
];

/* Extracting State Logic into a Reducer

Passing Data Deeply with Context

Scaling Up with Reducer and Context
*/

/* value is a prop
prop - properties passed from the (Board) parent component 
       to its (Square) child component 

Square component can be passed a prop called value 
Square receives the value prop from Board
Square's onSquareClick prop is the function that 
Square will call when it is clicked 
***onSomething name for props that represent events */
function Square({ value, onSquareClick }) {
  /* current value of Square is stored in state, and
  it changes when Square is clicked 
  value state stores the current value 
  setValue can be used to change the value 
  initial value of the value state is null */
  // const [value, setValue] = useState(null);

  // making this component interactive...
  // function handleClick() {
  // Option + Command + J to view the console
  // Square displays an "X" when clicked
  /* - calling set function in the onClick handler,
         tells React to re-render that Square whenever
         its button is clicked 
       - after the update and re-render, the Square's 
         value eill be 'X' 
       - each Square has its own state */
  // setValue("X");
  // }
  /* {} - allow props to escape into JavaScript from JSX */
  return (
    /* onClick is now also a prop of the button JSX element 
    returned from Square 
    removing the button's onClick={handleClick} prop 
    Square will call onSquareClick when it is clicked */
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

/* React DevTools lets me check the props and state of my
React components */

/* React's component architecture lets me create Square,
a reusable component 

Board component is fully controlled by the props it receives 
the onPlay function Board can call with the updated squares
array when a player makes a move */
function Board({ xIsNext, squares, onPlay }) {
  /* best to lift state up...
  game's state should be stored in the parent Board component
  and the Board component can tell each SQuare what to display
    by passing a prop 
    
  ***state should be lifted up when I want to collect data from
  multiple children or to have two child components communicate
  with each other 
  parent component can pass the state back down to the children
  via props */

  /* state variables squares defaults to an array of 9 nulls
     .fill - array method that lets me change all elements 
             in an array to a static value 
             array.fill(value, startIndex, endIndex) */

  /* SUMMARY: state handling is in the parent Board component */
  // const [squares, setSquares] = useState(Array(9).fill(null));

  /* each time a player moves, xIsNext will be flipped to determine 
  which player goes next and the game's state will be saved */
  // const [xIsNext, setXIsNext] = useState(true);

  /* past squares array stored in another array/state variable 
  called history 
  history array represents all board states, from the first move
  to the last move */

  // handleClick updates the squares arrray holding my board's state
  /* handleClick is able to update any square now 
  i is the index of the square to update */
  function handleClick(i) {
    /* if the square is already filled, return early before it
    tries to update the board state 
    also return early if a player has won */
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    /* copies squares array to nextSquares with slice() Array method
    slice() - creates a shallow copy of a portion of an array 
              array.slice(startIndex, endIndex)
              startIndex defaults to 0
              endIndex defaults to the length of the array */
    const nextSquares = squares.slice();

    // handleClick is updated to flip the value of xIsNext
    if (xIsNext) {
      // updates nextSquares array to add X to the first square
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    /* let React know that the state of the component has changed 
    triggers a re-render of the componenets that uses the squares Sstate
    (parent Board component and its child Square components) 
    
    closure - inner function (handleClick) has access to variables and
              functions defined in a outer function (Board) 
              ex. handleClick can read the sqaures state and call the 
                  setSquares method because they are both defined inside
                  of Board */
    /* setSquares(nextSquares);
    setXIsNext(!xIsNext); 
    replace the calls above with a single call to onPlay function
    so the Game component can update Board when user clicks a square */
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  /* status section will display the winner if the game is over and 
  if the game is ongoing I'll display which player's turn is next */
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    </* Fragments - wrap multiple adjacent JSX elements */>
      /* group squares into rows with divs */
      <div className="status">{status}</div>
      <div
        className="board-row"
        /* Board renders each Square component with a value prop
        connect Square's onSquareClick prop to handleClick function in the Board
         Board needs to pass down onSquareClick function to Square
         and Square will call that function when a square is clicked */

        /* onSquareClick={() => handleClick(0)} pass onSquareClick the arrow
        function, () => handleClick(i), which means handleClick(i) will only
        be called after the square is clicked */

        /* SUMMARY: parent Board passes props to child Square components 
                    so that they can be displayed correctly 

                    now when a Square is clicked, it asks the parent Board
                    to update the state 

                    when the Board's state changes, both the Board and every
                    child Square re-renders automatically
          
          this allows Board to determine the winner in the future 
          
          ***handleSomething for function definitions which handle events */
      >
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

/* 1. click on Square[0] runs function that the button receives as its 
      onClick prop from Square
      Square received that function as its onSquareClick prop from Board 
      Board defined that function, handleClick, and calls it with argument 0 
  2. handleClick uses argument 0 to update the first element of the squares
     array from null to X
  3. squares state of the Board was updated, so Board and all its children
     re-render 
     value prop of the Square[0] component changes from null to X 
     
avoiding direct data mutation lets me keep previous versions of 
the data intact and reuse them later */

/* Game is the new top-level component that will display a list of past moves
history state that contains entire game history goes here */
function Game() {
  /* squares state will now need to be lifted ip from the 
  child Board to the new parent Game */
  // const [xIsNext, setXIsNext] = useState(true);
  /* currentMove state keeps track of which step the user is
  currently viewing */
  const [currentMove, setCurrentMove] = useState(0);
  // [Array(9).fill(null)] is an array with a single item, an array of 9 nulls
  const [history, setHistory] = useState([Array(9).fill(null)]);

  /* xIsNext can be figured based on the currentMove
  xIsNext === true when currentMove is even
  xIsNext === false when currentMove is odd */
  const xIsNext = currentMove % 2 === 0;
  /* for rendering squares for the current move, read the last squares
  array from the history 
  no longer rendering the final move */
  const currentSquares = history[currentMove];

  /* handlePlay will be called by Board to update the game 
  it needs to update Game's state to trigger a re-render
  using the history state variable to store information 
  history state has to be updated by appending the updated squares array as a 
  new history entry 
  also want to toggle xIsNext */
  function handlePlay(nextSquares) {
    /* if I go back in time and make a new move from that point, 
    I only want to keep the history up to that point
    I'll add nextSquares after all items in history.slice(0, currentMove + 1) 
    so that I'm only keeping that portion of the old history */
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // creates a new array that contains all the items in history, followed by nextSquares
    setHistory(nextHistory);
    /* each time a move is made, I need to update currentMove 
    to point to the latest history entry */
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    // updates the currentMove
    setCurrentMove(nextMove);
    // sets xISNExt to true of the number that I'm changing currentMove to is even
    setXIsNext(nextMove % 2 === 0);
  }

  /* transform an array of history moves in state to an array of 
  React button elements, that allow user to "jump" to past moves 
  squares argument goes through each element of history
  move arguments foes through each array index 
  */
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      /* for each move in the game's history, I create a li which
      contains a button with an onClick handler that calls the jumpTo
      function 
      React needs a key property for each list item to differentiate
      each from its siblings 
      when a list is re-rendered, React takes each list item's key, 
      searches the previous list's items for a matching key... 
      if the current list has a key that didn't exist before, 
      React creates a componenet 
      if the current list is missing a key that existed in the previous listm
      React destroys the previous component
      if two keys match, the corresponding component is moved 
      
      keys tell React about the identity of each component
      this allows React to maintain state between re-renders
      if a component's key changes, the component will be destroyed
      and re-recreated with a new state 
      
      when an element is reacted, React extracts the key property
      and stores the key directly on the returned element 
      React uses key to decide which components to update 
      
      each past move in the game has a unique ID associated with it:
      it's the sequential number of the move 
      moves will never be re-ordered, deleted, or insert in the middle, 
      so it's sage to use the move index as a key */
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    /* additional divs returned by Game make room for the game info
    I'll add to the board later */
    <div className="game">
      <div
        className="game-board"
        /* xIsNext, currentSquares, and handlePlay are now props for Board */
      >
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div
        className="game-info"
        /* if I click on any step in the game's history, the board should immediately 
        update to show what the board looked like after that step occurred */
      >
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

/* helper function that takes an array of 9 squares, checks for a winner, 
and returns X, O, or null as appropriate */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

/* implement a UI in React will 5 steps:
1. Break the UI into a component hierarchy 
- if I have a mockup to start ...
- draw boxes around every component and subcomponent 
  in the mockup and name them
- split up a design into components in different ways
  - programming - single responsibility principle: a component
    should ideally only do one thing
    if it ends up growing, it should be decomposed into
     smaller subcomponents
  - CSS - think abouw what I would make class selectors for 
          (components are a bit less gradnular)
  - design - think about how I would organize the design's layers
- well-structured JSON will naturally map to component structure of my UI
  separate my UI into components, where each component matches one
    piece of my data model 
- FilterableProductTable
  - SearchBar
  - ProductTable
    - ProductCategoryRow
    - ProductRow 
*/
/* 2. Build a static version in React
- to build a static version of my app that renders my data model:
  - build components that reuse other components
  - pass data using props (way to pass data from parent to child)
- don't use state in this step
  state is for interactivity, data that changes over time 
- in simpler examples, build top-down
  in larger projects, build bottom-up 
- static app have components that will only return JSX 
  
going from bottom-up here
destructures category from the prop object, so it's accessible */
function ProductCategoryRow({ category }) {
  return (
    <tr /* table row element */>
      <th /* table header cell element with attribute 
          making it span 2 columns */
        colSpan="2"
        /* {} embedding JS expressin within JSX */
      >
        {category}
      </th>
    </tr>
  );
}

// destructures product from the prop object, so it's accessible
function ProductRow({ product }) {
  /* if the product's stocked property is true, assign 
  the product's name property to name
  if not, assign a span with product.name in red to name */
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

// destructures products array from the prop object, so it's accessible
function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  /* keeps track of the last encountered product category
  while iterating through the list */
  let lastCategory = null;

  // iterate through each product in the products array
  products.forEach((product) => {
    if (
      /* ensure that the search is case-insensitive 
      ensure that the comparison is case-insensitive 
      indexOf(...) searches for the position of the 
      substring (filterText) within product.name 
      if filterText exists in product.name, indexOf 
      returns the starting index of the substring (a value >= 0 
      if filterText is not found, indexOf returns -1 */
      product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1
    ) {
      // exits the current iteration if filterText is not found in product-name
      return;
    }
    /* if inStockOnly is true (checked, and the product is not stocked, 
    exit the current iteration */
    if (inStockOnly && !product.stocked) {
      return;
    }
    // if the product's category property is not null
    if (product.category !== lastCategory) {
      /* a new category has been encountered, so ProductTable
      needs to render a new category header row
      pushes a ProductCategoryRow component with its
      current category prop and key attribute, into the rows array 
      (key helps React identify and update elements when the list changes) */
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    /* regardless of whether the category changed or not,
    a ProductRow is added for each product
    push a ProductRow component with its product 
    prop and key attribute into the row array */
    rows.push(<ProductRow product={product} key={product.name} />);
    /* updates lastCategory to the current product.category
    to track the last processed category */
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody /* inserts rows array containing all ProductCategoryRow
      and ProductRow elements */
      >
        {rows}
      </tbody>
    </table>
  );
}

function SearchBarOne({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        /* add onChange event handlers and set the parent state from them */
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />{" "}
        Only show products in stock
      </label>
    </form>
  );
}

/* destructures products array from the prop object, so it's accessible
FilterableProductTable takes my data model as a prop
this is one-way data flow from top-level component to bottom components */
function FilterableProductTable({ products }) {
  /* since the state is owned by FilterableProductTable, only it can
  call setFilterTExt and setInStockOnly, these functions need to be
  passed down to Searchbar so it can update the state */
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  return (
    <div
    /* want to make it so that whenever the user changes the form inputs,
      the state updates to reflect those changes */
    >
      <SearchBarOne
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

function AppTwo() {
  return <FilterableProductTable products={PRODUCTS} />;
}

/* 3. Find the minimal but complete representation of UI state 
- I need to let users change my data model, and I use state to do that
- state: minimal set of changing data that my app needs to remember
- pieces of data in AppTwo:
  1. original list of products (passed in as props, so not state)
  2. search text user has entered
  3. value of the checkbox
  4. filtered list of products (can be computed, so not state)

  Does it remain unchanged over time? Yes, not state.
  Is it passed in from a parent via props? Yes, not state.
  Can I compute it based on existing state or props in my component? Yes, not state.

  props - way to pass data from parent component to child component
  state - component's memory that lets component keep track of some
          information and change it in response to interactions 
  A parent component will often keep some information in state (so
  that it can change it), and pass it down to child components as 
  their props 
*/

/* 4. Identify where my state should live 
- to do that:
  1. identify every component that renders something based on that state
     - ProductTable needs to filter the product list based on the state
     - SearchBar needs to display that state
  2. find their closest common parent component
     - FilterableProductTable 
  3. decide where the state should live
     1. often I can put the state directly into the common parent
     2. or I can put the state in a component above their common parent
     3. if I can't find a component where it makes sense to own the state,
        create a new component above th common parent, solely for 
        holding the state
     - FilterableProductTable 

still need code to respond to user actions like typing */
/* 5. Add inverse data flow 
- form components deep in the hierarchy need to update the state in FilterableProductTable */

// State is tied to a position in the render tree
function AppThree() {
  /* only one <Counter /> JSX tag, but it's rendered at two different 
  positions in the tree 
  each component has fully isolated state
  each Counter component gets it own, independent score and hover states */
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}

function AppFour() {
  /* React keeps the state around for as long as I render the
  same component at the same position in the tree */
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <CounterOne /* when showB is true, conditionally render second <CounterOne> 
                  the moment I stop rendering the second counter, its state disappears
                  when React removes a component, it destroys its state */
      />
      {showB && <CounterOne />}
      <label>
        <input
          type="checkbox"
          checked={showB}
          /* if input is checked, showB is true, otherwise false 
          when input is checked, a second CounterOne and its state 
          are initialized from scratch and added to the DOM */
          onChange={(e) => {
            setShowB(e.target.checked);
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function CounterOne() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}

function Person() {
  const [person, setPerson] = useState({
    firstName: "",
    lastName: "",
    age: 100,
  });

  /* BAD - Don't do this!
  const handleIncreaseAge = () => {
    // mutating the current state object
    person.age = person.age + 1;
    setPerson(person);
  };
  */

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setPerson({
      ...person,
      [name]: value,
    });
  };

  // GOOD - Do this!
  const handleIncreaseAge = () => {
    // copy the existing person object into a new object
    // while updating the age property
    const newPerson = { ...person, age: person.age + 1 };
    setPerson(newPerson);
  };

  return (
    <>
      <h1>
        {person.firstName} {person.lastName}
      </h1>
      <h2>{person.age}</h2>
      <label>
        First name:{" "}
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Last name:{" "}
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleNameChange}
        />
      </label>
      <button onClick={handleIncreaseAge}>Increase age</button>
    </>
  );
}

/* shows how many seconds have passed since the user has loaded the 
webpage
updates every second */
function Clock() {
  const [counter, setCounter] = useState(0);

  /* adds one to the counter state variable every second 
  setInterval is getting called at every state render 
  1. component first renders
  2. component calls initial setInterval function
  3. interval updates the state every second
  4. state update triggers re-render
  5. every re-render calls setInterval again
  6. setInterval triggers more frequent state updates
  7. each state update spawns new intervals */
  setInterval(() => {
    setCounter((count) => count + 1);
  }, 1000);

  return <p>{counter} seconds have passed.</p>;
}

/* escape hatches - mechanisms that allow me to bypass or step outside the
                    normal constraints provided by React's declarative model
*/

/* by default, useEffect hook runs on every render and I get multiple
setter calls on every render 
second argument of useEffect, accepts an array of dependencies allowing
the hook to re-render only when those dependencies change 
ex. if I have a state variable and want to have a side-effect occur any
    time the state changes, I can use this hook and mention the state
    variable in the dependency array */
function ClockOne() {
  const [counter, setCounter] = useState(0);

  /* calculation gets wrapped inside a useEffect hook to move it
  outside the rendering calculation 
  useEffect accepts a callback with all the calculations */
  useEffect(() => {
    setInterval(() => {
      setCounter((count) => count + 1);
    }, 1000);
    /* empty array tells React that I don't want the useEffect hook to run
    anytime other than the initial component render 
    when the component is unmounted, setInterval is not stopped, it keeps
    incrementing  */
  }, []);

  return <p>{counter} seconds have passed.</p>;
}

function ClockTwo() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const key = setInterval(() => {
      setCounter((count) => count + 1);
    }, 1000);

    /* cleanup function will be executed each time before the next effect is run
    and one final time when the component is unmounted 
    cleans up the interval with a cleanup function 
    if I don't clean up resources, memory leaks can occur, causing performance 
    issues bc event listeners, subscriptions, or nework requests will still exist
    even though the component is no longer in use */
    return () => {
      clearInterval(key);
    };
  }, []);

  return <p>{counter} seconds have passed.</p>;
}

function MyComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Effect that runs after every render
    // 1. component mounts/ first renders, useEffect runs after the initial render
    //    count is set to 0 from useState
    //    useEffect hook runs, logging "You clicked 0 times"
    //    no cleanup function to run before this point bc no previous effect to clean up
    console.log(`You clicked ${count} times`);

    /* cleanup function runs before the next effect or when the component unmounts/
    is removed from the DOM when React no longer needs the component (when user
    navigates away from the component's view, conditionally renders another component,
    or destroys it for any reason */
    return () => {
      console.log(
        "Cleanup before effect runs again or when component unmounts"
      );
    };
    // 2. when count is updated, component re-renders
    //    before the new effect runs, React calls the cleanup function from the previous effect
    //    when the state changes, React cleans up the last effect before applying the new one
  }, [count]); // effect only re-runs when `count` changes
  // 3. after the cleanup, newEffect runs with the updated count value

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

/* for a change in a component, due to a change in the props, I can calculate and set it 
during rendering */
function AdditionDisplay() {
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);

  // This is all unnecessary.

  // const [sum, setSum] = useState(0);
  // useEffect(() => {
  //   setSum(number1 + number2);
  // }, [number1, number2]);

  const sum = number1 + number2;

  return (
    <p>
      {number1} + {number2} = {sum}
    </p>
  );
}

/* I do not need effects for events
code that runs when a component is displayed should be in effects, the rest should
be in events */
function AppTwelve() {
  const [input, setInput] = useState("");

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  // You should avoid direct manipulation when not necessary

  // useEffect(() => {
  //   document.getElementById("name").addEventListener("change", handleInput);
  //   return () => {
  //     document.getElementById("name").removeEventListener("change", handleInput);
  //   }
  // });

  return (
    <>
      {/* <input id="name" /> */}

      <input onChange={handleInput} value={input} />
      <p>{input}</p>
    </>
  );
}

/* key helps React id elements, allow it to manage and update them more efficiently
when the key changes, React will treat the component as a new one, "resetting" it 
based on state changes */
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // update seconds every 1 second
      setSeconds((prev) => prev + 1);
    }, 1000);

    // cleanup the interval on component unmount
    return () => clearInterval(interval);

    /* no dependencies in the array, meaning I do not want the useEffect hook to run
    anytime other than the initial component render */
  }, []);

  return <div>Timer: {seconds} seconds</div>;
}

function AppThirteen() {
  const [resetCount, setResetCount] = useState(0);
  const resetTimer = () => {
    // update state to trigger a reset of the Timer component
    setResetCount((prev) => prev + 1);
  };

  return (
    <div>
      <h1>Timer Reset Example</h1>
      {/* assigning a key to the Timer component based on a state variable, forces 
      React to treat it as a new instance whenever that states changes thereby 
      resetting the timer */}
      <Timer key={resetCount} />
      <button onClick={resetTimer}>Reset Timer</button>
    </div>
  );
}

/* effect is independent from my component's lifecycle 
effect - how to synchronize an external system to the current props and state 
         as my code changes, synchronization will need to happen more or less often 
this effect connects my component to a chat server */
const serverUrl = "https://localhost:1234";

// sometimes it is necessary to start and stop synchronizing multiple times
// why is this necessary...
// ChatRoom component receives the "general" roomId prop that the user picks in a dropdown
/* my app displays the "general" chat room
function ChatRoom({ roomId /* "general" }) {
  useEffect(() => {
    // after the UI is displayed, React runs my Effect to start 
    // synchronizing, React connects to the "general" room
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  return <h1>Welcome to the {roomId} room </h>
} 

// user picks a different room, "travel", React will update the UI
// Effect that ran last time is still connected to the "general" room
// roomId prop has changed, so what my Effect did back then no longer matches the UI
// React does two things:
// 1. stops synchronizing with the old roomId- disconnect from the "general" room
// 2. starts synchronizing with the new roomId- connect to the "travel" room
// React already knows how to do both
// effect's body specifies how to start synchronizing
// effect's cleanup function specifies how to stop synchronizing
function ChatRoom({ roomId /* "travel" }) {
  useEffect(() => {
    // ...
  return <h1>Welcome to the {roomId} room </h>
} 
*/

// when does it happen
// how can I control this behavior
// how React re-synchronizes my Effect
/* 
function ChatRoom({ roomId }) {
  useEffect(() => {
    // 2. to start synchronizing
    // React runs the Effect that I'm provided during this render
    // React starts synchronizing to the "travel" chat room
    // until its cleanup function is eventually called too 
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // 1. to stop synchronizing
      // React calls the cleanup function that my Effect returned after connecting
      // to the "general" room
      // cleanup function disconnects from the "general" room
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
*/

/* every time after my component re-renders with a different roomId, my Effect will re-synchronize
user changes roomId from "travel" to "music", React will again stop synchronizing my Effect by
calling its cleanup function, disconnecting me from the "travel" room
then it starts synchronizing again by running its body with the new roomId prop, connecting me
to the "music" room

when the user goes to a different screen, ChatRoom unmounts 
there is no need to stay connected at all, so React will stop synchronizing my Effect one last time
and disconnects me from the "music" chat room
*/

/* ChatRoom's perspective/ what Effect does
1. ChatRoom mounted with roomId set to "general"/ Effect connected to the "general" room
2. ChatRoom updated with roomId set to "travel"/ Effect disconnected from the "general" room and connected to the "travel" room
3. ChatRoom updated with roomId set to "music"/ Effect disconnected from the "travel" room and connected to the "music" room
4. ChatRoom unmounted/ Effect disconnected from the "music" room 

Effect's perspective - it's a sequence of non-overlapping time periods
think of them in terms of single start synchronization/stop synchronization cycle at a time
(no need to for me to think of whether a component is mounting or updating when I write 
rendering logic that creates JSX- I simply describe what should be on the screen, and 
React figures out the rest)
1. Effect connected to the "general" room (until it disconnected)
2. Effect connected to the "travel" room (until it disconnected)
3. Effect connected to the "music" room (until it disconnected)
*/

function ChatRoom({ roomId }) {
  useEffect(() => {
    // effect's body specifies how to start synchronizing
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // cleanup function specifies how to stop synchronizing
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}

// utility that creates an object representing a connection to a specific server and room
function createConnection(serverUrl, roomId) {
  return {
    connect() {
      console.log(
        '✅  Connecting to "' + roomId + '" room at ' + serverUrl + "..."
      );
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    },
  };
}

function ChatRoomOne({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>Welcome to the {roomId} room!</h1>;
}

function AppFifteen() {
  const [roomId, setRoomId] = useState("general");
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{" "}
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? "Close chat" : "Open chat"}
      </button>
      {show && <hr />}
      {show && <ChatRoomOne roomId={roomId} />}
    </>
  );
}

/*  1. ✅ Connecting to "general" room at https://localhost:1234... (development-only)
    2. ❌ Disconnected from "general" room at https://localhost:1234 (development-only)
    3. ✅  Connecting to "general" room at https://localhost:1234...

    in development, React always remounts each component onces
    React verifies that my Effect can re-synchronize by forcing it to do that immediately
    in development to check I've implemented its cleanup well

    my Effect will re-synchronize in practice if some data it uses has changed
*/

/* How React knows it needs to re-synchronize the Effect 
// I told React that its code depends on roomId by including it in the list of dependencies
// 1. roomId is a prop, which means it can change over time 
function ChatRoomOne({ roomId }) {
  useEffect(() => {
    // 2. I knew that my effect reads roomId (its logic depends on a value that may change later)
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  // 3. bc effect reads roomId, I specified it as my effect's dependency, so that it 
  //    re-synchronizes when roomId changes
  //    every time my component re-renders, React will look at the array of dependencies that I have 
  //    passed, and if any of the values in the array is different from the value at the same spot
  //    that I passed during the previous render, React will re-synchronize my effect 
  }, [roomId]);
  return <h1>Welcome to the {roomId} room!</h1>;
}

I passed ["general"] during the initial render
I later passed ["travel"] during the next render, 
these are different values (compared with Object.is), so React will re-synchronize my effect
if my component re-renders, but roomId has not changed, my effect will remain connected to the same room */

/* Each effect represents a separate synchronization process 
if I want to add an analytics event when the user visits the room
logging the visit must be a separate process from connecting
they must be written as two separate effects */
function ChatRoomTwo({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);
  /* deleting one effect wouldn't break the other effect's logic 
  they synchronize different things, so it makes sense to split them up 
  however, if I split up a cohesive piece of logic into separate effects, 
  the code will be more difficult to maintain */
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
    /* Effects "react" to reactive values 
  why doesn't serverUrl need to be a dependency?
  serverUrl never changes due to a re-render, it's always the same no matter how many times
  the component re-renders and why 
  *dependencies only do something when they change over time 
  roomId may be different on a re-render
  *** props, state, and other values declared inside a component are reactive because they're 
  calculated during rendering and participate in the React data flow 
  reactive values must be included in dependencies */
  }, [roomId]);
  return <h1>Welcome to the {roomId} room!</h1>;
}

function AppSeventeen() {
  const [roomId, setRoomId] = useState("general");
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{" "}
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? "Close chat" : "Open chat"}
      </button>
      {show && <hr />}
      {show && <ChatRoomTwo roomId={roomId} />}
    </>
  );
}

function ChatRoomThree({ roomId }) {
  // state may change over time
  const [serverUrl, setServerUrl] = useState("https://localhost:1234");

  useEffect(() => {
    // my effect reads props and state
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
    // so I tell React that this effect "depends on" props and state
    // by including serverUrl, I ensure that the effect re-synchronizes after it changes
    // whenever I change a reactive value like roomId or serverUrl,
    // effect re-connects to the chat server
  }, [roomId, serverUrl]);
  return (
    <>
      <label>
        Server URL:{" "}
        <input
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
        />
        <h1>Welcome to the {roomId} room!</h1>
      </label>
    </>
  );
}

function AppEighteen() {
  const [roomId, setRoomId] = useState("general");
  return (
    <>
      <label>
        Choose the chat room:{" "}
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoomThree roomId={roomId} />
    </>
  );
}

/* What an effect with empty dependencies means 
if both serverUrlOne and roomId are outside the component, my effect's code does
not use any reactive values, so its dependencies can be empty */
const serverUrlOne = "https://localhost:1234";
const roomId = "general";

/* empty dependency array means this Effect connects to the chat room only
when the componet mounts, and disconnects only when the component unmounts */
function ChatRoomFour() {
  /* I've specified what my effect does to start and stop synchronizing 
  right now it has no reactive dependencies */
  useEffect(() => {
    // my effect reads props and state
    const connection = createConnection(serverUrlOne, roomId);
    connection.connect();
    return () => connection.disconnect();
    /* if I ever want the user to change roomId or serverUrlOne over time,
    and I would make them reactive, I only need to add them to the dependencies */
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}

function AppNineteen() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? "Close chat" : "Open chat"}
      </button>
      {show && <hr />}
      {show && <ChatRoomFour />}
    </>
  );
}

/* firewall - device or software that monitors and controls incoming and outgoing network 
              traffic based on predefined security rules
switch - network device that connects multiple devices within a LAN 
context - mechanism that allows me to share state or data across multiple components without
          having to pass props down manually through every level of the component tree 
          useful when I have data that needs to be accessed by many components at different
          nesting levels, such as a theme, user information, or global setting

All variables declared in the component body are reactive 
includes props, state, and all other variables from the component body 
and they should all be in the effect dependency list
if any of them change, my component will re-render */

const SettingsContext = createContext();

function SettingsProvider({ children }) {
  const [defaultServerUrl, setDefaultServerUrl] = useState(
    "https://default-server.com"
  );

  const settings = {
    defaultServerUrl,
    setDefaultServerUrl,
  };

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

/* roomId, settings, and serverUrl are all reactive */
function ChatRoomFive({ roomId, selectedServerUrl }) {
  const settings = useContext(SettingsContext);
  /* ?? - nullish coalescing operator 
  if selectedServerUrl is null or undefined, settings.defaultServerUrl is the fallback value 
  serverUrl is not a prop or state, it's a regular variable calculated during rendering, 
  bc it's calculated during rendering, it can change due to re-render */
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl;
  /* again, Effect handles the synchronization of the connection to a chat room */
  useEffect(() => {
    /* connection is that object representing a conenction to a specific server and room
    my effect reads roomId and serverUrl */
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So my effect needs to re-synchonize when either of the variables change
}

function AppTwenty() {
  const [roomId, setRoomId] = useState("general");
  return (
    <SettingsProvider>
      <label>
        Choose the chat room:{" "}
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoomFive roomId={roomId} />
    </SettingsProvider>
  );
}

/* mutable values, including global variables, aren't reactive 

if my linter is configured for React, it will check that every reactive value 
used by my code is declared as its dependency 

React verifies that I specified every reactive value as a dependency 
in some cases, React knows that a value never changes even though it's declared
  inside the component
  set function returned from useState and the ref object returned by useRef are stable,
    they are guaranteed to not change on a re-render
    stable values aren't reactive */

/* What to do when I don't want to re-synchronized
I can "prove" to the linter that these values aren't reactive values (i.e. they can't change as a 
result of a re-render) 
const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
const roomId = 'general'; // roomId is not reactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  // if serverUrl and roomId don't dependen on rendering and always have the same valyes, I can move them
  // outside the component or inside the effect
  }, []); // ✅ All dependencies declared
  // ...
} */

function MyComponentOne() {
  /* 1. MOUNTING - React inserts the component into the DOM for the first time 
        1b. EFFECT SETUP - useEffect hook runs first: I can initialize subscriptions, fetch data, etc. 
            logging is initialized */
  useEffect(() => {
    /* 1c. EFFECT RUNS AFTER RENDERING - useEffect callback runs after the initial render, 
           ensures any DOM-related effects work 
           MyComponentOne's useEffect hook runs, logging "Component mounted" to the console */
    console.log("Component mounted");

    /* cleanup function that React will call later when the component unmounts 
       this cleanup runs when the component unmounts 
       2. UNMOUNTING - React removes the component from the DOM, happens:
          (when component is conditionally rendered, and the condition (show) changes,
          when the user navigates away from the component (e.g. in a router based app,
          when the component is otherwise removed from the view)
          2a. before unmounting, React runs this cleanup function logging "Component unmounted" 
          2b. <MyComponentOne /> no longer gets rendered because AppFourteen conditionally renders it
              based on show, React unmounts MyComponentOne and removes it from the DOM */
    return () => {
      console.log("Component unmounted");
    };
  }, []);
  // 1a. React renders this div
  return <div>Hello, I am mounted!</div>;
}

function AppFourteen() {
  const [show, setShow] = useState(true);

  return (
    <div /* BEFORE MOUNTING - initial render of AppFourteen
            
    AppFourteen renders button and conditionally renders MyComponentOne bc show is initially true 
    2. UPDATING - some of a component's props or state have changed, triggering a re-render 
       2a. clicking the button toggles the show state,
           causing AppFourteen to re-render */
    >
      <button onClick={() => setShow(!show)}>Toggle Component</button>
      {
        /* MyComponentOne doesn't have any state or props, so it won't re-render based on updates 
        2b. if show is true, MyComponentOne remains mounted but no new render 
        2c. if show is false, AppFourteen re-renders without MyComponentOne, 
            leading to the unmounting of MyComponentOne */
        show && <MyComponentOne />
      }
    </div>
  );
}

const serverUrlTwo = "https://localhost:1234";

function ChatRoomSix({ roomId }) {
  const [message, setMessage] = useState("");

  /* message doesn't need to be included in the dependency array bc
  its value is not used inside the effect */
  useEffect(() => {
    const connection = createConnection(serverUrlTwo, roomId);
    connection.connect();
    return () => connection.disconnect();
    /* every reactive value should be in the array of dependencies
    this ensures that when the user selects a different room, the chat 
    reconnects
    serverUrlTwo is defined outside the component, so it doesn't need to
    be in the array */
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
    </>
  );
}

function AppTwentyOne() {
  const [roomId, setRoomId] = useState("general");
  return (
    <>
      <label>
        Choose the chat room:{" "}
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoomSix roomId={roomId} />
    </>
  );
}

function AppTwentyTwo() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  /* this is the better fix to to a stale value bug 
  having handleMove function inside the effect 
  then handleMove won't be a reactive value 
  the effect then depends on canMove instead of handleMove 
  my effect now stays synchronized with the value of canMove */
  useEffect(() => {
    // code inside the effect can use conditions
    function handleMove(e) {
      /* setPosition call can be wrapped into an if (canMove) {...} condition
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      } */
      setPosition({ x: e.clientX, y: e.clientY });
    }
    // or the event subscription logic can be wrapped into an if (canMove) {...} condition
    if (canMove) {
      window.addEventListener("pointermove", handleMove);
      return () => window.removeEventListener("pointermove", handleMove);
    }
    /* canMove is a reactive variable that I read inside the effect
  this is why it must be specified in the list of effect dependencies 
  including it in the dependencies ensures that the effect resynchronizes
  after every change to canMove's value */
  }, [canMove]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={canMove}
          onChange={(e) => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div
        style={{
          position: "absolute",
          backgroundColor: "pink",
          borderRadius: "50%",
          opacity: 0.6,
          transform: `translate(${position.x}px, ${position.y}px)`,
          pointerEvents: "none",
          left: -20,
          top: -20,
          width: 40,
          height: 40,
        }}
      />
    </>
  );
}

function AppTwentyThree() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
    /* this next line prevents ESLint from issuing warning or errors if the
  dependency array of my useEffect hook does not include all variables
  referenced inside the effect
  }, [canMove]);
  
  again, all variables declared in the component body are reactive
  every reactive value must be specified as a dependency, or it can
  potentially get stale over time 
  
  without re-synchronizing the effect, the handleMove attached as a
  listener is the handleMove function created during the initial render 
  
  since handleMove is going to be a newly defined function for every render
  of the component, I can remove the dependencies array altogether 
  
  the effect with re-synchronize after every re-render */
  });

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={canMove}
          onChange={(e) => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div
        style={{
          position: "absolute",
          backgroundColor: "pink",
          borderRadius: "50%",
          opacity: 0.6,
          transform: `translate(${position.x}px, ${position.y}px)`,
          pointerEvents: "none",
          left: -20,
          top: -20,
          width: 40,
          height: 40,
        }}
      />
    </>
  );
}

/* createEncryptedConnection and createUnencryptedConnection are two 
different APIs */
function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + "... (encrypted)");
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    },
  };
}

function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + "... (unencrypted)");
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    },
  };
}

/* this code is fragile because someone could edit the AppTwentyFour component
to pass an inline function as the value of this prop
function ChatRoomSeven({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    /* again, the linter is getting suppressed 
    createConnection is a prop that, so it's a reactive value that can change 
    over time, should be included in the dependency array 
    when the user ticks the checkbox, the parent component passes a different 
    value of the createConnection prop 
  }, [roomId, createConnection]);
  
now the prop is a boolean instead of a function
and I decide which function to use inside the effect 
both createEncryptedConnection and createUncryptedConnection are declared 
outside the component, so they aren't reactive */
function ChatRoomSeven({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted
      ? createEncryptedConnection
      : createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

function AppTwentyFour() {
  const [roomId, setRoomId] = useState("general");
  const [isEncrypted, setIsEncrypted] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{" "}
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label /* root AppTwentyFour component lets the user choose whether to 
             use encryption or not, and then passes down the corresponding API
             method to the child ChatRoomSeven component as the createConnection
             prop */
      >
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={(e) => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoomSeven roomId={roomId} isEncrypted={isEncrypted} />
    </>
  );
}

// url is a string representing the API endpoint from which data will be fetched
function fetchData(url) {
  if (url === "/planets") {
    // fetches and returns a list of planets
    return fetchPlanets();
    /* if url starts with "/planets/", proceeds with further valdiation to see
    if it matches a specific pattern
    if it matches, extracts the planetId and calls the fetchPlaces()
    the result of this match operation is stored in the match variable */
  } else if (url.startsWith("/planets/")) {
    // uses a regex to check if the url matches the expected pattern
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    // checks whether the url was correctly matched and whether a planetId was captured
    if (!match || !match[1] || !match[1].length) {
      // throw an error if the planetId is not present or the url format is incorrect
      throw Error(
        'Expected URL like "/planets/earth/places". Received: "' + url + '".'
      );
    }
    /* extracts the planetId from the regex's captured group and passes it to fetchPlaces 
    fetches the list of places associated with that specific planet */
    return fetchPlaces(match[1]);
  } else
    throw Error(
      // if url doesn't match any expected pattern, an error is thrown
      'Expected URL like "/planets" or "/planets/earth/places". Received: "' +
        url +
        '".'
    );
}

// simulates fetching the list of planets
async function fetchPlanets() {
  /* returns a promise that resolves after a 1 second delay with an
  array of planet objects */
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        // array has planet objects, each with an id and a name
        {
          id: "earth",
          name: "Earth",
        },
        {
          id: "venus",
          name: "Venus",
        },
        {
          id: "mars",
          name: "Mars",
        },
      ]);
    }, 1000);
  });
}

// simulates fetching places associated with a specific planet
async function fetchPlaces(planetId) {
  // if the argument is not a string, throws an error
  if (typeof planetId !== "string") {
    throw Error(
      "fetchPlaces(planetId) expects a string argument. " +
        "Instead received: " +
        planetId +
        "."
    );
  }
  /* returns a promise that resolves after a 1 second delay with 
  a list of places depending on the planetId */
  return new Promise((resolve) => {
    setTimeout(() => {
      if (planetId === "earth") {
        resolve([
          {
            id: "laos",
            name: "Laos",
          },
          {
            id: "spain",
            name: "Spain",
          },
          {
            id: "vietnam",
            name: "Vietnam",
          },
        ]);
      } else if (planetId === "venus") {
        resolve([
          {
            id: "aurelia",
            name: "Aurelia",
          },
          {
            id: "diana-chasma",
            name: "Diana Chasma",
          },
          {
            id: "kumsong-vallis",
            name: "Kŭmsŏng Vallis",
          },
        ]);
      } else if (planetId === "mars") {
        resolve([
          {
            id: "aluminum-city",
            name: "Aluminum City",
          },
          {
            id: "new-new-york",
            name: "New New York",
          },
          {
            id: "vishniac",
            name: "Vishniac",
          },
        ]);
      } else throw Error("Unknown planet ID: " + planetId);
    }, 1000);
  });
}

function Page() {
  // holds the list of planet fetched from the server
  const [planetList, setPlanetList] = useState([]);
  // holds the id of the currently selected planet
  const [planetId, setPlanetId] = useState("");

  // holds the list of places fetched based on the selected planet
  const [placeList, setPlaceList] = useState([]);
  // holds the id of the currently selected place
  const [placeId, setPlaceId] = useState("");

  // first select box is synchronized to the remote list of planets
  // fetches the list of planets when the component first mounts
  useEffect(() => {
    /* flags that the component is still mounted and it is safe to update 
    the state updates based on the the async operation's result */
    let ignore = false;
    /* the first select box populates the planetList state with 
    the result from the /planets API call 
    fetchData("/planets") initiates the fetch request to get the planets list
    .then((result) => {...}) when the data is successfully fetched, 
                             the callback function is executed with the result */
    fetchData("/planets").then((result) => {
      /* if ignore is still false, it proceeds to update the state 
      this check ensures that the state is only updated if the component 
      is still mounted and the effect hasn't been cleaned up */
      if (!ignore) {
        console.log("Fetched a list of planets.");
        // updates the planetList state with the planets list returned from the /planets API call
        setPlanetList(result);
        // sets the initial planetId to the ID of the first planet in the list
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      /* component has unmounted, or the effect has been cleaned up, 
      and therefore, it is not safe to update the state anymore 
      ignore flag prevents state updates when the component is no 
      longer in the DOM 
      this cleanup function ensures that any async operations that
      complete after the cleanup do not trigger states updates on
      unmounted components */
      ignore = true;
    };
  }, []);

  // second select box is synchronized to the remote list of places for the current planetId
  // runs whenever the planetId changes
  useEffect(() => {
    if (planetId) {
      // flags that the component is still mounted and it is safe to update
      let ignore = false;
      // fetches list of places for newly selected planet
      fetchData(`/planets/${planetId}/places`).then((result) => {
        // if ignore is still false, it proceeds to update the state
        if (!ignore) {
          console.log(`Fetched places for planet: ${planetId}`);
          // updates the placeList with the fetched places
          setPlaceList(result);
          // first place is automatically selected
          setPlaceId(result[0]?.id || "");
        }
      });
      return () => {
        // cleanup function sets ignore to true to prevent unwanted state updates
        ignore = true;
      };
    }
    /* planetId is a dependency, so it determines when the effect runs 
  when the dependency changes on subsequent renders, the effec will run again */
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{" "}
        <select
          value={planetId}
          onChange={(e) => {
            setPlanetId(e.target.value);
          }}
          // first dropdown, planetId, is populated with options from the planetList
        >
          {planetList.map((planet) => (
            <option key={planet.id} value={planet.id}>
              {planet.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Pick a place:{" "}
        <select
          value={placeId}
          onChange={(e) => {
            setPlaceId(e.target.value);
          }}
          /* second dropdown, placeId, is populated with options from the placeList,
        which depends on the selected planet */
        >
          {placeList.map((place) => (
            <option key={place.id} value={place.id}>
              {place.name}
            </option>
          ))}
        </select>
      </label>
      <hr />
      <p /* displays the currently selected place and planet */>
        You are going to: {placeId || "???"} on {planetId || "???"}{" "}
      </p>
    </>
  );
}

/* state initialization - state variables are created to hold lists of planets and
                          places and the selected planet and place
fetching planets - when component mounts, the list of planets is fetched and the first
                   planet is selected by default
fetching places - when a planet is selected, the list of places for that planet is fetched
                  and the first place is selected by default
rendering - dropdown menus are populated with the planets and places, and they update 
            based on the user's selection */

// custom hook
function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  /* most effects in my app should eventually be replaced by custom hooks 
  custom hooks hide the synchronization logic, so the calling component
  doesn't know about the effect 
  as I keep working on my app, I'll develop a palette of hooks to choose from
  and eventually I won't need to write Effects in my components very often */
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then((result) => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    };
  }, [url]);
  return [list, selectedId, setSelectedId];
}

function PageOne() {
  const [planetList, planetId, setPlanetId] = useSelectOptions("/planets");
  const [placeList, placeId, setPlaceId] = useSelectOptions(
    planetId ? `/planets/${planetId}/places` : null
  );

  return (
    <>
      <label>
        Pick a planet:{" "}
        <select
          value={planetId}
          onChange={(e) => {
            setPlanetId(e.target.value);
          }}
          /* first dropdown, planetId, is populated with options from the planetList 
          ? optional chaining operator used to safely access properties of an object
          that might be null or undefined without causing an error */
        >
          {planetList?.map((planet) => (
            <option key={planet.id} value={planet.id}>
              {planet.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Pick a place:{" "}
        <select
          value={placeId}
          onChange={(e) => {
            setPlaceId(e.target.value);
          }}
          /* second dropdown, placeId, is populated with options from the placeList,
        which depends on the selected planet */
        >
          {placeList?.map((place) => (
            <option key={place.id} value={place.id}>
              {place.name}
            </option>
          ))}
        </select>
      </label>
      <hr />
      <p /* displays the currently selected place and planet */>
        You are going to: {placeId || "???"} on {planetId || "???"}{" "}
      </p>
    </>
  );
}

/* Updating state based props or state
calculates a fullName from firstName and lastName by concatenating them */
function FormFour() {
  const [firstName, setFirstName] = useState("Taylor");
  const [lastName, setLastName] = useState("Swift");
  /* good to calculate fullName during rendering 
  avoid redundant state and unnecessary effect 
  when something can be calculated from existing props or state, don't put 
  it in state 
  instead calculate it during rendering 
  (remember, state is the minimal set of changing data that my app needs 
  to remember */
  const fullName = firstName + " " + lastName;
}

/* Caching expensive calculations 
computes visibleTodos by taking the todos it receives by props and filtering 
them according to the filter prop again, avoid redundant state and unnecessary 
effect */
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState("");
  /* this is fine if getFilteredTodos() is not slow or if I don't have a lot of todos
  if either of those is true, I don't want to recalculate getFilteredTodos() if some 
  unrelated state variable like newTodo has changed
  const visibleTodos = getFilteredTodos(todos, filter); */

  /* I can cache or memoise an expensive calculation by wrapping it in a useMemo hook 
  useMemo hook in React will optimize the performance of my component by caching the 
  result of a computation that is resource-intensive 
  useMemo lets me memoize the result of a calculation or function call so that it is 
  only recomputed when its dependencies change 
  memoization - storing the result of a computation so that I don't have to redo the 
                calculation if the input values haven't changed */
  /* tells React I don't want the innter function to re-run unless either todos or
  filter have changed 
  unless I'm creating or looping over thousands of objects, it's probably not expensive
  I can add a console log to measure the time spent in a piece of code */

  /* adding a console log to measure the time spent in a piece of code 
  if the overall logged time adds up to a significant amount, it might
    make sense to memoize the calculation 
  
  measuring performance in development will not give me the most accurate results, 
  ex. in Strict Mode, each component renders twice rather than once
  to get most accurate timings, I need to build my app for production and 
    test it on a device like my users have */
  console.time("filter array");
  const visibleTodos = useMemo(() => {
    // ...
    // return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  console.timeEnd("filter array");
}

/* whenever the key changes, React will recreate the DOM and reset the state
of the Profile component and all of its children
now the comment field will clear out automatically when navigating between profiles */
function ProfilePage({ userId }) {
  return <ProfileOne userId={userId} key={userId} />;
}

/* if I reset state on prop change in an effect, the component and its children
will first render with the stale value, and then render again
it's complicated bc I'd need to do this in every component that has 
  some state inside ProfilePage
  if the comment UI is nested, I'd want to clear out nested comment state too
  
I can tell React that each user's profile is conceptually a different profile
by giving it an explicity key 
here, the component is split in two and a key attribute
from the outer component is passed to the inner one */
function ProfileOne({ userId }) {
  // this and any other state below will reset on key change automatically
  const [comment, setComment] = useState("");
}

function ListOne({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // adjust the state while rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    // setSelection is called directly during a render
    setSelection(null);
  }
  /* React will re-render the ListOne immediately after it exits with a return statement 
  React has not rendered the List children or updated the DOM yet, so this lets the List
  children skip rendering the stale selection value */
  // ...
}

/* when I update a component during rendering, React throws away the return JSX and 
immediately retries rendering
React only lets me update the same component's state during a render
items !== prevItems is necessary to avoid loops
any other side effects (like changing the DOM or setting timeouts) should stay in
  event handlers or effects to keep components pure */

function ListTwo({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  /* instead of storing and resetting the selected item, I can store
  the selected item Id */
  const [selectedId, setSelectedId] = useState(null);

  /* calculate everything during rendering 
  no need to adjust the state at all
  if the item with the selected id is in the list, it remains selected
  if it's not, the selection calculated during rendering will be null 
  most changes to items will preserve the selection */
  // const selection = items.find((item) => item.id === selectedId) ?? null;
  // ...
}

/* when I'm not sure whether some code should be in an effect or in an event handler, 
ask myself WHY this code needs to run
use effects only for code that should run BECAUSE the component was displayed to the
  user 
  
here, the notification should appear because the user pressed the button, 
not because the page was displayed! */
function ProducePage({ product, addToCart }) {
  // don't need buyProduct as an effect
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  /* buyProduct logic is shared by handleBuyClick and handleCheckoutClick 
  event handlers which call it (if I need to reuse logic between several 
  event handlers, extract a function and call it from those handlers */
  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo("/checkout");
  }
}

function FormFive() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  /* analytics POST request should remain an effect because the reason to
  send the analytics event is that the form was displayed */
  useEffect(() => {
    postMessage("/analytics/event", { eventName: "visit_form" });
  }, []);

  /* the /api/register POST request is not caused by the form being displayed
  I only want to send the request at one specific moment in time, when the user
  presses the button, so the POST request can go into an event handler */
  function handleSubmit(e) {
    e.preventDefault();
    postMessage("/api/register", { firstName, lastName });
  }
}

function GameOne() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  /* calculate what I can during render 
  avoid chains of effects that adjust the state solely to trigger each other
  problems with doing that:
  1. it is very inefficient
     the component (and its children) have to re-render between each set call in the chain
  2. even if it wasn't slow, as my code evolves, I will run into cases where the chain I
     wrote doesn't for the new requirements */
  const isGameOver = round > 5;

  /* inside event handlers, state behaves like a snapshot
  even after I call, say, setRound(round + 1), the round variable will reflect the value 
  at the time the user clicked the button 
  
  if I want to use the next value for calculations, define it manually like, 
  const nextRound = round + 1; */
  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error("Game already ended.");
    }

    // calculate all the next state in the event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCard(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert("Good game!");
        }
      }
    }
  }
}
/* this is more efficient
if I implement a way to view game history, I will now be able to set each state variable 
to a move from the past without triggering the effect chain that adjusts every other value

in some cases, I can't calculate the next state directly in the event handler
ex. form with multiple dropdowns where the options of the next dropdown depend on the 
selected value of the previous dropdown
a chain of effects is appropriate bc I am synchronizing with network */

/* if logic must run once per app load rather than once per component mount,
a top-evel variable should be added to track whether it has already executed */
let didInit = false;

/* 
function AppTwentyFive() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // only runs once per app load
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  //...
}

// or I can also run it during module initiation and before the app renders
if (typeof window !== "undefine") {
  // checks if I'm running in the browser
  // only runs once per app load
  checkAuthToken();
  loadDataFromLocalStorage();
}

/* code at the top level runs once when my component is imported, even if it
doesn't end up beign rendered
to avoid slowdown or surprising behavior when importing arbitrary components,
this pattern 
app-wide initialization logic should be kept to root component modules like App.js 
or in my application's entry point */
function AppTwentySix() {
  //...
}

// update the state of both components within the same event handlers
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // perform all updates during the event that caused them
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }
  //...
}
/* both Toggle component and its parent component update their state 
during the event
React batches updates from different components together, so there will
be only one render pass */

/* state may be removed altogether, and instead receive isOn from 
from the parent component 
this way, the component is fully controlled by its parent */
function ToggleOne({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }
}

/* when I see something wrong on the screen, trace where the info comes
from by going up the component chain until I find which component passes
the wrong prop or has the wrong prop */
function Parent() {
  /* const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} /> */
  const data = useSomeAPI();
  // passing data down to the child
  return <Child data={data} />;
}

function Child({ data }) {
  /* avoid passing data to the parent in an effect 
function Child({ onFetch }) {
  const data = useSomeAPI();
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]); */
  //...
}

function subscribe(callback) {
  window.addEventListener("online", updateState);
  window.addEventListener("offline", updateState);
  return () => {
    window.removeEventListener("online", updateState);
    window.removeEventListener("offline", updateState);
  };
}

/* instead of having child components update the state of their parent 
components, let parents fetch that data and pass it down to the child 

my components may need to subscribe to some data outside of the React state 
data could be from a third-party library or a built-in browser API 
the data can change without React's knowledge, so I need to manually
subscribe my components to it, often with an effect, BUT that's not ideal */
function useOnlineStatus() {
  /* navigator.onLine API does not exist on the server, so it can't be 
  used for the initial HTML and state is initially set to true 
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      /* component subscribes to an external data source, the browser 
      navigator.onLine API 
      whenver the value of the data source changes in the browser,
      the component updates its state 
      setIsOnline(navigator.onLine);
    }

    updateState();
    */
  /* window.addEventListener("online", updateState);
    window.addEventListener("offline", updateState);
    return () => {
      window.removeEventListener("online", updateState);
      window.removeEventListener("offline", updateState);
    };
  }, []);
  return isOnline; */
  /* React has a purpose-built hook for subscribing to an external store
  that is preferred instead, useSyncExternalStore */
  return useSyncExternalStore(
    // React won't resubscribe for as long as I pass the same function
    subscribe,
    // how to get the value on the client
    () => navigator.onLine,
    // how to get the value on the server
    () => true
  );
}

function ChatIndicator() {
  // useOnlineStatus is a custom hook
  const isOnline = useOnlineStatus();
}

/* child component receives items as props from the parent and displays the list 
props - read-only/immutable inputs from the parent to a child
        controlled by parent
        if props change, they trigger re-renders
        props scope is across components from parent to child */
function ShoppingList({ items }) {
  return (
    <ul /* iterates over the items object prop and for each item, display a li 
    element with item.id assigned to its key and with item.name as its content */
    >
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

/* parent component manages state, props, and side effects */
function AppTwentySeven() {
  /* state - mutable internal data managed within a component
             controlled by component itself 
             if state updates, they trigger re-renders
             state scope is local to the component */
  // state to manage the list of items
  const [items, setItems] = useState([]);
  // state to track the number of items
  const [count, setCount] = useState(0);

  /* effect fetches the shopping list data from a mock API (application programming
  interface - set of rules and protocols that allows different apps or systems to
  communicate with each other and exchange data) when the component mounts 
  effects - manage side effects like API calls
            controlled by component's lifecycle 
            effects do not trigger re-renders, but they may trigger async changes
            effects scope synchronizes with external changes 
            exs. data fetching, DOM manipulation, subscriptions, or cleanup */
  useEffect(() => {
    console.log("Fetching shopping list...");
    /* simulates an API call; makes an HTTP request to the specified URL 
    sends GET request 
    fetch() returns a Promise that resolves with the HTTP response */
    fetch("/api/shopping-list")
      /* when the response from the server arrives, takes raw HTTP response 
      and extracts the JSON content from the response body */
      .then((response) => response.json())
      /* response.json() also returns a promise that resolves with the parsed
      JSON data and processes the data */
      .then((data) => {
        // updates the items state with the fetched data
        setItems(data);
        // updates the count state with the number of items
        setCount(data.length);
      });
    // empty dependency array, so effect runs only once after the component mounts
  }, []);

  // handler to add a new item to the shopping list (updating state)
  const addItem = () => {
    const newItem = { id: items.length + 1, name: `Item ${items.length + 1}` };
    // update the items state
    setItems([...items, newItem]);
    // update the count state
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Shopping List</h1>
      {/* state displayed */}
      <p>Number of items: {count}</p>
      {/* pass items as props to the child component */}
      <ShoppingList items={items} />s{/* update state on button click */}
      <button onClick={addItem}>Add Item</button>
    </div>
  );
}

/* useEffect hook synchronizes external side effects after renders or when certain
dependencies change (with a component's lifecycle)
- effects run after render
- I can control when the effect runs by passing dependencies in an array
- effects can return a cleanup function to run before the next effect or when the
  component unmounts */

function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let ignore = false;
    /* avoid fetching without cleanup logic 
    function call that retrieves the results for the specified query and page
    once the call resolves and returns the data  */
    fetchResults(query, page).then((json) => {
      if (!ignore) {
        // callback function updates results with data that is fetched
        setResults(json);
      }
    });
    /* this is the cleanup function that fixes teh race condition (when two different
    requests race against each other and come on a different order than I expect 
    when my effect fetches data, all responses except the last requested one will be
    ignored */
    return () => {
      ignore = true;
    };
    /* effect is only rerun when the query or page state changes 
    useful whenever the user changes the search query or navigates 
    to a different page */
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

/* in addition to handling race conditions, there's also caching responses (so that
the user can click Back and see the previous screen instantly, fetching data on the
server (so that initial server-rendered HTML contains the fetched content instead of
a spinner), and avoid network waterfalls (so that a child can fetch data without waiting 
for every parent) 

I can extract fetching logic into a custom hook */
function SearchResultsOne({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

/* whenever I have to resort to writing effects, keep an eye out for when I can extract
a piece of functionality into a custom hook with a more declarative and purpose-built API
like useData
***the fewer useEffects calls I have in my component, the easier I will find it to 
maintain my application */
function useData(url) {
  // state to manage the data, initially set to null
  const [data, setData] = useState(null);
  useEffect(() => {
    /* ignore serves as a flag to manage state updates during async operations such
    as fetching data
    prevents useData from trying to update state if the component unmounts
    or if the effect is no longer relevant by the time the fetch completes */
    let ignore = false;
    /* when async fetch is initiated inside useEffect hook, there's a chance the 
    component could unmount before the operation completes
    ignore flag ensures that once the component has been unmount or the effect is
    clearned up, the state update, setData(json), is skipped */
    fetch(url)
      /* when the HTTP response from the server arrives, takes raw response
      and extracts JSON content from the response body */
      .then((response) => response.json())
      /* response.json() also returns a promise that resolves with the parsed
      JSON data and processes the data */
      .then((json) => {
        /* if ignore is still false, update the state with the data */
        if (!ignore) {
          setData(json);
        }
      });
    // sets flag to false once the fetch completes
    return () => {
      ignore = true;
    };
    // triggers re-render when url changes
  }, [url]);
  return data;
}
/* should add logic for error handling and to track whether the content is loading 

- if I can calculate something during render, I don't need an effect
- to cache expensive calculations, add useMemo instead of useEffect
- to reset the state of an entire component tree, pass a different key to it
- to reset a particular bit of state in response to a prop change, set it during 
  rendering
- code that runs because a component was displayed should be in effects
  the rest should be in events
- if I need to update the state of several components, it's better to do it 
  during a single event
- whenever I try to synchronize state variables in different components, 
  considering lefting state up
- I can fetch data with effects, but I need to implement cleanup to avoid race
  conditions */

let nextIdOne = 0;

function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed,
  };
}

const initialTodosOne = [
  createTodo("Get apples", true),
  createTodo("Get oranges", true),
  createTodo("Get carrots"),
];

function TodoListOne() {
  /* only 2 essential pieces of state are todos and showActive 
  all other state variables are redundant and can be calculated during rendering */
  const [todos, setTodos] = useState(initialTodosOne);
  const [showActive, setShowActive] = useState(false);
  // const [activeTodos, setActiveTodos] = useState([]);
  // const [visibleTodos, setVisibleTodos] = useState([]);
  // const [footer, setFooter] = useState(null);

  const activeTodos = todos.filter((todo) => !todo.completed);

  /* useEffect(() => {
    setActiveTodos(todos.filter((todo) => !todo.completed));
  }, [todos]); */

  /* useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]); */

  const visibleTodos = showActive ? activeTodos : todos;

  /* useEffect(() => {
    setFooter(<footer>{activeTodos.length} todos left</footer>);
  }, [activeTodos]); */

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={(e) => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={(newTodo) => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map((todo) => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>{activeTodos.length} todos left</footer>
    </>
  );
}

let calls = 0;

function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter((todo) => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

function TodoListTwo() {
  const [todos, setTodos] = useState(initialTodosOne);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState("");
  // avoid redundant state and unnecessary effect
  // const [visibleTodos, setVisibleTodos] = useState([]);

  /* getVisibleTodos() will be called only if todos or showActive change
  typing into the input only changes the text state variable, so it does 
  not trigger a call to getVisibleTodos() */
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  /* useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]); */

  function handleAddClick() {
    setText("");
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={(e) => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleAddClick}>Add</button>
      <ul>
        {visibleTodos.map((todo) => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function TodoListThree() {
  const [todos, setTodos] = useState(initialTodosOne);
  const [showActive, setShowActive] = useState(false);

  const visibleTodos = getVisibleTodos(todos, showActive);

  /* useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]); */

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={(e) => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={(newTodo) => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map((todo) => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

/* text state variable can't possibly affect the list of todos, so NewTodo
form can be extracted into a separate component
text state variable can be moved into it */
function NewTodo({ onAdd }) {
  const [text, setText] = useState("");

  function handleAddClick() {
    setText("");
    onAdd(createTodo(text));
  }

  return (
    <>
      {/* when the input is typed into, only the text state updates 
      the text state is in the child NewTodo component, so the parent
      ToDoListThree component won't get re-rendered and getVisibleTodos 
      doesn't get called */}
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleAddClick}>Add</button>
    </>
  );
}

function ContactListThree({ contacts, selectedId, onSelect }) {
  return (
    <section>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                onSelect(contact.id);
              }}
            >
              {contact.id === selectedId ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EditContactOne(props) {
  /* const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email); 
  {...props} passes all the props received by EditContactOne to EditForm 
  unique key is added based on the savedContact's id 
  this ensures that React treats each form instance as a distinct element
  during re-renders */
  return <EditForm {...props} key={props.savedContact.id} />;
}

/* useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]); */

/* const [prevSavedContact, setPrevSavedContact] = useState(savedContact);
  if (savedContact !== prevSavedContact) {
    setName(savedContact.name);
    setEmail(savedContact.email);
    setPrevSavedContact(savedContact);
  } 
    
all the form state gets moved into the inner EditForm component 
make EditContactOne pass savedContact.id as the key to the inner EditForm 
component 
inner EditForm component resets all of the form state and recreates the DOM
whenever I select a different contact */
function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{" "}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{" "}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <button
        onClick={() => {
          const updatedData = {
            id: savedContact.id,
            name: name,
            email: email,
          };
          onSave(updatedData);
        }}
      >
        Save
      </button>
      <button
        onClick={() => {
          setName(savedContact.name);
          setEmail(savedContact.email);
        }}
      >
        Reset
      </button>
    </section>
  );
}

function ContactManagerOne() {
  const [contacts, setContacts] = useState(initialContactsOne);
  const [selectedId, setSelectedId] = useState(0);
  const selectedContact = contacts.find((c) => c.id === selectedId);

  function handleSave(updatedData) {
    const nextContacts = contacts.map((c) => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactListThree
        contacts={contacts}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
      />
      <hr />
      <EditContactOne savedContact={selectedContact} onSave={handleSave} />
    </div>
  );
}

const initialContactsOne = [
  { id: 0, name: "Taylor", email: "taylor@mail.com" },
  { id: 1, name: "Alice", email: "alice@mail.com" },
  { id: 2, name: "Bob", email: "bob@mail.com" },
];

// this solution still has sendMessage getting called with an empty string passed in
function FormSix() {
  // state to manage form display, start at false/ not showing form
  const [showForm, setShowForm] = useState(false);
  // state to manage message text
  const [message, setMessage] = useState("");

  useEffect(() => {
    // ignore is flag for whether the effect is still relevant
    let ignore = false;
    // only update state if the effect is still relevant
    if (!ignore) {
      /* if showForm is false, console log the message 
      problem is, a message is getting console logged even if send 
      button hasn't been clicked */
      if (!showForm) {
        sendMessage(message);
      }
    }
    /* cleanup function ensures that when the component re-renders, the
    old effect marks itself as ignored by setting ignore = true 
    */
    return () => {
      ignore = true;
    };
    /* showForm and message (as with any state) are dependencies
  each state change triggers a re-render and re-runs the useEffect, so
  multiple operations could be initiated at once
  
  useEffect function associated with an older state could finish after 
  the latest effect has already run
  this leads to an older message being sent last, overwriting or 
  conflicting with newer data (empty string getting logged in the console) */
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button
          onClick={() => {
            setMessage("");
            setShowForm(true);
          }}
        >
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ""}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log("Sending message: " + message);
}

/* Better solution - I am not sending the mssage because Thank you was displayed
I want to send the message because the user has submitted the form 
only submitting the form, the event, causes the message to be sent
this works regardless of whether showForm is initially set to true or false */
function FormSeven() {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  /* useEffect(() => {
    let ignore = false;
    if (!ignore) {
      if (!showForm) {
        sendMessage(message);
      }
    }
    return () => {
      ignore = true;
    };
  }, [showForm, message]); */

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    // sendMessage should be called inside this event handler
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button
          onClick={() => {
            setMessage("");
            setShowForm(true);
          }}
        >
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ""}>
        Send
      </button>
    </form>
  );
}

export {
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
};
