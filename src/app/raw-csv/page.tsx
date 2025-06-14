import { supabase } from '@/utils/supabaseClient';

type RawCSVRow = {
  id: string;
  name: string;
  list_name: string;
  rank: number;
  is_correct: boolean;
};

export default async function RawCSVPage() {
  const { data, error } = await supabase
    .from('raw_csv_uploads')
    .select('*');

  return (
    <div>
      <h1>Raw CSV Uploads</h1>

      {/* 🔍 DEBUG VIEW */}
      <h2>Debug Output</h2>
      <pre>{JSON.stringify({ error, data }, null, 2)}</pre>

      <h2>Data Table</h2>
      {data && data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>List Name</th>
              <th>Correct?</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row: RawCSVRow) => (
              <tr key={row.id}>
                <td>{row.rank}</td>
                <td>{row.name}</td>
                <td>{row.list_name}</td>
                <td>{row.is_correct ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No rows returned.</p>
      )}
    </div>
  );
}
