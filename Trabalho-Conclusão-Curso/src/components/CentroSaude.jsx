export default function CentroSaude() {
  const centers = [
    { name: "Posto Central", specialty: "Cardiologia", address: "Rua A, 123" },
    { name: "Posto Sul", specialty: "Nefrologia", address: "Rua B, 456" },
  ];

  return (
    <div>
      <h2>Postos de Saúde Sugeridos</h2>
      <ul>
        {centers.map((c, i) => (
          <li key={i}>{c.name} - {c.specialty} - {c.address}</li>
        ))}
      </ul>
    </div>
  );
}
