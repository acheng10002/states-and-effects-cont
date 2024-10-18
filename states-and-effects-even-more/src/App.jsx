import React, { useState, useEffect, useRef, Component } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";

/* 1. don't need an effect if I am calculating a value based on the state or prop during rendering
directly calculate the filtered list based on the state and prop during rendering 
without involving side effects */
function FilteredList({ items }) {
  // state that tracks the current search input
  const [query, setQuery] = useState("");

  /* filteredItems array is calculated during rendering based on query state and items prop 
  filtering happens automatically whenever the query changes, and the filtered list is re-rendered */
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  // filteredItems is purely a dervied state

  return (
    <div>
      <input
        type="text"
        placeholder="Search items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function AppOne() {
  const items = ["Apples", "Bananas", "Cherries", "Dates", "Elderberries"];

  return <FilteredList items={items} />;
}

/* 2. don't need an effect for events
code that runs when a component is displayed should be in effects
the rest should be in events 

effects - code that runs as part of the component lifecycle, when component
          mounts, unmounts, or updates
          useEffect for side effects that depend on the component being displayed
          (e.g. fetching data when the component loads)
events - actions triggered by user interactions 
         handle logic for user-triggered events like button clicks or form submissions
         within event handlers themselves

here, effect for fetching data on mount and event for handling user input */
function MyComponent() {
  const [data, setData] = useState(null);
  const [inputValue, setInputValue] = useState("");

  /* useEffect used for side effect that depends on the component being displayed
  simulates a data fetch when the component mounts and runs once */
  useEffect(() => {
    /* 
    fetch('/api/data')
    .then(response => response.json())
    .then(fetchedData => setData(fetchedData));
    */
    const fetchData = () => {
      // simulate a delay as if I'm fetching from an API
      setTimeout(() => {
        const simulatedData = {
          id: 1,
          name: "Simulated Data",
          description: "This is the data fetched from the simulated API.",
        };
        // set the fetched data in the state
        setData(simulatedData);
        // 2-second delay to simulate the fetch
      }, 2000);
    };
    fetchData();
    // empty dependency array ensure this runs only once, when the component mounts
  }, []);

  // event handler for input change (a user interaction)
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // event handler for form submission (again a user interaction)
  const handleSubmit = (e) => {
    /* stops the browser's default behavior for an event object, like form submission
    (browser usually reloads the page or redirects), link click (browser usually follows
    the link), key presses (prevents form from submitting when Enter is pressed) */
    e.preventDefault();
    // this runs in response to user action
    console.log("Submitted:", inputValue);
  };

  return (
    <div>
      <h1>Data from Simulated Data:</h1>
      {/* render the fetched data or show loading text */}
      {data ? (
        /* <pre> ensures the whitespace (indents, new lines) is preserved and displayed as
          is in the browser
          JSON.stringify converts the data object into a formatted JSON string with 2 spaces
          of indentation */
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          // event handler for input
          onChange={handleInputChange}
          placeholder="Enter something"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

/* 3. don't need an effect to reset the state based on a condition 
keys can be used to reset components when state changes
components with different keys get treated as completely different components
  when the key changes, the component will unmount and remount
  effectively resetting the state of the component 
  
ResettableForm's key is based on the formKey state of the parent AppTwo 
whenever formKey changes, React treats ResettableForm as a new component
and resets its state */
function ResettableForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Name: ${name}, Email: ${email}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}
/* React key pattern is sueful for resetting state when the component is meant
to be completely re-initialized*/
function AppTwo() {
  const [formKey, setFormKey] = useState(0);

  /* when formKey changes, React treats ResettableForm as a new component
  anf resets its state */
  const handleReset = () => {
    /* updater function inherently provides the previous state as an argument
    React automatically passes the previous value of formKey to the function
    increment the key to trigger a "reset" of the form */
    setFormKey((prevKey) => prevKey + 1);
  };

  return (
    <div>
      <h1>Resettable Form</h1>
      <ResettableForm key={formKey} />
      {/* form remains in its current state as long as formKey does not change
      when Reset Form button is clicked, setFormKey is called, incrementing formKey, 
      and causes ResettableForm component to remount */}
      <button onClick={handleReset}>Reset Form</button>
    </div>
  );
}

/* 4. don't need an effect to update the state of a parent or some other non-child
component, consider lifting the state 

effects are called escape hatches because they allow developers to handle side effects
in a controlled manner when normal rendering or state management isn't sufficient */

/* 1. infinite loop caused by side-effect updating state 
      a. fix it with correct management of the useEffect dependencies argument 
         which then makes the loop breakable */
function CountInputChangesOne() {
  const [value, setValue] = useState("");
  const [count, setCount] = useState(-1);

  /* every time the component re-renders due to the user typing into the input,
  useEffect updates the counter
  if the dependency array is empty, the setCount callback is executed after every 
  rendering of the component and causes an infinite loop (bc setCount updates the
  state, state update triggers re-rendering, re-rendering runs useEffect again, 
  which runs the setCount callback which updates the state again, etc.)
  
  adding [value] as a dependency, count state will only be updated when value changes */
  useEffect(() => setCount(count + 1), [value]);

  const onChange = ({ target }) => setValue(target.value);

  return (
    <div>
      {/* form input value is a controlled component, its value is controlled by
      React state */}
      <input type="text" value={value} onChange={onChange} />
      <div>Number of changes: {count}</div>
    </div>
  );
}

// b. fix it by using a reference
function CountInputChangesTwo() {
  const [value, setValue] = useState("");

  /* useRef() hook storres the number of changes of the input 
  updating a reference doesn't trigger re-rendering */
  const countRef = useRef(0);

  /* onChange event handler has countRef.current++ execute each time value state 
  changes, but reference change again doesn't trigger re-rendering */
  const onChange = ({ target }) => {
    setValue(target.value);
    countRef.current++;
  };

  return (
    <div>
      {/* form input value is a controlled component, its value is controlled by
      React state */}
      <input type="text" value={value} onChange={onChange} />
      <div>Number of changes: {countRef.current}</div>
    </div>
  );
}

// 2. infinite loop caused by new objects references
function CountSecrets() {
  const [secret, setSecret] = useState({ value: "", countSecrets: 0 });

  useEffect(() => {
    if (secret.value === "secret") {
      /* gotta be careful when using objects as dependencies 
      as soon as the input value equals secret, state updater function is called
      secrets counter is incremented, but the state updater function
      also creates a new object, secret 
      meaning the dependency has changed, so useEffect(..., [secret]) gets invoked again,
      side-effect updates the state, new secret object is created again, etc. 
      
      ***2 objects in JS are equal only if they reference exactly the same object */
      setSecret((s) => ({ ...s, countSecrets: s.countSecrets + 1 }));
    }
    // }, [secret]);
    // changing the dependency fixes the infinite loop
  }, [secret.value]);

  const onChange = ({ target }) => {
    setSecret((s) => ({ ...s, value: target.value }));
  };

  return (
    <div>
      <input type="text" value={secret.value} onChange={onChange} />
      <div>Number of secrets: {secret.countSecrets}</div>
    </div>
  );
}

/* avoid objects as dependencies, and stick to primitives 

useEffect(callback, deps) executes callback (the side-effect) after deps changes
I have to be careful with what the side-effect does, bc I might trigger an infinite loop
of component rendering

1. common case that generates an infinite loop is updating the state in the side-effect
   without having any dependency at all
   a. manage the hook dependencies, control when exactly the side-effect should run
      use Effect(() => {
        setState(count + 1);
      }, [whenToUpdateValue]); 
   b. alternatively, use a reference, bc updating a reference doesn't trigger a re-rendering 
      countRef.current++;
      
2. another common case is using an object as a dependency, and within the side-effect, update
   that object (effectively creating a new object) 
   - instead, use the object property values directly as dependencies 
   
Mapping React class components to function components with hooks is a mistake 

DogInfo is a class component that uses classs-based lifecycle methods and state management
to display information about a dog 

both class DogInfo and function DogInfo fetch: 
- dog data when the component mounts, 
- refetches the dog data when the dogId prop changes, 
- and aborts the fetch request when the component unmounts or when the dogId changes before
  the fetch completes

below, are all lifecycle hooks 
class component */
class DogInfo extends Component {
  /* property called controller that will later be used to store an instance of AbortController
  AbortController is used to cancel ongoing fetch requests */
  controller = null;
  /* initializes the component's state with a dog property set to null 
  holds the dog data once it's fetched from the API */
  state = { dog: null };
  fetchDog() {
    /* if there's an ongoing fetch request (by an existing AbortController), aborts the
    previous request
    optional chaining (?.) ensures that the abort() method is only called if controller
    is not null 
    "this" is the context in which a function is called */
    this.controller?.abort();

    /* creates a new instance of AbortController which can control the fetch request and 
    allow it to be canceled later */
    this.controller = new AbortController();
    /* getDog(this.props.dogId, - API call made using the dogId prop
    { signal: this.controller.signal } - links the request to the AbortController, 
                                          allowing it to be aborted if needed */
    getDog(this.props.dogId, { signal: this.controller.signal }).then(
      (dog) => {
        /* when the fetch completes successfully, dog data is stored in the component's 
        state using this.setState({ dog }) */
        this.setState({ dog });
      },
      (error) => {
        // handle the error
      }
    );
  }

  // called when the component is first added to the DOM
  componentDidMount() {
    // fetch the dog data when the component is first rendered
    this.fetchDog();
  }

  // called whenever the component re-renders due to changes in props or state
  componentDidUpdate(prevProps) {
    // checks if the previous dogId is different from the current one
    if (prevProps.dogId !== this.props.dogId) {
      // if it is different, fetches new dog data
      this.fetchDog();
    }
  }

  // called just before the component is removed from the DOM
  componentWillUnmount() {
    /* ensures any ongoing fetch request is aborted when the component unmounts
    to avoid memory leaks or attempts to update the state of an unmounted component */
    this.controller?.abort();
  }

  render() {
    return <div>{/* render dog's info */}</div>;
  }
  /* componentDidMount(), componentDidUpdate(), componentWillUNmount(), and render() 
  are built-in lifecycle methods */
}

/* useEffect is not a lifecycle hook; it's a mechanism for synchronizing side effects
with the state of my app 
functional component 
dogId prop is used to fetch and display info about a dog */
function DogInfo({ dogId }) {
  /* no dog data when the component first renders 
  once data is fetched, state will be updated to contain the dog's info */
  const [dog, setDog] = useState(null);

  /* runs when the component renders or when dogId value changes, it fetches
  the dog data from an external source */
  useEffect(() => {
    /* instance of AbortController that cancels the fetch request if needed, 
    ex. when the component unmounts before the fetch request completes */
    const controller = new AbortController();
    /* fetches data about the dog based on the given dogId and links
    the request to the AbortController so it can be canceled if necessary */
    getDog(dogId, { signal: controller.signal }).then(
      /* once the fetch request is successful, the .then block executes and 
      the fetched dog data is passed to the setSog function to update the dog state
      with the new data */
      (d) => setDog(d),
      (error) => {
        // handle the error
      }
    );
    /* cleanup function called when the component is about to unmount or when the 
    dogId changes, to ensure the component doesn't attempt to update its state
    after it's unmounted */
    return () => controller.abort();
    // re-runs effect/ triggers a new fetch when dogId changes
  }, [dogId]);

  /* if I must define a function for my effect to call, then do it inside the 
  effect callback, not outside */

  return <div>{/* render dog's info */}</div>;
}

// logical concerns can be separated into individual hooks
function ChatFeed() {
  // useFeedSubscription()
  useEffect(() => {
    //subscribe to feed
    return () => {
      // unsubscribe from feed
    };
  });
  // useDocumentTitle()
  useEffect(() => {
    //set document title
    return () => {
      // restore document title
    };
  });
  // useOnlineStatus()
  useEffect(() => {
    //subscribe to online status
    return () => {
      // unsubscribe from online status
    };
  });
  // useGeoLocation()
  useEffect(() => {
    //subscribe to geo location
    return () => {
      // unsubscribe from geo location
    };
  });

  return <div>{/* render dog's info */}</div>;
}

function UsernameForm({ initialUsername = "", onSubmitUsername }) {
  const [username, setUsername] = useState(initialUsername);
  const [touched, setTouched] = useState(false);

  /* React doesn't keep track of the current value of a ref
  I am responsible for referencing and mutating that value myself 
  React will set the current value for me when I pass a ref prop
  to an element, but other than that, all React promises is that it 
  will store my object and associate it to a particular instance
  of a component

  useRef ensures that the value is associated with a particular instance 
  of a component */
  const usernameInputRef = React.useRef < HTMLInputElement > null;

  const usernameIsLowerCase = username === username.toLowerCase();
  const usernameIsLongEnough = username.length >= 3;
  const usernameIsShortEnough = username.length <= 10;
  const formIsValid =
    usernameIsShortEnough && usernameIsLongEnough && usernameIsLowerCase;

  const displayErrorMessage = touched && !formIsValid;

  /* effect focuses the input when an error is displayed so the user 
  can fix the problem */
  useEffect(() => {
    if (displayErrorMessage) usernameInputRef.current?.focus();
  }, [displayErrorMessage]);

  let errorMessage = null;
  if (!usernameIsLowerCase) {
    errorMessage = "Username must be lower case";
  } else if (!usernameIsLongEnough) {
    errorMessage = "Username must be at least 3 characters long";
  } else if (!usernameIsShortEnough) {
    errorMessage = "Username must be no longer than 10 characters";
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!formIsValid) {
      return;
    }
    onSubmitUsername(username);
  };

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <form name="usernameForm" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="usernameInput">Username:</label>
        <input
          ref={usernameInputRef}
          id="usernameInput"
          type="text"
          value={username}
          onChange={handleChange}
          onBlur={handleBlur}
          pattern="[a-z]{3,10}"
          required
          aria-describedby={displayErrorMessage ? "error-message" : undefined}
        />
      </div>
      {displayErrorMessage ? (
        <div role="alert" className="error-message">
          {errorMessage}
        </div>
      ) : null}
      <button type="submit">Submit</button>
    </form>
  );
}

/* anything I use in my effect callback that won't trigger a re-render when
updated should not go into the dependency array
if I NEED the callback to be called when those things change, then I NEED
to put it in useState (or useReducer) 

custom hook that accepts a ref 
including the ref in the dependency array doesn't make any difference */
function useDateCall(cbRef) {
  useEffect(() => {
    cbRef, current(new Date());
  }, [cbRef]); // no eslint warning here
}

function Comp() {
  const logRef = useRef(console.log);
  useDateCall(logRef);
  return <div>{/*stuff here */}</div>;
}

/* just don't list a ref in my dependency array, and if I want the effect to
re-rerun when the ref value is changed, put that value in useState/useReducer 
so that an update will trigger a render */

export {
  AppOne,
  MyComponent,
  AppTwo,
  CountInputChangesOne,
  CountInputChangesTwo,
  CountSecrets,
};
