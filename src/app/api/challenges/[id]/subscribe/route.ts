import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.subscriber.findUnique({
    where: { challengeId_userId: { challengeId: params.id, userId: user.id } },
  });

  if (existing) {
    await prisma.subscriber.delete({ where: { id: existing.id } });
    return NextResponse.json({ subscribed: false });
  } else {
    await prisma.subscriber.create({
      data: {
        challengeId: params.id,
        userId: user.id,
        userName: user.displayName || user.primaryEmail || 'Anonymous',
      },
    });
    return NextResponse.json({ subscribed: true });
  }
}