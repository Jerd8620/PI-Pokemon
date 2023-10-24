const { Router } = require('express');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const {
    addPokemon,
    getPokemonApi,
    getPokemonTypes,
    getAllPokemons,
} = require("../controllers/controllers");
const { Pokemon, Type } = require("../db");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

// GET all pokemon
router.get("/pokemons", async (req, res) => {
    let { name } = req.query;
    if (name) {
        const pokemonDB = await Pokemon.findAll({
            where: {
                name: name.toLowerCase(),

            },
        });
        if (pokemonDB.length) {
            return res.json(pokemonDB);
        } else {
            const pokemonsApi = await getPokemonApi();
            const foundPokemon = pokemonsApi.filter(
                (p) => p.name === name.toLowerCase()
            );
            if (foundPokemon) {
                return res.json(foundPokemon);
            } else {
                return res.json("Pokemon no encontrado");
            }
        }
    }
    const pokemons = await getAllPokemons();
    return res.status(200).json(pokemons);
});

// GET Pokemon ID

router.get("/pokemons/:idPokemon", async (req, res) => {
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
            const pokemonsApi = await getPokemonApi();
            const foundPokemon = pokemonsApi.find((p) => p.id === id);
            if (foundPokemon) {
                return res.json(foundPokemon);
            } else {
                return res.json("ID ingresado no pertenece a ningun pokemon");
            }
        }
    }
    return res.send("El ID tiene que ser numero").status(404);
});


// POST Pokemon
router.post("/pokemons", async (req, res) => {
    await addPokemon(req, res);
});

// GET types
router.get("/types", async (req, res) => {
    const pokemonTypes = await getPokemonTypes();
    return res.json(pokemonTypes);
})

module.exports = router;
