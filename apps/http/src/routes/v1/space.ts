import  client  from '@repo/db';
import { Router } from "express";
import { AddElementSchema, createElementSchema, createSpaceSchema } from "../../types";
import { userMiddleware } from '../../middleware/user';


export const spaceRouter = Router();


spaceRouter.post("/", userMiddleware, async (req, res) => {
const parseData = createSpaceSchema.safeParse(req.body)
if(!parseData.success){
    res.status(400).json({message: "validation failed"});
    return
}

    if(!parseData.data.mapId){
        const space = await client.space.create({
            data: {
                name: parseData.data.name,
      
                width: parseInt(parseData.data.dimesions.split("x")[0]),
                height: parseInt(parseData.data.dimesions.split("x")[1]),
                creatorId: req.userId!,
            }
            
        })
        res.json({spaceId: space.id})
    }


    const map = await client.map.findUnique({
        where: {
            id: parseData.data.mapId
        }, select: {

            mapElements: true,
            width: true,
            height: true
        }
    })

    if(!map){
        res.status(400).json({message: "map not found"});
        return
    }

    let space = await client.$transaction(async () => {
        const space = await client.space.create({
            data: {
                name: parseData.data.name,
                width: map.width,
                height: map.height,
                creatorId: req.userId!,
            }
        })

        await client.spaceElements.createMany({
            data: map.mapElements.map(e => ({
                spaceId: space.id,
                elementId: e.elementId,
                x: e.x!,
                y: e.y!,
            }))
        })
        return space
    })

    res.json({spaceId: space.id})
})




spaceRouter.delete("/:spaceId",  userMiddleware, async (req, res) => {
    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        }, select: {
            creatorId: true
        }
    })

    if(!space){
        res.status(400).json({message: "space not found"})
        return
    }

    if(space?.creatorId !== req.userId){
        res.status(403).json({message: "you are not the owner of this space"})
        return
    }
    await client.space.delete({
        where: {
            id: req.params.spaceId
        }
    })
    res.json({message: "space deleted"})
})




spaceRouter.get("/all ", userMiddleware, async (req, res) => {
    const spaces = await client.space.findMany({
        where: {
            creatorId: req.userId
        }
    })
    res.json({
        spaces: spaces.map(s => ({
            id: s.id,
            name: s.name,
            thumbnail: s.thumbnail,
            dimension: `${s.width}x${s.height}`
        }))
    })
})




spaceRouter.post("/element ", userMiddleware, async (req, res) => {
    const parsedData = AddElementSchema.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({message: "validation failed"});
        return
    }

    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId,
            creatorId: req.userId,
        }, select: {
            width: true,
            height: true
        }
    })
    if(!space){
        res.status(400).json({message: "space not found"});
        return
    }

   await client.spaceElements.create({
        data: {
            spaceId: req.params.spaceId,
            elementId: parsedData.data.elementId,
            x: parsedData.data.x,
            y: parsedData.data.y,
        }
    })        
    res.json({message: "element added"})
})

spaceRouter.delete("/element ", (req, res) => {

})


spaceRouter.get("/:spaceId", (req,res) => {
    
})