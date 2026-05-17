import {z} from "zod";


export const signUpInputSchema = z.object({
    username : z.string(),
    email : z.email(),
    password : z.string(),
    role : z.enum(["admin","sales"]),
})

export const signInInputSchema = z.object({
    email : z.email(),
    password : z.string()
}) 



export const leadInputSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    status: z.enum(["New", "Contacted", "Qualified", "Lost"]),
    source: z.enum(["Website", "Instagram", "Referral"]),
})