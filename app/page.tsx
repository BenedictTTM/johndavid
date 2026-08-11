import SplitHero from "@/components/SplitHero";
import Footer from "@/components/Footer";
import Blog from "@/components/Blog";
import WhoAmI from "@/components/WhoAmI";
import Contact from "@/components/Contact";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 6,
    });
  } catch (error) {
    console.error("Error fetching posts on homepage:", error);
    posts = [];
  }

  const blogPosts = posts.map((post) => ({
    ...post,
    category: post.category || "Uncategorized",
    date: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
    image: post.image || "/dry.png",
    excerpt: post.excerpt || "",
    content: post.content || "",
  }));

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <SplitHero />
        <section id="about">
          <WhoAmI />
        </section>
        <Blog posts={blogPosts} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
