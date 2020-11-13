export const hideNavButtons = () => {
    return {
        type: "HIDE"
    }
}

export const showNavButtons = () => {
    return {
        type: "SHOW"
    }
}

export const logIn = () => {
    return {
        type: "LOGIN"
    }
}

export const logOut = () => {
    return {
        type: "LOGOUT"
    }
}

export const addToken = (token) => {
    return {
        type: "ADD_TOKEN",
        token: token
    }
}