const initState = {
    value: '初始值'
}

const reducer = (state = initState, action) => {
    switch(action.type){
        case "send_type":
            return Object.assign({}, state, action);
        default: 
            return state;
    }
}

module.exports = {
    reducer
}