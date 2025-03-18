function NotFoundClient() {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1505009258427-29298f4dc5f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aWNlfGVufDB8fDB8fHww")',
        }}
      >
        <div className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg rounded-lg p-8 w-96 text-white text-center">
          <h1 className="text-4xl font-semibold mb-4">Billion error page</h1>
          <h2 className="text-7xl font-bold relative inline-block">404</h2>
          <p className="text-xl italic mt-2">ooops!</p>
          <p className="mt-4">The Page You're Looking For Was Not Found.</p>
          <a
            href="/"
            className="mt-6 inline-block bg-black bg-opacity-50 hover:bg-opacity-70 text-white py-2 px-4 rounded-md"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }
  export default NotFoundClient;
  