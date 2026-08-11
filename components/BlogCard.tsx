import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageSquare, Share2 } from "lucide-react";
import LikeButton from "./LikeButton";
import { BlogPost } from "@/types/blog";

interface BlogCardProps {
    post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <article className="group flex flex-col h-full bg-[#FAF7C8] border border-[#713600]/12 rounded-xl p-5 shadow-[0_4px_20px_rgba(56,36,13,0.04)] hover:border-[#713600]/30 hover:shadow-[0_8px_30px_rgba(113,54,0,0.08)] transition-all duration-300">
            {/* Featured Image */}
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg mb-5 border border-[#713600]/10">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 400px"
                    loading="lazy"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
                <div className="text-[10px] text-[#713600] font-bold uppercase tracking-[0.2em] mb-2 font-mono">
                    {post.category || "Article"}
                </div>

                <h2 className="text-xl md:text-2xl leading-[1.3] font-serif font-semibold text-[#38240D] mb-3 tracking-tight group-hover:text-[#C05800] transition-colors duration-300">
                    <Link href={`/blog/${post.id}`}>
                        {post.title}
                    </Link>
                </h2>

                <p className="text-[13px] md:text-[14px] text-[#38240D]/75 leading-relaxed mb-4 font-normal line-clamp-3">
                    {post.excerpt}
                </p>

                <div className="text-[11px] text-[#38240D]/60 mb-5 font-medium tracking-wide uppercase">
                    <time dateTime={new Date(post.date).toISOString()}>
                        {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#713600]/10">
                    <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center text-[11px] font-bold tracking-widest uppercase text-[#713600] hover:text-[#C05800] transition-colors"
                    >
                        Read More
                        <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-4 text-[#38240D]/60">
                        <LikeButton postId={post.id} initialLikes={post.likesCount || 0} />
                        <button className="hover:text-[#713600] transition-colors p-1" aria-label="Comment">
                            <MessageSquare className="w-4 h-4 stroke-[1.75]" />
                        </button>
                        <button className="hover:text-[#713600] transition-colors p-1" aria-label="Share">
                            <Share2 className="w-4 h-4 stroke-[1.75]" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
