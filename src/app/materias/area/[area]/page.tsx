import { read } from "@/../lib/neo4j";
import Link from "next/link";
import { Material } from "@/../types";
import { Integer } from "neo4j-driver";

interface MaterialRecord {
  material: Material;
}

//Busca materias da area da computação
async function getMaterias(area: Integer) {
  const res = await read<MaterialRecord>(`
  MATCH (m:Material)-[:PERTENCE_A_AREA]->(a:Area WHERE ID(a) = ${area}) RETURN m {id: ID(m), .*} AS material ORDER BY m.nome ASC`);
  const materias = res.map((row) => row.material);
  return materias;
}

export default async function AreaPage({ params }: any) {
  const area = params.area;
  const materias = await getMaterias(area);
  return (
    <div>
      <h1>Materias de {materias[0]?.nome}</h1>
      <ul>
        {materias.map((material) => (
          <li key={material.nome}>
            <Link
              href={`/materias/area/${area}/${material.id}`}
            >
              {material.nome}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
