export const TYPE_STYLES = {
  bug: "bg-[#A8B820] text-white",
  dragon: "bg-[#7038F8] text-white",
  fairy: "bg-[#EE99AC] text-white",
  fire: "bg-[#F08030] text-white",
  ghost: "bg-[#705898] text-white",
  ground: "bg-[#E0C068] text-white",
  normal: "bg-[#A8A878] text-white",
  psychic: "bg-[#F85888] text-white",
  steel: "bg-[#B8B8D0] text-white",
  dark: "bg-[#705848] text-white",
  electric: "bg-[#F8D030] text-white",
  fighting: "bg-[#C03028] text-white",
  flying: "bg-[#A890F0] text-white",
  grass: "bg-[#78C850] text-white",
  ice: "bg-[#98D8D8] text-white",
  poison: "bg-[#A040A0] text-white",
  rock: "bg-[#B8A038] text-white",
  water: "bg-[#6890F0] text-white",
  default: "bg-neutral-400 text-white",
};

export const TYPE_COLORS = {
  bug: "#A8B820",
  dragon: "#7038F8",
  fairy: "#EE99AC",
  fire: "#F08030",
  ghost: "#705898",
  ground: "#E0C068",
  normal: "#A8A878",
  psychic: "#F85888",
  steel: "#B8B8D0",
  dark: "#705848",
  electric: "#F8D030",
  fighting: "#C03028",
  flying: "#A890F0",
  grass: "#78C850",
  ice: "#98D8D8",
  poison: "#A040A0",
  rock: "#B8A038",
  water: "#6890F0",
  default: "#D3D3D3",
};

export const STAT_CONFIG = [
  { name: "hp", label: "HP", shortLabel: "HP" },
  { name: "attack", label: "Ataque", shortLabel: "ATQ" },
  { name: "defense", label: "Defesa", shortLabel: "DEF" },
  { name: "special-attack", label: "Ataque Especial", shortLabel: "ATQ. ESP." },
  { name: "special-defense", label: "Defesa Especial", shortLabel: "DEF. ESP." },
  { name: "speed", label: "Velocidade", shortLabel: "VEL" },
];

export function getTypeClass(typeName) {
  return TYPE_STYLES[typeName] || TYPE_STYLES.default;
}
