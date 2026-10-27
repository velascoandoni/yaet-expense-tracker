export class IllegalArgumentsError extends Error {
    argument:string
    constructor({message = "Illegal arguments",argument=""}) {
      super(message);
      this.name = "IllegalArgumentsError";
      this.argument=argument
    }
  }