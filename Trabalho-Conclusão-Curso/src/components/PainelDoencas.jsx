export default function PainelDoencas() {
  const diseases = [
    { name: "Diabetes", probability: "70%" },
    { name: "Anemia", probability: "20%" },
    { name: "Asma", probability: "10%" },
  ];

  return (
    <div className="form-container fadeInUp">
      <h2>Resultados</h2>
      <ul>
        {diseases.map((d, i) => (
          <li key={i}>
            <strong>{d.name}</strong> — Probabilidade: {d.probability}
          </li>
        ))}
      </ul>
    </div>
  );
}
