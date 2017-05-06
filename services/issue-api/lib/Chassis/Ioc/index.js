import {toPairs} from 'lodash'; // Object.entries does not work in unit tests

export class Container {
  constructor (defs = {}) {
    this._defs = new Map(toPairs(defs));
    this._booting = new Map();
    this._booted = new Map([['container', this.proxy]]);
    this._cleanup = [];
    this._frozen = false;
  }

  get (name) {
    if (this._frozen) {
      throw new Error('Container is frozen, call to "get" method disallowed.');
    }

    return this._booting.has(name) ? this._booting.get(name) : this._boot(name);
  }

  boot () {
    for (let name of this._defs.keys()) {
      if (this._booted.has(name)) {
        continue;
      }

      this._boot(name);
    }

    const booting = Array.from(this._booting.values());
    return Promise.all(booting).then(() => this._frozen = true);
  }

  _boot (name) {
    if (!this._defs.has(name)) {
      throw new Error(`Unable to boot "${name}": service not found.`);
    } else if (this._booting.has(name)) {
      throw new Error(`Unable to boot "${name}": circular references detected.`);
    }

    const booting = this._defs.get(name).call(null, this);
    this._booting.set(name, booting);

    if (booting instanceof Promise) {
      booting.then((booted) => this._booted.set(name, booted));
    } else {
      this._booted.set(name, booting);
    }

    return this._booting.get(name);
  }

  async close () {
    for (let handler of this._cleanup) {
      await handler(this.proxy);
    }
  }

  onCleanup (handler) {
    this._cleanup.push(handler);
  }

  get proxy () {
    return new Proxy(this, {
      get: (target, name) => {
        if (typeof name === 'symbol' || name === 'inspect') {
          return;
        } else if (name === 'onCleanup') {
          return this.onCleanup;
        }

        return this._booted.get(name);
      }
    });
  }

  get frozen () {
    return this._frozen;
  }
}
