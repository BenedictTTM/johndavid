import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/blog";

interface BlogRowProps {
    post: BlogPost;
}

export default function BlogRow({ post }: BlogRowProps) {
    return (
        <article className="group flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-[#FAF7C8] border border-[#713600]/10 hover:border-[#713600]/25 transition-all duration-300 mb-4 last:mb-0">
            {/* Image (Left) */}
            <div className="relative w-full sm:w-1/3 aspect-[16/10] sm:aspect-[4/3] overflow-hidden rounded-lg flex-shrink-0 border border-[#713600]/10">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 150px"
                    loading="lazy"
                />
            </div>

            {/* Content (Right) */}
            <div className="flex flex-col flex-1 min-w-0 py-1">
                <div className="text-[10px] text-[#713600] font-bold uppercase tracking-[0.2em] mb-1 font-mono">
                    {post.category || "Article"}
                </div>

                <h3 className="text-base md:text-lg font-serif font-semibold text-[#38240D] mb-2 leading-snug tracking-tight group-hover:text-[#C05800] transition-colors duration-300 line-clamp-2">
                    <Link href={`/blog/${post.id}`}>
                        {post.title}
                    </Link>
                </h3>

                <div className="text-[11px] text-[#38240D]/60 mt-auto font-medium uppercase tracking-wider">
                    <time dateTime={new Date(post.date).toISOString()}>
                        {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </time>
                </div>
            </div>
        </article>
    );
}
