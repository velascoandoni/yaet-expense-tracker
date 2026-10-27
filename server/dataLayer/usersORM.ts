import { NotFoundError } from "./models/Errors/NotFoundError";
import { IllegalArgumentsError } from "./models/Errors/IllegalArgumentsError";
import { db } from "./db/db";
import { users as usersTable } from "./db/schema/users";
import { eq } from "drizzle-orm";
import type { CreateUser, PublicUser, User } from "../../types/users";
import { CryptoHasher, hash, randomUUIDv7 } from "bun";
import { use } from "react";




export async function getUsers():Promise<PublicUser[]> {
    let users =await db.select().from(usersTable)
    return users
}
export async function getUser(user_id:number):Promise<PublicUser | undefined>{

    if(isNaN(user_id)) throw new IllegalArgumentsError({argument:"league_id"})

    let [user] = await db.select().from(usersTable).where(eq(usersTable.user_id,user_id)).limit(1)

    if(!user) throw new NotFoundError()

    return user
}

export async function getUserByUsername(username:string):Promise<User | undefined>{

    if(!username) throw new IllegalArgumentsError({argument:"username"})

    let [user] = await db.select().from(usersTable).where(eq(usersTable.name,username)).limit(1)

    if(!user) throw new NotFoundError()

    return user
}

export async function login(username:string,userpassword:string):Promise<PublicUser>{
    if(!username) 
        throw new IllegalArgumentsError({argument:"username"})
    if(!userpassword) 
        throw new IllegalArgumentsError({argument:"password"})


    let user=await getUserByUsername(username)
    if(!user) 
        throw new NotFoundError()
    let {admin,name,password,salt,user_id}=user

    let passwordHash=CryptoHasher.hash("sha256",userpassword+salt)
    
    if(passwordHash.toBase64()!=password)   
        throw new NotFoundError()

    return {admin,name,user_id}
}
export async function addUser(user:CreateUser):Promise<User | undefined>{
    if(!user) 
        throw new IllegalArgumentsError({argument:"league"})
    if(!user?.name) 
        throw new IllegalArgumentsError({argument:"name"})

    let [newLeague]=await db.insert(usersTable).values(user).returning()

    return newLeague
}

export async function register(username:string,password:string):Promise<PublicUser | undefined>{
    if(!username) 
        throw new IllegalArgumentsError({argument:"username"})
    if(!password) 
        throw new IllegalArgumentsError({argument:"password"})


    let salt=randomUUIDv7()
    let passwordHash=CryptoHasher.hash("sha256",password+salt)
    

    let user=await addUser({name: username, password: passwordHash.toBase64(), salt, admin: false})
    if(!user) 
        throw new NotFoundError()

    let {user_id,admin} = user

    return {user_id,name:username,admin}

}
export async function updateUser(user_id:number,user:User):Promise<User | Error>{
    console.log(user_id,user)
    if(!user) 
        throw new IllegalArgumentsError({argument:"league"})
    if(user?.user_id!=user_id) 
        throw new IllegalArgumentsError({argument:"league_id"})
    if(!user?.user_id) 
        throw new IllegalArgumentsError({argument:"league_id"})
    if(!user?.name) 
        throw new IllegalArgumentsError({argument:"name"})

    let [updatedLeague]=await db.update(usersTable).set(user).where(eq(usersTable.user_id,user_id)).returning()
    return updatedLeague
}

