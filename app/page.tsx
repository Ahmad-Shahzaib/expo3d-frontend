export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          VEX Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          3D Virtual Exhibition Platform
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">🚀 Setup Complete</h2>
          <p className="text-gray-700 mb-4">
            Your Next.js + Three.js + MongoDB project is ready!
          </p>
          <ul className="text-left space-y-2 text-gray-600">
            <li>✅ Next.js 14 with TypeScript</li>
            <li>✅ React Three Fiber (Three.js)</li>
            <li>✅ MongoDB Integration</li>
            <li>✅ Tailwind CSS</li>
            <li>✅ Environment Configuration</li>
          </ul>
          <p className="mt-6 text-sm text-gray-500">
            Check SETUP.pdf for installation and implementation guide
          </p>
        </div>
      </div>
    </main>
  );
}

