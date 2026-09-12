
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const category = (formData.get('category') as string)?.trim() || '';

    // Structured block document (JSON string) — may be absent for legacy posts
    const contentBlocksRaw = formData.get('contentBlocks') as string | null;
    const contentBlocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : undefined;

    // Safer file retrieval
    const imageEntry = formData.get('image');
    const image = (imageEntry && typeof imageEntry === 'object' && 'arrayBuffer' in imageEntry) ? imageEntry as File : null;

    const readTime = (formData.get('readTime') as string) || '5 min';
    const published = formData.get('published') === 'true';

    console.log('Creating post:', { title, category, published, hasImage: !!image });

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!category || category === 'Uncategorized') {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    let imageUrl: string | null = null;
    if (image && image.size > 0) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const isCloudinaryConfigured = 
          process.env.CLOUDINARY_CLOUD_NAME && 
          process.env.CLOUDINARY_API_KEY && 
          process.env.CLOUDINARY_API_SECRET;

        if (isCloudinaryConfigured) {
          console.log('Uploading media to Cloudinary...');
          // Upload to Cloudinary using a promise wrapper
          const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'blog-posts', resource_type: 'auto' },
              (error, result) => {
                if (error) {
                  console.error('Cloudinary upload error:', error);
                  reject(error);
                } else resolve(result);
              }
            );
            uploadStream.end(buffer);
          });

          imageUrl = uploadResult.secure_url;
          console.log('Media uploaded to Cloudinary:', imageUrl);
        } else {
          console.log('Cloudinary credentials not detected. Saving file locally...');
          // Fallback to local storage in public/uploads
          const fs = await import('fs/promises');
          const path = await import('path');
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
          
          // Ensure directory exists
          await fs.mkdir(uploadsDir, { recursive: true });
          
          // Generate a unique filename
          const fileExtension = image.name.split('.').pop() || 'png';
          const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
          const filePath = path.join(uploadsDir, filename);
          
          // Write file
          await fs.writeFile(filePath, buffer);
          imageUrl = `/uploads/${filename}`;
          console.log('Saved media locally to:', imageUrl);
        }
      } catch (uploadError) {
        console.error('Failed to process image upload:', uploadError);
        return NextResponse.json({ error: 'Failed to process image upload', details: uploadError }, { status: 500 });
      }
    }

    const dateRaw = formData.get('date') as string | null;
    const date = dateRaw ? new Date(dateRaw) : undefined;

    const isNote = category.trim().toLowerCase() === 'note';
    const defaultImage = isNote ? null : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop';

    console.log('Saving to database...');
    const post = await prisma.post.create({
      data: {
        title,
        excerpt: excerpt || '',
        content: content || '',
        contentBlocks: contentBlocks ?? undefined,
        category,
        image: imageUrl || defaultImage,
        readTime,
        published,
        ...(date && !isNaN(date.getTime()) ? { date } : {}),
      },
    });
    console.log('Post created:', post.id);

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create post', details: error },
      { status: 500 }
    );
  }
}
