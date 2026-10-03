export default function NutritionTable({ nutrition }){
  const hasProtein = nutrition.hasProtein;
  return (
    <table className="ledger">
      <colgroup>
        {hasProtein
          ? <><col style={{ width: '52%' }} /><col style={{ width: '24%' }} /><col style={{ width: '24%' }} /></>
          : <><col style={{ width: '72%' }} /><col style={{ width: '28%' }} /></>}
      </colgroup>
      <thead>
        <tr>
          <th>Sastojak</th>
          <th className="val">Kcal</th>
          {hasProtein && <th className="val">Proteini</th>}
        </tr>
      </thead>
      <tbody>
        {nutrition.rows.map((row, i) => (
          <tr key={i}>
            <td>{row.name}</td>
            <td className="val">{row.kcal}</td>
            {hasProtein && <td className="val">{row.protein || '—'}</td>}
          </tr>
        ))}
        {nutrition.totals.map((t, idx) => (
          <tr key={idx} className={"total" + (idx > 0 ? " sub" : "")}>
            <td>{t.name}</td>
            <td className="val">{t.kcal}</td>
            {hasProtein && <td className="val">{t.protein || '—'}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
