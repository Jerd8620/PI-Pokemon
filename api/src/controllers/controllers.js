const { Pokemon, Type } = require('../db');
const axios = require('axios');

let dbID = 40;

// API
async function getPokemonsAPI() {
    try {
        const response = await axios.get(
            "https://pokeapi.co/api/v2/pokemon?offset=20&limit=40"
        );
        const data = Promise.all(
            response.data.results.map(async (pokemon) => {
                let subRequest = await axios.get(pokemon.url);
                let pokemonResult = {
                    name: subRequest.data.name,
                    id: Number(subRequest.data.id),
                    hp: subRequest.data.stats[0].base_stat,
                    attack: subRequest.data.stats[1].base_stat,
                    defense: subRequest.data.stats[2].base_stat,
                    speed: subRequest.data.stats[4].base_stat,
                    height: subRequest.data.height,
                    weigth: subRequest.data.weigth,
                    image: subRequest.data.sprites.other.home.front_default,
                    types: subRequest.data.types.map((type) => {
                        return { name: type.type.name };
                    }),
                    created: "false"
                };
                return pokemonResult;
            })
        );
        return data;
    } catch (error) {
        return error;
    }
}

// DB y API
async function getAllPokemons() {
    const dbPokemons = await Pokemon.findAll({
        include: {
            model: Type,
            through: {
                attributes: [],
            },
            attributes: ["name"],
        },
    });
    const ApiPokemons = await getPokemonsAPI();
    return [...ApiPokemons, ...dbPokemons];
}

// Pokemon por ID
async function getPokemonId() {
    const id = Number(req.params.idPokemon);
    if (typeof id === "number") {
        const pokemonDb = await Pokemon.findOne({
            where: {
                id: id,
            },
            include: {
                model: Type,
                through: {
                    attributes: [],
                },
                attributes: ["name"],
            },
        });
        if (pokemonDb) {
            return res.json(pokemonDb);
        } else {
            const pokemonsApi = await getPokemonsAPI();
            const foundPokemon = pokemonsApi.find((p) => p.id === id);
            if (foundPokemon) {
                return res.json(foundPokemon);
            } else {
                return res.json("ID que se ingreso no es de ningun pokemon");
            }
        }
    }
    return res.send("ID tiene que ser numerico").status(404);
}

// Agregar pokemon a la DB
async function addPokemon(req, res) {
    const { hp, attack, defense, speed, height, weigth, image, type1, type2 } =
        req.body;
    let name = req.body.name.toLowerCase();
    let pokemon = {
        id: ++dbID,
        name,
        hp,
        attack,
        defense,
        speed,
        height,
        weigth,
        image,
    };
    try {
        let createPokemon = await Pokemon.created(pokemon);
        const addType1 = await createPokemon.addType(type1, {
            through: "pokemon_type",
        });
        const addType2 = await createPokemon.addType(type2, {
            through: "pokemon_type",
        });
        return res.status(200).send("Pokemon creado de manera correcta");
    } catch (error) {
        return error;
    }
}

// AGREGADO DE TIPOS DE POKEMONS A DB
async function getPokemonsTypes() {
    let pokemonDb = await Type.findAll();
    if (pokemonDb.length > 0) {
        return pokemonDb;
    } else {
        const response = await axios.get("https://pokeapi.co/api/v2/type");
        const data = Promise.all(
            response.data.results.map(async (t, index) => {
                let types = await Type.created({
                    id: index + 1,
                    name: t.name,
                });
                return types;
            })
        );
        return data;
    }
}

module.exports = {
    addPokemon,
    getPokemonsAPI,
    getAllPokemons,
    getPokemonId,
    getPokemonsTypes
};