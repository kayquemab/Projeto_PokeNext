// src/app/Regioes/[regioesId]/page.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
    ChevronLeft,
    ChevronRight,
    MapPinned,
    Sparkles,
    Swords,
    Crown,
    Shuffle,
} from "lucide-react";

/* =========================
   Helpers (estilo parecido, mas não “copiado”)
========================= */

const TYPE_STYLES = {
    grass: "bg-[#78C850] text-black",
    poison: "bg-[#A040A0] text-white",
    fire: "bg-[#F08030] text-white",
    water: "bg-[#6890F0] text-white",
    electric: "bg-[#F8D030] text-black",
    flying: "bg-[#A890F0] text-black",
    ice: "bg-[#98D8D8] text-black",
    bug: "bg-[#A8B820] text-black",
    normal: "bg-[#A8A878] text-black",
    fighting: "bg-[#C03028] text-white",
    psychic: "bg-[#F85888] text-white",
    rock: "bg-[#B8A038] text-black",
    ground: "bg-[#E0C068] text-black",
    ghost: "bg-[#705898] text-white",
    dragon: "bg-[#7038F8] text-white",
    dark: "bg-[#705848] text-white",
    steel: "bg-[#B8B8D0] text-black",
    fairy: "bg-[#EE99AC] text-black",
    default: "bg-neutral-300 text-neutral-900",
};

function getTypeClass(typeName) {
    return TYPE_STYLES[typeName] || TYPE_STYLES.default;
}

function formatName(name) {
    return String(name || "")
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickN(arr, n) {
    return shuffleArray(arr).slice(0, Math.max(0, n));
}

function extractIdFromUrl(url) {
    const m = String(url || "").match(/\/(\d+)\/?$/);
    return m ? Number(m[1]) : null;
}

/* =========================
   Dados das regiões (UI + integração)
   - leaders/teams: mock “bonito” (você pode refinar depois)
   - carousel: pega 12 aleatórios via PokeAPI (pokedex/{name})
========================= */

const REGIOES = [
    {
        id: "kanto",
        nome: "Kanto",
        geracao: "Geração I",
        icone: "/pokedexicons/kanto.svg",
        banner: "/regioes/kanto.jpeg",
        // use sua imagem do mapa mundi aqui:
        mapaMundi: "/regioes/mapa-mundi.png",
        // três imagens por região (fallback: usa o banner)
        heroImages: ["/regioes/kanto.jpeg", "/regioes/kanto.jpeg", "/regioes/kanto.jpeg"],
        // PokeAPI pokedex
        pokedexName: "kanto",
        starters: [
            { id: 1, name: "bulbasaur", types: ["grass", "poison"] },
            { id: 4, name: "charmander", types: ["fire"] },
            { id: 7, name: "squirtle", types: ["water"] },
        ],
        gymLeaders: [
            {
                name: "Brock",
                city: "Pewter City",
                badge: "Boulder Badge",
                mainType: "rock",
                team: [
                    { id: 74, name: "geodude", types: ["rock", "ground"] },
                    { id: 95, name: "onix", types: ["rock", "ground"] },
                ],
            },
            {
                name: "Misty",
                city: "Cerulean City",
                badge: "Cascade Badge",
                mainType: "water",
                team: [
                    { id: 120, name: "staryu", types: ["water"] },
                    { id: 121, name: "starmie", types: ["water", "psychic"] },
                ],
            },
            {
                name: "Lt. Surge",
                city: "Vermilion City",
                badge: "Thunder Badge",
                mainType: "electric",
                team: [
                    { id: 25, name: "pikachu", types: ["electric"] },
                    { id: 26, name: "raichu", types: ["electric"] },
                ],
            },
            {
                name: "Erika",
                city: "Celadon City",
                badge: "Rainbow Badge",
                mainType: "grass",
                team: [
                    { id: 71, name: "victreebel", types: ["grass", "poison"] },
                    { id: 114, name: "tangela", types: ["grass"] },
                ],
            },
            {
                name: "Koga",
                city: "Fuchsia City",
                badge: "Soul Badge",
                mainType: "poison",
                team: [
                    { id: 109, name: "koffing", types: ["poison"] },
                    { id: 110, name: "weezing", types: ["poison"] },
                ],
            },
            {
                name: "Sabrina",
                city: "Saffron City",
                badge: "Marsh Badge",
                mainType: "psychic",
                team: [
                    { id: 64, name: "kadabra", types: ["psychic"] },
                    { id: 65, name: "alakazam", types: ["psychic"] },
                ],
            },
            {
                name: "Blaine",
                city: "Cinnabar Island",
                badge: "Volcano Badge",
                mainType: "fire",
                team: [
                    { id: 58, name: "growlithe", types: ["fire"] },
                    { id: 59, name: "arcanine", types: ["fire"] },
                ],
            },
            {
                name: "Giovanni",
                city: "Viridian City",
                badge: "Earth Badge",
                mainType: "ground",
                team: [
                    { id: 31, name: "nidoqueen", types: ["poison", "ground"] },
                    { id: 34, name: "nidoking", types: ["poison", "ground"] },
                    { id: 112, name: "rhydon", types: ["ground", "rock"] },
                ],
            },
        ],
        legendaries: [
            { id: 144, name: "articuno", types: ["ice", "flying"] },
            { id: 145, name: "zapdos", types: ["electric", "flying"] },
            { id: 146, name: "moltres", types: ["fire", "flying"] },
            { id: 150, name: "mewtwo", types: ["psychic"] },
            { id: 151, name: "mew", types: ["psychic"] },
        ],
    },

    // As demais regiões (estrutura completa).
    // Você pode refinar leaders/teams depois. O layout já suporta tudo.
    {
        id: "johto",
        nome: "Johto",
        geracao: "Geração II",
        icone: "/pokedexicons/johto.svg",
        banner: "/regioes/johto.jpeg",
        mapaMundi: "/regioes/mapa-mundi.png",
        heroImages: ["/regioes/johto.jpeg", "/regioes/johto.jpeg", "/regioes/johto.jpeg"],
        pokedexName: "original-johto",
        starters: [
            { id: 152, name: "chikorita", types: ["grass"] },
            { id: 155, name: "cyndaquil", types: ["fire"] },
            { id: 158, name: "totodile", types: ["water"] },
        ],
        gymLeaders: [
            { name: "Falkner", city: "Violet City", badge: "Zephyr Badge", mainType: "flying", team: [{ id: 16, name: "pidgey", types: ["normal", "flying"] }, { id: 17, name: "pidgeotto", types: ["normal", "flying"] }] },
            { name: "Bugsy", city: "Azalea Town", badge: "Hive Badge", mainType: "bug", team: [{ id: 11, name: "metapod", types: ["bug"] }, { id: 14, name: "kakuna", types: ["bug"] }, { id: 123, name: "scyther", types: ["bug", "flying"] }] },
            { name: "Whitney", city: "Goldenrod City", badge: "Plain Badge", mainType: "normal", team: [{ id: 35, name: "clefairy", types: ["fairy"] }, { id: 241, name: "miltank", types: ["normal"] }] },
            { name: "Morty", city: "Ecruteak City", badge: "Fog Badge", mainType: "ghost", team: [{ id: 92, name: "gastly", types: ["ghost", "poison"] }, { id: 93, name: "haunter", types: ["ghost", "poison"] }, { id: 94, name: "gengar", types: ["ghost", "poison"] }] },
            { name: "Chuck", city: "Cianwood City", badge: "Storm Badge", mainType: "fighting", team: [{ id: 62, name: "poliwrath", types: ["water", "fighting"] }, { id: 107, name: "hitmonchan", types: ["fighting"] }] },
            { name: "Jasmine", city: "Olivine City", badge: "Mineral Badge", mainType: "steel", team: [{ id: 81, name: "magnemite", types: ["electric", "steel"] }, { id: 208, name: "steelix", types: ["steel", "ground"] }] },
            { name: "Pryce", city: "Mahogany Town", badge: "Glacier Badge", mainType: "ice", team: [{ id: 86, name: "seel", types: ["water"] }, { id: 87, name: "dewgong", types: ["water", "ice"] }, { id: 221, name: "piloswine", types: ["ice", "ground"] }] },
            { name: "Clair", city: "Blackthorn City", badge: "Rising Badge", mainType: "dragon", team: [{ id: 148, name: "dragonair", types: ["dragon"] }, { id: 230, name: "kingdra", types: ["water", "dragon"] }] },
        ],
        legendaries: [
            { id: 249, name: "lugia", types: ["psychic", "flying"] },
            { id: 250, name: "ho-oh", types: ["fire", "flying"] },
            { id: 243, name: "raikou", types: ["electric"] },
            { id: 244, name: "entei", types: ["fire"] },
            { id: 245, name: "suicune", types: ["water"] },
            { id: 251, name: "celebi", types: ["psychic", "grass"] },
        ],
    },

    {
        id: "hoenn",
        nome: "Hoenn",
        geracao: "Geração III",
        icone: "/pokedexicons/hoenn.svg",
        banner: "/regioes/hoenn.jpeg",
        mapaMundi: "/regioes/mapa-mundi.png",
        heroImages: ["/regioes/hoenn.jpeg", "/regioes/hoenn.jpeg", "/regioes/hoenn.jpeg"],
        pokedexName: "hoenn",
        starters: [
            { id: 252, name: "treecko", types: ["grass"] },
            { id: 255, name: "torchic", types: ["fire"] },
            { id: 258, name: "mudkip", types: ["water"] },
        ],
        gymLeaders: [
            { name: "Roxanne", city: "Rustboro City", badge: "Stone Badge", mainType: "rock", team: [{ id: 74, name: "geodude", types: ["rock", "ground"] }, { id: 299, name: "nosepass", types: ["rock"] }] },
            { name: "Brawly", city: "Dewford Town", badge: "Knuckle Badge", mainType: "fighting", team: [{ id: 66, name: "machop", types: ["fighting"] }, { id: 296, name: "makuhita", types: ["fighting"] }] },
            { name: "Wattson", city: "Mauville City", badge: "Dynamo Badge", mainType: "electric", team: [{ id: 100, name: "voltorb", types: ["electric"] }, { id: 309, name: "electrike", types: ["electric"] }, { id: 82, name: "magneton", types: ["electric", "steel"] }] },
            { name: "Flannery", city: "Lavaridge Town", badge: "Heat Badge", mainType: "fire", team: [{ id: 218, name: "slugma", types: ["fire"] }, { id: 324, name: "torkoal", types: ["fire"] }] },
            { name: "Norman", city: "Petalburg City", badge: "Balance Badge", mainType: "normal", team: [{ id: 288, name: "vigoroth", types: ["normal"] }, { id: 289, name: "slaking", types: ["normal"] }] },
            { name: "Winona", city: "Fortree City", badge: "Feather Badge", mainType: "flying", team: [{ id: 277, name: "swellow", types: ["normal", "flying"] }, { id: 334, name: "altaria", types: ["dragon", "flying"] }] },
            { name: "Tate & Liza", city: "Mossdeep City", badge: "Mind Badge", mainType: "psychic", team: [{ id: 344, name: "claydol", types: ["ground", "psychic"] }, { id: 337, name: "lunatone", types: ["rock", "psychic"] }, { id: 338, name: "solrock", types: ["rock", "psychic"] }] },
            { name: "Juan", city: "Sootopolis City", badge: "Rain Badge", mainType: "water", team: [{ id: 350, name: "milotic", types: ["water"] }, { id: 230, name: "kingdra", types: ["water", "dragon"] }] },
        ],
        legendaries: [
            { id: 383, name: "groudon", types: ["ground"] },
            { id: 382, name: "kyogre", types: ["water"] },
            { id: 384, name: "rayquaza", types: ["dragon", "flying"] },
            { id: 385, name: "jirachi", types: ["steel", "psychic"] },
            { id: 386, name: "deoxys", types: ["psychic"] },
        ],
    },

    {
        id: "sinnoh",
        nome: "Sinnoh",
        geracao: "Geração IV",
        icone: "/pokedexicons/sinnoh.svg",
        banner: "/regioes/sinnoh.jpeg",
        mapaMundi: "/regioes/mapa-mundi.png",
        heroImages: ["/regioes/sinnoh.jpeg", "/regioes/sinnoh.jpeg", "/regioes/sinnoh.jpeg"],
        pokedexName: "extended-sinnoh",
        starters: [
            { id: 387, name: "turtwig", types: ["grass"] },
            { id: 390, name: "chimchar", types: ["fire"] },
            { id: 393, name: "piplup", types: ["water"] },
        ],
        gymLeaders: [
            { name: "Roark", city: "Oreburgh City", badge: "Coal Badge", mainType: "rock", team: [{ id: 74, name: "geodude", types: ["rock", "ground"] }, { id: 408, name: "cranidos", types: ["rock"] }] },
            { name: "Gardenia", city: "Eterna City", badge: "Forest Badge", mainType: "grass", team: [{ id: 420, name: "cherubi", types: ["grass"] }, { id: 407, name: "roserade", types: ["grass", "poison"] }] },
            { name: "Maylene", city: "Veilstone City", badge: "Cobble Badge", mainType: "fighting", team: [{ id: 307, name: "meditite", types: ["fighting", "psychic"] }, { id: 448, name: "lucario", types: ["fighting", "steel"] }] },
            { name: "Crasher Wake", city: "Pastoria City", badge: "Fen Badge", mainType: "water", team: [{ id: 418, name: "buizel", types: ["water"] }, { id: 419, name: "floatzel", types: ["water"] }] },
            { name: "Fantina", city: "Hearthome City", badge: "Relic Badge", mainType: "ghost", team: [{ id: 429, name: "mismagius", types: ["ghost"] }, { id: 426, name: "drifblim", types: ["ghost", "flying"] }] },
            { name: "Byron", city: "Canalave City", badge: "Mine Badge", mainType: "steel", team: [{ id: 437, name: "bronzong", types: ["steel", "psychic"] }, { id: 464, name: "rhyperior", types: ["ground", "rock"] }] },
            { name: "Candice", city: "Snowpoint City", badge: "Icicle Badge", mainType: "ice", team: [{ id: 460, name: "abomasnow", types: ["grass", "ice"] }, { id: 471, name: "glaceon", types: ["ice"] }] },
            { name: "Volkner", city: "Sunyshore City", badge: "Beacon Badge", mainType: "electric", team: [{ id: 466, name: "electivire", types: ["electric"] }, { id: 405, name: "luxray", types: ["electric"] }] },
        ],
        legendaries: [
            { id: 483, name: "dialga", types: ["steel", "dragon"] },
            { id: 484, name: "palkia", types: ["water", "dragon"] },
            { id: 487, name: "giratina", types: ["ghost", "dragon"] },
            { id: 493, name: "arceus", types: ["normal"] },
            { id: 491, name: "darkrai", types: ["dark"] },
            { id: 492, name: "shaymin", types: ["grass"] },
        ],
    },

    {
        id: "unova",
        nome: "Unova",
        geracao: "Geração V",
        icone: "/pokedexicons/unova.svg",
        banner: "/regioes/unova.jpeg",
        mapaMundi: "/regioes/mapa-mundi.png",
        heroImages: ["/regioes/unova.jpeg", "/regioes/unova.jpeg", "/regioes/unova.jpeg"],
        // PokeAPI tem “unova” e “original-unova”; vamos usar “unova”
        pokedexName: "unova",
        starters: [
            { id: 495, name: "snivy", types: ["grass"] },
            { id: 498, name: "tepig", types: ["fire"] },
            { id: 501, name: "oshawott", types: ["water"] },
        ],
        gymLeaders: [
            { name: "Cilan/Chili/Cress", city: "Striaton City", badge: "Trio Badge", mainType: "grass", team: [{ id: 511, name: "pansage", types: ["grass"] }, { id: 513, name: "pansear", types: ["fire"] }, { id: 515, name: "panpour", types: ["water"] }] },
            { name: "Lenora", city: "Nacrene City", badge: "Basic Badge", mainType: "normal", team: [{ id: 506, name: "lillipup", types: ["normal"] }, { id: 505, name: "watchog", types: ["normal"] }] },
            { name: "Burgh", city: "Castelia City", badge: "Insect Badge", mainType: "bug", team: [{ id: 542, name: "leavanny", types: ["bug", "grass"] }, { id: 543, name: "venipede", types: ["bug", "poison"] }] },
            { name: "Elesa", city: "Nimbasa City", badge: "Bolt Badge", mainType: "electric", team: [{ id: 523, name: "zebstrika", types: ["electric"] }, { id: 587, name: "emolga", types: ["electric", "flying"] }] },
            { name: "Clay", city: "Driftveil City", badge: "Quake Badge", mainType: "ground", team: [{ id: 552, name: "krokorok", types: ["ground", "dark"] }, { id: 618, name: "stunfisk", types: ["ground", "electric"] }] },
            { name: "Skyla", city: "Mistralton City", badge: "Jet Badge", mainType: "flying", team: [{ id: 581, name: "swanna", types: ["water", "flying"] }, { id: 579, name: "reuniclus", types: ["psychic"] }] },
            { name: "Brycen", city: "Icirrus City", badge: "Freeze Badge", mainType: "ice", team: [{ id: 614, name: "beartic", types: ["ice"] }, { id: 615, name: "cryogonal", types: ["ice"] }] },
            { name: "Iris/Drayden", city: "Opelucid City", badge: "Legend Badge", mainType: "dragon", team: [{ id: 612, name: "haxorus", types: ["dragon"] }, { id: 635, name: "hydreigon", types: ["dark", "dragon"] }] },
        ],
        legendaries: [
            { id: 643, name: "reshiram", types: ["dragon", "fire"] },
            { id: 644, name: "zekrom", types: ["dragon", "electric"] },
            { id: 646, name: "kyurem", types: ["dragon", "ice"] },
            { id: 494, name: "victini", types: ["psychic", "fire"] },
            { id: 649, name: "genesect", types: ["bug", "steel"] },
        ],
    },

    {
        id: "kalos",
        nome: "Kalos",
        geracao: "Geração VI",
        icone: "/pokedexicons/kalos.svg",
        banner: "/regioes/kalos.jpeg",
        mapaMundi: "/regioes/mapa-mundi.png",
        heroImages: ["/regioes/kalos.jpeg", "/regioes/kalos.jpeg", "/regioes/kalos.jpeg"],
        pokedexName: "kalos-central",
        starters: [
            { id: 650, name: "chespin", types: ["grass"] },
            { id: 653, name: "fennekin", types: ["fire"] },
            { id: 656, name: "froakie", types: ["water"] },
        ],
        gymLeaders: [
            { name: "Viola", city: "Santalune City", badge: "Bug Badge", mainType: "bug", team: [{ id: 664, name: "scatterbug", types: ["bug"] }, { id: 666, name: "vivillon", types: ["bug", "flying"] }] },
            { name: "Grant", city: "Cyllage City", badge: "Cliff Badge", mainType: "rock", team: [{ id: 696, name: "tyrunt", types: ["rock", "dragon"] }, { id: 699, name: "aurorus", types: ["rock", "ice"] }] },
            { name: "Korrina", city: "Shalour City", badge: "Rumble Badge", mainType: "fighting", team: [{ id: 701, name: "hawlucha", types: ["fighting", "flying"] }, { id: 448, name: "lucario", types: ["fighting", "steel"] }] },
            { name: "Ramos", city: "Coumarine City", badge: "Plant Badge", mainType: "grass", team: [{ id: 707, name: "klefki", types: ["steel", "fairy"] }, { id: 673, name: "gogoat", types: ["grass"] }] },
            { name: "Clemont", city: "Lumiose City", badge: "Volt Badge", mainType: "electric", team: [{ id: 695, name: "heliolisk", types: ["electric", "normal"] }, { id: 702, name: "dedenne", types: ["electric", "fairy"] }] },
            { name: "Valerie", city: "Laverre City", badge: "Fairy Badge", mainType: "fairy", team: [{ id: 682, name: "spritzee", types: ["fairy"] }, { id: 700, name: "sylveon", types: ["fairy"] }] },
            { name: "Olympia", city: "Anistar City", badge: "Psychic Badge", mainType: "psychic", team: [{ id: 678, name: "meowstic-female", types: ["psychic"] }, { id: 561, name: "sigilyph", types: ["psychic", "flying"] }] },
            { name: "Wulfric", city: "Snowbelle City", badge: "Iceberg Badge", mainType: "ice", team: [{ id: 713, name: "avalugg", types: ["ice"] }, { id: 712, name: "bergmite", types: ["ice"] }] },
        ],
        legendaries: [
            { id: 716, name: "xerneas", types: ["fairy"] },
            { id: 717, name: "yveltal", types: ["dark", "flying"] },
            { id: 718, name: "zygarde", types: ["dragon", "ground"] },
            { id: 719, name: "diancie", types: ["rock", "fairy"] },
            { id: 720, name: "hoopa", types: ["psychic", "ghost"] },
            { id: 721, name: "volcanion", types: ["fire", "water"] },
        ],
    },

    {
        id: "alola",
        nome: "Alola",
        geracao: "Geração VII",
        icone: "/pokedexicons/alola.svg",
        banner: "/regioes/alola.jpeg",
        mapaMundi: "/regioes/mapa-mundi.png",
        heroImages: ["/regioes/alola.jpeg", "/regioes/alola.jpeg", "/regioes/alola.jpeg"],
        pokedexName: "original-alola",
        starters: [
            { id: 722, name: "rowlet", types: ["grass", "flying"] },
            { id: 725, name: "litten", types: ["fire"] },
            { id: 728, name: "popplio", types: ["water"] },
        ],
        gymLeaders: [
            { name: "Ilima", city: "Melemele", badge: "Trial", mainType: "normal", team: [{ id: 734, name: "yungoos", types: ["normal"] }, { id: 735, name: "gumshoos", types: ["normal"] }] },
            { name: "Lana", city: "Akala", badge: "Trial", mainType: "water", team: [{ id: 746, name: "wishiwashi", types: ["water"] }, { id: 592, name: "frillish", types: ["water", "ghost"] }] },
            { name: "Kiawe", city: "Akala", badge: "Trial", mainType: "fire", team: [{ id: 757, name: "salandit", types: ["poison", "fire"] }, { id: 776, name: "turtonator", types: ["fire", "dragon"] }] },
            { name: "Mallow", city: "Akala", badge: "Trial", mainType: "grass", team: [{ id: 763, name: "tsareena", types: ["grass"] }, { id: 764, name: "comfey", types: ["fairy"] }] },
            { name: "Sophocles", city: "Ula'ula", badge: "Trial", mainType: "electric", team: [{ id: 738, name: "vikavolt", types: ["bug", "electric"] }, { id: 777, name: "togedemaru", types: ["electric", "steel"] }] },
            { name: "Acerola", city: "Ula'ula", badge: "Trial", mainType: "ghost", team: [{ id: 778, name: "mimikyu", types: ["ghost", "fairy"] }, { id: 302, name: "sableye", types: ["dark", "ghost"] }] },
            { name: "Mina", city: "Poni", badge: "Trial", mainType: "fairy", team: [{ id: 730, name: "primarina", types: ["water", "fairy"] }, { id: 788, name: "tapu-fini", types: ["water", "fairy"] }] },
            { name: "Kahuna (Hala)", city: "Melemele", badge: "Kahuna", mainType: "fighting", team: [{ id: 57, name: "primeape", types: ["fighting"] }, { id: 797, name: "celesteela", types: ["steel", "flying"] }] },
        ],
        legendaries: [
            { id: 791, name: "solgaleo", types: ["psychic", "steel"] },
            { id: 792, name: "lunala", types: ["psychic", "ghost"] },
            { id: 800, name: "necrozma", types: ["psychic"] },
            { id: 785, name: "tapu-koko", types: ["electric", "fairy"] },
            { id: 789, name: "cosmog", types: ["psychic"] },
        ],
    },

    {
        id: "galar",
        nome: "Galar",
        geracao: "Geração VIII",
        icone: "/pokedexicons/galar.svg",
        banner: "/regioes/galar.jpeg",
        mapaMundi: "/regioes/mapa-mundi.png",
        heroImages: ["/regioes/galar.jpeg", "/regioes/galar.jpeg", "/regioes/galar.jpeg"],
        pokedexName: "galar",
        starters: [
            { id: 810, name: "grookey", types: ["grass"] },
            { id: 813, name: "scorbunny", types: ["fire"] },
            { id: 816, name: "sobble", types: ["water"] },
        ],
        gymLeaders: [
            { name: "Milo", city: "Turffield", badge: "Grass Badge", mainType: "grass", team: [{ id: 830, name: "eldegoss", types: ["grass"] }, { id: 831, name: "wooloo", types: ["normal"] }] },
            { name: "Nessa", city: "Hulbury", badge: "Water Badge", mainType: "water", team: [{ id: 833, name: "chewtle", types: ["water"] }, { id: 834, name: "drednaw", types: ["water", "rock"] }] },
            { name: "Kabu", city: "Motostoke", badge: "Fire Badge", mainType: "fire", team: [{ id: 851, name: "centiskorch", types: ["fire", "bug"] }, { id: 850, name: "sizzlipede", types: ["fire", "bug"] }] },
            { name: "Bea/Allister", city: "Stow-on-Side", badge: "Fighting/Ghost", mainType: "fighting", team: [{ id: 865, name: "sirfetchd", types: ["fighting"] }, { id: 867, name: "runerigus", types: ["ground", "ghost"] }] },
            { name: "Opal", city: "Ballonlea", badge: "Fairy Badge", mainType: "fairy", team: [{ id: 868, name: "milcery", types: ["fairy"] }, { id: 869, name: "alcremie", types: ["fairy"] }] },
            { name: "Gordie/Melony", city: "Circhester", badge: "Rock/Ice", mainType: "rock", team: [{ id: 874, name: "stonjourner", types: ["rock"] }, { id: 875, name: "eiscue", types: ["ice"] }] },
            { name: "Piers", city: "Spikemuth", badge: "Dark Badge", mainType: "dark", team: [{ id: 862, name: "obstagoon", types: ["dark", "normal"] }, { id: 559, name: "scraggy", types: ["dark", "fighting"] }] },
            { name: "Raihan", city: "Hammerlocke", badge: "Dragon Badge", mainType: "dragon", team: [{ id: 887, name: "dragapult", types: ["dragon", "ghost"] }, { id: 884, name: "duraludon", types: ["steel", "dragon"] }] },
        ],
        legendaries: [
            { id: 888, name: "zacian", types: ["fairy"] },
            { id: 889, name: "zamazenta", types: ["fighting"] },
            { id: 890, name: "eternatus", types: ["poison", "dragon"] },
            { id: 898, name: "calyrex", types: ["psychic", "grass"] },
        ],
    },

    {
        id: "paldea",
        nome: "Paldea",
        geracao: "Geração IX",
        icone: "/pokedexicons/paldea.svg",
        banner: "/regioes/paldea.png",
        mapaMundi: "/regioes/mapa-mundi.png",
        heroImages: ["/regioes/paldea.png", "/regioes/paldea.png", "/regioes/paldea.png"],
        // PokeAPI: paldea
        pokedexName: "paldea",
        starters: [
            { id: 906, name: "sprigatito", types: ["grass"] },
            { id: 909, name: "fuecoco", types: ["fire"] },
            { id: 912, name: "quaxly", types: ["water"] },
        ],
        gymLeaders: [
            { name: "Katy", city: "Cortondo", badge: "Bug Badge", mainType: "bug", team: [{ id: 917, name: "tarountula", types: ["bug"] }, { id: 918, name: "spidops", types: ["bug"] }] },
            { name: "Brassius", city: "Artazon", badge: "Grass Badge", mainType: "grass", team: [{ id: 943, name: "maschiff", types: ["dark"] }, { id: 970, name: "brambleghast", types: ["grass", "ghost"] }] },
            { name: "Iono", city: "Levincia", badge: "Electric Badge", mainType: "electric", team: [{ id: 940, name: "wattrel", types: ["electric", "flying"] }, { id: 941, name: "kilowattrel", types: ["electric", "flying"] }] },
            { name: "Kofu", city: "Cascarrafa", badge: "Water Badge", mainType: "water", team: [{ id: 976, name: "veluza", types: ["water", "psychic"] }, { id: 980, name: "clodsire", types: ["poison", "ground"] }] },
            { name: "Larry", city: "Medali", badge: "Normal Badge", mainType: "normal", team: [{ id: 925, name: "maushold", types: ["normal"] }, { id: 931, name: "squawkabilly", types: ["normal", "flying"] }] },
            { name: "Ryme", city: "Montenevera", badge: "Ghost Badge", mainType: "ghost", team: [{ id: 936, name: "ar-marouge", types: ["fire", "psychic"] }, { id: 937, name: "ceruledge", types: ["fire", "ghost"] }] },
            { name: "Tulip", city: "Alfornada", badge: "Psychic Badge", mainType: "psychic", team: [{ id: 956, name: "espathra", types: ["psychic"] }, { id: 955, name: "flittle", types: ["psychic"] }] },
            { name: "Grusha", city: "Glaseado", badge: "Ice Badge", mainType: "ice", team: [{ id: 975, name: "cetitan", types: ["ice"] }, { id: 971, name: "greavard", types: ["ghost"] }] },
        ],
        legendaries: [
            { id: 1007, name: "koraidon", types: ["fighting", "dragon"] },
            { id: 1008, name: "miraidon", types: ["electric", "dragon"] },
            { id: 1024, name: "terapagos", types: ["normal"] },
            { id: 1017, name: "ogerpon", types: ["grass"] },
        ],
    },
];

/* =========================
   UI Pieces
========================= */

function TypePill({ type }) {
    return (
        <span
            className={[
                "px-2.5 py-1 rounded-md text-[10px] font-extrabold capitalize shadow-sm",
                "border border-black/10 dark:border-white/10",
                getTypeClass(type),
            ].join(" ")}
        >
            {type}
        </span>
    );
}

function PokemonCard({ p, onClick, small }) {
    const artwork =
        p?.artwork ||
        p?.sprites?.other?.["official-artwork"]?.front_default ||
        p?.sprites?.front_default ||
        "";

    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={[
                "group relative overflow-hidden rounded-xl border",
                "border-white/15 bg-white/10 hover:bg-white/15 transition",
                "text-left",
                small ? "p-3" : "p-4",
            ].join(" ")}
        >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.06] mix-blend-overlay pointer-events-none" />

            <div className="flex items-center gap-3">
                <div
                    className={[
                        "relative shrink-0 rounded-xl overflow-hidden",
                        small ? "w-14 h-14" : "w-16 h-16",
                        "bg-black/20 border border-white/10",
                    ].join(" ")}
                >
                    {artwork ? (
                        <Image
                            src={artwork}
                            alt={formatName(p.name)}
                            fill
                            unoptimized
                            className="object-contain p-2 drop-shadow-xl"
                        />
                    ) : (
                        <div className="w-full h-full" />
                    )}
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-zinc-100 font-extrabold text-sm truncate">
                            {formatName(p.name)}
                        </p>
                        {p?.id ? (
                            <span className="text-[10px] font-bold text-zinc-300">
                                #{String(p.id).padStart(4, "0")}
                            </span>
                        ) : null}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {(p.types || []).slice(0, 2).map((t) => (
                            <TypePill key={t} type={t} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-3 h-px w-full bg-white/10" />
            <p className="mt-3 text-[11px] text-zinc-200/80 leading-relaxed">
                Clique para abrir na Pokédex
            </p>
        </motion.button>
    );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]" />
                    <h2 className="text-zinc-100 font-extrabold text-base md:text-lg">
                        {title}
                    </h2>
                </div>
                {subtitle ? (
                    <p className="mt-2 text-[12px] text-zinc-200/70 leading-relaxed">
                        {subtitle}
                    </p>
                ) : null}
            </div>

            {Icon ? (
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 border border-white/10">
                    <Icon className="h-5 w-5 text-white/80" />
                </span>
            ) : null}
        </div>
    );
}

/* =========================
   Page
========================= */

export default function RegioesId() {
    const router = useRouter();
    const params = useParams();

    const regioesIdRaw =
        params?.regioesId ?? params?.id ?? params?.slug ?? params?.name;

    const regioesId = useMemo(
        () => String(regioesIdRaw || "").trim().toLowerCase(),
        [regioesIdRaw]
    );

    const region = useMemo(
        () => REGIOES.find((r) => r.id === regioesId) || null,
        [regioesId]
    );

    const order = useMemo(() => REGIOES.map((r) => r.id), []);
    const index = Math.max(0, order.indexOf(regioesId));
    const safeIndex = index >= 0 ? index : 0;

    const prevIndex = (safeIndex - 1 + order.length) % order.length;
    const nextIndex = (safeIndex + 1) % order.length;

    const prevId = order[prevIndex];
    const nextId = order[nextIndex];

    const [prevRegion, setPrevRegion] = useState(null);
    const [nextRegion, setNextRegion] = useState(null);
    const [isNavigating, setIsNavigating] = useState(false);

    const [carousel, setCarousel] = useState([]);
    const [carouselLoading, setCarouselLoading] = useState(false);
    const [carouselError, setCarouselError] = useState("");

    const [heroKey, setHeroKey] = useState(0);
    const abortRef = useRef(null);

    const goTo = (id) => {
        if (isNavigating) return;
        setIsNavigating(true);
        router.push(`/Regioes/${id}`);
    };

    const prefetch = (id) => {
        try {
            router.prefetch?.(`/Regioes/${id}`);
        } catch { }
    };

    useEffect(() => {
        setIsNavigating(false);
        setHeroKey((k) => k + 1);
    }, [regioesId]);

    useEffect(() => {
        const p = REGIOES.find((r) => r.id === prevId);
        const n = REGIOES.find((r) => r.id === nextId);
        setPrevRegion(p ? { id: p.id, nome: p.nome } : null);
        setNextRegion(n ? { id: n.id, nome: n.nome } : null);
    }, [prevId, nextId]);

    async function fetchPokemonByName(name, signal) {
        const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, { signal });
        if (!r.ok) throw new Error("Falha ao carregar Pokémon.");
        const data = await r.json();
        const artwork =
            data?.sprites?.other?.["official-artwork"]?.front_default ||
            data?.sprites?.front_default ||
            "";
        return {
            id: data?.id,
            name: data?.name,
            artwork,
            types: data?.types?.map((t) => t?.type?.name).filter(Boolean) || [],
        };
    }

    async function refreshCarousel() {
        if (!region?.pokedexName) return;

        // abort anterior
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            setCarouselLoading(true);
            setCarouselError("");
            setCarousel([]);

            const pr = await fetch(
                `https://pokeapi.co/api/v2/pokedex/${region.pokedexName}`,
                { signal: controller.signal }
            );
            if (!pr.ok) throw new Error("Falha ao carregar pokédex da região.");
            const pd = await pr.json();

            const entries = Array.isArray(pd?.pokemon_entries) ? pd.pokemon_entries : [];
            const speciesNames = entries
                .map((e) => e?.pokemon_species?.name)
                .filter(Boolean);

            // 12 aleatórios
            const selected = pickN(speciesNames, 12);

            // carrega dados (em paralelo)
            const data = await Promise.all(
                selected.map((name) => fetchPokemonByName(name, controller.signal).catch(() => null))
            );

            const ok = data.filter(Boolean);
            setCarousel(ok);
        } catch (err) {
            if (String(err?.name) === "AbortError") return;
            setCarouselError(err?.message || "Erro ao carregar carrossel.");
            setCarousel([]);
        } finally {
            setCarouselLoading(false);
        }
    }

    useEffect(() => {
        if (!region) return;
        refreshCarousel();
        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [region?.id]);

    if (!region) {
        return (
            <div className="w-full max-w-xl mx-auto mt-10 px-4">
                <p className="text-red-500 text-sm">Região não encontrada.</p>
                <button
                    onClick={() => router.push("/Regioes")}
                    className="mt-3 text-[#E3350D] hover:underline text-sm font-semibold"
                >
                    Voltar para Regiões
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* ================= NAV (Prev/Next) ================= */}
            <header className="relative w-full">
                <motion.div className="mx-auto w-full max-w-6xl pt-0 pb-0">
                    <div className="w-full">
                        <div className="grid grid-cols-2 gap-1">
                            {/* Prev */}
                            <button
                                type="button"
                                onClick={() => goTo(prevId)}
                                onMouseEnter={() => prefetch(prevId)}
                                onFocus={() => prefetch(prevId)}
                                disabled={isNavigating}
                                className={[
                                    "group flex w-full items-center justify-start gap-3 rounded-l-2xl px-4 py-3 text-left text-white transition",
                                    "bg-[#616161] hover:bg-[#1B1B1B]",
                                    "disabled:opacity-70 disabled:pointer-events-none",
                                ].join(" ")}
                            >
                                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#616161] transition group-hover:text-[#1B1B1B]">
                                    <ChevronLeft className="h-4 w-4" />
                                </span>

                                <div className="leading-tight">
                                    <div className="text-xs font-semibold opacity-90">
                                        N° {String(prevIndex + 1).padStart(2, "0")}
                                    </div>
                                    <div className="text-sm font-semibold truncate max-w-[180px] sm:max-w-none">
                                        {prevRegion?.nome || "—"}
                                    </div>
                                </div>
                            </button>

                            {/* Next */}
                            <button
                                type="button"
                                onClick={() => goTo(nextId)}
                                onMouseEnter={() => prefetch(nextId)}
                                onFocus={() => prefetch(nextId)}
                                disabled={isNavigating}
                                className={[
                                    "group flex w-full items-center justify-end gap-3 rounded-r-2xl px-4 py-3 text-right text-white transition",
                                    "bg-[#616161] hover:bg-[#1B1B1B]",
                                    "disabled:opacity-70 disabled:pointer-events-none",
                                ].join(" ")}
                            >
                                <div className="leading-tight">
                                    <div className="text-sm font-semibold truncate max-w-[180px] sm:max-w-none">
                                        {nextRegion?.nome || "—"}
                                    </div>
                                    <div className="text-xs font-semibold opacity-90">
                                        N° {String(nextIndex + 1).padStart(2, "0")}
                                    </div>
                                </div>

                                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#616161] transition group-hover:text-[#1B1B1B]">
                                    <ChevronRight className="h-4 w-4" />
                                </span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* ================= HERO: MAPA + 3 IMAGENS ================= */}
            <section className="relative w-full">
                <div className="relative h-[92vh] w-full overflow-hidden">
                    {/* Fundo mapa mundi */}
                    <Image
                        src={region.mapaMundi || "/regioes/mapa-mundi.png"}
                        alt="Mapa mundi"
                        fill
                        priority
                        className="object-cover opacity-95"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/55 to-black/90" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.08] mix-blend-overlay pointer-events-none" />

                    {/* Título */}
                    <div className="absolute inset-x-0 top-10 z-10 px-4">
                        <motion.div
                            key={heroKey}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                            className="mx-auto w-full max-w-6xl"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 border border-white/15">
                                            <Image
                                                src={region.icone}
                                                alt=""
                                                width={44}
                                                height={44}
                                                className="drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                                {region.nome}
                                            </h1>
                                            <p className="mt-1 text-sm text-white/70 font-semibold flex items-center gap-2">
                                                <MapPinned className="h-4 w-4" />
                                                {region.geracao}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/80 leading-relaxed">
                                        Uma visão geral do mundo, com destaques da região: iniciais, líderes, encontros e lendários.
                                    </p>
                                </div>

                                <div className="hidden sm:flex items-center gap-2">
                                    <span className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white/80 text-xs font-bold">
                                        #{String(safeIndex + 1).padStart(2, "0")} / {String(order.length).padStart(2, "0")}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Três imagens da região (cards flutuantes) */}
                    <div className="absolute inset-x-0 bottom-12 z-10 px-4">
                        <div className="mx-auto w-full max-w-6xl">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(region.heroImages?.length ? region.heroImages : [region.banner, region.banner, region.banner])
                                    .slice(0, 3)
                                    .map((src, idx) => (
                                        <motion.div
                                            key={`${region.id}-${idx}-${heroKey}`}
                                            initial={{ opacity: 0, y: 18 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.08, duration: 0.45 }}
                                            whileHover={{ y: -4, scale: 1.02 }}
                                            className="
                        relative overflow-hidden rounded-2xl
                        border border-white/15 bg-white/5
                        shadow-lg
                      "
                                        >
                                            <div className="relative h-44 sm:h-52">
                                                <Image
                                                    src={src || region.banner}
                                                    alt={`${region.nome} — destaque ${idx + 1}`}
                                                    fill
                                                    className="object-cover opacity-90"
                                                />
                                                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/35 to-black/80" />
                                            </div>

                                            <div className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]" />
                                                    <p className="text-white font-extrabold text-sm">
                                                        Destaque {idx + 1}
                                                    </p>
                                                </div>
                                                <p className="mt-2 text-[12px] text-white/70 leading-relaxed">
                                                    Uma cena marcante da região para dar clima e identidade visual.
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= CONTENT WRAPPER ================= */}
            <div className="mt-6 px-4 sm:px-6 md:px-8 lg:px-0">
                <div className="mx-auto w-full max-w-6xl space-y-6">
                    {/* ================= 1) STARTERS ================= */}
                    <div
                        className="
              rounded-2xl
              border border-black/10 dark:border-white/10
              overflow-hidden
              bg-[url('/wallpaper-preto.png')]
              bg-cover bg-center bg-no-repeat
              shadow-lg
            "
                    >
                        <div className="p-6">
                            <SectionHeader
                                icon={Sparkles}
                                title="Iniciais da região"
                                subtitle="Escolha um inicial para abrir direto na Pokédex."
                            />

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {region.starters.map((s) => (
                                    <PokemonCard
                                        key={s.id}
                                        p={{
                                            id: s.id,
                                            name: s.name,
                                            artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${s.id}.png`,
                                            types: s.types,
                                        }}
                                        onClick={() => router.push(`/Pokedex/${s.id}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ================= 2) GYM LEADERS ================= */}
                    <div
                        className="
              rounded-2xl
              border border-black/10 dark:border-white/10
              overflow-hidden
              bg-[url('/wallpaper-preto.png')]
              bg-cover bg-center bg-no-repeat
              shadow-lg
            "
                    >
                        <div className="p-6">
                            <SectionHeader
                                icon={Swords}
                                title="Líderes de Ginásio"
                                subtitle="Os 8 líderes, com alguns Pokémon marcantes e seus tipos (mock — fácil de expandir)."
                            />

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {region.gymLeaders.map((g, idx) => (
                                    <motion.div
                                        key={`${g.name}-${idx}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-80px" }}
                                        transition={{ duration: 0.35 }}
                                        className="
                      relative rounded-2xl overflow-hidden
                      border border-white/15 bg-white/10
                      p-5
                    "
                                    >
                                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.06] mix-blend-overlay pointer-events-none" />

                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-4 bg-[#E3350D] rounded-sm shadow-[0_0_6px_#E3350D]" />
                                                    <p className="text-zinc-100 font-extrabold text-sm truncate">
                                                        {g.name}
                                                    </p>
                                                </div>

                                                <p className="mt-2 text-[12px] text-zinc-200/70">
                                                    {g.city} • <span className="font-bold">{g.badge}</span>
                                                </p>

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <span
                                                        className={[
                                                            "px-3 py-1.5 rounded-lg text-[11px] font-extrabold capitalize",
                                                            "border border-white/10 bg-white/10 text-white",
                                                        ].join(" ")}
                                                    >
                                                        Tipo principal:
                                                    </span>
                                                    <TypePill type={g.mainType} />
                                                </div>
                                            </div>

                                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 border border-white/10">
                                                <Crown className="h-5 w-5 text-white/80" />
                                            </span>
                                        </div>

                                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {g.team.map((p) => (
                                                <PokemonCard
                                                    key={`${g.name}-${p.id}`}
                                                    p={{
                                                        ...p,
                                                        artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
                                                    }}
                                                    small
                                                    onClick={() => router.push(`/Pokedex/${p.id}`)}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ================= 3) CAROUSEL 12 ALEATÓRIOS ================= */}
                    <div
                        className="
              rounded-2xl
              border border-black/10 dark:border-white/10
              overflow-hidden
              bg-[url('/wallpaper-preto.png')]
              bg-cover bg-center bg-no-repeat
              shadow-lg
            "
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <SectionHeader
                                    icon={Shuffle}
                                    title="Encontros aleatórios"
                                    subtitle="12 Pokémon aleatórios da região (via PokeAPI)."
                                />

                                <motion.button
                                    type="button"
                                    onClick={refreshCarousel}
                                    whileHover={{ y: -2, scale: 1.04 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="
                    shrink-0
                    px-4 py-2
                    rounded-xl
                    bg-[#E3350D] hover:bg-[#C32B0B]
                    text-white text-xs font-extrabold
                    border border-white/10
                    transition
                    disabled:opacity-60 disabled:pointer-events-none
                  "
                                    disabled={carouselLoading}
                                >
                                    {carouselLoading ? "Carregando..." : "Sortear de novo"}
                                </motion.button>
                            </div>

                            {carouselError ? (
                                <p className="mt-4 text-red-300 text-sm">{carouselError}</p>
                            ) : null}

                            <div className="mt-6 overflow-x-auto">
                                <div className="flex gap-4 min-w-max pb-2">
                                    {(carouselLoading ? Array.from({ length: 12 }) : carousel).map((p, idx) => {
                                        if (!p) {
                                            return (
                                                <div
                                                    key={`skeleton-${idx}`}
                                                    className="
                            w-[280px]
                            rounded-2xl
                            border border-white/15
                            bg-white/10
                            p-4
                          "
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/10" />
                                                        <div className="flex-1">
                                                            <div className="h-4 w-40 rounded bg-white/10" />
                                                            <div className="mt-2 h-3 w-28 rounded bg-white/10" />
                                                            <div className="mt-3 flex gap-2">
                                                                <div className="h-6 w-16 rounded bg-white/10" />
                                                                <div className="h-6 w-16 rounded bg-white/10" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={`${p.id}-${p.name}`} className="w-[300px]">
                                                <PokemonCard
                                                    p={p}
                                                    onClick={() => router.push(`/Pokedex/${p.id}`)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <p className="mt-4 text-[12px] text-zinc-200/70">
                                Dica: isso usa a Pokédex da região (<span className="font-bold">{region.pokedexName}</span>) para
                                sortear os encontros.
                            </p>
                        </div>
                    </div>

                    {/* ================= 4) LEGENDÁRIOS ================= */}
                    <div
                        className="
              rounded-2xl
              border border-black/10 dark:border-white/10
              overflow-hidden
              bg-[url('/wallpaper-preto.png')]
              bg-cover bg-center bg-no-repeat
              shadow-lg
            "
                    >
                        <div className="p-6">
                            <SectionHeader
                                icon={Crown}
                                title="Pokémon lendários da região"
                                subtitle="Os lendários/míticos mais marcantes — clique para abrir na Pokédex."
                            />

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {region.legendaries.map((p) => (
                                    <PokemonCard
                                        key={p.id}
                                        p={{
                                            ...p,
                                            artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`,
                                        }}
                                        onClick={() => router.push(`/Pokedex/${p.id}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ================= FOOTER: VOLTAR ================= */}
                    <div className="w-full rounded-2xl mx-auto overflow-visible">
                        <div className="pb-4 flex justify-end">
                            <motion.button
                                onClick={() => router.push("/Regioes")}
                                whileHover={{
                                    scale: 1.08,
                                    y: -2,
                                    transition: { type: "spring", stiffness: 250, damping: 14 },
                                }}
                                className="
                  relative z-10
                  px-6 py-3
                  rounded-xl
                  bg-[#E3350D] hover:bg-[#C32B0B]
                  text-white font-semibold text-sm
                  transition
                "
                            >
                                Voltar para Regiões
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Observação prática (só pra não te pegar de surpresa):
          Se você não tiver /regioes/mapa-mundi.png ainda, adicione essa imagem.
          O resto usa seus wallpapers + grid e funciona de boa.
      */}
        </div>
    );
}