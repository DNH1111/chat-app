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

// function to convert database snapshot values from JSON to array
export function transformToArrayWithId(snapVal) {
    /* snapVal refers to the contents of snap.val() used inside the callback function inside the on() function,
        while retrieving the contents of the database. It has the contents of the database in JSON format,
        which is to be converted into an array.
    */
    /* if snapVal is not null, return an array of objects where each object consists of a key and its values 
        from snapVal
        eg: suppose snapVal = {
                        roomId: {
                            name,
                            description
                        }
                    } 
            then return in this form: [
                                        {
                                            name,
                                            description,
                                            roomId
                                        }
                                    ]
           
    */
    return snapVal
        ? Object.keys(snapVal).map(roomId => {
              return { ...snapVal[roomId], id: roomId };
          })
        : [];
}

export async function getUserUpdates(userId, keyToUpdate, value, db) {
    const updates = {};

    updates[`profiles/${userId}/${keyToUpdate}`] = value;

    const getMessages = db
        .ref('/messages')
        .orderByChild('author/uid')
        .equalTo(userId)
        .once('value');

    const getRooms = db
        .ref('/rooms')
        .orderByChild('lastMessage/author/uid')
        .equalTo(userId)
        .once('value');

    // both the promises, snapMessages and getRooms will return snapshots
    const [mSnap, rSnap] = await Promise.all([getMessages, getRooms]);

    mSnap.forEach(messageSnap => {
        updates[`/messages/${messageSnap.key}/author/${keyToUpdate}`] = value;
    });

    rSnap.forEach(roomSnap => {
        updates[`/rooms/${roomSnap.key}/lastMessage/author/${keyToUpdate}`] =
            value;
    });

    return updates;
}
