import Button from "../../components/ui/Button";

function LoginPage() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="bg-white rounded-4 shadow-sm p-5 w-100"
        style={{ maxWidth: "400px" }}
      >
        <div className="text-center mb-4">
          <h1 className="fw-bold mb-1">Welcome back</h1>
          <p className="text-muted mb-0">Log in to your account</p>
        </div>
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input type="text" className="form-control" id="username" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input type="password" className="form-control" id="password" />
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
