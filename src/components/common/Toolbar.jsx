/** Search + status filter + sort controls shared by both dashboards. */
export default function Toolbar({ query, onQuery, status, onStatus, statusOptions, sort, onSort }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="flex-1">
        <label htmlFor="search" className="sr-only">Search assignments</label>
        <input
          id="search"
          type="search"
          className="field"
          placeholder="Search by title or description"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <div>
          <label htmlFor="status-filter" className="sr-only">Filter by status</label>
          <select id="status-filter" className="field" value={status} onChange={(e) => onStatus(e.target.value)}>
            {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="sr-only">Sort by due date</label>
          <select id="sort" className="field" value={sort} onChange={(e) => onSort(e.target.value)}>
            <option value="soonest">Due soonest</option>
            <option value="latest">Due latest</option>
          </select>
        </div>
      </div>
    </div>
  )
}
