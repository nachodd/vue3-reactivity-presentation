---
theme: ./theme
colorSchema: 'auto'
layout: intro
# https://sli.dev/custom/highlighters.html
highlighter: shiki
title: Vue 3 - Reactivity
themeConfig:
  logoHeader: '/nacho-pixel-32.png'
---

# Vue 3 Reactivity

🪄 Reactivity Caveats and more

<div class="pt-12">
  <span @click="next" class="px-2 p-1 rounded cursor-pointer hover:bg-white hover:bg-opacity-10">
    Press Space to continue <carbon:arrow-right class="inline"/>
  </span>
</div>

---
slideTitle: Introduction - Reactivity Fundamentals
layout: two-cols
---

### ref()

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```
```html
<div>{{ count }}</div>
```

::right::

### reactive()

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

```html
<button @click="state.count++">
  state.counter: {{ state.count }}
</button>
```

<Reactive />

<!--
**Refs:**

Using the Composition API, the recommended way to declare reactive state is using the `ref()` function.
`ref()` takes the argument and returns it wrapped within a ref object with a `.value` property:

[CODE]

**Reactive:**

There is another way to declare reactive state, with the `reactive()` API. Unlike a ref which wraps the inner value in a special object, `reactive()` makes an object itself reactive:
[CODE]

Reactive objects are [JavaScript Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) and behave just like normal objects. The difference is that Vue is able to intercept the access and mutation of all properties of a reactive object for reactivity tracking and triggering.

`reactive()` converts the object deeply: nested objects are also wrapped with `reactive()` when accessed. It is also called by ref() internally when the ref value is an object. Similar to shallow refs, there is also the [`shallowReactive()`](https://vuejs.org/api/reactivity-advanced#shallowreactive) API for opting-out of deep reactivity.

-->
---
layout: text-image
media: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjR5dTEzbHgwMTAyZ2R6N2toam9naHY2ZzFkd2hscGIyemhmemY0biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3cXmze4Y8igXdnkc3U/giphy.gif'
---

# Why Refs?

```js
const saludo = ref("Hola")
console.log(saludo.value) // But why???

function greeting() {
  setTimeout(() => {
    saludo.value += " mundo!"
  }, 3000)
}
```
Output:
<br/><br/>
<WhyRefs />

<br/>

<div class="text-center font-bold">
  ✨ dependency-tracking based
  <br/>
  reactivity system. ✨
</div>

<!--
At this point you might be wondering why we need to use `.value` on refs instead of plain variables. To explain that, we will need to talk about how Vue's reactivity system works.

When you use a `ref` in a template, and change the `ref`'s value later, Vue automatically detects the change and updates the DOM accordingly. This is made possible with a **dependency-tracking based reactivity system**. When a component is rendered for the first time, Vue tracks every ref that was used during the render. Later on, when a ref is mutated, it will trigger a re-render for components that are tracking it.

In standard JavaScript, there is no way to detect the access or mutation of plain variables. However, we can intercept the get and set operations of an object's properties using getter and setter methods.

The `.value` property gives Vue the opportunity to detect when a ref has been accessed or mutated. Under the hood, Vue performs the **tracking** in its getter, and performs **triggering** in its setter.

Conceptually, you can think of a `ref` as an object that looks like this:
[NEXT SLIDE]
-->
---
layout: two-cols
---

# Why Refs?

```js
const saludo = ref("Hola")
console.log(saludo.value) // But why???

function greeting() {
  setTimeout(() => {
    saludo.value += " mundo!"
  }, 3000)
}
```
Output:
<br/><br/>
<WhyRefs />

<br/>

<div class="text-center font-bold">
  ✨ dependency-tracking based
  <br/>
  reactivity system. ✨
</div>

::right::

```js
// pseudo code, not actual implementation
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```
<!--
We are going to deep dive into this later.

Another nice trait of refs is that unlike plain variables, you can pass **refs into functions while retaining access to the latest value and the reactivity connection**.
-->


---

# Deep Reactivity

- `ref` => any value type (deeply nested objects, arrays, Map).
- A `ref` will make its value deeply reactive.

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // these will work as expected.
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

- Non-primitive values => reactive().
- opt-out of deep reactivity: [**Shallow Refs**](https://vuejs.org/api/reactivity-advanced#shallowref)

<!--
`Refs` can hold any value type, including deeply nested objects, arrays, or JavaScript built-in data structures like Map.
A `ref` will make its value deeply reactive. This means you can expect changes to be detected even when you mutate nested objects or arrays:
[CODE]

Non-primitive values are turned into reactive proxies via `reactive()`.

It is also possible to opt-out of deep reactivity with **shallow refs**. For shallow refs, only `.value` access is tracked for reactivity. Shallow refs can be used for optimizing performance by avoiding the observation cost of large objects, or in cases where the inner state is managed by an external library.
-->

---
layout: new-section
---

# Reactivity Caveats

![Reactivity Caveats](/reactivity-sign.jpg)

---


# Reactivity Caveats

### Reactive Proxy vs. Original​

The returned value from reactive() is a `Proxy` of the original object, which is **not equal** to the original object:
<br/>
<br/>
<v-click>
```js
const raw = {}
const proxy = reactive(raw)

// proxy is NOT equal to the original.
console.log(proxy === raw) // false
```
</v-click>

<!--
It is important to note that the returned value from `reactive()` is a Proxy of the original object, which is not equal to the original object:

[CODE]

Only the proxy is reactive - mutating the original object will not trigger updates. Therefore, the best practice when working with Vue's reactivity system is to exclusively use the proxied versions of your state.
-->

---

# Reactivity Caveats

### Reactive Proxy vs. Original​

<div class="monaco">
```js {monaco-run} {autorun:false}
import { reactive } from "vue"

const raw = {}
const proxy = reactive(raw)

// proxy is NOT equal to the original.
console.log("proxy === raw", proxy === raw)

// calling reactive() on the same object returns the same proxy
console.log("reactive(raw) === proxy", reactive(raw) === proxy)

// calling reactive() on a proxy returns itself
console.log("reactive(proxy) === proxy",reactive(proxy) === proxy)

// Same applies for nested objects:

const proxy2 = reactive({})
const raw2 = {}
proxy2.nested = raw2

console.log("proxy2.nested === raw2", proxy2.nested === raw2)
```
</div>

<style scoped>

.monaco :deep(.slidev-monaco-container-inner) {
  max-height: 285px;
}
.monaco :deep(.slidev-runner-output) {
  overflow: scroll;
  max-height: 190px;
}
</style>

<!--
To ensure consistent access to the proxy, calling `reactive()` on the same object always returns the same proxy, and calling `reactive()` on an existing proxy also returns that same proxy:

[CODE]

This rule applies to nested objects as well. Due to deep reactivity, nested objects inside a reactive object are also proxies:

[CODE]

-->

---

# Reactivity Caveats

### Limitations of reactive()

1. **Limited value types**: object types (objects, arrays, and collection types). Can't hold primitive types such as string, number or boolean.

2. **Cannot replace entire object**:

```js
let state = reactive({ count: 0 })

// the above reference ({ count: 0 }) is no longer being tracked
// (reactivity connection is lost!)
state = reactive({ count: 1 })
```

<!--
1. **Limited value types**: it only works for object types (objects, arrays, and collection types such as Map and Set). It cannot hold primitive types such as string, number or boolean.

2. **Cannot replace entire object**: since Vue's reactivity tracking works over property access, we must always keep the same reference to the reactive object. This means we can't easily "replace" a reactive object because the reactivity connection to the first reference is lost:
-->


---

# Reactivity Caveats

### Limitations of reactive()

<br/>

2. **Cannot replace entire object**:


<div class="overflow-hidden text-center self-end">
  <iframe
    src="https://play.vuejs.org/#eNp9kstuwjAQRX9l5A1BilIo3TQCpLZi0Up9qLD0Jg0DmCZ25AdFQvn3jp0EqETZJB7f6+sztg/soaqSnUOWsrHJtajslEtRVkpbOIDGVUyfLLdih1DDSqsSemTvcckl7oNtiavMFWTnEsCgdVXUbwqAXEljgYwwOeZErQaQpTCMu+Irhd4t5fpx3ff5fqQpT8suDnxUa/G/OqwulZMWl393VQUmhVpHnL02cgqcxXYjTEIZlO+NRLsQJSpnI1o9mZ726YzEfQE8oN8f0Rv44aClP+f/BwaiEW2em/4lqjqG0WAwCBW1ySV9xjfH26HCYlkVmUWqABaz+SKFwyEccx28ZzqLmTXEsBLrZGuUpIsObXCWq7ISBer3ygpi5IxCGgDOsqJQPy9hzmqHbae0ZoP594X5rdn7Oc4+NBrUO6SuOs1meo22kWfzN9zT+CiWaukKcl8RP5HOz3nGxvbo5JKwz3yB9jk8WiHXCzPbW5Sma8qDnh4LZ/R8n660fsIdJXftFdSs/gWo//3z"
    frameborder="0"
    width="960"
    height="390"
    class="-mt-14 mb-2"
  ></iframe>
</div>

<!--
This can fixed by not replacing the object.
-->

---

# Reactivity Caveats

### Limitations of reactive()

<br/>

3. **Not destructure-friendly**:

<br/>

```js
const state = reactive({ count: 0 })

// count is disconnected from state.count when destructured.
let { count } = state
// does not affect original state
count++

// the function receives a plain number and
// won't be able to track changes to state.count
// we have to pass the entire object in to retain reactivity
callSomeFunction(state.count)
```
<!--
3. **Not destructure-friendly**: when we destructure a reactive object's primitive type property into local variables, or when we pass that property into a function, we will lose the reactivity connection:

[CODE]
-->

---

# Reactivity Caveats

### Additional Ref Unwrapping Details

<br>

- As Reactive Object Property

```js {*|0-4|6|8-10|*}
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```
<br/>

```js {*|1|3-4|5-6|*}
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// original ref is now disconnected from state.count
console.log(count.value) // 1
```

<!--
A ref is automatically unwrapped when accessed or mutated as a property of a reactive object. In other words, it behaves like a normal property:

[CODE]

If a new `ref` is assigned to a property linked to an existing `ref`, it will replace the old `ref`:

[CODE]

`ref` unwrapping only happens when nested inside a deep reactive object. It does not apply when it is accessed as a property of a shallow reactive object.
-->

---
layout: two-cols
---
# Reactivity Caveats

### Additional Ref Unwrapping Details

- Caveat in Arrays and Collections

<div class="monaco">
```js {monaco-run} {autorun:false}
import { reactive, ref } from "vue"

const books = reactive([ref('Vue 3 Guide')])
console.log("no .value", books[0]) // need .value here

console.log("with .value", books[0].value) // Works as expected
```
</div>

::right::

<br/><br/><br/>
<br/><br/>

<div class="monaco">
```js {monaco-run} {autorun:false}
import { reactive, ref } from "vue"

const map = reactive(new Map([['count', ref(0)]]))

console.log("no .value", map.get('count')) // need .value here

console.log("with .value", map.get('count').value) // Works as expected
```
</div>

<style scoped>
.monaco :deep(.slidev-runner-output) {
  overflow: scroll;
  max-height: 190px;
}
</style>

<!--
Unlike reactive objects, there is no unwrapping performed when the ref is accessed as an element of a reactive array or a native collection type like `Map`:
(Code block)

-->

---

# Reactivity Caveats

### Additional Ref Unwrapping Details

<br/>

- Caveat when Unwrapping in Templates

<br/>

```js
import { reactive, ref } from "vue"

const count = ref(0)
const object = { id: ref(1) }
```
<UnwrappingTemplates0 />

<!--
In the following example, what would be the expected output?

Ref unwrapping in templates only applies if the ref is a top-level property in the template render context.
In the example below, count and object are top-level properties, but `object.id` is not:
```
const count = ref(0)
const object = { id: ref(1) }
```

Therefore, this expression works as expected: `{{ count + 1 }}`
while this one does NOT: `{{ object.id + 1 }}`

The rendered result will be `[object Object]1` because `object.id` is not unwrapped when evaluating the expression and remains a ref object.

-->

---

# Reactivity Caveats

### Additional Ref Unwrapping Details

- Caveat when Unwrapping in Templates

What would happen if we destructure `id` into a top-level property?:

```js
const object = { id: ref(1) }
const { id } = object
```
```html
<span>TEST: {{ id + 1 }}</span>
```
<v-click>
outputs:
<UnwrappingTemplates1/>
</v-click>

<v-click>
Also, what would happend if a <code>ref</code> it's the final evaluated value of a text interpolation?
```html
<span>TEST: {{ object.id }}</span>
```
</v-click>

<v-click>
outputs:
<UnwrappingTemplates2/>
<br/>
<div v-pre>This is equivalent to <code>{{ object.id.value }}</code></div>
</v-click>

---
layout: new-section
---

# How Reactivity Works in Vue

![How Reactivity Works in Vue](/how-does-this-work.jpg)

<style scoped>
.slidev-layout img {
  max-width: 34vw !important
}
</style>

---
layout: two-cols
slideTitle: How Reactivity Works in Vue
---

- Imagine a Spreadsheet with cells `A0`, `A1` and `A2`.
- `A2` is equal to the sum of `A0` and `A1`
- In JS, we could model this as:
```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3
A0 = 2
console.log(A2) // Still 3
```
<v-click>
```js
let A0 = 1
let A1 = 2
let A2
function update() {
  A2 = A0 + A1
}
```
</v-click>

::right::

<v-click>
The `update()` function produces a **side effect**, or **effect** for short, because it modifies the state of the program.

`A0` and `A1` are considered dependencies of the effect, as their values are used to perform the effect. The effect is said to be a subscriber to its dependencies.

What we need is a magic function that can invoke `update()` (the **effect**) whenever `A0` or `A1` (the **dependencies**) change.

```js
function whenDepsChange(update)
```
</v-click>

<!--
[TEXT then EXAMPLE]

[CLICK]

When we mutate `A0`, `A2` does not change automatically.
In order to re-run the code that updates `A2`, let's wrap it in a function:


```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

This `whenDepsChange()` function has the following tasks:

1. Track when a variable is read. E.g. when evaluating the expression A0 + A1, both A0 and A1 are read.
2. If a variable is read when there is a currently running effect, make that effect a subscriber to that variable. E.g. because A0 and A1 are read when `update()` is being executed, `update()` becomes a subscriber to both A0 and A1 after the first call.
3. Detect when a variable is mutated. E.g. when A0 is assigned a new value, notify all its subscriber effects to re-run.

We'll get back to this later.
-->

---
layout: two-cols
slideTitle: How Reactivity Works in Vue
---

_(Pseudo-code)_

```js {*|4,9}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}
```

::right::

<br/>

```js {*|4,9}
function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

<!--
We can't track the reading and writing of plain JS variables. There's just no mechanism for doing that in vanilla JavaScript. What we can do though, is intercept the reading and writing of object properties.

There are two ways of intercepting property access in JavaScript: `getter` / `setters` and `Proxies`. Vue 2 used `getter` / `setters` exclusively due to browser support limitations. In Vue 3, `Proxies` are used for reactive objects and `getter` / `setters` are used for `refs`. Here's some pseudo-code that illustrates how they work:

[CODE]

This explains a few limitations of reactive objects that we have discussed in the Reactivity fundamentals section:
- When you assign or destructure a reactive object's property to a local variable, accessing or assigning to that variable is non-reactive because it no longer triggers the `get` / `set` proxy traps on the source object. Note this "disconnect" only affects the variable binding - if the variable points to a non-primitive value such as an object, mutating the object would still be reactive.
- The returned proxy from `reactive()`, although behaving just like the original, has a different identity if we compare it to the original using the `===` operator.

[CLICK]
[CLICK]
In this example, please take a look at the `track` and trigger `functions`

-->


---
layout: two-cols
slideTitle: How Reactivity Works in Vue
---

_(Pseudo-code)_

```ts {*|8|*}
// This will be set right before an effect
// is about to be run.
let activeEffect: WeakMap<target, Map<key, Set<effect>>>

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

::right::

<br/>

```js {*|2|3}
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

<!--
Inside `track()`, we check whether there is a currently running effect. If there is one, we lookup the subscriber effects (stored in a Set) for the property being tracked, and add the effect to the Set:

[CLICK]
[CODE]
[CLICK]

Effect subscriptions are stored in a global `WeakMap` data structure. If no subscribing effects Set was found for a property (tracked for the first time), it will be created. This is what the `getSubscribersForProperty()` function does, in short. For simplicity, we will skip its details.

[CLICK]

Inside `trigger()`, we again lookup the subscriber effects for the property. [CLICK] But this time we invoke them instead:

[CODE]

-->

---
slideTitle: How Reactivity Works in Vue
---

Let's get back to the `whenDepsChange` method we talked about earlier:

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```
<!--
[TEXT]

It wraps the raw `update` function we mentioner earlier (to update the A2 cell in our case) in an effect that sets itself as the current active effect before running the actual update. This enables `track()` calls during the update to locate the current active effect.

At this point, we have created an effect that automatically tracks its dependencies, and re-runs whenever a dependency changes. We call this a **Reactive Effect**.
-->

---
layout: two-cols
slideTitle: How Reactivity Works in Vue
---

`watchEffect()` (simmilar to `whenDepsChange()`):

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // tracks A0 and A1
  A2.value = A0.value + A1.value
})

// triggers the effect
A0.value = 2
```

::right::

<v-click>
```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```
</v-click>

<v-click>
```js
import { ref, watchEffect } from 'vue'

const count = ref(0)
watchEffect(() => {
  document.body.innerHTML = `Count is: ${count.value}`
})
// updates the DOM
count.value++
```
</v-click>

<!--
Vue provides an API that allows us to create reactive effects: `watchEffect()`. It works pretty similarly to the magical `whenDepsChange()`:

[CODE]

[CLICK]

Using a reactive effect to mutate a `ref` isn't the most interesting use case. A Computed Property makes it more declarative:

[CODE]

Internally, computed manages its invalidation and re-computation using a reactive effect.

So, What is an example of a common and useful reactive effect?

[WAIT]
[CLICK]

Updating the DOM! We can implement simple "reactive rendering" like this:

[CODE]

In fact, this is pretty close to how a Vue component keeps the state and the DOM in sync - each component instance creates a reactive effect to render and update the DOM. Of course, Vue components use much more efficient ways to update the DOM than `innerHTML`.

-->

---
layout: new-section
---

# Reactivity Debugging & More

![debugging](/debugging.jpeg)

<style scoped>
img {
  width: auto !important;
  height: 46vh !important;
}
</style>


---
layout: two-cols
slideTitle: Reactivity Debugging & more
---

### Component Debugging Hooks

```js
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
```

::right::

<br><br>

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

<!--
It's great that Vue's reactivity system automatically tracks dependencies, but in some cases we may want to figure out exactly what is being tracked, or what is causing a component to re-render.

We can debug what dependencies are used during a component's render and which dependency is triggering an update using the `onRenderTracked` and `onRenderTriggered` lifecycle hooks. Both hooks will receive a debugger event which contains information on the dependency in question. `debugger` statement in the callbacks will allow us to interactively inspect the dependency:

[CODE]

-->

---
layout: two-cols
slideTitle: Reactivity Debugging & more
footer: <code>onTrack</code> and <code>onTrigger</code> computed options only work in development mode.
---

### Computed Debugging

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // triggered when count.value is tracked as a dependency
    debugger
  },
  onTrigger(e) {
    // triggered when count.value is mutated
    debugger
  }
})

// access plusOne, should trigger onTrack
console.log(plusOne.value)

// mutate count.value, should trigger onTrigger
count.value++
```

::right::

### Watcher Debugging

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

<style scoped>
.slidev-layout h3 {
  margin-top: 0;
}
</style>

<!--
We can debug computed properties by passing `computed()` a second options object with `onTrack` and `onTrigger` callbacks:

- `onTrack` will be called when a reactive property or ref is tracked as a dependency.
- `onTrigger` will be called when the watcher callback is triggered by the mutation of a dependency.
Both callbacks will receive debugger events in the same format as component debug hooks:

[CODE]

Similar to `computed()`, watchers also support the `onTrack` and `onTrigger` options:

[CODE]

-->

---

# Ohter usefull APIs

### toRaw()

Returns the raw, original object of a Vue-created proxy.

- Type

```ts
function toRaw<T>(proxy: T): T
```

- Details

`toRaw()` can return the original object from proxies created by `reactive()`, `readonly()`, `shallowReactive()` or `shallowReadonly()`.


- Example

```js
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```

<!--
Details:

This is an escape hatch that can be used to temporarily read without incurring proxy access / tracking overhead or write without triggering changes. It is not recommended to hold a persistent reference to the original object. Use with caution.
-->

---
layout: two-cols
---
# Ohter usefull APIs

### markRaw()

Marks an object so that it will never be converted to a proxy. Returns the object itself.

- Type

```ts
function markRaw<T extends object>(value: T): T
```

- Example

```js
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false

// also works when nested inside other reactive objects
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false
```

::right::

`markRaw()` and shallow APIs such as `shallowReactive()` allow you to selectively opt-out of the default deep reactive/readonly conversion and embed raw, non-proxied objects in your state graph. They can be used for various reasons:
- Some values simply should not be made reactive, for example a complex 3rd party class instance, or a Vue component object.
- Skipping proxy conversion can provide performance improvements when rendering large lists with immutable data sources.

---

# Ohter usefull APIs

### effectScope()

Creates an effect scope object which can capture the reactive effects (i.e. computed and watchers) created within it so that these effects can be disposed together. For detailed use cases of this API, please consult its corresponding [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md).


<div class="grid grid-cols-2 gap-16">
  <div class="prose">

- Type

```ts
function effectScope(detached?: boolean): EffectScope

interface EffectScope {
  run<T>(fn: () => T): T | undefined // undefined if scope is inactive
  stop(): void
}
```
  </div>
  <div class="prose">

- Example

```js
const scope = effectScope()
scope.run(() => {
  const doubled = computed(() => counter.value * 2)
  watch(doubled, () => console.log(doubled.value))
  watchEffect(() => console.log('Count: ', doubled.value))
})
// to dispose all effects in the scope
scope.stop()
```
  </div>
</div>


---

# Ohter usefull APIs

### customRef()

Creates a customized ref with explicit control over its dependency tracking and updates triggering.

- Type

```ts
function customRef<T>(factory: CustomRefFactory<T>): Ref<T>
type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T
  set: (value: T) => void
}
```

- Details

`customRef()` expects a factory function, which receives track and trigger functions as arguments and should return an object with get and set methods.

In general, `track()` should be called inside `get(),` and `trigger()` should be called inside `set()`. However, you have full control over when they should be called, or whether they should be called at all.

<style scoped>
.slidev-layout h1 {
  margin-bottom: 10px;
}
.slidev-layout h3 {
  margin-top: 0;
}
</style>

---

# Ohter usefull APIs

### customRef()

<br>

- Example:

<div class="overflow-hidden text-center self-end">
  <iframe
    src="https://play.vuejs.org/#eNp9Uk1v2zAM/SuELnGBLEm3nYKkwD562A7b0AU76eLZTOJWlgSJShMY/u+jJdvxuqG62Hz8enxkIz5YuzgFFGux8YWrLIFHCvZO6qq2xhE0EDx+xt8m6ALLB9xDC3tnapgtluUEXjz6mdSF0Z6A8EywfZmYzY6olJnN4Xa1Wt1IvVmmltyMDcLaqpyQLYBNxwD47Y6VT/WMVhcItuQQD7dMk3uVkO8JHVxMmJ0QPBlrsQS62Eof1rHQMlXigk2TCrXtCFbaBoLTm9qUqLZSdH4pYMnezXIkJObixaQs1yhPEbhtPRWG9WQppMZzDNlzIlVG/6PHKVcB58Ct8wvL9ZZFgabjpZA1rGo0gTrT8UacvjbKMnJ58TQHctXhgO4GtncpcYztLYADUtZXTS+mZqz+APQZkcyAtvPhj68h0/j8q/P+VadQmLtdIpn1ZCdVe4TH4gpDGDO5Mk0vtuWoocfU1483Jdv2co1Qm37ip2W05WWR59PYVwdelNG8qthQisLUtlLovttuG16K9UBFipwP8/lrxMjxUga8OGLx9B/80Z87TIofDj26E0ox+ih3rHpy3//8Fk9qdPKlBcXRrzgf0BsVOo4p7GPQJdOexEW2X+IB8p3v/P2ZUPthqI5olCPGS8Hn+OmV0a903y3ex7xOxfYPTYpUIA=="
    frameborder="0"
    width="960"
    height="400"
    class="-mt-14 mb-2"
  ></iframe>
</div>

<style scoped>
.slidev-layout h1 {
  margin-bottom: 10px;
}
</style>

---
class: 'grid text-center align-self-center justify-self-center'
---

# Gracias totales

