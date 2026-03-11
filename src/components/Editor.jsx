import { useEffect, useRef } from "react";
import grapesjs from "grapesjs";

const Editor = () => {
    const editorRef = useRef(null);
    const gjsEditor = useRef(null);

    useEffect(() => {
        if (!editorRef.current) return;

        // Initialize GrapesJS and store the instance
        gjsEditor.current = grapesjs.init({
            container: editorRef.current,

            height: "100%",
            width: "100%",

            storageManager: false,

            fromElement: false,
        });

        // Cleanup function
        return () => {
            gjsEditor.current.destroy();
            gjsEditor.current = null;
        };

    }, []);

    return (
        <div
            ref={editorRef}
            style={{ width: "100%", height: "100%" }}
        />
    );
};

export default Editor;