import { navLinks } from "../../../constants/navLinks";

interface SidebarProps {
  activeKey: string;
  onSelect: (key: string) => void;
}

function Sidebar({ activeKey, onSelect }: SidebarProps) {
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
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
