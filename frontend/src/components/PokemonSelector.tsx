// frontend/src/components/PokemonSelector.tsx
import Select from "react-select";
import pokemons from "../data/pokemon_list.json";
// Datos de ejemplo

interface PokemonOption {
  value: number; // O number, según tu JSON
  label: string;
}

const pokemonOptions: PokemonOption[] = pokemons.map((d) => {
  return {
    value: d.id,
    label: d.name,
  };
});

interface Props {
  init: PokemonOption | null;
  onSelect: (id: number) => void;
}

export default function PokemonSelector({ init, onSelect }: Props) {
  return (
    <div style={{ width: "500px" }}>
      {/* Controlamos el ancho para que sea compacto */}
      <Select<PokemonOption>
        options={pokemonOptions}
        defaultValue={init}
        placeholder="Buscar Pokémon..."
        isSearchable={true}
        onChange={(option) => option && onSelect(option.value)}
        // Estilos para hacerlo más pequeño y que quepa en el panel
        styles={{
          control: (base) => ({
            ...base,
            minHeight: "90px",
            fontSize: "28px",
            background: "#333",
            color: "white",
            borderColor: "#555",
            boxShadow: "none",
            borderRadius: 6,
            overflow: "hidden",
          }),
          valueContainer: (base) => ({ ...base, padding: "8px 12px" }),
          singleValue: (base) => ({ ...base, color: "white" }),
          placeholder: (base) => ({ ...base, color: "#bbb" }),
          input: (base) => ({ ...base, color: "white" }),
          indicatorSeparator: () => ({ display: "none" }),
          dropdownIndicator: (base) => ({ ...base, color: "white" }),
          menu: (base) => ({
            ...base,
            background: "#333",
            color: "white",
            boxShadow: "none",
            marginTop: 0,
            border: "1px solid #555",
            borderRadius: 6,
            overflow: "hidden",
          }),
          menuList: (base) => ({ ...base, background: "#333", padding: 0 }),
          option: (base, state) => ({
            ...base,
            fontSize: 22,
            color: state.isFocused ? "black" : "white",
            background: state.isFocused ? "#aaa" : "#555",
            padding: "8px 12px",
          }),
        }}
      />
    </div>
  );
}
