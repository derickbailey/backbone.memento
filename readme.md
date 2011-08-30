# Backbone.Memento

Memento push and pop for [Backbone.js](http://documentcloud.github.com/backbone) models.

A view may offer some editing capabilities that directly modify a model, directly. If
you want to cancel the changes after they have already been applied to the model, you
will have to make a round trip to the back-end server or other origin of the model's
data to do so.

With the memento pattern and the Backbone.Memento plugin, you do not need to make
any round trips.

## Getting Started

It's easy to get up and running. You only need to have Backbone (including underscore.js - 
a requirement for Backbone) in your page before including the backbone.memento
plugin.

### Prerequisites

* Backbone.js v0.4 or higher

This plugin is built and tested against Backbone v0.5.1 but should run against most
versions of Backbone, as it only uses functionality built into the Backbone Models.
Namely, it uses the `set` and `unset` methods of models.

### Get The Memento Plugin

Download the `backbone.memento.js` file from this github repository and copy it into 
your javascripts folder. Add the needed `<script>` tag to bring the plugin into any page
that wishes to use it. Be sure to include the modelbinding file _after_ the backbone.js file.

### Setup A Model For Mementoing

Your models must make use of the Backbone.Memento object, directly. This can easily be
done by instantiating the memento with your model's initializer and then providing a
store and restore method.

````
SomeModel = Backbone.Model.extend({
  initialize: function(){
    this.memento = new Backbone.Memento(this);
  },

  store: function(){
    this.memento.push();
  },

  restore: function(){
    this.memento.pop();
  }
});
````

## Examples

With this in place, you can push your model's state onto the memento stack by calling
`store`, and pop the previously stored state back into the model (destroying the current
state in the process) by calling `restore`. 

````
myModel = new SomeModel();
myModel.set({foo: "bar"});

myModel.store();

myModel.set({foo: "a change"});

myModel.restore();

myModel.get("foo"); // => "bar"
````

### Set And Unset Attributes

Backbone.Memento will set and unset attributes, when poping from the memento stack.
For example, if you add an attribute after storing your models state, and then later
restore back to the previous state, the attribute that you added will be unset. The
unset attribute will have it's change event fired, as well.

````
myModel = new SomeModel();
myModel.set({foo: "stuff"});

myModel.store();

myModel.set({bar: "a new attribute"});

myModel.bind("change:bar", function(model, value){
  alert('bar was changed to: ' + val);
}

myModel.restore(); // => causes an alert box to say "bar was changed to undefined"

myModel.get("bar"); // => undefined, as the attribute does not exist
````

# Legal Mumbo Jumbo (MIT License)

Copyright (c) 2011 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
