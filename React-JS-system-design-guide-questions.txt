# 🧠 Frontend Engineering Interview Revision Guide

A concise reference covering React performance, JavaScript patterns, state architecture, algorithms, and system design.

---

## Table of Contents

1. [React Performance Optimization](#1-react-performance-optimization)
2. [JavaScript Data Manipulation](#2-javascript-data-manipulation)
3. [State Architecture & Topology Scales](#3-state-architecture--topology-scales)
4. [Algorithmic Optimization — Two-Sum Pattern](#4-algorithmic-optimization--two-sum-pattern)
5. [Lifecycle Closures & React State Stability](#5-lifecycle-closures--react-state-stability)
6. [Frontend System Design](#6-frontend-system-design)

---

## 1. React Performance Optimization

### The Problem

A dashboard renders a static array of items through a `<HeavyTable />` child component. When the parent toggles its theme state, `<HeavyTable />` re-renders despite its props remaining identical.

**Why?** By default, React recursively re-renders all children when parent state changes, regardless of whether their props changed. React prioritizes rendering safety over optimization.

---

### Fix: `React.memo`

Wrap the child component in `React.memo` to introduce a **shallow prop comparison** — skipping re-render if props are unchanged.

```jsx
import React, { useState, memo } from 'react';

const HeavyTable = memo(({ items }) => {
  console.log("HeavyTable rendered strictly on prop mutations!");
  return (
    <ul>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
});
```

---

### ⚠️ Anti-Pattern: Reference Breaking

Passing **inline arrays, literal objects, or un-memoized functions** as props breaks `React.memo`. New reference-type allocations produce fresh memory pointers on every render, causing shallow equality (`===`) to fail.

---

### Fix: `useCallback`

Stabilize function pointers passed to memoized children.

```jsx
// Caches and stabilizes the memory pointer across execution snapshots
const handleItemClick = useCallback((clickedItem) => {
  setItems((prevItems) => prevItems.filter(item => item !== clickedItem));
}, []); // Empty dependencies keep reference permanently stable via functional updates
```

---

## 2. JavaScript Data Manipulation

### The Problem

Transform a flat array of transaction records into a lookup dictionary mapping **total costs by product category**.

### Strategy: `.reduce()`

The optimal approach for compressing arrays into a single target dimension (object, array, or primitive).

```js
const transactions = [
  { id: 1, category: 'Electronics', amount: 300 },
  { id: 2, category: 'Clothing',    amount: 50  },
  { id: 3, category: 'Electronics', amount: 120 },
  { id: 4, category: 'Groceries',   amount: 80  }
];

const totalByCategory = transactions.reduce((acc, { category, amount }) => {
  // Leverage logical assignment to dynamically default undefined properties
  acc[category] = (acc[category] || 0) + amount;
  return acc;
}, {}); // CRITICAL: Explicitly anchor accumulator default state as an empty object
```

---

## 3. State Architecture & Topology Scales

### The Problem

What are the structural flaws of **Prop Drilling**, how does the Context API solve them, and when should you migrate to Redux/Zustand?

---

### Prop Drilling Vulnerabilities

| Issue | Description |
|---|---|
| **Refactoring Fragility** | Intermediate components become artificially coupled with state they don't consume, creating large refactoring surfaces |
| **Component Pollution** | Layout code fills with proxy variables, destroying legibility and modular reusability |

---

### Fix: React Context API

Establishes an architectural broadcast layer — a `Provider` injects state into the tree, and `useContext` decodes it inside deeply nested components, bypassing layout proxies entirely.

---

### When to Migrate to Redux / Zustand

| Trigger | Reason |
|---|---|
| **Re-render Boundaries** | Context updates trigger full render cycles across all `useContext` subscribers. Redux prevents this via deterministic state slice subscriptions (Selectors) |
| **Middleware Needs** | Redux centralizes async operations, interceptors, and audit logs cleanly — something native Context lacks |

---

## 4. Algorithmic Optimization — Two-Sum Pattern

### The Problem

Find indices of two numbers in an array that sum to a target — in **linear time**.

---

### Strategy: O(n) HashMap

Single-pass loop with a memory lookup table — avoids brute-force nested loops at O(n²).

```js
function twoSum(nums, target) {
  const mp = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    // Constant-time O(1) check inside our map registry
    if (mp.has(complement)) {
      return [mp.get(complement), i];
    }

    // Capture the current value as key and its index as value
    mp.set(nums[i], i);
  }

  return [];
}
```

---

## 5. Lifecycle Closures & React State Stability

### The Problem

Why do standard JS closure utilities (like Debounce) break inside functional React components?

**Why?** Every state change causes a full re-evaluation of the component from top to bottom. Raw function declarations create a fresh closure in memory each time — internal trackers like the debounce timer get re-allocated on every keypress, making `clearTimeout` useless.

---

### Fix: `useRef`

Unlike `useCallback` (which can break with improper dependency arrays), `useRef` completely **isolates data across rendering phases** without triggering layout updates — preserving the exact same closure reference across the component lifecycle.

```jsx
export default function SearchBar() {
  const [query, setQuery] = useState('');

  // Seal the internal closure state within a single execution instance
  const debouncedSearchRef = useRef(
    debounce((value) => makeApiCall(value), 500)
  );

  const handleChange = (e) => {
    setQuery(e.target.value);
    debouncedSearchRef.current(e.target.value); // Trigger the stable closure instance
  };

  return <input type="text" value={query} onChange={handleChange} />;
}
```

---

## 6. Frontend System Design

### A. DOM Node Virtualization (Windowing)

Render only items **visible within the viewport**. As elements exit screen bounds, unmount them while preserving scroll dimensions with calculated padding. Use `IntersectionObserver` to trigger pre-fetch pipelines before users reach list boundaries.

---

### B. Bundle Splitting & Connection Segregation

Decouple auxiliary resources (charts, real-time frames) from primary scripts using `React.lazy()` and `<Suspense>`. This lowers initial **Time-to-Interactive (TTI)**. Deploy high-overhead connections (e.g. WebSockets) only on demand, with automatic teardown on unmount.

---

### C. State Caching via SWR (Stale-While-Revalidate)

Instead of `useEffect` fetches that cause loading flashes:

1. Render **cached ("stale") data** immediately from local memory
2. Run background revalidation requests to backend endpoints
3. Silently repaint the UI upon confirmation

---

### D. Mutation Synchronization Strategies

| Strategy | Description |
|---|---|
| **Cache Invalidation** | Forcefully wipe matching local cache namespaces after successful mutation API responses — keeping the backend as source of truth |
| **Optimistic Updates** | Instantly update UI assuming success. On server error, roll back to the previous snapshot cleanly — keeping the experience lag-free |

---

*Frontend Engineering Interview Revision Guide*
