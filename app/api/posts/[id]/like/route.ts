
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust import path if needed

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: postId } = await params;
        const body = await request.json();
        const { userId, message } = body;

        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Check if post exists and is published before starting transaction
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { published: true }
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (!post.published) {
            return NextResponse.json({ error: 'Cannot like unpublished post' }, { status: 400 });
        }

        // Perform toggle in a transaction with extended timeout for remote database latency
        const result = await prisma.$transaction(async (tx) => {
            const existingLike = await tx.like.findUnique({
                where: {
                    postId_userId: {
                        postId,
                        userId
                    }
                }
            });

            let liked = false;
            let currentLikesCount = 0;

            if (existingLike) {
                // Unlike
                await tx.like.delete({
                    where: {
                        postId_userId: {
                            postId,
                            userId
                        }
                    }
                });
                const updatedPost = await tx.post.update({
                    where: { id: postId },
                    data: {
                        likesCount: {
                            decrement: 1
                        }
                    },
                    select: { likesCount: true }
                });
                currentLikesCount = updatedPost.likesCount;
                liked = false;
            } else {
                // Like
                await tx.like.create({
                    data: {
                        postId,
                        userId,
                        message
                    }
                });
                const updatedPost = await tx.post.update({
                    where: { id: postId },
                    data: {
                        likesCount: {
                            increment: 1
                        }
                    },
                    select: { likesCount: true }
                });
                currentLikesCount = updatedPost.likesCount;
                liked = true;
            }

            return { liked, likesCount: currentLikesCount };
        }, {
            maxWait: 5000,
            timeout: 15000
        });

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Error toggling like:', error);
        if (error.message === 'Post not found' || error.message === 'Cannot like unpublished post') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: 'Internal Server Error', details: error.message, stack: error.stack }, { status: 500 });
    }
}
