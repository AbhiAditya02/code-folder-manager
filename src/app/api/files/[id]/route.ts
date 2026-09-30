import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { codeFiles } from '@/db/schema';
import { updateFileSchema } from '@/lib/validators';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const fileId = (await params).id;
    
    const file = await db.query.codeFiles.findFirst({
      where: eq(codeFiles.id, fileId),
      with: {
        folder: true
      }
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json(file);
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const fileId = (await params).id;
    
    const existing = await db.query.codeFiles.findFirst({
      where: eq(codeFiles.id, fileId)
    });

    if (!existing) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = updateFileSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const [updated] = await db.update(codeFiles)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(codeFiles.id, fileId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const fileId = (await params).id;
    
    const existing = await db.query.codeFiles.findFirst({
      where: eq(codeFiles.id, fileId)
    });

    if (!existing) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    await db.delete(codeFiles).where(eq(codeFiles.id, fileId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
