import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const alt = 'Post Cover Image';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

function stripHtml(text: string | null | undefined): string {
    if (!text) return '';
    return text
        .replace(/<[^>]*>?/gm, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let post = null;
    try {
        post = await prisma.post.findUnique({
            where: { id },
            select: {
                title: true,
                excerpt: true,
                content: true,
                category: true,
                readTime: true,
                image: true,
            },
        });
    } catch (e) {
        console.error('Error fetching post for OG image:', e);
    }

    const title = post?.title || 'John David Ledger';
    const category = (post?.category && post.category !== 'Uncategorized' && post.category !== 'Note')
        ? post.category
        : 'Editorial';
    const readTime = post?.readTime || '3 min read';

    const rawExcerpt = stripHtml(post?.excerpt) || stripHtml(post?.content);
    const excerpt = rawExcerpt.length > 140 ? `${rawExcerpt.substring(0, 137)}...` : rawExcerpt;

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: '#FAF7C8',
                    padding: '60px 70px',
                    border: '14px solid #38240D',
                    position: 'relative',
                }}
            >
                {/* Top header badge */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: '#713600',
                            }}
                        />
                        <span
                            style={{
                                fontSize: 18,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.25em',
                                color: '#713600',
                                fontFamily: 'sans-serif',
                            }}
                        >
                            John David Ledger
                        </span>
                    </div>
                    <span
                        style={{
                            fontSize: 15,
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: '#713600',
                            fontFamily: 'sans-serif',
                            backgroundColor: 'rgba(113, 54, 0, 0.08)',
                            padding: '6px 18px',
                            borderRadius: '999px',
                        }}
                    >
                        {category}
                    </span>
                </div>

                {/* Main Content Area */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        margin: 'auto 0',
                    }}
                >
                    <h1
                        style={{
                            fontSize: title.length > 50 ? 44 : 56,
                            fontWeight: 800,
                            lineHeight: 1.15,
                            color: '#38240D',
                            margin: 0,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {title}
                    </h1>
                    {excerpt ? (
                        <p
                            style={{
                                fontSize: 22,
                                lineHeight: 1.45,
                                color: 'rgba(56, 36, 13, 0.75)',
                                margin: 0,
                                fontFamily: 'sans-serif',
                            }}
                        >
                            {excerpt}
                        </p>
                    ) : null}
                </div>

                {/* Footer Bar */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '2px solid rgba(113, 54, 0, 0.15)',
                        paddingTop: '20px',
                        width: '100%',
                    }}
                >
                    <span
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: '#713600',
                            fontFamily: 'sans-serif',
                            letterSpacing: '0.05em',
                        }}
                    >
                        Engineer · Public Speaker · Researcher
                    </span>
                    <span
                        style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: 'rgba(56, 36, 13, 0.6)',
                            fontFamily: 'sans-serif',
                        }}
                    >
                        {readTime}
                    </span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
