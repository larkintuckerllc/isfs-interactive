# React Redux Boilerplate

## Introduction

This project serves as a boilerplate (starting point) for React Redux
application development. It draws heavily from an excellent tutorial
by Dan Abramov.

<https://egghead.io/courses/building-react-applications-with-idiomatic-redux>
<https://github.com/gaearon/todos/tree/27-updating-data-on-the-server>

## Installation

Download and expand into a directory. From within that direction run:

`npm install`

## Usage

To run the boilerplate, run the following from the installation directory
and open web browser to <http://localhost:8080>.

`npm run start`

One can either use this boilerplate for guidance in developing one's own
application or as a starting point for it.

## Contributing

Submit bug of enhancement requests using the BitBucket issues feature.

## Credits

This project is currently developed and maintained by:

* John Tucker <mailto:john@larkintuckerllc.com>
* Evan Sangaline <mailto:evan@intoli.com>

## Contact

General questions and comments can be directed to <mailto:john@larkintuckerllc.com>.

## License

This project is licensed under the MIT License.

## Discussion

As this boilerplate is fairly opinionated, there is merit in providing a
discussion as to the inspiration for its design.

### View Dependent Side-Effects in Controller-Views

Before reading on, one needs to have a basic understanding of the Flux
application architecture.

https://facebook.github.io/flux/docs/overview.html

The implementation of the form submit handler in the component
`src/components/Item/ItemRemove.jsx`, is different than the
ideal Flux data flow:

```
Action => Dispatcher => Store => View
```

**note**: Technically, this file consists of the the `ItemRemove`
stateless functional component decorated by a succession of
specialized components.

```
handleSubmit() {
  const { blockingSet, item, itemRemove, navigate } = this.props;
  blockingSet(true);
  return itemRemove(item)
    .then(
      () => {
        blockingSet(false);
        navigate('/');
      },
      (error) => {
        if (process.env.NODE_ENV !== 'production'
          && error.name !== 'ServerException') {
          window.console.log(error);
          return;
        }
        blockingSet(false);
        throw new SubmissionError({});
      }
    );
}
```

The principle action creator is `itemRemove`; it removes an item from the
store. It also manages the side-effect of removing the item from the server.

At the same time there are additional side-effects that are not managed
by the action creator but rather are managed in the `ItemRemoveSubmit`
controller-view component. This is possible because `itemRemove` returns
a promise.

* The call to the action creator `blockingSet` manages the effect of popping up a
spinner for the duration of the removal operation.
* The call to `navigate` manages the effect of routing back to the list of
items on success.
* `handleSubmit` returns a promise that Redux Form uses to manage
the form, e.g., sets the form's error state.

The ideal Flux data flow would have all these side-effects managed
by the action creator `itemRemove`. The problem with this approach is that
these side-effects are dependent on the view implementation; thus refactoring
views would necessitate refactoring the action creators.

In these cases the data flow is:

```
Action => Dispatcher => Store => View
       => Controller-View
```

### Organizing the Redux Code with Ducks

In an earlier version of the boilerplate, we were following Dan Abramov's
approach of organizing Redux elements by type (action creators, reducers,
and accessors). This quickly became problematic as adding features
required updating many files.

The quote and documented Duck pattern by Erik Rasmussen synchronized
with us; and we used this pattern.

> I find as I am building my redux app, one piece of functionality
> at a time, I keep needing to add {actionTypes, actions, reducer}
> tuples for each use case. I have been keeping these in separate
> files and even separate folders, however 95% of the time, it's
> only one reducer/actions pair that ever needs their associated actions.

> To me, it makes more sense for these pieces to be bundled together
> in an isolated module that is self contained, and can even be
> packaged easily into a library.

<https://github.com/erikras/ducks-modular-redux>

### Uniform Redux Interfaces (Duck Patterns)

**Synchronous Value Duck**

The simplest pattern is the synchronous value Duck, e.g.,
`src/ducks/blocking.js`. They store a single value
and manage synchronous side-effect (if any).

The Duck has a single action creator.

* setBlocking: Set the value.

For example, `setBlocking` is called from
`src/components/Items/ItemAdd.jsx` to set the value
to a boolean.

**note**: If the value is nullable, the Duck would also have
an additional action creator to set that special value. This
action creator would be prefixed with `remove`.

The Duck has a single accessor.

* getBlocking: Returns the value.

For example `getBlocking` is called from
`src/components/App/AppContainer.jsx` to conditionally display
the `src/components/App/Blocking.jsx` component.

**Asynchronous Collection Duck**

The most complex pattern is an asynchronous collection
Duck, e.g., `src/ducks/parts.js`. They store a collection of
elements and manage an asynchronous API side-effect, e.g.,
REST API.

The Duck has the following primary action creators that manage
the asynchronous API side-effect. This implementation only allows
one asynchronous action (per Duck) to be in effect at a time.

* fetchItems: Fetch asynchronous collection (pulls into memory from API).
* addItem: Add element to collection with side-effect.
* updateItem: Update element with side-effect.
* removeItem: Remove element from collection with side-effect.

These action creators are typically called from components in response
to a user action, e.g., submitting a form. For example, `addItem`
is called in the component `src/components/Items/ItemAddjsx`.

The Duck also has the following action creators that do not
manage the asynchronous API side-effect.

* addItemLocal: Add element to collection.
* updateItemLocal: Update element.
* removeItemLocal: Remove element from collection.

These action creators are typically called from other ducks. For example,
`removePartLocal` is called from `src/ducks/items.js` to remove all the
related parts when removing an item.

The Duck also has the following action creators that resets the
error states. In this implementation, resetting one state actually resets
all of the error states.

* resetFetchItemsError
* resetAddItemError
* resetUpdateItemError
* resetRemoveItemError

These action creators are used to reset errors when there is no form
(Redux Form provides its own action creators). For example,
`resetRemoveItemPartError` is called from `src/components/Item/index.jsx`
to reset the error when the component is loaded.

The Duck has the following primary accessors.

* getItem: Provided an id, return an element.
* getItems: Return the collection.

These accessors are typically called from components,
e.g., `getItem` is called from `src/components/Item/index.jsx`.

The following accessors return a boolean reflecting the state of the
asynchronous action.

* getIsFetchingItems
* getIsAddingItems
* getIsUpdatingItems
* getIsRemovingItems

These accessors are typically called from components to
display a loading alert during an asynchronous action,
e.g, `getIsFetchingItems` and `getIsFetchingParts` are called
in `src/components/App/index.jsx`. Redux Forms provides its own
mechanism for this situation. Also, this application centralizes
the handling of most other of these situations using the
`src/ducks/blocking.js` Duck and the `src/components/App/AppContainer.jsx`
component.

The following accessors return a string (or null) reflecting the
last error from the asynchronous action.

* getFetchItemsErrorMessage
* getAddItemErrorMessage
* getUpdateItemErrorMessage
* getRemoveItemErrorMessage

These accessors are typically called from components to display
an error alert after a failed asynchronous action, .e.g.,
`getFetchItemsErrorMessage` and `getFetchPartsErrorMessage` are
called in `src/components/App/index.jsx`. Again, Redux Forms
provides its own mechanism for this situation.
