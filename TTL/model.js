const mongoose = require('mongoose');

const TtlSchema = mongoose.Schema(
    {
        string1: {
            type: String,
            require: true,
        },
        string2: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ttl', TtlSchema);
