// Backbone.Memento v0.4.2
//
// Copyright (C)2011 Derick Bailey, Muted Solutions, LLC
// Distributed Under MIT License
//
// Documentation and Full License Available at:
// http://github.com/derickbailey/backbone.memento

Backbone.Memento = (function(Backbone, _){
  'use strict';

  // ----------------------------
  // Memento: the public API
  // ----------------------------
  var Memento = function(structure, config){
    this.version = "0.4.2";

    config = _.extend({ignore: []}, config);

    var serializer = new Serializer(structure, config);
    var mementoStack = new MementoStack(structure, config);

    var restoreState = function (previousState, restoreConfig){
      if (!previousState){ return; }
      serializer.deserialize(previousState, restoreConfig);
    };

    this.store = function(){
      var currentState = serializer.serialize();
      mementoStack.push(currentState);
    };

    this.restore = function(restoreConfig){
      var previousState = mementoStack.pop();
      restoreState(previousState, restoreConfig);
    };

    this.restart = function(restoreConfig){
      var previousState = mementoStack.rewind();
      restoreState(previousState, restoreConfig);
    };

    this.consolidate = function(restoreConfig){
      mementoStack = new MementoStack(structure, config);
      this.store();
    };
  };

  // ----------------------------
  // TypeHelper: a consistent API for removing attributes and
  // restoring attributes, on models and collections
  // ----------------------------
  var TypeHelper = function(structure){
    if (structure instanceof Backbone.Model) {
      this.removeAttr = function(data){ structure.unset(data); };
      this.restore = function(data){ structure.set(data); };
    } else {
      this.removeAttr = function(data){ structure.remove(data); };
      this.restore = function(data){ structure.reset(data); };
    }
  };

  // ----------------------------
  // Serializer: serializer and deserialize model and collection state
  // ----------------------------
  var Serializer = function(structure, config){
    var typeHelper = new TypeHelper(structure);

    function dropIgnored(attrs, restoreConfig){
      attrs = _.clone(attrs);
      if (restoreConfig.hasOwnProperty("ignore") && restoreConfig.ignore.length > 0){
        for(var index in restoreConfig.ignore){
          var ignore = restoreConfig.ignore[index];
          delete attrs[ignore];
        }
      }
      return attrs;
    }

    function getAddedAttrDiff(newAttrs, oldAttrs){
      var removedAttrs = [];

      // guard clause to ensure we have attrs to compare
      if (!newAttrs || !oldAttrs){
        return removedAttrs;
      }

      // if the attr is found in the old set but not in
      // the new set, then it was remove in the new set
      for (var attr in oldAttrs){
        if (oldAttrs.hasOwnProperty(attr)){
          if (!newAttrs.hasOwnProperty(attr)){
            removedAttrs.push(attr);
          }
        }
      }

      return removedAttrs;
    }

    function removeAttributes(structure, attrsToRemove){
      for (var index in attrsToRemove){
        var attr = attrsToRemove[index];
        typeHelper.removeAttr(attr);
      }
    }

    function restoreState(previousState, restoreConfig){
      var oldAttrs = dropIgnored(previousState, restoreConfig);

      //get the current state
      var currentAttrs = structure.toJSON();
      currentAttrs = dropIgnored(currentAttrs, restoreConfig);

      //handle removing attributes that were added
      var removedAttrs = getAddedAttrDiff(oldAttrs, currentAttrs);
      removeAttributes(structure, removedAttrs);

      typeHelper.restore(oldAttrs);
    }

    this.serialize = function(){
      var attrs = structure.toJSON();
      attrs = dropIgnored(attrs, config);
      return attrs;
    }

    this.deserialize = function(previousState, restoreConfig){
      restoreConfig = _.extend({}, config, restoreConfig);
      restoreState(previousState, restoreConfig);
    }

  };

  // ----------------------------
  // MementoStack: push / pop model and collection states
  // ----------------------------
  var MementoStack = function(structure, config){
    var attributeStack;

    function initialize(){
      attributeStack = [];
    }

    this.push = function(attrs){
      attributeStack.push(attrs);
    }

    this.pop = function(restoreConfig){
      var oldAttrs = attributeStack.pop();
      return oldAttrs;
    }

    this.rewind = function(){
      var oldAttrs = attributeStack[0];
      initialize();
      return oldAttrs;
    }

    initialize();
  };

  return Memento;
})(Backbone, _);