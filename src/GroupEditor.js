import React from 'react'
import SyncingEditor from './SyncingEditor';

function GroupEditor({match, location}) {
    const id = match.params.id;
    //console.log("location: " + location);
    return (
        <div>
            <SyncingEditor groupId={id} />
        </div>
    )
}

export default GroupEditor
