import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/ui/Button";
import users from "../../data/users.json";
import { PATHS } from "../../routes/paths";

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
  const navigate = useNavigate();

  const handleLogin = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm(username, password)) return;
    if (!users.some((user) => user.username === username)) {
      alert("User not found.");
      return;
    }
    navigate(PATHS.dashboard);
  };

  return (
    <div>
      <div style={{ maxWidth: "400px" }}>
        <div>
          <h1>Omnishop</h1>
          <p>Log in to your account</p>
        </div>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
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
