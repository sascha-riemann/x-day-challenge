import { stackServerApp } from '@/stack';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ChallengeCard from '@/components/ChallengeCard';

export const dynamic = 'force-dynamic';

export default async function MyChallengesPage() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect('/handler/sign-in');
  }

  const myChallenges = await prisma.challenge.findMany({
    where: { creatorId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { likes: true, subscribers: true, checkins: true } },
      likes: { where: { userId: user.id } },
      subscribers: { where: { userId: user.id } },
    },
  });

  const subscribedChallenges = await prisma.challenge.findMany({
    where: {
      subscribers: { some: { userId: user.id } },
      NOT: { creatorId: user.id },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { likes: true, subscribers: true, checkins: true } },
      likes: { where: { userId: user.id } },
      subscribers: { where: { userId: user.id } },
    },
  });

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Challenges</h1>
        
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Created by Me</h2>
            <Link href="/challenges/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm">
              + New Challenge
            </Link>
          </div>
          {myChallenges.length === 0 ? (
            <p className="text-gray-500">You haven't created any challenges yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {myChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  userId={user.id}
                  likesCount={challenge._count.likes}
                  subscribersCount={challenge._count.subscribers}
                  checkinsCount={challenge._count.checkins}
                  isLiked={challenge.likes.length > 0}
                  isSubscribed={false}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Subscribed</h2>
          {subscribedChallenges.length === 0 ? (
            <p className="text-gray-500">You haven't subscribed to any challenges yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {subscribedChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  userId={user.id}
                  likesCount={challenge._count.likes}
                  subscribersCount={challenge._count.subscribers}
                  checkinsCount={challenge._count.checkins}
                  isLiked={challenge.likes.length > 0}
                  isSubscribed={challenge.subscribers.length > 0}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}