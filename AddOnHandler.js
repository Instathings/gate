class AddOnHandler {
  constructor() {
    this.instances = [];
  }

  static getInstance() {
    if (this.instance === undefined) {
      this.instance = new AddOnHandler();
    }
    return this.instance;
  }

  add(addOnInstance) {
    this.instances.push(addOnInstance);
  }

  get(id) {
    let result;
    this.instances.forEach((element) => {
      if (element.id === id) {
        result = element;
      }
    });
    return result;
  }
}

module.exports = AddOnHandler;