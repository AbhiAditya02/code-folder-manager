import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { folders } from '@/db/schema';
import { createFolderSchema } from '@/lib/validators';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const dept = searchParams.get('dept');
    const year = searchParams.get('year');
    const batch = searchParams.get('batch');
    const groupName = searchParams.get('groupName');

    let conditions = [];
    if (dept) conditions.push(eq(folders.dept, dept));
    if (year) conditions.push(eq(folders.year, parseInt(year)));
    if (batch) conditions.push(eq(folders.batch, batch));
    if (groupName) conditions.push(eq(folders.group_name, groupName));

    const result = await db.query.folders.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [desc(folders.createdAt)],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createFolderSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const { dept, year, batch, groupName } = parsed.data;
    const folderName = `${dept}_${year}_${batch}_${groupName}`;

    // Check if it already exists
    const existing = await db.query.folders.findFirst({
      where: eq(folders.name, folderName)
    });

    if (existing) {
      return NextResponse.json({ error: 'Folder already exists' }, { status: 409 });
    }

    const [newFolder] = await db.insert(folders).values({
      name: folderName,
      dept,
      year,
      batch,
      group_name: groupName,
    }).returning();

    return NextResponse.json(newFolder, { status: 201 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
