'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CheckInFormProps {
  challengeId: string;
  day: number;
}

export default function CheckInForm({ challengeId, day }: CheckInFormProps) {
  const router = useRouter();
  const [proof, setProof] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch(`/api/challenges/${challengeId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, proof }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to check in');
      }

      setSuccess(true);
      setProof('');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">✅ Checked in for Day {day}!</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Proof / What did you do today?
        </label>
        <textarea
          value={proof}
          onChange={(e) => setProof(e.target.value)}
          placeholder="e.g., Did 50 pushups today! Feeling great."
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
      >
        {loading ? 'Checking in...' : `Check In Day ${day}`}
      </button>
    </form>
  );
}