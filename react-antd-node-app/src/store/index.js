import { createStore, combineReducers } from 'redux'

const userReducer = (state = { value: 'user初始值' }, action) => {
    switch (action.type) {
        case 'user_action':
            return Object.assign({}, state, action);
        default:
            return state;
    }
}

const widgetReducer = (state = { value: 'widget初始值' }, action) => {
    switch (action.type) {
        case 'widget_action':
            return Object.assign({}, state, action);
        default:
            return state;
    }
}

const reducers = combineReducers({
    userState: userReducer,
    widgetState: widgetReducer
})

const store = createStore(reducers)

export default store