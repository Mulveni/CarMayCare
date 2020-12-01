import Colors from '../styles/colors';

export const infoText = () => {
    return {
        color: "white",
        backgroundColor: Colors.orange,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 20
    }
}

export const defaultButton = () => {
    return {
        color: "white",
        backgroundColor: Colors.blue1,
        '&:hover': {
            backgroundColor: Colors.orange
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

export const background = () => {
    return {
        backgroundColor: Colors.blue3,
        margin: "auto",
        maxWidth: 1024
    }
}