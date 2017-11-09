const request = require('./request');
const mongoose = require('mongoose');
const assert = require('chai').assert;

describe('<Resource Name Here> API', () => {
    
    before(() => mongoose.connection.dropDatabase());

    const postPet = pet => request
        .post('/api/pets')
        .send(pet)
        .then(({ body }) => body);
        
    const postRave = rave => request
        .post('/api/raves')
        .send(rave)
        .then(({ body }) => body);

    let pets = null;
    let raves = null;

    before(() => {
        return Promise.all([
            postPet({ name: 'janky', type: 'cat', breed: 'tabby', catchPhrase: 'all about FPS!' }),
            postPet({ name: 'echo', type: 'bird', breed: 'parrot', catchPhrase: 'say what?' })
        ])
            .then(([janky, echo]) => {
                pets = { janky, echo };
                return Promise.all([
                    postRave({ pet: janky._id, comments: 'seemed slow on my machine', email: 'bob@bob.com' }),
                    postRave({ pet: echo._id, comments: 'very saucy', email: 'bob@bob.com' }),
                    postRave({ pet: janky._id, comments: 'how smooth', email: 'sally@sally.com' }),
                    postRave({ pet: echo._id, comments: 'what a smart bird!', email: 'sally@sally.com' })
                ]);
            })
            .then(_raves => {
                raves = _raves;
            });
    });

    it('GET /pets', () => {
        return request.get('/api/pets')
            .then(({ body }) => {
                assert.equal(body.length, 2);
                assert.ok(body.find(p => p.name === pets.janky.name));
                assert.ok(body.find(p => p.name === pets.echo.name));
            });
    });

    it('GET /pets by type', () => {
        return request.get('/api/pets?type=cat')
            .then(({ body }) => {
                assert.equal(body.length, 1);
                assert.equal(body[0].name, pets.janky.name);
            });
    });

    it('GET /raves', () => {
        return request.get('/api/raves')
            .then(({ body }) => {
                assert.equal(body.length, 4);
                assert.ok(body[0].pet.name);
                assert.ok(body[0].pet.type);
            });
    });

    it('GET /pets detail', () => {
        return request.get(`/api/pets/${pets.janky._id}`)
            .then(({ body }) => {
                assert.ok(body.name);
                assert.ok(body.type);
                assert.ok(body.breed);
                assert.ok(body.catchPhrase);
                assert.ok(body.raves);
                assert.equal(body.raves.length, 2);
                const jankyRaves = raves.filter(r => r.pet === pets.janky._id);
                assert.equal(body.raves.length, jankyRaves.length);
            });
    });


});