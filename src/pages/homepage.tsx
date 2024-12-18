import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/profile/12345" className="text-blue-500 underline">
        Go to Profile
      </Link>
    </div>
  );
}

export default HomePage;
