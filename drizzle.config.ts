import { defineConfig } from "drizzle-kit";
export default defineConfig({
    dialect: "postgresql",
    schema: "./server/dataLayer/db/schema/*",
    out: "drizzle",
    dbCredentials:{
        url:process.env.POSTGRES_URL
    }
});