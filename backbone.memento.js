// Backbone.Memento v0.1.1
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT Liscene
//
// Documentation and Full Licence Availabe at:
// http://github.com/derickbailey/backbone.memento

// ----------------------------
// Backbone.Memento
// ----------------------------
Backbone.Memento = (function(model){
  var attributeStack = new Array();

  function getRemovedAttrDiff(newAttrs, oldAttrs){
    var removedAttrs = [];

    for (var attr in oldAttrs){
      if (oldAttrs.hasOwnProperty(attr)){
        if (!newAttrs.hasOwnProperty(attr)){
          removedAttrs.push(attr);
        }
      }
    }

    return removedAttrs;
  }

  function removeAttributes(model, attrsToRemove){
    for (var index in attrsToRemove){
      attr = attrsToRemove[index];
      model.unset(attr);
    }
  }

  function restoreState(last){
      //get the previous state
      var attrs = attributeStack[last];

      //handle removing attributes that were added
      var removedAttrs = getRemovedAttrDiff(attrs, model.toJSON());
      removeAttributes(model, removedAttrs);

      //restore the previous state
      model.set(attrs);

      //destroy the no-longer-current state
      delete attributeStack[last];
  }
  
  return {
    version: "0.1.1",

    push: function(){
      attributeStack.push(model.toJSON());
    },
    
    pop: function(){
      var last = attributeStack.length-1;
      if (last < 0)
        return null;

      restoreState(last);
    },

    clear: function(){
      if(attributeStack.length === 0){
        return null;
      }

      

      restoreState(0);
      // restoreState deleted item 0, but really we should be starting from scratch.
      attributeStack = new Array();
    }
  }
});
