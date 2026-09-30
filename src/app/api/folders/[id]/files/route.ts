import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { codeFiles, folders } from '@/db/schema';
import { createFileSchema } from '@/lib/validators';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const folderId = params.id;
    
    const files = await db.query.codeFiles.findMany({
      where: eq(codeFiles.folderId, folderId),
      orderBy: [desc(codeFiles.createdAt)],
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const folderId = params.id;
    
    // Check if folder exists
    const folder = await db.query.folders.findFirst({
      where: eq(folders.id, folderId)
    });

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = createFileSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const { heading, language, content } = parsed.data;

    const [newFile] = await db.insert(codeFiles).values({
      folderId,
      heading,
      language,
      content,
    }).returning();

    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    console.error('Error creating file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
