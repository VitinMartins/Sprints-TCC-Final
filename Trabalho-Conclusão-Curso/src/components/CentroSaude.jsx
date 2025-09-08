export default function CentroSaude() {
  const centers = [
    { name: "Posto Central", specialty: "Cardiologia", address: "Rua A, 123" },
    { name: "Posto Sul", specialty: "Nefrologia", address: "Rua B, 456" },
  ];

  return (
    <div className="form-container fadeInUp">
      <h2>Postos de Saúde Sugeridos</h2>
      <ul>
        {centers.map((c, i) => (
          <li key={i}>
            <strong>{c.name}</strong> — {c.specialty} — {c.address}
          </li>
        ))}
      </ul>
    </div>
  );
}
