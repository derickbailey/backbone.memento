describe("memento collection", function(){
  beforeEach(function(){
    this.collection = new ACollection();
  });

  describe("when mementoing a collection and then rolling it back", function(){
    beforeEach(function(){
      this.collection.reset({foo: "bar"});
      this.collection.store();
    });

    it("should reset the collection to the memento'd models", function(){
      this.collection.reset({foo: "what?"});
      this.collection.restore();
      expect(this.collection.at(0).get("foo")).toBe("bar");
    });
  });

  describe("when restoring and no mementos exist", function(){
    beforeEach(function(){
      this.collection.reset({foo: "bar"});
      this.collection.restore();
    });

    it("should not restore anything", function(){
      expect(this.collection.at(0).get("foo")).toBe("bar");
    });
  });

  describe("when mementoing once and restoring twice", function(){
    beforeEach(function(){
      this.collection.reset({foo: "bar"});
      this.collection.store();
    });

    it("should not restore anything past the first one", function(){
      this.collection.restore();
      this.collection.restore();
      expect(this.collection.at(0).get("foo")).toBe("bar");
    });
  });

  describe("when mementoing twice and rolling back once", function(){
    beforeEach(function(){
      this.collection.reset({foo: "bar"});
      this.collection.store();
      this.collection.reset({foo: "i dont know"});
      this.collection.store();
      this.collection.reset({foo: "third"});
    });

    it("should reset to the previous stored version", function(){
      this.collection.restore();
      expect(this.collection.at(0).get("foo")).toBe("i dont know");
    });
  });

  describe("when adding a new models and then restoring previous version", function(){
    beforeEach(function(){
      this.collection.reset({foo: "bar"});
      this.collection.store();
      this.collection.reset({bar: "baz"});
    });

    it("should remove the new model", function(){
      this.collection.restore();
      expect(this.collection.at(0).get("bar")).toBeUndefined();
    });

    it("should fire a reset event for the removed model", function(){
      changed = false;
      this.collection.bind("reset", function(){
        changed = true;
      });
      this.collection.restore();
      expect(changed).toBeTruthy();
    });
  });

  describe("when removing a model from the collection and then restart", function(){
    beforeEach(function(){
      this.collection.reset([{foo: "bar"}, {bar: "baz"}]);
      this.collection.store();
    });

    it("should re-add the model to the collection", function(){
      this.collection.remove(this.collection.at(1));
      this.collection.restore();
      expect(this.collection.at(1).get("bar")).toBe("baz");
    });
  });
  
});

