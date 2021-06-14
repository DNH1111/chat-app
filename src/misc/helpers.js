// file containing reusable helper functions

// function to return user name initials
export function getNameInitials(name) {
    const splitName = name.toUpperCase().split(' ');

    // if name is two words or more, return initials of first two words
    if (splitName.length > 1) {
        return splitName[0][0] + splitName[1][0];
    }

    // else return initial of the firstname
    return splitName[0][0];
}
