import React, { Ref, forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import Quill, { EmitterSource, Range } from 'quill';
import Delta from 'quill-delta';
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";


// Editor is an uncontrolled React component

interface Props {
  className?: string
  style?: React.CSSProperties
  readOnly?: boolean
  defaultValue?: Delta
  onTextChange?: (delta: Delta, oldDelta: Delta, source: string) => void
  onSelectionChange?: (
    range: Range,
    oldRange: Range,
    emit: EmitterSource
  ) => void
}

const Editor = forwardRef<Quill, Props>(
  ({ className, style, readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {

    const localRef = useRef<Quill>(null);
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      localRef.current?.enable(!readOnly);
    }, [localRef, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const quill = new Quill(editorContainer, {
        theme: 'snow',
      });

      localRef.current = quill;

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        localRef.current = null;
        container.innerHTML = '';
      };
    }, [localRef]);

    useImperativeHandle<Quill, Quill>(
      ref,
      () => localRef.current
    )

    return <div className={className} style={style} ref={containerRef}></div>;
  },
);

Editor.displayName = 'Editor';

export default Editor;