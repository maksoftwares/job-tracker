import clsx from "clsx";

export type SortKey = "appliedAt" | "salary" | "stage";
export type SortDirection = "asc" | "desc";

interface SortButtonProps {
  label: string;
  column: SortKey;
  sort: { key: SortKey; direction: SortDirection };
  onSortChange: (key: SortKey) => void;
}

function SortButton({ label, column, sort, onSortChange }: SortButtonProps) {
  const isActive = sort.key === column;
  const direction = sort.direction;
  return (
    <button
      className={clsx("flex items-center gap-1", isActive ? "text-primary-700" : "text-slate-700")}
      onClick={() => onSortChange(column)}
    >
      <span>{label}</span>
      <span className="text-xs">{isActive ? (direction === "asc" ? "▲" : "▼") : ""}</span>
    </button>
  );
}

interface TableHeaderProps {
  sort: { key: SortKey; direction: SortDirection };
  onSortChange: (key: SortKey) => void;
}

export function TableHeader({ sort, onSortChange }: TableHeaderProps) {
  return (
    <thead className="bg-slate-100 text-xs uppercase text-slate-600">
      <tr>
        <th className="px-4 py-3 text-left">Company</th>
        <th className="px-4 py-3 text-left">Role</th>
        <th className="px-4 py-3 text-left">
          <SortButton label="Stage" column="stage" sort={sort} onSortChange={onSortChange} />
        </th>
        <th className="px-4 py-3 text-left">Location</th>
        <th className="px-4 py-3 text-left">Work mode</th>
        <th className="px-4 py-3 text-left">
          <SortButton label="Salary" column="salary" sort={sort} onSortChange={onSortChange} />
        </th>
        <th className="px-4 py-3 text-left">Source</th>
        <th className="px-4 py-3 text-left">Recruiter</th>
        <th className="px-4 py-3 text-left">
          <SortButton label="Applied" column="appliedAt" sort={sort} onSortChange={onSortChange} />
        </th>
        <th className="px-4 py-3 text-left">Next follow-up</th>
        <th className="px-4 py-3 text-left">Last updated</th>
      </tr>
    </thead>
  );
}
