AModel = Backbone.Model.extend({
  initialize: function(){
    var memento = new Backbone.Memento(this);
    _.extend(this, memento);
  }
});

ACollection = Backbone.Collection.extend({
  initialize: function(){
    var memento = new Backbone.Memento(this);
    _.extend(this, memento);
  }
});

IgnoredAttrsModel = Backbone.Model.extend({
  initialize: function(){
    var memento = new Backbone.Memento(this, {
      ignore: ["ignoreMe"]
    });
    _.extend(this, memento);
  }
});

SetOptionsModel = Backbone.Model.extend({
  initialize: function(){
    var memento = new Backbone.Memento(this, {setOptions: {memento: true}});
    _.extend(this, memento);
  }
});
