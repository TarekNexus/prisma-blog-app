import { Post } from "../../../generated/prisma/client";
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
const getAllPosts = async () => {
    const Allposts = await prisma.post.findMany();
    return Allposts;
}

export const postService = {
    createPost,
    getAllPosts
}