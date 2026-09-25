import { ActivityEntry } from "@/types/billing";

export function ActivityHistory({ rows }: { rows: ActivityEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>User</th>
            <th>Aktivitas</th>
            <th>Catatan</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td>{r.user}</td>
              <td>{r.activity}</td>
              <td className="whitespace-normal text-brandgrey-600">{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
