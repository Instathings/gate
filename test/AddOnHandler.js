const assert = require('assert');

const AddOnHandler = require('../lib/AddOnHandler');

describe('AddOnHandler', () => {
  it('should have the getInstance static method', () => {
    assert.strictEqual(typeof AddOnHandler.getInstance, 'function');
  });

  it('should be a singleton class', () => {
    const instance = AddOnHandler.getInstance();
    const secondInstance = AddOnHandler.getInstance();
    assert.strictEqual(instance, secondInstance);
  });

  it('should contain the instances array', () => {
    const instance = AddOnHandler.getInstance();
    const { instances } = instance;
    assert.strictEqual(instances.length, 0);
  });

  it('should add a new element to the instances', () => {
    const instance = AddOnHandler.getInstance();
    instance.add(1);
    assert.strictEqual(instance.instances.length, 1);
    assert.strictEqual(instance.instances[0], 1);
  });

  it('should return the element with the requested id', () => {
    const first = {
      id: 1,
    };
    const second = {
      id: 2,
    };
    const instance = AddOnHandler.getInstance();
    instance.add(first);
    instance.add(second);
    const result = instance.get(1);
    assert.strictEqual(result.id, 1);
  });

  it('should return undefined if the element with the requested id doesn\'t exists', () => {
    const instance = AddOnHandler.getInstance();
    const result = instance.get(3);
    assert.strictEqual(result, undefined);
  });
});
