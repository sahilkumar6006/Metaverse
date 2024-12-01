import { Router } from 'express';
import { UpdateMetadataSchema } from '../../types';
import client from '@repo/db'
import { userMiddleware } from '../../middleware/user';

export const userRouter  = Router();


userRouter.post("/metadata", userMiddleware, async(req,res) => {
const parsedData = UpdateMetadataSchema.safeParse(req.body)
if(!parsedData.success){
    res.status(400).json({message: "validation failed"});
    return
}

client.user.update({
    where: {
        id: req.userId
    },
    data: {
        avatarId: parsedData.data.avatarId
    }
})
res.json({message: "Metaadata updated"})
})

userRouter.get("/metadatabulk", async    (req,res) => {
    const userIdString = (req.query.userIds?? "[]") as string
    const userIds = (userIdString).slice(1, userIdString?.length -2).split(",");

    const metadata = await client.user.findMany({
        where: {
            id: {
                in: userIds
            }
        },select: {
            avatar: true,
            id: true
        }
    })
    res.json({
        avatars: metadata.map(m => ({
            userId: m.id,
            avatarId: m.avatar?.imageUrl
        })
    )
    })

})