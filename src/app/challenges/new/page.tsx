import { stackServerApp } from '@/stack';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CreateChallengeForm from '@/components/CreateChallengeForm';

export default async function NewChallengePage() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect('/handler/sign-in');
  }

  return (
    <div>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create a New Challenge</h1>
        <CreateChallengeForm />
      </main>
    </div>
  );
}