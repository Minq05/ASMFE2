import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div 
            className="flex items-center justify-center h-screen text-white" 
            style={{ 
                backgroundImage: `url("https://png.pngtree.com/background/20210706/original/pngtree-ice-crystal-solid-snow-background-picture-image_107981.jpg")`, 
                backgroundSize: "cover", 
                backgroundPosition: "center" 
            }}
        >
            <div className="bg-white bg-opacity-20 backdrop-blur-md shadow-lg rounded-lg p-8 w-96 text-center">
                <h1 className="text-4xl font-semibold mb-4 text-black">Billion Error Page</h1>
                <h2 className="text-7xl font-bold animate-bounce text-orange-500">404</h2>
                <p className="text-xl italic mt-2 text-black">Ooops!</p>
                <p className="mt-4 text-black">The Page You're Looking For Was Not Found.</p>
                <Link to="/" className="mt-6 inline-block bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition duration-300">
                    Go Home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
