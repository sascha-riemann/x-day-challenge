import { stackServerApp } from '@/stack';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CheckInForm from '@/components/CheckInForm';
import LikeButton from '@/components/LikeButton';
import SubscribeButton from '@/components/SubscribeButton';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const user = await stackServerApp.getUser();
  const challenge = await prisma.challenge.findUnique({
    where: { id: params.id },
    include: {
      checkins: { orderBy: { day: 'asc' } },
      _count: { select: { likes: true, subscribers: true } },
      likes: user ? { where: { userId: user.id } } : false,
      subscribers: user ? { where: { userId: user.id } } : false,
    },
  });

  if (!challenge) {
    notFound();
  }

  const isCreator = user?.id === challenge.creatorId;
  const isLiked = user ? challenge.likes.length > 0 : false;
  const isSubscribed = user ? challenge.subscribers.length > 0 : false;

  const userCheckins = challenge.checkins.filter(c => c.userId === challenge.creatorId);
  const completedDays = userCheckins.length;
  const progressPercent = Math.round((completedDays / challenge.totalDays) * 100);

  // Determine next day for check-in
  const myCheckins = user ? challenge.checkins.filter(c => c.userId === user.id) : [];
  const nextDay = myCheckins.length + 1;
  const canCheckIn = user && (isCreator || isSubscribed) && nextDay <= challenge.totalDays;

  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{challenge.title}</h1>
              <p className="text-gray-500 mt-1">by {challenge.creatorName} • {challenge.totalDays} days</p>
            </div>
            <div className="flex gap-2">
              {user && (
                <>
                  <LikeButton challengeId={challenge.id} isLiked={isLiked} likesCount={challenge._count.likes} />
                  {!isCreator && (
                    <SubscribeButton challengeId={challenge.id} isSubscribed={isSubscribed} subscribersCount={challenge._count.subscribers} />
                  )}
                </>
              )}
            </div>
          </div>
          <p className="text-gray-700 mb-6">{challenge.description}</p>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress (creator)</span>
              <span>{completedDays}/{challenge.totalDays} days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex gap-4 text-sm text-gray-500">
            <span>❤️ {challenge._count.likes} likes</span>
            <span>👥 {challenge._count.subscribers} subscribers</span>
          </div>
        </div>

        {canCheckIn && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Check In - Day {nextDay}</h2>
            <CheckInForm challengeId={challenge.id} day={nextDay} />
          </div>
        )}

        {user && myCheckins.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Check-ins</h2>
            <div className="space-y-3">
              {myCheckins.map((checkin) => (
                <div key={checkin.id} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Day {checkin.day}</span>
                    <span className="text-gray-400 text-sm">{format(new Date(checkin.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{checkin.proof}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">All Check-ins</h2>
          {challenge.checkins.length === 0 ? (
            <p className="text-gray-500">No check-ins yet.</p>
          ) : (
            <div className="space-y-3">
              {challenge.checkins.map((checkin) => (
                <div key={checkin.id} className="border-l-4 border-indigo-400 pl-4 py-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Day {checkin.day}</span>
                    <span className="text-gray-400 text-sm">{format(new Date(checkin.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{checkin.proof}</p>
                  <p className="text-gray-400 text-xs mt-1">User: {checkin.userId.slice(0, 8)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}