'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  challengeId: string;
  isLiked: boolean;
  likesCount: number;
}

export default function LikeButton({ challengeId, isLiked: initialLiked, likesCount: initialCount }: LikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/challenges/${challengeId}/like`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setCount(prev => data.liked ? prev + 1 : prev - 1);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
        liked
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {liked ? '❤️' : '🤍'} {count}
    </button>
  );
}