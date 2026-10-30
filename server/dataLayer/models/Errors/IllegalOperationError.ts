export class IllegalOperationError extends Error {
    constructor({message = "Operation could not be performed"}={}) {
      super(message);
      this.name = "IllegalOperationError";
    }
  }