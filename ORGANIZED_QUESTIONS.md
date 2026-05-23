# Organized Interview Questions

## Pure JavaScript Questions

### Q1: Diff between map and forEach
**Key Difference:** `map()` creates a new array and doesn't modify the original, while `forEach()` iterates but doesn't return anything.

```javascript
const ans = arr.map((e) => {
  return e + 2;  // Returns new array
})

arr.forEach((e) => {
  return e + 2;  // Returns undefined, doesn't create new array
})
```

---

### Q2: Diff between null and undefined
- **null**: Intentionally assigned value (type: object)
- **undefined**: Variable declared but not initialized

```javascript
(null == undefined)   // true  (checks only value)
(null === undefined)  // false (checks value and type)
```

---

### Q3: Flatten the array
**Single depth:**
```javascript
let arr = [[1,2], [4,3,2], [8,9,0]];
[].concat(...arr)  // [1, 2, 4, 3, 2, 8, 9, 0]
```

**Multiple levels:**
```javascript
arr.flat(Infinity)  // Flattens all levels
```

---

### Q4: Let vs const vs var
| Keyword | Scope | Redeclarable | Reassignable |
|---------|-------|--------------|--------------|
| var | Global | Yes | Yes |
| let | Block | No | Yes |
| const | Block | No | No |

---

### Q5: setTimeout related - Closure Issue
**With `let` (Block Scoped):**
```javascript
function temp() {
  for(let i = 0; i < 5; i++) {
    setTimeout(function a() {
      console.log(i);  // Output: 0, 1, 2, 3, 4
    }, i * 1000)
  }
}
```

**With `var` (Global Scoped):**
```javascript
function temp() {
  for(var i = 0; i < 5; i++) {
    setTimeout(function a() {
      console.log(i);  // Output: 5, 5, 5, 5, 5
    }, i * 1000)
  }
}
```

**Fix using IIFE:**
```javascript
function temp() {
  for(var i = 0; i < 5; i++) {
    (function(i) {
      setTimeout(function a() {
        console.log(i);  // Output: 0, 1, 2, 3, 4
      }, i * 1000)
    })(i);
  }
}
```

---

### Q6: Explain call, apply and bind

```javascript
let person = {
  name: "sammed",
  hello: function(word) {
    console.log("welcome " + this.name + " and " + word);
  }
}

let another = {
  name: "Rakesh"
}

// Using call() - executes immediately, individual arguments
person.hello.call(another, "hi");  
// Output: "welcome Rakesh and hi"

// Using apply() - executes immediately, array of arguments
person.hello.apply(another, ["hi"]);  
// Output: "welcome Rakesh and hi"

// Using bind() - returns a function, doesn't execute immediately
const temp = person.hello.bind(another);
temp("hi");  
// Output: "welcome Rakesh and hi"
```

---

### Q22: Write the order of console (Event Loop)
```javascript
console.log('script start');      // 1 - Synchronous

setTimeout(function() {
  console.log('setTimeout');      // 4 - Macrotask
}, 0);

Promise.resolve()
  .then(function() {
    console.log('promise1');      // 2 - Microtask
  })
  .then(function() {
    console.log('promise2');      // 3 - Microtask
  });

console.log('script end');        // 1 - Synchronous

// Output Order:
// 1. script start
// 2. script end
// 3. promise1
// 4. promise2
// 5. setTimeout
```

**Explanation:** Synchronous → Microtasks (Promises) → Macrotasks (setTimeout)

---

### Q23: Output of the code - Array Reference Behavior

```javascript
var temp = [1, 2, 3];

((x) => {
  x.push(55);
  console.log(x);      // [1, 2, 3, 55]
  
  x = [3, 2, 1];
  x.push(44);
  console.log(x);      // [3, 2, 1, 44]
})(temp)

console.log(temp);     // [1, 2, 3, 55]
```

**Explanation:**
- Arrays are assigned by reference
- `x` initially references `temp`
- `x.push(55)` modifies the original array
- `x = [3, 2, 1]` reassigns `x` to a NEW array (no longer references `temp`)
- Final `console.log(temp)` shows only the first push

---

### Q24: 'this' in Regular JS Function vs Arrow Function

```javascript
var variable = "Global Level Variable";

let myObject = {
  variable: "Object Level Variable",
  arrowFunction: () => {
    console.log(this.variable);      // "Global Level Variable"
  },
  regularFunction() {
    console.log(this.variable);      // "Object Level Variable"
  }
};

myObject.arrowFunction();
myObject.regularFunction();
```

**Explanation:**
- **Arrow Functions:** No own `this` context; inherit from lexical scope (global)
- **Regular Functions:** Own `this` context; bound to calling object

---

### Q25: Using filter() to Remove Duplicates from Array

```javascript
let a = [1, 2, 3, 2, 1, 3, 4, 5, 6];
let b = a.filter((ele, i, arr) => arr.indexOf(ele) === i);

// Result: [1, 2, 3, 4, 5, 6]
```

**Explanation:**
- `indexOf()` returns the index of the FIRST occurrence
- Compare current index `i` with `indexOf(ele)`
- Keep only elements appearing for the first time
- Effectively removes duplicates

---

### Q26: Explain call(), apply(), and bind() (Detailed)

JavaScript methods to control the `this` context and enable method borrowing.

#### Using call()
```javascript
const student1 = {
  name: "sammed",
  callName: function() {
    console.log(this.name);
  }
};

const student2 = {
  name: "shrey"
};

student1.callName.call(student2);  // Output: "shrey"
```
- Invokes function immediately
- Sets `this` to the provided object

#### Using apply()
```javascript
const student1 = {
  name: "sammed",
  greet: function(message, time) {
    console.log(`${message}, ${this.name}! It's ${time}`);
  }
};

const student2 = {
  name: "shrey"
};

student1.greet.apply(student2, ["Hello", "morning"]);
// Output: "Hello, shrey! It's morning"
```
- Like `call()` but accepts arguments as an array
- Useful for arrays of arguments

#### Using bind()
```javascript
const student1 = {
  name: "sammed",
  greet: function(message, time) {
    console.log(`${message}, ${this.name}! It's ${time}`);
  }
};

const student2 = {
  name: "shrey"
};

// Partial binding
const boundGreet = student1.greet.bind(student2, "Hi");
boundGreet("evening");  // Output: "Hi, shrey! It's evening"

// Fully bound
const fullyBound = student1.greet.bind(student2, "Hello", "night");
fullyBound();  // Output: "Hello, shrey! It's night"
```
- Creates a new function without executing immediately
- Returns a function that can be called later
- Allows partial application (pre-filling arguments)

#### Key Differences

| Method | Executes Immediately | Arguments Format | Returns |
|--------|----------------------|------------------|---------|
| **call()** | Yes | Individual args | Function result |
| **apply()** | Yes | Array | Function result |
| **bind()** | No | Individual args | New bound function |

---

## React Questions

### Q7: React Lifecycle of Components

#### Class Components
**1. Mounting (Component added to DOM)**
```javascript
componentDidMount() {
  // Runs once after component mounts
  // Used to fetch API data or initialize
}
```

**2. Updating (State/Props change)**
```javascript
componentDidUpdate(prevProps, prevState) {
  // Runs whenever state or props change
}
```

**3. Unmounting (Component removed from DOM)**
```javascript
componentWillUnmount() {
  // Runs before component is removed
  // Used for cleanup
}
```

#### Functional Components (using Hooks)
**1. Mounting:**
```javascript
useEffect(() => {
  console.log("Component mounted");
}, [])  // Empty dependency array = runs once
```

**2. Updating:**
```javascript
useEffect(() => {
  console.log("Component updated");
}, [number])  // Runs when 'number' changes
```

**3. Unmounting:**
```javascript
useEffect(() => {
  return () => {
    console.log("Component unmounted");
  }
}, [number])  // Cleanup function runs on unmount
```

---

### Q8: What is Virtual DOM?
- JavaScript object representation of the real DOM
- Has a node tree with elements and attributes
- **Benefits:**
  - Uses less memory
  - High execution speed
  - Improves performance through efficient diffing and batching updates

---

### Q9: Are props immutable? If yes, why?
**Yes, props are immutable (read-only).**

**Reasons:**
- Props act like function arguments
- Props are passed through multiple components
- Immutability ensures data integrity across the component tree
- Prevents accidental modifications to data from parent components

---

### Q10: How to pass data from parent to child and child to parent?

**Parent to Child (using Props):**
```javascript
// Parent
<Child message="Hello from parent" />

// Child
function Child(props) {
  return <p>{props.message}</p>;
}
```

**Child to Parent (using Callback Function):**
```javascript
// Parent
function Parent() {
  const handleChildData = (data) => {
    console.log("Data from child:", data);
  }
  return <Child sendData={handleChildData} />
}

// Child
function Child({ sendData }) {
  return <button onClick={() => sendData("Hi parent")}>Send Data</button>
}
```

---

### Q11: What is a fragment? What is div-soup?

**Fragment:** React Fragments allow you to wrap multiple elements without adding extra DOM nodes.

**Div-soup:** Using unnecessary `<div>` wrappers for every group of elements.

**Disadvantage of div-soup:**
- Creates unnecessary DOM nodes
- Bloats HTML structure
- Can break CSS layouts

**Solution with Fragments:**
```javascript
// Without Fragment (div-soup)
return (
  <div>
    <Component1 />
    <Component2 />
  </div>
)

// With Fragment
return (
  <>
    <Component1 />
    <Component2 />
  </>
)
```

---

### Q12: Class-based vs Function-based components

| Aspect | Class Component | Function Component |
|--------|-----------------|-------------------|
| Definition | Extends React.Component | Plain JavaScript function |
| State Management | `this.state` | `useState` hook |
| Lifecycle | `componentDidMount`, etc. | `useEffect` hook |
| Syntax | More verbose | More concise |
| Performance | Slightly slower | Slightly faster |

---

### Q13: Can you only do something with class-based components and not functional components?

**Before Hooks:** Yes, only class components had lifecycle methods.

**After Hooks:** Functional components can do almost everything class components can do.

**Minor Differences:**
- Class components have `render()` method
- Error boundaries are currently only available in class components
- `getSnapshotBeforeUpdate()` and `componentDidCatch()` have no functional equivalents yet

---

### Q14: What are error boundaries?

React components that:
- Catch JavaScript errors in child component tree
- Log those errors
- Display fallback UI instead of crashing

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}
```

---

### Q15: Controlled vs Uncontrolled components

**Controlled Component:** React manages form data through state
```javascript
function Form() {
  const [value, setValue] = useState("");
  
  return (
    <input 
      value={value} 
      onChange={(e) => setValue(e.target.value)} 
    />
  );
}
```

**Uncontrolled Component:** DOM manages form data directly
```javascript
function Form() {
  const inputRef = useRef();
  
  return (
    <input ref={inputRef} />
  );
}
```

---

### Q16: What is prop-drilling?

Prop drilling is passing data from one component through multiple intermediate components until reaching the component that needs it.

**Problem:**
```javascript
// Data flows through multiple layers
<GrandParent data={data} />
  <Parent data={data} />
    <Child data={data} />
      <GrandChild data={data} />  // Only this needs it
```

**Solution:** Use Context API or State Management (Redux, Zustand)

---

### Q17: What is Context API? Downsides?

**Context API:** Built-in React tool for global state management without prop drilling.

**Advantages:**
- No increase in bundle size
- Minimal boilerplate

**Downsides:**
- UI and state management in same component
- Difficult debugging in nested components
- Can cause performance issues with frequent updates
- Not ideal for frequently changing data

---

### Q18: useState hook

Used for state management in functional components.

```javascript
const [count, setCount] = useState(0);

return (
  <>
    <p>Count: {count}</p>
    <button onClick={() => setCount(count + 1)}>Increment</button>
  </>
);
```

---

### Q19: useEffect hook

Used to perform side effects in React components (fetch data, subscriptions, DOM manipulation).

```javascript
useEffect(() => {
  // Side effect code here
  return () => {
    // Cleanup code here
  };
}, [dependencies]);
```

---

### Q20: useRef hook

The `useRef` Hook allows you to:
- **Persist values** between renders without causing re-renders
- **Store mutable values** that don't trigger updates
- **Access DOM elements** directly

```javascript
const inputRef = useRef();

const focusInput = () => {
  inputRef.current.focus();
}

return (
  <>
    <input ref={inputRef} />
    <button onClick={focusInput}>Focus Input</button>
  </>
);
```

---

### Q21: How to optimize React performance?

1. **Use immutable data structures** - Prevents accidental mutations
2. **Create pure components** - Same output for same props/state
3. **Code splitting** - Break into multiple chunk files
4. **React.memo** - Memoize components to prevent unnecessary re-renders
5. **Use Fragments** - Avoid unnecessary DOM nodes
6. **Lazy loading** - Load components on demand

```javascript
// Using React.memo
const MyComponent = React.memo(function Component(props) {
  return <div>{props.name}</div>;
});
```

---

## Summary

**Pure JavaScript Questions (12 total):** Q1, Q2, Q3, Q4, Q5, Q6, Q22, Q23, Q24, Q25, Q26 (and Q6/Q26 overlap)

**React Questions (15 total):** Q7, Q8, Q9, Q10, Q11, Q12, Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20, Q21
