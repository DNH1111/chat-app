// React Component to form the Top part of the Chat page
import React from 'react';
import { useCurrentRoom } from '../../../context/current-room.context';

const Top = () => {
    // using CurrentRoom Context to get only Room name, instead of all of its data
    // CurrentRoom Context is implemented using use-context-selector
    const name = useCurrentRoom(v => v.name);

    return <div>{name}</div>;
};

export default Top;
