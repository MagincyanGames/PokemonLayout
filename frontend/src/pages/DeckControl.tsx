import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import PokemonSelector from "../components/PokemonSelector";
import "./DeckControl.css";

const socket = io({ transports: ["websocket"] });

interface PokemonData {
  id: number;
  name: string;
}

export default function DeckControl() {
  const [status, setStatus] = useState<any>(null);
  const [pokemons, setPokemons] = useState<PokemonData[]>([]);

  useEffect(() => {
    // Cargar lista de pokemons
    fetch("/pokemon_list.json")
      .then((res) => res.json())
      .then((data) => setPokemons(data))
      .catch((err) => console.error("Error cargando pokemons:", err));

    socket.on("initial_state", (data) => {
      console.log("Estado inicial recibido:", data);
      if (data) {
        setStatus(data);
      }
    });

    socket.on("pokemon_changed", (data) => {
      if (data) {
        console.log("REC:", data);
        setStatus((prevStatus: any) => {
          prevStatus[data.slotId] = {
            id: data.slotId,
            pokemonId: data.pokemonId,
          };

          return prevStatus;
        });
      }
    });

    socket.emit("request_initial_state");
  }, []);

  const updatePokemon = (slot: {
    id: number;
    pokemonId: number;
    isShiny: boolean;
  }) => {
    socket.emit("update_pokemon", {
      slotId: slot.id,
      pokemonId: slot.pokemonId,
      isShiny: slot.isShiny,
    });
  };

  const getPokemonNameForSlot = (slotId: number) => {
    const slot = status?.slots?.[slotId];
    const pokemonId = slot?.pokemonId ?? 0;
    return pokemons[pokemonId]?.name || "---";
  };

  const renderSlot = (slotId: number) => {
    const slot = status?.slots?.[slotId];
    const pokemonId = slot?.pokemonId ?? 0;
    const isShiny = slot?.isShiny ?? false;

    return (
      <PokemonSelector
        slot={slotId}
        key={slotId}
        init={{
          value: pokemonId,
          label: getPokemonNameForSlot(slotId),
          isShiny,
        }}
        onSelect={(val) => {
          updatePokemon(val);
        }}
      />
    );
  };

  return (
    <div className="deck-control-container">
      <h1 className="deck-control-header">Panel de Control</h1>
      <div className="selectors-container">
        {status && pokemons.length > 0 ? (
          <>{[0, 1, 2, 3, 4, 5].map((slotId) => renderSlot(slotId))}</>
        ) : (
          <div style={{ color: "white", padding: "10px" }}>
            Cargando datos...
          </div>
        )}
      </div>
    </div>
  );
}
