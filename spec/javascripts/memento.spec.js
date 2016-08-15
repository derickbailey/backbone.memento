describe("memento", function(){
  beforeEach(function(){
    this.model = new AModel();
  });

  describe("when mementoing a model and then rolling it back", function(){
    beforeEach(function(){
      this.model.set({foo: "bar"});
      this.model.store();
    });

    it("should reset the model to the memento'd attributes", function(){
      this.model.set({foo: "what?"});
      this.model.restore();
      expect(this.model.get("foo")).toBe("bar");
    });
  });

  describe("when restoring and no mementos exist", function(){
    beforeEach(function(){
      this.model.set({foo: "bar"});
      this.model.restore();
    });

    it("should not restore anything", function(){
      expect(this.model.get("foo")).toBe("bar");
    });
  });

  describe("when mementoing once and restoring twice", function(){
    beforeEach(function(){
      this.model.set({foo: "bar"});
      this.model.store();
    });

    it("should not restore anything past the first one", function(){
      this.model.restore();
      this.model.restore();
      expect(this.model.get("foo")).toBe("bar");
    });
  });

  describe("when restoring with keepState option", function(){
    beforeEach(function(){
      this.model.set({foo: "first"});
      this.model.store();
      this.model.set({foo: "second"});
      this.model.store();
    });

    it("should always restore to the state at the last .store call", function(){
      this.model.restore({ keepState: true });
      this.model.restore({ keepState: true });
      expect(this.model.get("foo")).toBe("second");
    });
  });

  describe("when mementoing twice and rolling back once", function(){
    beforeEach(function(){
      this.model.set({foo: "bar"});
      this.model.store();
      this.model.set({foo: "i dont know"});
      this.model.store();
      this.model.set({foo: "third"});
    });

    it("should reset to the previous stored version", function(){
      this.model.restore();
      expect(this.model.get("foo")).toBe("i dont know");
    });
  });

  describe("when adding a new attributes and then restoring previous version", function(){
    beforeEach(function(){
      this.model.set({foo: "bar"});
      this.model.store();
      this.model.set({bar: "baz"});
    });

    it("should remove the new attribute", function(){
      this.model.restore();
      expect(this.model.get("bar")).toBeUndefined();
    });

    it("should fire a change event for the removed attribute", function(){
      changed = false;
      this.model.bind("change:bar", function(){
        changed = true;
      });
      this.model.restore();
      expect(changed).toBeTruthy();
    });
  });

});
