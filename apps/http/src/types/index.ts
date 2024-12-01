import z from "zod"

export const signupSchema = z.object({
    username: z.string(),
    password: z.string().min(4),
    type: z.enum(["user", "admin"])
})


export const siginSchema = z.object({
    username: z.string().email(),
    password: z.string().min(8)
})


export const UpdateMetadataSchema = z.object({
avatarId : z.string()
})

export const createSpaceSchema = z.object({
    name: z.string(),
    dimesions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId: z.string(),
})

export const AddElementSchema = z.object({
    spaceId: z.string(),
    elementId: z.string(),
    x: z.number(),
    y: z.number(),
})

export const createElementSchema = z.object({
    imageUrl: z.string(),
    width: z.number(),
    height: z.number(),
    static: z.boolean()
})


export const updateElementSchema = z.object({
    imageUrl: z.string()
})


export const createAvatarSchema = z.object({
    name: z.string(),
    imageUrl: z.string()
})


export const CreateMapSchema = z.object({
    thumbnail: z.string(),
    dimensions: z.string(),
    defaultElements : z.array(z.object({
        elmentId: z.string(),
        x: z.number(),
        Y: z.number() 
    }))
})


declare global {
    namespace Express {
      export  interface Request {
        role?: "Admin" | "User";
        userId: string;
        }
    }
}