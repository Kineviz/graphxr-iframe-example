module.exports = {
    "parserOptions": {
        "ecmaVersion": 2017
    },

 
    "env": {
        "browser": true,
        "node": true,
        "jest": true,
        "commonjs": true,
        "es6": true,
     },
    "settings": {
        "react": {
            "version": "detect"
        },
        "propWrapperFunctions": [
            // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
            "forbidExtraProps",
            // {"property": "freeze", "object": "Object"},
            // {"property": "myFavoriteWrapper"}
        ],
    },
    "rules": {
        "no-unused-vars":1,
        "no-useless-escape":1,
        "no-extra-semi":1,
        "no-var": 1, 
    },
   
};

