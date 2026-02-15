import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io({ transports: ["websocket"] });

// Ajustable: frames por segundo de la animación
const ANIMATION_FPS = 20; // Cambia este valor para ajustar la velocidad

export default function PokemonView() {
  const { id } = useParams();
  const [pokemonData, setPokemonData] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 1. Efecto para los Sockets
  useEffect(() => {
    document.documentElement.style.backgroundColor = "transparent";
    socket.on("initial_state", (state) => {
      if (state.slots && state.slots[id ?? "0"]) {
        setPokemonData(state.slots[id ?? "0"]);
      }
    });

    socket.on("pokemon_changed", (data) => {
      // Comparamos con string o número según cómo lo envíes del backend
      console.log(data);
      if (String(data.slotId) === String(id)) {
        setPokemonData({
          id: data.slotId,
          pokemonId: data.pokemonId,
          isShiny: data.isShiny,
        });
      }
    });

    socket.emit("request_initial_state");

    return () => {
      socket.off("initial_state");
      socket.off("pokemon_changed");
    };
  }, [id]);

  // 2. Manejador para detectar el tamaño del Spritesheet
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setDimensions({ width: naturalWidth, height: naturalHeight });
  };

  // 3. Cálculos de animación
  // Asumimos que el spritesheet es una tira horizontal donde cada frame es un cuadrado (alto = ancho del frame)
  const spriteNameRaw = pokemonData?.pokemonId ?? null;

  // Si el nombre es un número, los ficheros usan al menos 3 dígitos
  const formatSpriteName = (name: string) => {
    if (/^\d+$/.test(name)) {
      const n = Number(name);
      if (n <= 0) return null;
      if (n >= 1000) return String(n);
      return name.padStart(3, "0");
    }
    return name;
  };

  const spriteName = spriteNameRaw
    ? formatSpriteName(String(spriteNameRaw))
    : null;
  const spriteUrl = spriteName
    ? `/pokemons/${spriteName}${pokemonData.isShiny ? "s" : ""}.png`
    : undefined; // Cambiado a .png para transparencia
  const totalFrames =
    dimensions.width > 0 && dimensions.height > 0
      ? dimensions.width / dimensions.height
      : 1;
  const frames = Math.max(1, Math.floor(totalFrames));
  const animationDuration = frames / ANIMATION_FPS; // segundos por loop

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "300px",
        height: "300px",
        overflow: "hidden",
      }}
    >
      {/* 4. El div que contiene la animación */}
      {spriteUrl && dimensions.width > 0 && (
        <div
          style={{
            width: `${dimensions.height}px`, // El ancho de un solo frame
            height: `${dimensions.height}px`,
            backgroundImage: `url(${spriteUrl})`,
            backgroundSize: `auto 100%`, // El alto siempre al 100% del contenedor
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated", // Mantiene el estilo Pixel Art nítido
            animation: `play-pokemon ${animationDuration}s steps(${frames}) infinite`,
            // Escalamos para que el frame (que es pequeño) ocupe los 300px que quieres
            transform: `scale(${300 / dimensions.height})`,
            transformOrigin: "top left",
          }}
        />
      )}

      {/* 5. Imagen oculta para detectar dimensiones automáticamente */}
      {spriteUrl && (
        <img
          src={spriteUrl}
          onLoad={onImageLoad}
          style={{ display: "none" }}
          alt="hidden-loader"
        />
      )}

      {/* 6. Definición de la animación */}
      <style>{`
        @keyframes play-pokemon {
          from { background-position: 0px; }
          to { background-position: -${dimensions.width}px; }
        }
      `}</style>
    </div>
  );
}
