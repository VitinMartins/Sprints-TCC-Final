export default function PainelDoencas() {
  // Mock de dados por enquanto
  const diseases = [
    { name: "Diabetes", probability: "70%" },
    { name: "Anemia", probability: "20%" },
    { name: "Asma", probability: "10%" },
  ];

  return (
    <div>
      <h2>Resultados</h2>
      <ul>
        {diseases.map((d, i) => (
          <li key={i}>{d.name} - {d.probability}</li>
        ))}
      </ul>
    </div>
  );
}
