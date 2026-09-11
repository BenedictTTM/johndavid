import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: postId } = await params;
        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        const comments = await prisma.comment.findMany({
            where: {
                postId,
                approved: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                postId: true,
                name: true,
                body: true,
                createdAt: true,
            },
        });

        return NextResponse.json(comments);
    } catch (error: any) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: postId } = await params;
        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        const body = await request.json();
        const { name, email, body: commentBody } = body;

        const trimmedName = (name || '').trim();
        const trimmedContent = (commentBody || '').trim();

        if (!trimmedName) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        if (!trimmedContent) {
            return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
        }

        if (trimmedContent.length > 2000) {
            return NextResponse.json({ error: 'Comment must be under 2000 characters' }, { status: 400 });
        }

        // Transaction: create comment and update commentsCount
        const result = await prisma.$transaction(async (tx) => {
            const post = await tx.post.findUnique({
                where: { id: postId },
                select: { id: true, published: true },
            });

            if (!post) {
                throw new Error('Post not found');
            }

            const comment = await tx.comment.create({
                data: {
                    postId,
                    name: trimmedName,
                    email: email ? String(email).trim() : null,
                    body: trimmedContent,
                    approved: true,
                },
            });

            const updatedPost = await tx.post.update({
                where: { id: postId },
                data: {
                    commentsCount: {
                        increment: 1,
                    },
                },
                select: {
                    commentsCount: true,
                },
            });

            return {
                comment: {
                    id: comment.id,
                    postId: comment.postId,
                    name: comment.name,
                    body: comment.body,
                    createdAt: comment.createdAt.toISOString(),
                },
                commentsCount: updatedPost.commentsCount,
            };
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error('Error creating comment:', error);
        if (error.message === 'Post not found') {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        return NextResponse.json(
            { error: error.message || 'Failed to submit comment' },
            { status: 500 }
        );
    }
}
