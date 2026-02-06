import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { day, proof } = body;

  if (!day || !proof) {
    return NextResponse.json({ error: 'Day and proof are required' }, { status: 400 });
  }

  const challenge = await prisma.challenge.findUnique({ where: { id: params.id } });
  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }

  if (day > challenge.totalDays) {
    return NextResponse.json({ error: 'Day exceeds challenge duration' }, { status: 400 });
  }

  // Check user is creator or subscriber
  const isCreator = challenge.creatorId === user.id;
  if (!isCreator) {
    const sub = await prisma.subscriber.findUnique({
      where: { challengeId_userId: { challengeId: params.id, userId: user.id } },
    });
    if (!sub) {
      return NextResponse.json({ error: 'You must subscribe to check in' }, { status: 403 });
    }
  }

  try {
    const checkin = await prisma.checkIn.create({
      data: {
        challengeId: params.id,
        userId: user.id,
        day: parseInt(day),
        proof,
      },
    });
    return NextResponse.json(checkin);
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Already checked in for this day' }, { status: 409 });
    }
    throw e;
  }
}