import { createStore } from "redux";

const initialState = {}

function reducers(state = initialState, action) {
    if (action.type === "prestamos/showAll"){
        console.log(initialState)
    }

    return {
        testing : ""
    };
    
}

export default () => {
    return {
        ...createStore(reducers)
    };
};