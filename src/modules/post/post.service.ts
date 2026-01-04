import {
  Payload,
  PostWhereInput,
} from "./../../../generated/prisma/internal/prismaNamespace";
import { Post, PostStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};
const getAllPosts = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search?: string | undefined;
  tags?: string[] | [];
  isFeatured?: boolean | undefined;
  status?: PostStatus;
  authorId?: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: PostWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }
  if (tags && tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }
  if (isFeatured) {
    andConditions.push({
      isFeatured: isFeatured,
    });
  }
  if (status) {
    andConditions.push({
      status: status,
    });
  }
  if (authorId) {
    andConditions.push({
      authorId: authorId,
    });
  }

  const Allposts = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    data: Allposts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const getPostById = async (postId: string) => {
    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })
        const postData = await tx.post.findUnique({
            where: {
                id: postId
            }
        })
        return postData
    })
}

export const postService = {
  createPost,
  getAllPosts,
  getPostById
};
