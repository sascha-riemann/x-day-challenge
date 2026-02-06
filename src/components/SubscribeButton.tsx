'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SubscribeButtonProps {
  challengeId: string;
  isSubscribed: boolean;
  subscribersCount: number;
}

export default function SubscribeButton({ challengeId, isSubscribed: initialSubscribed, subscribersCount: initialCount }: SubscribeButtonProps) {
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/challenges/${challengeId}/subscribe`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setSubscribed(data.subscribed);
        setCount(prev => data.subscribed ? prev + 1 : prev - 1);
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
        subscribed
          ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {subscribed ? '✅ Joined' : '👥 Join'} ({count})
    </button>
  );
}