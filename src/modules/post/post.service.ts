import { Payload, PostWhereInput } from './../../../generated/prisma/internal/prismaNamespace';
import { Post, PostStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result;
}
const getAllPosts = async ({search, tags,isFeatured,status,authorId,page,limit,skip}:
     {search?: string | undefined,
      tags?: string[] |[],
        isFeatured?: boolean| undefined,
        status?: PostStatus,
        authorId?: string| undefined,
        page:number,
        limit:number,
        skip:number
}) => {

    const andConditions:PostWhereInput[] = [];
    if (search) {
        andConditions.push({
            OR: [   
                {
                    title: {
                        contains: search as string, 
                        mode: 'insensitive'
                    }
                },
                {
                    content: {
                        contains: search as string,
                        mode: 'insensitive'
                    }
                },
                { tags:{
                    has: search as string
                }}
            ]
        });
    }
    if(tags && tags.length>0){
        andConditions.push({
            tags:{  
                hasEvery: tags as string[]
            }
        });
    }
    if(isFeatured){
        andConditions.push({
            isFeatured: isFeatured
        });
    }
    if(status){
        andConditions.push({
            status: status
        });
    }
    if(authorId){
        andConditions.push({
            authorId: authorId
        });
    }
    const Allposts = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
          AND: 
            andConditions
          
        }
    });
    return Allposts;
}

export const postService = {
    createPost,
    getAllPosts
}