# boreDOM

boreDOM is a JavaScript DOM library that allows users to traverse HTML documents for manipulation and event handling in an easy-to-use way, inspired by jQuery.

### Selecting DOM elements

Users are able to use the following to select the elements that they would like to modify using the below:

##### `$l(selector)`

Returns a boreDOM collection that matches the given selector argument.

e.g. `$l('div')` will return all divs of the document.

##### `.children`

Returns a boreDOM collection of each of the children of each element.

##### `.parent`

Returns a boreDOM collection of every parent of the elements.

##### `.find(selector)`

Returns a boredDOM collection of all the children of the elements that match the selector.

### Modifying DOM elements

Once the users have selected the elements they want to modify, the below methods are available for their usage:

##### `.html`

If no argument is given, it will return the innerHTML of the first element and if given an argument, it will update the innerHTML of each of the elements.

##### `.empty`

Empties the innerHTML of each element by setting it to an empty string.

##### `.append(child)`

Will append the child to each element.

##### `.attr(attributeName, attributeValue)`

If only given the first argument, the value of an the attribute will be returned from the first element of the boreDOM collection.

If the second argument is given, it will set the attribute value of each of the elements.

##### `.addClass(class)`

Adds a class to each of the elements.

##### `.removeClass(class)`

Removes class from each of the  elements.

##### `.remove()`

Removes each of the element in the collection from the DOM by setting the outerHTML as an empty string.

##### `.on(eventType, callback)`

Adds a listener to each of the elements in the boreDOM collection by storing the callback as a value of the eventType property.

##### `.off(eventType)`

Removes the event listener based on the event type on the elements by checking the eventType property of the element and removing the callback.

### Trigger callbacks when document is ready

Using the `$l(function)` wrapper, you are able to pass in functions that will only run when the document is ready. Functions are stored in an array and will execute in the order they were entered.

```JavaScript
const methods = [];

const $l = function(argument) {
  if (argument instanceof Function) {
   if (document.readyState === "complete") {
     argument();
   } else {
     methods.push(argument);
   }
 }
}
document.addEventListener("DOMContentLoaded", runMethods);

function runMethods() {
  methods.forEach(method => {
    method();
  });
}
```

### Performs asynchronous Ajax request

```JavaScript
$l.ajax = options => {
  const xhr = new XMLHttpRequest();
  const defaults = {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    method: 'GET',
    url: '',
    success: () => {},
    error: () => {},
    data: {}
  };

  options = $l.extend(defaults, options);

  options.method = options.method.toUpperCase();

  xhr.open(options.method, options.url, true);
  xhr.onload = (e) => {
    if (xhr.status === 200) {
      options.success(xhr.response);
    } else {
      options.error(xhr.response);
    }
  };

  xhr.send(JSON.stringify(options.data));
};
```

When initializing the request, we set async parameter to true. The `.send()` method will then return as soon as the request is sent. We place an `.onload` listener for when XMLHttpRequest completes successfully. This allows us to send an Ajax request asynchronously.
