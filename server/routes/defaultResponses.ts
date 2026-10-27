export function notImplemented(c:any){
    return c.text("501 Not Implemented",501)
}
export function internalServerError(c:any){
    return c.text("500 Internal Server Error",500)
}
export function badRequest(c:any,e:any){
    return c.text(`400 Bad request: ${e.argument}`,400);
}

export function forbidden(c:any,e:any){
    return c.text(`403 Forbidden: ${e.argument}`,403);
}