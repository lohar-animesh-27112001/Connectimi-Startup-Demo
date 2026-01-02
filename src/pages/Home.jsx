import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Welcome!</h2>
        <p>You are now on the home page.</p>
        <Link className="btn" to="/">Logout</Link>
      </div>
    </div>
  );
}

export default Home;
