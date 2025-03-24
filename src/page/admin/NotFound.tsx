import { Button } from "antd";
import { Link } from "react-router-dom";

function NotFoundAdmin() {
    return (
        <div
            className="flex items-center justify-center h-screen text-white"
            style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1514747348279-46eb4082b804?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aWNlfGVufDB8fDB8fHww")`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            <div className="bg-white bg-opacity-20 backdrop-blur-md shadow-lg rounded-lg p-8 w-96 text-center">
                <h1 className="text-4xl font-semibold mb-4 text-black">Billion Error Page</h1>
                <h2 className="text-7xl font-bold animate-bounce text-orange-500">404</h2>
                <p className="text-xl italic mt-2 text-black">Ooops!</p>
                <p className="mt-4 text-black">The Page You're Looking For Was Not Found.</p>
                <Button>
                    <Link to="/admin">
                        Go Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export default NotFoundAdmin;
