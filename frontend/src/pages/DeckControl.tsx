import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import PokemonSelector from "../components/PokemonSelector";
import pokemons from "../components/pokemon_list.json";
import "./DeckControl.css";

const socket = io({ transports: ["websocket"] });

export default function DeckControl() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
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
            name: data.name,
          };

          return prevStatus;
        });
      }
    });

    socket.emit("request_initial_state");
  }, []);

  const updatePokemon = (slotId: number, nuevoPokemon: number) => {
    socket.emit("update_pokemon", { slotId, name: nuevoPokemon });
  };

  return (
    <div className="deck-control-container">
      <h1 className="deck-control-header">Panel de Control</h1>
      <div className="selectors-container">
        {status && (
          <>
            <PokemonSelector
              init={{
                value: status.slots[0].name,
                label: pokemons[status.slots[0].name].name,
              }}
              onSelect={(val) => {
                updatePokemon(0, val);
              }}
            />
            <PokemonSelector
              init={{
                value: status.slots[1].name,
                label: pokemons[status.slots[1].name].name,
              }}
              onSelect={(val) => {
                updatePokemon(1, val);
              }}
            />
            <PokemonSelector
              init={{
                value: status.slots[2].name,
                label: pokemons[status.slots[2].name].name,
              }}
              onSelect={(val) => {
                updatePokemon(2, val);
              }}
            />
            <PokemonSelector
              init={{
                value: status.slots[3].name,
                label: pokemons[status.slots[3].name].name,
              }}
              onSelect={(val) => {
                updatePokemon(3, val);
              }}
            />
            <PokemonSelector
              init={{
                value: status.slots[4].name,
                label: pokemons[status.slots[4].name].name,
              }}
              onSelect={(val) => {
                updatePokemon(4, val);
              }}
            />
            <PokemonSelector
              init={{
                value: status.slots[5].name,
                label: pokemons[status.slots[5].name].name,
              }}
              onSelect={(val) => {
                updatePokemon(5, val);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
