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

            deviceManager: {
                devices: [
                    {
                        name: "Desktop",
                        width: "",
                    },
                    {
                        name: "Tablet",
                        width: "768px",
                        widthMedia: "992px",
                    },
                    {
                        name: "Mobile",
                        width: "375px",
                        widthMedia: "480px",
                    },
                ],
            },
        });


        // Inject reset CSS into canvas iframe
        gjsEditor.current.on("load", () => {
            const iframeDoc = gjsEditor.current.Canvas.getDocument();
            const resetStyle = iframeDoc.createElement("style");

            resetStyle.innerHTML = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: sans-serif !important;
                min-height: 100vh !important;
                background: #ffffff !important;
            }
            `;

            iframeDoc.head.appendChild(resetStyle);
        })


        // Temporarily expose editor to window for console testing
        window.gjsEditor = gjsEditor.current;

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