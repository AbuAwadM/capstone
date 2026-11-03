import { Store } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { navLinks } from "../../../constants/navLinks";
import { PATHS } from "../../../routes/paths";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="flex flex-col w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center gap-3 px-3 py-2 mb-6">
        <Store size={24} strokeWidth={1.5} className="text-black" />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Omnishop
        </h1>
      </div>
      <ul className="flex-1 space-y-1">
        {navLinks.map((link) => (
          <li key={link.key}>
            <NavLink
              to={`/${link.key}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-lg rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 font-medium text-black"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <link.icon size={22} strokeWidth={1.5} />
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="px-3 py-2 text-lg text-left text-gray-600 rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-900"
        onClick={() => navigate(PATHS.login)}
      >
        Log out
      </button>
    </aside>
  );
}

export default Sidebar;
