const INITIAL_STATE = {
    id: 0,
    name: "",
    address: "",
    province: "",
    city: "",
    district: "",
    latitude: 0,
    longitude: 0,
}

export const warehousesReducer = (state = INITIAL_STATE, action) => {
    console.log("data dari action: ", action);
    switch (action.type){
        case "GET_WAREHOUSE":
            return {...state, ...action.payload}
        default:
            return state
    }
}