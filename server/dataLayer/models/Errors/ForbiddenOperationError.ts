export class ForbiddenOperationError extends Error {
    argument:string
    constructor({message = "ForbiddenOperationError",argument=""}) {
      super(message);
      this.name = "ForbiddenOperationError";
      this.argument=argument
    }
  }