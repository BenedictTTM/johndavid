import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
    'Research',
    'Mentorship',
    'Bioinformatics',
    'Engineering',
    'AI & Health',
    'Community',
];

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            select: { category: true },
            distinct: ['category'],
        });

        const fromDb = posts
            .map(p => p.category?.trim())
            .filter((c): c is string => Boolean(c && c !== 'Uncategorized'));

        const combined = Array.from(new Set([...DEFAULT_CATEGORIES, ...fromDb])).sort();

        return NextResponse.json(combined);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(DEFAULT_CATEGORIES);
    }
}
