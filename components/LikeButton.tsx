"use client";

import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
    className?: string;
}

export default function LikeButton({ postId, initialLikes, className }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        let storedUserId = localStorage.getItem("mba_userId");
        if (!storedUserId) {
            storedUserId = `user_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
            localStorage.setItem("mba_userId", storedUserId);
        }
        setUserId(storedUserId);

        const likedPosts = JSON.parse(localStorage.getItem("mba_liked_posts") || "[]");
        if (likedPosts.includes(postId)) {
            setIsLiked(true);
        }
    }, [postId]);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading || !userId) return;

        setIsLoading(true);

        const previousLikes = likes;
        const previousIsLiked = isLiked;

        setLikes(prev => isLiked ? prev - 1 : prev + 1);
        setIsLiked(!isLiked);

        try {
            const res = await fetch(`/api/posts/${postId}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (!res.ok) {
                throw new Error("Failed to toggle like");
            }

            const data = await res.json();

            const likedPosts = JSON.parse(localStorage.getItem("mba_liked_posts") || "[]");
            if (data.liked) {
                if (!likedPosts.includes(postId)) {
                    likedPosts.push(postId);
                }
            } else {
                const index = likedPosts.indexOf(postId);
                if (index > -1) {
                    likedPosts.splice(index, 1);
                }
            }
            localStorage.setItem("mba_liked_posts", JSON.stringify(likedPosts));

            setLikes(data.likesCount);
            setIsLiked(data.liked);

        } catch (error) {
            console.error("Error liking post:", error);
            setLikes(previousLikes);
            setIsLiked(previousIsLiked);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center gap-1.5 p-1 group transition-all duration-300 ${className || ""}`}
            aria-label={isLiked ? "Unlike" : "Like"}
        >
            <ThumbsUp
                className={`w-4 h-4 stroke-[1.75] transition-all duration-300 ${isLiked
                    ? "fill-[#C05800] text-[#C05800] scale-110"
                    : "text-[#38240D]/60 group-hover:text-[#713600]"
                    }`}
            />
            {likes > 0 && (
                <span className={`text-[11px] font-bold transition-colors ${isLiked ? "text-[#C05800]" : "text-[#38240D]/70 group-hover:text-[#713600]"
                    }`}>
                    {likes}
                </span>
            )}
        </button>
    );
}
