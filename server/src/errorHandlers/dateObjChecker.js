const dateObjChecker = (checked) => {

    if(!(checked instanceof Date)){

        throw new Error('arg must be a Date obj')
    }

    return true

}

module.exports = dateObjChecker;
