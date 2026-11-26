import type { ReactNode } from "react";
import styles from "./TabularPageLayout.module.css";
import Button from "@/components/ui/Button/Button";
import SearchBar from "@/components/ui/SearchBar";
import DropDown, { type DropDownOption } from "@/components/ui/DropDown";

export type FilterValues = Record<string, string>;

export interface StatItem {
  label: string;
  value: ReactNode;
}

export interface FilterConfig {
  /** Key this filter writes to in `FilterValues`. */
  key: string;
  placeholder: string;
  options: DropDownOption[];
}

interface ToolBoxProps {
  topic: string;
  /** Label for the add button. Defaults to "Add <topic without trailing s>". */
  addLabel?: string;
  onAdd?: () => void;
  stats?: StatItem[];
  filters?: FilterConfig[];
  /** Key the search bar writes to in `FilterValues`. */
  searchKey?: string;
  filterValues?: FilterValues;
  onFiltersChange?: (values: FilterValues) => void;
}

function ToolBox({
  topic,
  addLabel,
  onAdd,
  stats = [],
  filters = [],
  searchKey = "query",
  filterValues = {},
  onFiltersChange,
}: ToolBoxProps) {
  function updateFilter(key: string, value: string) {
    onFiltersChange?.({ ...filterValues, [key]: value });
  }

  return (
    <div className={styles.toolbox}>
      <div className={styles.heading}>
        <h1>{topic}</h1>
        {onAdd && (
          <Button type="button" size="medium" onClick={onAdd}>
            {addLabel ?? `Add ${topic.replace(/s$/i, "")}`}
          </Button>
        )}
      </div>
      {stats.length > 0 && (
        <div className={styles.stats}>
          {stats.map((stat) => (
            <span key={stat.label}>
              {stat.label}: <span>{stat.value}</span>
            </span>
          ))}
        </div>
      )}
      <div className={styles.filters}>
        <SearchBar
          className={styles.searchBar}
          value={filterValues[searchKey] ?? ""}
          placeholder={`Search ${topic.toLowerCase()}...`}
          onChange={(event) => updateFilter(searchKey, event.target.value)}
        />
        {filters.map((filter) => (
          <DropDown
            key={filter.key}
            className={styles.dropDown}
            value={filterValues[filter.key] ?? ""}
            options={filter.options}
            placeholder={filter.placeholder}
            onChange={(value) => updateFilter(filter.key, value)}
          />
        ))}
      </div>
    </div>
  );
}

interface TabularPageLayoutProps extends ToolBoxProps {
  /** Main content, e.g. the table. */
  children?: ReactNode;
  /** Side panel content. */
  aside?: ReactNode;
}

export default function TabularPageLayout({
  children,
  aside,
  ...toolBoxProps
}: TabularPageLayoutProps) {
  return (
    <div className="flex h-full gap-4 p-4">
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <ToolBox {...toolBoxProps} />
        <div className="flex-1 min-h-0">{children}</div>
      </div>
      <aside className="w-[30%] shrink-0 overflow-hidden">{aside}</aside>
    </div>
  );
}
