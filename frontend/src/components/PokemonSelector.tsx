// frontend/src/components/PokemonSelector.tsx
import Select from "react-select";
import { useState, useEffect } from "react";
import Switch from "react-switch";

// Datos de ejemplo

interface PokemonOption {
  value: number; // O number, según tu JSON
  label: string;
  isShiny: boolean;
}

interface Props {
  slot: number;
  init: PokemonOption | null;
  onSelect: (slot: { id: number; pokemonId: number; isShiny: boolean }) => void;
}

export default function PokemonSelector({ slot, init, onSelect }: Props) {
  const [pokemonOptions, setPokemonOptions] = useState<PokemonOption[]>([]);
  const [isShiny, setIsShiny] = useState<boolean>(init?.isShiny ?? false);
  const [pokemonId, setPokemonId] = useState<number>(init?.value ?? 0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/pokemon_list.json")
      .then((res) => res.json())
      .then((pokemons) => {
        const options = pokemons.map((d: { id: number; name: string }) => ({
          value: d.id,
          label: d.name,
        }));

        setPokemonOptions(options);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando pokemons:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ width: "100%", padding: "10px", color: "white" }}>
        Cargando pokemons...
      </div>
    );
  }

  return (
    <div
      style={{ 
        width: 400, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        gap: "clamp(10px, 2vw, 20px)",
        maxWidth: "700px",
        margin: "0 auto",
        padding: "0 10px",
        boxSizing: "border-box"
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <Select<PokemonOption>
          options={pokemonOptions}
          defaultValue={init}
          placeholder="Buscar Pokémon..."
          isSearchable={true}
          isDisabled={loading}
          onChange={(option) => {
            setPokemonId(option?.value ?? 0);
            option &&
              onSelect({
                id: slot,
                pokemonId: option.value,
                isShiny,
              });
          }}
          styles={{
            container: (base) => ({
              ...base,
              width: "100%",
            }),
            control: (base) => ({
              ...base,
              minHeight: "clamp(50px, 10vw, 90px)",
              height: "clamp(50px, 10vw, 90px)",
              fontSize: "clamp(16px, 3vw, 28px)",
              background: "#333",
              color: "white",
              borderColor: "#555",
              boxShadow: "none",
              borderRadius: 6,
              overflow: "hidden",
              width: "100%",
            }),
          valueContainer: (base) => ({ 
            ...base, 
            padding: "clamp(4px 8px, 2vw, 8px 12px)" 
          }),
          singleValue: (base) => ({ 
            ...base, 
            color: "white",
            fontSize: "clamp(16px, 3vw, 28px)",
          }),
          placeholder: (base) => ({ 
            ...base, 
            color: "#bbb",
            fontSize: "clamp(14px, 2.5vw, 24px)",
          }),
          input: (base) => ({ 
            ...base, 
            color: "white",
            fontSize: "clamp(16px, 3vw, 28px)",
          }),
          indicatorSeparator: () => ({ display: "none" }),
          dropdownIndicator: (base) => ({ 
            ...base, 
            color: "white",
            padding: "clamp(4px, 1vw, 8px)",
          }),
          menu: (base) => ({
            ...base,
            background: "#333",
            color: "white",
            boxShadow: "none",
            marginTop: 0,
            border: "1px solid #555",
            borderRadius: 6,
            overflow: "hidden",
            width: "100%",
          }),
          menuList: (base) => ({ 
            ...base, 
            background: "#333", 
            padding: 0,
            maxHeight: "clamp(200px, 50vh, 400px)",
          }),
          option: (base, state) => ({
            ...base,
            fontSize: "clamp(14px, 2.5vw, 22px)",
            color: state.isFocused ? "black" : "white",
            background: state.isFocused ? "#aaa" : "#555",
            padding: "clamp(6px 8px, 2vw, 8px 12px)",
          }),
          }}
        />
      </div>
      <div
        style={{
          minWidth: "clamp(40px, 8vw, 60px)",
          width: "clamp(40px, 8vw, 60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Switch
          checked={isShiny}
          onChange={(b) => {
            setIsShiny(b);
            onSelect({
              id: slot,
              pokemonId,
              isShiny: b,
            });
          }}
          height={typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 28}
          width={typeof window !== 'undefined' && window.innerWidth < 768 ? 40 : 56}
        />
      </div>
    </div>
  );
}
