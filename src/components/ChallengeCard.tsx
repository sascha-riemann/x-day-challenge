import Link from 'next/link';

interface ChallengeCardProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    totalDays: number;
    creatorName: string;
    createdAt: Date;
  };
  userId: string | null;
  likesCount: number;
  subscribersCount: number;
  checkinsCount: number;
  isLiked: boolean;
  isSubscribed: boolean;
}

export default function ChallengeCard({
  challenge,
  likesCount,
  subscribersCount,
  checkinsCount,
  isLiked,
  isSubscribed,
}: ChallengeCardProps) {
  return (
    <Link href={`/challenges/${challenge.id}`}>
      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition cursor-pointer h-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{challenge.title}</h3>
        <p className="text-gray-500 text-sm mb-2">by {challenge.creatorName} • {challenge.totalDays} days</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{challenge.description}</p>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>{isLiked ? '❤️' : '🤍'} {likesCount}</span>
          <span>{isSubscribed ? '✅' : '👥'} {subscribersCount}</span>
          <span>📋 {checkinsCount} check-ins</span>
        </div>
      </div>
    </Link>
  );
}