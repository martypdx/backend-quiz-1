const router = require('express').Router();
const Pet = require('../models/pet');
const Rave = require('../models/rave');

module.exports = router
    .post('/', (req, res, next) => {
        new Pet(req.body).save()
            .then(pet => res.json(pet))
            .catch(next);
    })
    
    .get('/', (req, res, next) => {
        const { type } = req.query;
        const query = type ? { type } : {};
        Pet.find(query)
            .select('name type')
            .lean()
            .then(pets => res.json(pets))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Promise.all([
            Pet.findById(id)
                .populate('raves', 'pet comments email')
                .lean(),
            Rave.find({ pet: id })
                .lean()
        ])
            .then(([pet, raves]) => {
                pet.raves = raves;
                res.json(pet);
            })
            .catch(next);
    });