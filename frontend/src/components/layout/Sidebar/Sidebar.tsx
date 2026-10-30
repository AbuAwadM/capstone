import { NavLink, useNavigate } from "react-router";
import { navLinks } from "../../../constants/navLinks";
import { PATHS } from "../../../routes/paths";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside
      className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end min-vh-100"
      style={{ width: "240px" }}
    >
      <h2 className="fs-4 fw-bold mb-4 px-2">Omnishop</h2>
      <ul className="nav nav-pills flex-column gap-1">
        {navLinks.map((link) => (
          <li className="nav-item" key={link.key}>
            <NavLink
              to={`/${link.key}`}
              className={({ isActive }) =>
                `nav-link w-100 text-start ${isActive ? "active" : "link-dark"}`
              }
            >
              <i className={`bi ${link.icon} me-2`} aria-hidden="true"></i>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn btn-outline-secondary btn-sm w-100 mt-auto"
        onClick={() => navigate(PATHS.login)}
      >
        <i className="bi bi-box-arrow-right me-2" aria-hidden="true"></i>
        Log out
      </button>
    </aside>
  );
}

export default Sidebar;
