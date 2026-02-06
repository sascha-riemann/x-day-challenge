import Link from 'next/link';
import { stackServerApp } from '@/stack';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import ChallengeCard from '@/components/ChallengeCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await stackServerApp.getUser();
  const challenges = await prisma.challenge.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { likes: true, subscribers: true, checkins: true },
      },
      likes: user ? { where: { userId: user.id } } : false,
      subscribers: user ? { where: { userId: user.id } } : false,
    },
  });

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Challenges</h1>
          {user && (
            <Link
              href="/challenges/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              + New Challenge
            </Link>
          )}
        </div>
        {challenges.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No challenges yet. Be the first to create one!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                userId={user?.id || null}
                likesCount={challenge._count.likes}
                subscribersCount={challenge._count.subscribers}
                checkinsCount={challenge._count.checkins}
                isLiked={user ? challenge.likes.length > 0 : false}
                isSubscribed={user ? challenge.subscribers.length > 0 : false}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}