"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const POKEMON_ON_SCREEN = 30;

function randomBetween(minimum, maximum) {
  return Math.random() * (maximum - minimum) + minimum;
}

function pickRandomPokemon(availablePokemon) {
  const shuffled = [...availablePokemon];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index];
    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = current;
  }

  return shuffled.slice(0, Math.min(POKEMON_ON_SCREEN, shuffled.length));
}

function createPokemonPixel(sprite, index) {
  return {
    ...sprite,
    instanceId: `${sprite.name}-${index}`,
    direction: Math.random() > 0.5 ? "right" : "left",
    duration: randomBetween(18, 38),
    delay: randomBetween(-35, 0),
    size: randomBetween(36, 52),
    top: randomBetween(8, 38),
  };
}

function PokemonPixel({ pokemon }) {
  const [direction, setDirection] = useState(pokemon.direction);
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <button
      type="button"
      aria-label={`${pokemon.name}: passe o mouse para fazer carinho ou clique para mudar a direção`}
      className={`pokemon-pixel pokemon-pixel--${direction}`}
      style={{
        "--pokemon-delay": `${pokemon.delay}s`,
        "--pokemon-duration": `${pokemon.duration}s`,
        "--pokemon-size": `${pokemon.size}px`,
        "--pokemon-top": `${pokemon.top}%`,
      }}
      onClick={() => setDirection((current) => current === "right" ? "left" : "right")}
      onPointerEnter={() => setIsInteracting(true)}
      onPointerLeave={() => setIsInteracting(false)}
    >
      <span className="pokemon-pixel__heart" aria-hidden="true">♥</span>
      <Image
        src={isInteracting ? pokemon.idleSrc : pokemon.walkSrc}
        alt=""
        width={96}
        height={96}
        unoptimized
        draggable={false}
      />
    </button>
  );
}

export default function PokemonPixelWorld() {
  const [pokemon, setPokemon] = useState([]);
  const [lanes, setLanes] = useState({ header: null, footer: null });

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/pokemon-pixels", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((availablePokemon) => {
        setLanes({
          header: document.querySelector("[data-pokemon-pixel-header]"),
          footer: document.querySelector("[data-pokemon-pixel-footer]"),
        });
        setPokemon(
          pickRandomPokemon(availablePokemon).map(createPokemonPixel)
        );
      })
      .catch((error) => {
        if (error?.name !== "AbortError") setPokemon([]);
      });

    return () => controller.abort();
  }, []);

  if (!pokemon.length || !lanes.header || !lanes.footer) return null;

  const halfway = Math.ceil(pokemon.length / 2);
  const headerPokemon = pokemon.slice(0, halfway);
  const footerPokemon = pokemon.slice(halfway);

  return (
    <>
      {createPortal(
        <div className="pokemon-pixel-lane" aria-label="Pokémon caminhando no cabeçalho">
          {headerPokemon.map((currentPokemon) => (
            <PokemonPixel
              key={currentPokemon.instanceId}
              pokemon={currentPokemon}
            />
          ))}
        </div>,
        lanes.header
      )}
      {createPortal(
        <div className="pokemon-pixel-lane" aria-label="Pokémon caminhando no rodapé">
          {footerPokemon.map((currentPokemon) => (
            <PokemonPixel
              key={currentPokemon.instanceId}
              pokemon={currentPokemon}
            />
          ))}
        </div>,
        lanes.footer
      )}
    </>
  );
}
