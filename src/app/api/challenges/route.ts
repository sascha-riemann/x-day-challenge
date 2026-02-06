import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, totalDays } = body;

  if (!title || !description || !totalDays || totalDays < 1 || totalDays > 365) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const challenge = await prisma.challenge.create({
    data: {
      title,
      description,
      totalDays: parseInt(totalDays),
      creatorId: user.id,
      creatorName: user.displayName || user.primaryEmail || 'Anonymous',
    },
  });

  return NextResponse.json(challenge);
}