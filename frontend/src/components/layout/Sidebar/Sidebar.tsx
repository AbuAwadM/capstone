import { NavLink, useNavigate } from "react-router";
import { navLinks } from "../../../constants/navLinks";
import { PATHS } from "../../../routes/paths";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside style={{ width: "240px" }}>
      <h2>Omnishop</h2>
      <ul>
        {navLinks.map((link) => (
          <li key={link.key}>
            <NavLink to={`/${link.key}`}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button type="button" onClick={() => navigate(PATHS.login)}>
        Log out
      </button>
    </aside>
  );
}

export default Sidebar;
