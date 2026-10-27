import { Hono } from "hono";
import { serveStatic } from 'hono/bun';
import { logger } from "hono/logger";
import { notFound, onError } from "stoker/middlewares";
import { expensesRouter } from './routes/expensesRouter';
import { usersRouter } from "./routes/usersRouter";
import { expenseTypesRouter } from "./routes/expenseTypesRouter";
import { existsSync, readFileSync } from "fs";

const app = new Hono()



app.notFound(notFound)
app.onError(onError)

app.use('*',logger())
app.route("/api/expenseTypes",expenseTypesRouter)

app.route("/api/expenses",expensesRouter)

app.route("/api/users",usersRouter)


app.get("/api/message",c=>{
    return c.json({message:"Hello, world!"})
})
app.get("/api/*",c=>{
    return c.json({ 
        message: "Route not found",
        path: c.req.path,
        method: c.req.method
    }, 404)
})

app.use('/assets/*', serveStatic({ root: './frontend/dist' }))
app.get('*', (c) => {
  return c.html(readFileSync('./frontend/dist/index.html', 'utf-8'))
})




export default app