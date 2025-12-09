const HomePage = ({ navigate }) => (
  <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center">
    <Home size={64} className="text-red-600 mb-4" />
    <h1 className="text-3xl font-bold text-gray-700 mb-4">Home</h1>
    <p className="text-gray-500 mb-8">Welcome to the home page</p>
    <button onClick={() => navigate('/')} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition">
      Go to Quiz
    </button>
  </div>
);

const NewsPage = ({ navigate }) => (
  <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center">
    <List size={64} className="text-red-600 mb-4" />
    <h1 className="text-3xl font-bold text-gray-700 mb-4">News</h1>
    <p className="text-gray-500 mb-8">Latest updates and news</p>
    <button onClick={() => navigate('/')} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition">
      Go to Quiz
    </button>
  </div>
);

const ProfilePage = ({ navigate }) => (
  <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center">
    <User size={64} className="text-red-600 mb-4" />
    <h1 className="text-3xl font-bold text-gray-700 mb-4">Profile</h1>
    <p className="text-gray-500 mb-8">User profile information</p>
    <button onClick={() => navigate('/')} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition">
      Go to Quiz
    </button>
  </div>
);