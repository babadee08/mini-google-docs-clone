import React, { useState, useRef, useEffect } from 'react';
import { Editor } from 'slate-react';
import Mitt from 'mitt';
import { initialValue } from './slateInitialValue';

const emitter = new Mitt();


function SyncingEditor() {

    const [value, setValue] = useState(initialValue);
    const editor  = useRef(null);
    const id = useRef(`${Date.now()}`);
    const remote = useRef(false)

    useEffect(() => {
        emitter.on('*', (type, ops) => {
            if (id.current !== type) {
                // console.log('change happened in other editor');
                remote.current = true
                ops.forEach(op => editor.current.applyOperation(op));
                remote.current = false;
            }
            
        });
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
                emitter.emit(id.current, ops);
            }
        }} 
        />
    );
}

export default SyncingEditor  
