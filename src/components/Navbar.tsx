import Link from 'next/link';
import { stackServerApp } from '@/stack';
import { UserButton } from '@stackframe/stack';

export default async function Navbar() {
  const user = await stackServerApp.getUser();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            🏆 X-Day Challenge
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
            Explore
          </Link>
          {user && (
            <Link href="/my-challenges" className="text-gray-600 hover:text-gray-900 text-sm">
              My Challenges
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <UserButton />
          ) : (
            <Link
              href="/handler/sign-in"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}