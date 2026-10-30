import { navLinks } from "../../../constants/navLinks";

interface SidebarProps {
  activeKey: string;
  onSelect: (key: string) => void;
  onLogout: () => void;
}

function Sidebar({ activeKey, onSelect, onLogout }: SidebarProps) {
  return (
    <aside
      className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end min-vh-100"
      style={{ width: "240px" }}
    >
      <h2 className="fs-4 fw-bold mb-4 px-2">Omnishop</h2>
      <ul className="nav nav-pills flex-column gap-1">
        {navLinks.map((link) => (
          <li className="nav-item" key={link.key}>
            <button
              type="button"
              className={`nav-link w-100 text-start ${
                activeKey === link.key ? "active" : "link-dark"
              }`}
              onClick={() => onSelect(link.key)}
            >
              <i className={`bi ${link.icon} me-2`} aria-hidden="true"></i>
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn btn-outline-secondary btn-sm w-100 mt-auto"
        onClick={onLogout}
      >
        <i className="bi bi-box-arrow-right me-2" aria-hidden="true"></i>
        Log out
      </button>
    </aside>
  );
}

export default Sidebar;
