const router = require('express').Router();
const Rave = require('../models/rave');
const Pet = require('../models/pet');

module.exports = router
    .post('/', (req, res, next) => {
        const { pet, email } = req.body;
        Promise.all([
            Pet.findById(pet).count(),
            Rave.findOne({ pet, email }).count()
        ])
            .then(([petCount, raveCount]) => {
                if(petCount === 0) throw { code: 400, error: 'pet does not exist' };
                if(raveCount > 0) throw { code: 400, error: 'rave for pet and email already exists'};

                return new Rave(req.body).save();
            })
            .then(rave => res.json(rave))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Rave.find()
            .select('comments email pet')
            .populate('pet', 'name type')
            .lean()
            .then(pets => res.json(pets))
            .catch(next);
    });