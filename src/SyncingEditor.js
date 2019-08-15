import React, { useState, useRef, useEffect } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
// import Mitt from 'mitt';
import { initialValue } from './slateInitialValue';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');
// const emitter = new Mitt();


function SyncingEditor({groupId}) {

    const [value, setValue] = useState(initialValue);
    const editor  = useRef(null);
    const id = useRef(`${Date.now()}`);
    const remote = useRef(false)

    useEffect(() => {

        /* socket.once('init-value', (value) => {
            //console.log('getting here');
            setValue(Value.fromJSON(value));
        });

        socket.emit('send-value'); */

        fetch(`http://localhost:4000/groups/${groupId}`).then(x => x.json().then(data => {
            // console.log(data);
            setValue(Value.fromJSON(data));
        }));

        const eventName = `new-remote-operations-${groupId}`

        socket.on(eventName, ({editorId, ops}) => {
            if (id.current !== editorId) {
                // console.log('change happened in other editor');
                remote.current = true
                ops.forEach(op => editor.current.applyOperation(op));
                remote.current = false;
            }
        });

        /* emitter.on('*', (type, ops) => {
            if (id.current !== type) {
                // console.log('change happened in other editor');
                remote.current = true
                ops.forEach(op => editor.current.applyOperation(op));
                remote.current = false;
            }
            
        }); */

        return () => {
            socket.off(eventName);
        }
    }, []);
    
    return (
        <Editor 
        ref={editor}
        style={{
            backgroundColor: '#fafafa',
            maxWidth: 800,
            minHeight: 150
        }}
        value={value} 
        onChange={val => {
            // console.log('operations');
            setValue(val.value);

            const ops = val.operations
                .filter(
                    o => {
                        if (o) {
                            return (
                                o.type !== 'set_selection' &&
                                o.type !== 'set_value' &&
                                (!o.data || !o.data.has('source'))
                            );
                        }

                        return false;
                    }
                )
                .toJS()
                .map(o => ({ ...o, data: { source: 'one' } }));

            if (ops.length & !remote.current) {
                // emitter.emit(id.current, ops);
                socket.emit('new-operations', {
                    editorId: id.current, 
                    ops: ops,
                    value: val.value.toJSON(),
                    groupId
                });
            }
        }} 
        />
    );
}

export default SyncingEditor  
