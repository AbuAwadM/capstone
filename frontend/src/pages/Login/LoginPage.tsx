import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/ui/Button";
import users from "../../data/users.json";
import { PATHS } from "../../routes/paths";

const inputClassName =
  "mt-1 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

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
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-100 p-12 bg-white rounded-xl shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 my-2">Omnishop</h1>
          <p className="text-gray-600">Log in to your account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClassName}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClassName}
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
