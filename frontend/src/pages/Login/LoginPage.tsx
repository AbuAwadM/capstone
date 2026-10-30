import { useState } from "react";
import Button from "../../components/ui/Button";
import users from "../../data/users.json";
import DashboardPage from "../Dashboard/DashboardPage";

const validateForm = (username: string, password: string): boolean => {
  if (!username || !password) {
    alert(
      "Please fill in all fields. \n Username: admin \n Password: omnishop ",
    );
    return false;
  }
  return true;
};

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm(username, password)) return;
    if (!users.some((user) => user.username === username)) {
      alert("User not found.");
      return;
    }
    setIsLoggedIn(true);
  };

  if (isLoggedIn) return <DashboardPage onLogout={() => setIsLoggedIn(false)} />;

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="bg-white rounded-4 shadow-sm p-5 w-100"
        style={{ maxWidth: "400px" }}
      >
        <div className="text-center mb-4">
          <h1 className="fw-bold mb-1">Omnishop</h1>
          <p className="text-muted mb-0">Log in to your account</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <Button variant="primary" type="submit">
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
