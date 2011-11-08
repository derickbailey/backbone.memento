describe("set options", function(){

  describe("when configuring a model to use set options", function(){
    beforeEach(function(){
      this.model = new SetOptionsModel();
      this.changed = {};

      var test = this;
      this.model.bind('change:attr', function(model, value, options) {
        test.changed.options = options;
      });
    });

    describe("should use the options when restoring", function(){
      beforeEach(function(){
        this.model.set({attr: "something"});
        this.model.store();
        this.model.set({attr: "something else"});
        this.model.restore();
      });

      it("when attributes changed, the options should be passed in", function(){
        expect(this.changed.options.memento).toBe(true);
      });
    });

    describe("should allow for manual override", function(){
      beforeEach(function(){
        this.model.set({attr: "something"});
        this.model.store();
        this.model.set({attr: "something else"});
        this.model.restore({setOptions: {memento: 7}});
      });

      it("when attributes changed, the options should be passed in", function(){
        expect(this.changed.options.memento).toBe(7);
      });
    });
  });

  describe("when using it on a model that hasn't been configured", function(){
    beforeEach(function(){
      this.model = new AModel();
      this.changed = {};

      var test = this;
      this.model.bind('change:attr', function(model, value, options) {
        test.changed.options = options;
      });
    });

    describe("when restored normally", function(){
      beforeEach(function(){
        this.model.set({attr: "something"});
        this.model.store();
        this.model.set({attr: "something else"});
        this.model.restore();
      });

      it("should be fired without options", function(){
        expect(this.changed.options.memento).toBe(undefined);
      });
    });

    describe("should allow for manual override", function(){
      beforeEach(function(){
        this.model.set({attr: "something"});
        this.model.store();
        this.model.set({attr: "something else"});
        this.model.restore({setOptions: {memento: 7}});
      });

      it("when attributes changed, the options should be passed in", function(){
        expect(this.changed.options.memento).toBe(7);
      });
    });
  });

  describe("when using it on a collection that hasn't been configured", function(){
    beforeEach(function(){
      this.collection = new ACollection();
      this.changed = {}

      var test = this;
      this.collection.bind('reset', function(collection, options) {
        test.changed.options = options;
      });
    });

    describe("when mementoing once and then restoring with setOptions", function(){
      beforeEach(function(){
        this.collection.restart({foo: "bar"});
        this.collection.store();
        this.collection.restore({setOptions: {memento: 7}});
      });

      it("reset should be fired with the options", function(){
        expect(this.changed.options.memento).toBe(7);
      });
    });

    describe("when mementoing once and then restoring without setOptions", function(){
      beforeEach(function(){
        this.collection.restart({foo: "bar"});
        this.collection.store();
        this.collection.restore();
      });

      it("reset should be fired without options", function(){
        expect(this.changed.options.memento).toBe(undefined);
      });
    });
  });
});
