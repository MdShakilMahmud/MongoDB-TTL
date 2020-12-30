const express = require('express');
const router = express.Router();
const TtlSchema = require('./model');

router.get('/', (req, res) => {
    const host = req.headers.host;
    res.send({
        create: `http://${host}/create/anyString/anyString`,
        getAll: `http://${host}/getall`,
        setTTL: `http://${host}/setttl/seconds`,
        deleteAll: `http://${host}/truncatedb`,
    });
});

//create a new document
router.get('/create/:string1/:string2', async (req, res) => {
    if (
        req.params.string1 === 'anyString' ||
        req.params.string2 === 'anyString'
    ) {
        res.send(
            'Please replace "anyString" with whatever you want but should be string'
        );
    } else {
        const data = new TtlSchema({
            string1: req.params.string1,
            string2: req.params.string2,
        });
        try {
            const response = await data.save();
            res.send({
                response,
                GoHome: `http://${req.headers.host}`,
                getAll: `http://${req.headers.host}/getall`,
            });
        } catch (err) {
            res.send(err);
        }
    }
});

// get all the documents
router.get('/getall', async (req, res) => {
    try {
        const response = await TtlSchema.find();
        res.send({ response, GoHome: `http://${req.headers.host}` });
    } catch (err) {
        res.send(err);
    }
});

// set index for a collection to Time To Leave (TTL)
router.get('/setttl/:seconds', async (req, res) => {
    if (req.params.seconds !== 'seconds') {
        // params alway string
        // make it integer
        const seconds = parseInt(req.params.seconds, 10);
        if (seconds) {
            try {
                // it's safe to delete previous index and create a new one with new conditions
                // Get all indexes only for this collection
                const indexes = await TtlSchema.collection.getIndexes();
                // delete the index if exist
                if (indexes.hasOwnProperty('createdAt_1')) {
                    await TtlSchema.collection.dropIndex('createdAt_1');
                }
                // create a new index with new conditions
                const response = await TtlSchema.collection.createIndex(
                    { createdAt: 1 },
                    { expireAfterSeconds: seconds }
                );
                res.send({ response, GoHome: `http://${req.headers.host}` });
            } catch {
                res.send(err);
            }
        } else {
            res.send({
                message: 'Enter a number instead of string.',
                Back: `http://${req.headers.host}/seconds`,
            });
        }
    } else {
        res.send({
            message: 'Please replace "seconds" with number',
            example: {
                '2 days': 172800,
                '1 day': 86400,
                '1 hour': 3600,
                '30 minutes': 1800,
                '5 minutes': 300,
                '1 minute': 60,
                '1 second': 1,
            },
            Note: '',
            GoHome: `http://${req.headers.host}`,
        });
    }
});

// delete the full database
router.get('/truncatedb', async (req, res) => {
    try {
        const response = await TtlSchema.remove();
        res.send({ response, GoHome: `http://${req.headers.host}` });
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;
