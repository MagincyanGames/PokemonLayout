import * as fs from "fs";
import * as path from "path";

interface PokemonEntry {
  id: number;
  name: string;
}

function parsePokemonFile(inputPath: string, outputPath: string) {
  // 1. Leer el archivo
  const fileContent = fs.readFileSync(inputPath, "utf-8");
  const lines = fileContent.split(/\r?\n/);

  const pokemonList: PokemonEntry[] = [
    {
      id: 0,
      name: "---",
    },
  ];

  let currentId: number | null = null;
  let currentName: string | null = null;

  // 2. Analizar línea por línea
  for (let line of lines) {
    line = line.trim();

    // Detectar inicio de bloque [ID]
    const idMatch = line.match(/^\[(\d+)\]$/);
    if (idMatch) {
      // Si ya teníamos un Pokémon acumulado antes de este nuevo ID, lo guardamos
      if (currentId !== null && currentName !== null) {
        pokemonList.push({ id: currentId, name: currentName });
      }
      currentId = parseInt(idMatch[1], 10);
      currentName = null; // Resetear nombre para el nuevo bloque
      continue;
    }

    // Detectar la propiedad Name=...
    if (line.startsWith("Name=")) {
      currentName = line.split("=")[1];
    }
  }

  // Guardar el último Pokémon del archivo
  if (currentId !== null && currentName !== null) {
    pokemonList.push({ id: currentId, name: currentName });
  }

  // 3. Escribir el resultado en un JSON
  fs.writeFileSync(outputPath, JSON.stringify(pokemonList, null, 2));
  console.log(`✅ ¡Hecho! Se han procesado ${pokemonList.length} Pokémon.`);
}

// Ejecución (Asegúrate de que la ruta del archivo sea correcta)
const inputFile = path.join(__dirname, "pokemon.txt");
const outputFile = path.join(__dirname, "pokemon_list.json");

parsePokemonFile(inputFile, outputFile);
