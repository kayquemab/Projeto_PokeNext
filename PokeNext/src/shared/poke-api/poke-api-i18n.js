import { getPokeApiResourceId } from "./poke-api.client";
import abilityNamesPtBr from "./locales/pt-br/ability-names.json";
import moveNamesPtBr from "./locales/pt-br/move-names.json";

export const POKE_API_LOCALES = ["pt-br", "pt"];

export const TYPE_LABELS_PT_BR = {
  bug: "Inseto",
  dark: "Sombrio",
  dragon: "Dragão",
  electric: "Elétrico",
  fairy: "Fada",
  fighting: "Lutador",
  fire: "Fogo",
  flying: "Voador",
  ghost: "Fantasma",
  grass: "Planta",
  ground: "Terra",
  ice: "Gelo",
  normal: "Normal",
  poison: "Veneno",
  psychic: "Psíquico",
  rock: "Pedra",
  shadow: "Sombra",
  steel: "Aço",
  stellar: "Estelar",
  unknown: "Desconhecido",
  water: "Água",
};

export const STAT_LABELS_PT_BR = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Ataque Especial",
  "special-defense": "Defesa Especial",
  speed: "Velocidade",
  accuracy: "Precisão",
  evasion: "Evasão",
};

export const DAMAGE_CLASS_LABELS_PT_BR = {
  physical: "Físico",
  special: "Especial",
  status: "Estado",
};

export const CONTEST_TYPE_LABELS_PT_BR = {
  cool: "Carisma",
  beauty: "Beleza",
  cute: "Fofura",
  smart: "Inteligência",
  tough: "Resistência",
};

export const AILMENT_LABELS_PT_BR = {
  unknown: "Desconhecido",
  none: "Nenhuma condição",
  paralysis: "Paralisia",
  sleep: "Sono",
  freeze: "Congelamento",
  burn: "Queimadura",
  poison: "Envenenamento",
  confusion: "Confusão",
  infatuation: "Paixão",
  trap: "Aprisionamento",
  nightmare: "Pesadelo",
  torment: "Tormento",
  disable: "Bloqueio",
  yawn: "Bocejo",
  "heal-block": "Bloqueio de cura",
  "no-type-immunity": "Sem imunidade de tipo",
  "leech-seed": "Semente sanguessuga",
  embargo: "Embargo",
  "perish-song": "Canção do perecimento",
  ingrain: "Enraizamento",
  silence: "Silêncio",
};

export const MOVE_TARGET_LABELS_PT_BR = {
  "specific-move": "Movimento específico",
  "selected-pokemon-me-first": "Pokémon selecionado",
  ally: "Aliado",
  "users-field": "Campo do usuário",
  "user-or-ally": "Usuário ou aliado",
  "opponents-field": "Campo adversário",
  user: "Usuário",
  "random-opponent": "Adversário aleatório",
  "all-other-pokemon": "Todos os outros Pokémon",
  "selected-pokemon": "Pokémon selecionado",
  "all-opponents": "Todos os adversários",
  "entire-field": "Campo inteiro",
  "user-and-allies": "Usuário e aliados",
  "all-pokemon": "Todos os Pokémon",
  "all-allies": "Todos os aliados",
  "fainting-pokemon": "Pokémon desmaiando",
};

export const MOVE_CATEGORY_LABELS_PT_BR = {
  damage: "Dano",
  ailment: "Condição de estado",
  "net-good-stats": "Alteração positiva de atributos",
  heal: "Cura",
  "damage+ailment": "Dano e condição de estado",
  swagger: "Confusão e aumento de atributo",
  "damage+lower": "Dano e redução de atributo",
  "damage+raise": "Dano e aumento de atributo",
  "damage+heal": "Dano e recuperação",
  ohko: "Nocaute em um golpe",
  "whole-field-effect": "Efeito no campo inteiro",
  "field-effect": "Efeito de campo",
  "force-switch": "Troca forçada",
  unique: "Efeito único",
};

const FORM_LABELS_PT_BR = {
  alola: "Alola",
  galar: "Galar",
  hisui: "Hisui",
  paldea: "Paldea",
  mega: "Mega",
  gmax: "Gigamax",
  primal: "Primitiva",
  origin: "Origem",
  therian: "Therian",
  incarnate: "Encarnação",
  totem: "Totem",
  "battle-bond": "Vínculo de Batalha",
  ash: "Ash",
  crowned: "Coroada",
  eternamax: "Eternamax",
  ultra: "Ultra",
  dusk: "Crepúsculo",
  dawn: "Alvorada",
  midnight: "Meia-noite",
  midday: "Meio-dia",
  school: "Cardume",
  normal: "Normal",
  attack: "Ataque",
  defense: "Defesa",
  speed: "Velocidade",
  plant: "Planta",
  sandy: "Areia",
  trash: "Lixo",
  sunny: "Ensolarada",
  rainy: "Chuvosa",
  snowy: "Nevosa",
  land: "Terrestre",
  sky: "Celeste",
  altered: "Alterada",
  heat: "Calor",
  wash: "Lavagem",
  frost: "Geada",
  fan: "Ventilador",
  mow: "Cortador",
  east: "Leste",
  west: "Oeste",
  standard: "Padrão",
  zen: "Zen",
  aria: "Ária",
  pirouette: "Pirueta",
  blade: "Lâmina",
  shield: "Escudo",
  small: "Pequena",
  average: "Média",
  large: "Grande",
  complete: "Completa",
  solo: "Solo",
  disguised: "Disfarçada",
  busted: "Revelada",
  amped: "Eletrizada",
  "low-key": "Discreta",
  ice: "Gelo",
  noice: "Sem Gelo",
  male: "Macho",
  female: "Fêmea",
  "full-belly": "Barriga Cheia",
  hangry: "Faminta",
  dada: "Dada",
  hero: "Heroica",
  zero: "Ingênua",
  chest: "Baú",
  roaming: "Itinerante",
  curly: "Curvada",
  droopy: "Caída",
  stretchy: "Alongada",
  terastal: "Terastal",
  "red-striped": "Listras Vermelhas",
  "blue-striped": "Listras Azuis",
  "white-striped": "Listras Brancas",
  "galar-standard": "Padrão de Galar",
  "galar-zen": "Zen de Galar",
  "single-strike": "Golpe Único",
  "rapid-strike": "Golpe Rápido",
  "ice-rider": "Cavaleiro Glacial",
  "shadow-rider": "Cavaleiro Espectral",
  "family-of-three": "Família de Três",
  "family-of-four": "Família de Quatro",
  "two-segment": "Dois Segmentos",
  "three-segment": "Três Segmentos",
  "combat-breed": "Raça de Combate",
  "blaze-breed": "Raça de Fogo",
  "aqua-breed": "Raça Aquática",
  "paldea-combat-breed": "Raça de Combate de Paldea",
  "paldea-blaze-breed": "Raça de Fogo de Paldea",
  "paldea-aqua-breed": "Raça Aquática de Paldea",
  "red-meteor": "Meteoro Vermelho",
  "orange-meteor": "Meteoro Laranja",
  "yellow-meteor": "Meteoro Amarelo",
  "green-meteor": "Meteoro Verde",
  "blue-meteor": "Meteoro Azul",
  "indigo-meteor": "Meteoro Índigo",
  "violet-meteor": "Meteoro Violeta",
  "red-core": "Núcleo Vermelho",
  "orange-core": "Núcleo Laranja",
  "yellow-core": "Núcleo Amarelo",
  "green-core": "Núcleo Verde",
  "blue-core": "Núcleo Azul",
  "indigo-core": "Núcleo Índigo",
  "violet-core": "Núcleo Violeta",
};

const EXACT_POKEMON_NAMES = {
  "nidoran-f": "Nidoran ♀",
  "nidoran-m": "Nidoran ♂",
  farfetchd: "Farfetch'd",
  sirfetchd: "Sirfetch'd",
  "mr-mime": "Mr. Mime",
  "mime-jr": "Mime Jr.",
  "mr-rime": "Mr. Rime",
  "ho-oh": "Ho-Oh",
  "porygon-z": "Porygon-Z",
  "type-null": "Type: Null",
  "jangmo-o": "Jangmo-o",
  "hakamo-o": "Hakamo-o",
  "kommo-o": "Kommo-o",
  "wo-chien": "Wo-Chien",
  "chien-pao": "Chien-Pao",
  "ting-lu": "Ting-Lu",
  "chi-yu": "Chi-Yu",
};

// Termos recorrentes permitem apresentar identificadores compostos em português
// mesmo quando o recurso ainda não possui localização pt-BR na própria PokeAPI.
const IDENTIFIER_WORDS_PT_BR = {
  absorb: "absorção",
  acid: "ácido",
  aerial: "aéreo",
  air: "ar",
  aqua: "aquático",
  armor: "armadura",
  attack: "ataque",
  aura: "aura",
  avalanche: "avalanche",
  ball: "esfera",
  barrier: "barreira",
  battle: "batalha",
  beam: "raio",
  berry: "fruta",
  bite: "mordida",
  blast: "explosão",
  blaze: "chama",
  body: "corpo",
  bomb: "bomba",
  bone: "osso",
  boost: "impulso",
  brave: "corajoso",
  break: "quebra",
  breath: "sopro",
  bubble: "bolha",
  bug: "inseto",
  bullet: "projétil",
  burn: "queimadura",
  cannon: "canhão",
  charge: "carga",
  charm: "encanto",
  claw: "garra",
  clear: "límpido",
  cloud: "nuvem",
  coat: "revestimento",
  color: "cor",
  confusion: "confusão",
  cosmic: "cósmico",
  cotton: "algodão",
  counter: "contra-ataque",
  crash: "impacto",
  cure: "cura",
  cut: "corte",
  cutter: "cortador",
  dance: "dança",
  dark: "sombrio",
  day: "dia",
  defense: "defesa",
  detect: "detecção",
  double: "duplo",
  dragon: "dragão",
  drain: "dreno",
  dream: "sonho",
  drill: "broca",
  dry: "seco",
  dust: "poeira",
  earth: "terra",
  edge: "lâmina",
  electric: "elétrico",
  energy: "energia",
  eruption: "erupção",
  explosion: "explosão",
  eyes: "olhos",
  fairy: "fada",
  fang: "presa",
  fast: "rápido",
  feather: "pena",
  fire: "fogo",
  fist: "punho",
  flame: "chama",
  flash: "clarão",
  flower: "flor",
  focus: "foco",
  force: "força",
  freeze: "congelamento",
  frost: "geada",
  fury: "fúria",
  gas: "gás",
  giga: "giga",
  grass: "planta",
  grip: "aperto",
  growl: "rosnado",
  guard: "proteção",
  gun: "jato",
  gust: "rajada",
  hammer: "martelo",
  head: "cabeça",
  heal: "cura",
  healing: "cura",
  heat: "calor",
  heavy: "pesado",
  hidden: "oculto",
  high: "alto",
  horn: "chifre",
  hydro: "hidro",
  hyper: "hiper",
  hypnosis: "hipnose",
  ice: "gelo",
  immunity: "imunidade",
  impact: "impacto",
  intimidate: "intimidação",
  iron: "ferro",
  jet: "jato",
  jump: "salto",
  kick: "chute",
  leaf: "folha",
  leech: "sanguessuga",
  life: "vida",
  light: "luz",
  lightning: "relâmpago",
  look: "olhar",
  low: "baixo",
  lunar: "lunar",
  magic: "mágico",
  magnet: "ímã",
  mega: "mega",
  metal: "metal",
  meteor: "meteoro",
  mind: "mente",
  mirror: "espelho",
  mist: "névoa",
  moon: "lua",
  morning: "manhã",
  mud: "lama",
  natural: "natural",
  night: "noite",
  nightmare: "pesadelo",
  normal: "normal",
  ocean: "oceano",
  overgrow: "crescimento",
  paralysis: "paralisia",
  pay: "pagamento",
  petal: "pétala",
  pinch: "pinça",
  poison: "veneno",
  powder: "pó",
  power: "poder",
  pressure: "pressão",
  protect: "proteção",
  psychic: "psíquico",
  pulse: "pulso",
  punch: "soco",
  quick: "rápido",
  rain: "chuva",
  rapid: "veloz",
  razor: "navalha",
  recover: "recuperação",
  rest: "descanso",
  rock: "pedra",
  rod: "para-raios",
  roll: "rolamento",
  sand: "areia",
  scratch: "arranhão",
  screen: "tela",
  seed: "semente",
  shadow: "sombra",
  shell: "casco",
  shield: "escudo",
  shock: "choque",
  shot: "disparo",
  skin: "pele",
  sky: "céu",
  slam: "pancada",
  slash: "talho",
  sleep: "sono",
  sludge: "lodo",
  solar: "solar",
  sonic: "sônico",
  sound: "som",
  spark: "faísca",
  special: "especial",
  speed: "velocidade",
  spin: "giro",
  spore: "esporo",
  steel: "aço",
  sting: "ferrão",
  stone: "pedra",
  storm: "tempestade",
  strength: "força",
  sturdy: "robustez",
  sun: "sol",
  super: "super",
  surf: "surfe",
  swarm: "enxame",
  swift: "veloz",
  sword: "espada",
  swords: "espadas",
  tackle: "investida",
  tail: "cauda",
  telepathy: "telepatia",
  teleport: "teleporte",
  terrain: "terreno",
  thick: "espesso",
  thunder: "trovão",
  toxic: "tóxico",
  transform: "transformação",
  tri: "triplo",
  triple: "triplo",
  turbo: "turbo",
  veil: "véu",
  vine: "cipó",
  voice: "voz",
  volt: "volt",
  water: "água",
  wave: "onda",
  whip: "chicote",
  whirlwind: "redemoinho",
  wind: "vento",
  wing: "asa",
  wings: "asas",
  wonder: "maravilha",
  wood: "madeira",
  x: "X",
  y: "Y",
  zap: "elétrico",
  zero: "zero",
};

const EXACT_MOVE_NAMES_PT_BR = {
  "thunder-shock": "Choque do Trov\u00e3o",
  thunderbolt: "Raio",
  flamethrower: "Lan\u00e7a-chamas",
  pound: "Pancada",
  "karate-chop": "Golpe de Caratê",
  "double-slap": "Tapa Duplo",
  "comet-punch": "Soco Cometa",
  "mega-punch": "Mega Soco",
  "pay-day": "Dia de Pagamento",
  "fire-punch": "Soco de Fogo",
  "ice-punch": "Soco de Gelo",
  "thunder-punch": "Soco do Trovão",
  "vice-grip": "Aperto de Pinça",
  "razor-wind": "Vento Cortante",
  "swords-dance": "Dança das Espadas",
  "wing-attack": "Ataque de Asa",
  "vine-whip": "Chicote de Cipó",
  "double-kick": "Chute Duplo",
  "jump-kick": "Chute em Salto",
  "sand-attack": "Ataque de Areia",
  "headbutt": "Cabeçada",
  "horn-attack": "Ataque de Chifre",
  "body-slam": "Pancada Corporal",
  "take-down": "Derrubada",
  "double-edge": "Ataque de Risco",
  "tail-whip": "Chicote de Cauda",
  "poison-sting": "Ferrão Venenoso",
  "pin-missile": "Míssil de Espinhos",
  "water-gun": "Jato de Água",
  "hydro-pump": "Hidrobomba",
  "ice-beam": "Raio de Gelo",
  "hyper-beam": "Hiper-raio",
  "solar-beam": "Raio Solar",
  "quick-attack": "Ataque Rápido",
  "night-shade": "Sombra Noturna",
  "double-team": "Equipe Dupla",
  "smokescreen": "Cortina de Fumaça",
  "light-screen": "Tela de Luz",
  "focus-energy": "Energia Focada",
  "self-destruct": "Autodestruição",
  "fire-blast": "Explosão de Fogo",
  "skull-bash": "Golpe de Crânio",
  "high-jump-kick": "Chute de Salto Alto",
  "dream-eater": "Comedor de Sonhos",
  "poison-gas": "Gás Venenoso",
  "leech-life": "Dreno de Vida",
  "sky-attack": "Ataque Celeste",
  "acid-armor": "Armadura Ácida",
  "rock-slide": "Deslizamento de Pedras",
  "tri-attack": "Ataque Triplo",
  "flame-wheel": "Roda de Fogo",
  "cotton-spore": "Esporo de Algodão",
  "powder-snow": "Neve em Pó",
  "mach-punch": "Soco Veloz",
  "scary-face": "Cara Assustadora",
  "sweet-kiss": "Beijo Doce",
  "sludge-bomb": "Bomba de Lodo",
  "mud-slap": "Tapa de Lama",
  "destiny-bond": "Vínculo do Destino",
  "perish-song": "Canção do Perecimento",
  "icy-wind": "Vento Gelado",
  "bone-rush": "Rajada de Ossos",
  "rain-dance": "Dança da Chuva",
  "sunny-day": "Dia Ensolarado",
  "iron-tail": "Cauda de Ferro",
  "metal-claw": "Garra de Metal",
  "morning-sun": "Sol da Manhã",
  "hidden-power": "Poder Oculto",
  "dragon-breath": "Sopro do Dragão",
  "rapid-spin": "Giro Rápido",
  "sweet-scent": "Aroma Doce",
  "sacred-fire": "Fogo Sagrado",
  "baton-pass": "Passagem de Bastão",
  "ancient-power": "Poder Ancestral",
  "shadow-ball": "Esfera Sombria",
  "future-sight": "Visão do Futuro",
  "rock-smash": "Quebra-Rocha",
  "whirlpool": "Redemoinho",
  "fake-out": "Fingimento",
  "heat-wave": "Onda de Calor",
  "will-o-wisp": "Fogo-fátuo",
  "facade": "Fachada",
  "focus-punch": "Soco Focado",
  "brick-break": "Quebra-Tijolo",
  "knock-off": "Desarme",
  "secret-power": "Poder Secreto",
  "air-cutter": "Cortador de Ar",
  "overheat": "Superaquecimento",
  "rock-tomb": "Tumba de Pedra",
  "aerial-ace": "Ás Aéreo",
  "dragon-claw": "Garra do Dragão",
  "calm-mind": "Mente Calma",
  "leaf-blade": "Lâmina de Folha",
  "dragon-dance": "Dança do Dragão",
  "roost": "Poleiro",
  "close-combat": "Combate Corpo a Corpo",
  "aura-sphere": "Esfera de Aura",
  "dark-pulse": "Pulso Sombrio",
  "air-slash": "Talho Aéreo",
  "bug-buzz": "Zumbido de Inseto",
  "energy-ball": "Esfera de Energia",
  "earth-power": "Poder da Terra",
  "giga-impact": "Impacto Giga",
  "flash-cannon": "Canhão de Luz",
  "stone-edge": "Lâmina de Pedra",
  "stealth-rock": "Pedra Furtiva",
  "grass-knot": "Nó de Grama",
  "charge-beam": "Raio de Carga",
  "heavy-slam": "Pancada Pesada",
  "electro-ball": "Esfera Elétrica",
  "flame-charge": "Carga de Chamas",
  "low-sweep": "Rasteira",
  "acid-spray": "Jato Ácido",
  "acrobatics": "Acrobacia",
  "volt-switch": "Troca Voltaica",
  "bulldoze": "Escavação",
  "dragon-tail": "Cauda do Dragão",
  "wild-charge": "Carga Selvagem",
  "draining-kiss": "Beijo Drenante",
  "misty-terrain": "Terreno Nebuloso",
  "grassy-terrain": "Terreno de Grama",
  "electric-terrain": "Terreno Elétrico",
  "psychic-terrain": "Terreno Psíquico",
  "moonblast": "Explosão Lunar",
  "dazzling-gleam": "Brilho Deslumbrante",
  "play-rough": "Jogo Duro",
  "smart-strike": "Golpe Certeiro",
  "solar-blade": "Lâmina Solar",
  "liquidation": "Liquidação",
  "body-press": "Pressão Corporal",
  "breaking-swipe": "Golpe Quebrador",
  "meteor-beam": "Raio Meteoro",
  "tera-blast": "Explosão Tera",
};

const EXACT_ABILITY_NAMES_PT_BR = {
  stench: "Mau Cheiro",
  drizzle: "Garoa",
  "speed-boost": "Impulso de Velocidade",
  "battle-armor": "Armadura de Batalha",
  sturdy: "Robustez",
  damp: "Umidade",
  limber: "Flexibilidade",
  "sand-veil": "Véu de Areia",
  static: "Eletricidade Estática",
  "volt-absorb": "Absorção de Eletricidade",
  "water-absorb": "Absorção de Água",
  oblivious: "Indiferença",
  "cloud-nine": "Céu Limpo",
  "compound-eyes": "Olhos Compostos",
  insomnia: "Insônia",
  "color-change": "Mudança de Cor",
  immunity: "Imunidade",
  "flash-fire": "Absorção de Fogo",
  "shield-dust": "Poeira Protetora",
  "own-tempo": "Ritmo Próprio",
  "suction-cups": "Ventosas",
  intimidate: "Intimidação",
  "shadow-tag": "Marca Sombria",
  "rough-skin": "Pele Áspera",
  "wonder-guard": "Proteção Maravilhosa",
  levitate: "Levitação",
  "effect-spore": "Efeito Esporo",
  synchronize: "Sincronia",
  "clear-body": "Corpo Límpido",
  "natural-cure": "Cura Natural",
  "lightning-rod": "Para-raios",
  "serene-grace": "Graça Serena",
  "swift-swim": "Nado Veloz",
  chlorophyll: "Clorofila",
  illuminate: "Iluminação",
  trace: "Rastreamento",
  "huge-power": "Poder Imenso",
  "poison-point": "Ponta Venenosa",
  "inner-focus": "Foco Interior",
  "magma-armor": "Armadura de Magma",
  "water-veil": "Véu de Água",
  "magnet-pull": "Atração Magnética",
  soundproof: "À Prova de Som",
  "rain-dish": "Prato de Chuva",
  "sand-stream": "Corrente de Areia",
  pressure: "Pressão",
  "thick-fat": "Gordura Espessa",
  "early-bird": "Madrugador",
  "flame-body": "Corpo em Chamas",
  "run-away": "Fuga",
  "keen-eye": "Olhar Aguçado",
  "hyper-cutter": "Cortador Potente",
  pickup: "Coleta",
  truant: "Preguiça",
  hustle: "Entusiasmo",
  "cute-charm": "Charme Fofo",
  plus: "Mais",
  minus: "Menos",
  forecast: "Previsão",
  "sticky-hold": "Aderência",
  "shed-skin": "Troca de Pele",
  guts: "Coragem",
  "marvel-scale": "Escama Maravilhosa",
  "liquid-ooze": "Lodo Líquido",
  overgrow: "Crescimento",
  blaze: "Chama",
  torrent: "Torrente",
  swarm: "Enxame",
  "rock-head": "Cabeça de Pedra",
  drought: "Seca",
  "arena-trap": "Armadilha de Arena",
  "vital-spirit": "Espírito Vital",
  "white-smoke": "Fumaça Branca",
  "pure-power": "Poder Puro",
  "shell-armor": "Armadura de Casco",
  "air-lock": "Bloqueio de Ar",
  adaptability: "Adaptabilidade",
  "skill-link": "Ligação de Habilidade",
  hydration: "Hidratação",
  "solar-power": "Poder Solar",
  "quick-feet": "Pés Rápidos",
  "motor-drive": "Motor Elétrico",
  rivalry: "Rivalidade",
  steadfast: "Firmeza",
  "snow-cloak": "Manto de Neve",
  gluttony: "Gula",
  "anger-point": "Ponto de Fúria",
  unburden: "Alívio",
  heatproof: "Resistência ao Calor",
  simple: "Simplicidade",
  "dry-skin": "Pele Seca",
  download: "Transferência",
  "iron-fist": "Punho de Ferro",
  "poison-heal": "Cura Venenosa",
  anticipation: "Antecipação",
  forewarn: "Pressentimento",
  unaware: "Desatenção",
  "tinted-lens": "Lente Colorida",
  filter: "Filtro",
  scrappy: "Valentia",
  sniper: "Precisão Crítica",
  "magic-guard": "Proteção Mágica",
  "no-guard": "Sem Proteção",
  stall: "Atraso",
  technician: "Técnico",
  "leaf-guard": "Proteção de Folha",
  klutz: "Desajeitado",
  "mold-breaker": "Quebra-Molde",
  "super-luck": "Super Sorte",
  aftermath: "Consequência",
  "honey-gather": "Coleta de Mel",
  frisk: "Inspeção",
  reckless: "Imprudência",
  multitype: "Multitipo",
  "flower-gift": "Presente Floral",
  "bad-dreams": "Pesadelos",
};

function normalizeLanguage(language) {
  return String(language || "").trim().toLowerCase();
}

function capitalizeWords(value) {
  return String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getLocalizedEntry(entries, fields) {
  const list = Array.isArray(entries) ? entries : [];
  const requestedFields = Array.isArray(fields) ? fields : [fields];

  for (const locale of POKE_API_LOCALES) {
    const entry = list.find(
      (item) => normalizeLanguage(item?.language?.name) === locale
    );

    if (!entry) continue;

    for (const field of requestedFields) {
      if (entry?.[field]) {
        return String(entry[field]).replace(/\f|\n|\r/g, " ").trim();
      }
    }
  }

  return "";
}

export function getLocalizedName(resource) {
  return getLocalizedEntry(resource?.names, "name");
}

export function translateTypeName(identifier) {
  return TYPE_LABELS_PT_BR[identifier] || "Tipo desconhecido";
}

export function translateStatName(identifier) {
  return STAT_LABELS_PT_BR[identifier] || "Atributo desconhecido";
}

function translateCompoundIdentifier(identifier) {
  const tokens = String(identifier || "").toLowerCase().split("-").filter(Boolean);
  const translatedTokens = tokens.map((token) => IDENTIFIER_WORDS_PT_BR[token]);

  if (!tokens.length || translatedTokens.some((token) => !token)) {
    return "";
  }

  return capitalizeWords(translatedTokens.join(" "));
}

function getFallbackResourceLabel(kind, resource) {
  const id = resource?.id || getPokeApiResourceId(resource);
  const labels = {
    ability: "Habilidade",
    move: "Movimento",
    item: "Item",
    version: "Versão",
    generation: "Geração",
    resource: "Informação",
  };
  const label = labels[kind] || labels.resource;

  return id ? `${label} #${id}` : `${label} sem tradução`;
}

export function translatePokeApiResourceName(resource, kind = "resource") {
  const identifier = typeof resource === "string" ? resource : resource?.name;
  const localizedName = typeof resource === "object" ? getLocalizedName(resource) : "";

  if (localizedName) return localizedName;
  if (kind === "pokemon") return formatPokemonName(identifier);
  if (kind === "type") return translateTypeName(identifier);
  if (kind === "stat") return translateStatName(identifier);
  if (kind === "damage-class") {
    return DAMAGE_CLASS_LABELS_PT_BR[identifier] || "Classe desconhecida";
  }
  if (kind === "contest-type") {
    return CONTEST_TYPE_LABELS_PT_BR[identifier] || "Concurso desconhecido";
  }
  if (kind === "ailment") {
    return AILMENT_LABELS_PT_BR[identifier] || "Condição desconhecida";
  }
  if (kind === "move-target") {
    return MOVE_TARGET_LABELS_PT_BR[identifier] || "Alvo desconhecido";
  }
  if (kind === "move-category") {
    return MOVE_CATEGORY_LABELS_PT_BR[identifier] || "Categoria desconhecida";
  }

  const exactNames =
    kind === "move"
      ? EXACT_MOVE_NAMES_PT_BR
      : kind === "ability"
        ? EXACT_ABILITY_NAMES_PT_BR
        : {};
  const exactName = exactNames[identifier];
  if (exactName) return exactName;

  const catalogNames =
    kind === "move"
      ? moveNamesPtBr
      : kind === "ability"
        ? abilityNamesPtBr
        : {};
  const catalogName = catalogNames[identifier];
  if (catalogName) return catalogName;

  const compoundName = translateCompoundIdentifier(identifier);
  return compoundName || getFallbackResourceLabel(kind, resource);
}

export function formatPokemonName(identifier) {
  const value = String(identifier || "").trim();
  if (!value) return "Pokémon desconhecido";

  const normalizedValue = value.toLowerCase();
  const exactName = EXACT_POKEMON_NAMES[normalizedValue];
  if (exactName) return exactName;

  const exactSuffix = Object.keys(FORM_LABELS_PT_BR)
    .sort((a, b) => b.length - a.length)
    .find((suffix) => normalizedValue.endsWith(`-${suffix}`));

  if (!exactSuffix) {
    return capitalizeWords(value.replace(/-/g, " "));
  }

  const baseName = value.slice(0, -(exactSuffix.length + 1));
  return `${formatPokemonName(baseName)} — ${FORM_LABELS_PT_BR[exactSuffix]}`;
}
