const navButtonsReducer = (state = { disabled: false, visibility: "visible" }, action) => {
    switch (action.type) {
        case "HIDE":
            return { disabled: true, visibility: "hidden" }
        case "SHOW":
            return { disabled: false, visibility: "visible" }
        default:
            return state;
    }
}

export default navButtonsReducer;