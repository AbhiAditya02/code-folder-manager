  import { NextResponse } from 'next/server';
import { db } from '@/db';
import { codeFiles } from '@/db/schema';
import { lt } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    // Check for authorization header to prevent unauthorized triggers (optional, based on setup)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Delete files older than 7 days
    const result = await db.delete(codeFiles).where(lt(codeFiles.createdAt, sevenDaysAgo)).returning();

    return NextResponse.json({
      success: true,
      deletedCount: result.length,
      message: `Deleted ${result.length} files older than 7 days.`,
    });
  } catch (error) {
    console.error('Error during cleanup cron job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
