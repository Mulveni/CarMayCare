export const infoText = () => {
    return {
        color: "white",
        backgroundColor: "#F26101",
        borderRadius: 10,
        paddingLeft: 10,
        marginTop: 20
    }
}

export const defaultButton = () => {
    return {
        display: "flex", flexDirection: "column",
        marginTop: 8,
        margin: 'auto',
        color: "white",
        backgroundColor: "#304269",
        '&:hover': {
            backgroundColor: "#F26101"
        }
    }
}

export const defaultLink = () => {
    return {
        display: "flex",
        justifyContent: "center",
        marginTop: 25
    }
}