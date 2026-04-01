import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";

// Import custom plugin
import basicBlocksPlugin from "../plugins/basicBlocksPlugin";
import sectionBlocksPlugin from "../plugins/sectionBlocksPlugin";
import customComponentsPlugin from "../plugins/customComponentsPlugin";
import mediaBlocksPlugin from "../plugins/mediaBlocksPlugin";
import commandsPlugin from "../plugins/commandsPlugin";
import stylePlugin from "../plugins/stylePlugin";
import rtePlugin from "../plugins/rtePlugin";

const Editor = () => {
    const editorRef = useRef(null);
    const gjsEditor = useRef(null);
    const pageIdRef = useRef(null);

    const [activeDevice, setActiveDevice] = useState("Desktop");

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const updateUndoRedoState = () => {
        setCanUndo(gjsEditor.current.UndoManager.hasUndo());
        setCanRedo(gjsEditor.current.UndoManager.hasRedo());
    };

    const handleUndo = () => {
        gjsEditor.current.UndoManager.undo();
        updateUndoRedoState();
    };

    const handleRedo = () => {
        gjsEditor.current.UndoManager.redo();
        updateUndoRedoState();
    };

    const handleImport = () => {
        const html = prompt("Paste your HTML here:");
        if (!html) return;

        gjsEditor.current.setComponents(html);
    };

    const handleExport = () => {
        const html = gjsEditor.current.getHtml();
        const css = gjsEditor.current.getCss();

        const fullPage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>My Page</title>
            <style>${css}</style>
        </head>
        ${html}
        </html>
        `;

        const blob = new Blob([fullPage], { type: "text/html" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "my-page.html";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleClear = () => {
        const confirmed = window.confirm("Are you sure you want to clear the canvas?");

        if (!confirmed) return;

        gjsEditor.current.runCommand("clear-canvas");
    };

    const handleDeviceChange = (device) => {
        gjsEditor.current.setDevice(device);
        setActiveDevice(device);
    };

    const handleSave = async () => {
        try {

            // Get current project data from GrapesJS
            const projectData = gjsEditor.current.getProjectData();

            // Send to backend
            const response = await fetch(`http://localhost:5000/api/pages/${pageIdRef.current}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "Untitled Page",
                    projectData: projectData,
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert("Page saved successfully!");
            }

        } catch (error) {
            console.error("Save error:", error);
            alert("Save failed!");
        }

    };

    const handleLoad = async () => {

        try {

            // Fetch page data from backend
            const response = await fetch(`http://localhost:5000/api/pages/${pageIdRef.current}`);
            const data = await response.json();

            if (data.success) {

                // Load project data into GrapesJS
                gjsEditor.current.loadProjectData(data.data.projectData);
                alert("Page loaded successfully!");

            }

        } catch (error) {
            console.error("Load error:", error);
            alert("Load failed!");
        }

    };

    useEffect(() => {

        const initPage = async () => {
            const savedPageId = localStorage.getItem("current-page-id");

            if (savedPageId) {
                pageIdRef.current = savedPageId;
                console.log("Existing page loaded:", savedPageId);
            } else {
                const response = await fetch("http://localhost:5000/api/pages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "Untitled Page",
                        projectData: {},
                    }),
                });
                const data = await response.json();
                pageIdRef.current = data.data._id;
                localStorage.setItem("current-page-id", pageIdRef.current);
                console.log("New page created:", pageIdRef.current);
            }
        };

        initPage();

    }, []);

    useEffect(() => {
        if (!editorRef.current) return;

        // Initialize GrapesJS and store the instance
        gjsEditor.current = grapesjs.init({
            container: editorRef.current,
            height: "100%",
            width: "100%",
            storageManager: false,
            fromElement: false,

            // add plugin
            plugins: [basicBlocksPlugin, sectionBlocksPlugin, customComponentsPlugin, mediaBlocksPlugin, commandsPlugin, stylePlugin, rtePlugin],

            // plugin option empty for now
            pluginsOpts: {
                [basicBlocksPlugin]: {},
                [sectionBlocksPlugin]: {},
                [customComponentsPlugin]: {},
                [mediaBlocksPlugin]: {},
                [commandsPlugin]: {},
                [stylePlugin]: {},
                [rtePlugin]: {},
            },

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
                    {
                        name: "4K",
                        width: "2560px",
                        widthMedia: "2560px",
                    },
                    {
                        name: "Small Mobile",
                        width: "320px",
                        widthMedia: "320px",
                    },
                ],
            },

            assetManager: {
                upload: true,
                uploadFile: (e) => {
                    console.log("E: ", e, "\n");

                    console.log(e.target.files)

                    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
                    console.log("Files: ", files, "\n");

                    Array.from(files).forEach((file) => {
                        const url = URL.createObjectURL(file);

                        gjsEditor.current.AssetManager.add({
                            type: "image",
                            src: url,
                            name: file.name,
                        });
                    });
                },
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

            // Add default assets
            gjsEditor.current.AssetManager.add([
                {
                    type: "image",
                    src: "https://picsum.photos/300/200?random=1",
                    name: "Image 1",
                    width: 300,
                    height: 200,
                },
                {
                    type: "image",
                    src: "https://picsum.photos/300/200?random=2",
                    name: "Image 2",
                    width: 300,
                    height: 200,
                },
                {
                    type: "image",
                    src: "https://picsum.photos/300/200?random=3",
                    name: "Image 3",
                    width: 300,
                    height: 200,
                },
            ]);
        });

        // Listen for canvas changes to update undo/redo state
        gjsEditor.current.on("component:add", () => {
            setTimeout(updateUndoRedoState, 100);
        });

        gjsEditor.current.on("component:remove", () => {
            setTimeout(updateUndoRedoState, 100);
        });

        gjsEditor.current.on("component:update", () => {
            setTimeout(updateUndoRedoState, 100);
        });

        gjsEditor.current.on("component:change", () => {
            setTimeout(updateUndoRedoState, 100);
        });

        // Temporarily expose editor to window for console testing
        window.gjsEditor = gjsEditor.current;

        // Cleanup function
        return () => {
            gjsEditor.current.destroy();
            gjsEditor.current = null;
        };

    }, []);

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>

            {/* Top bar with export button */}
            <div style={{ background: "#333", padding: "8px 16px", display: "flex", gap: 8 }}>
                <button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    style={{
                        background: canUndo ? "#555" : "#2a2a2a",
                        color: canUndo ? "white" : "#666",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: 4,
                        cursor: canUndo ? "pointer" : "not-allowed",
                    }}
                >
                    ↩ Undo
                </button>

                <button
                    onClick={handleRedo}
                    disabled={!canRedo}
                    style={{
                        background: canRedo ? "#555" : "#2a2a2a",
                        color: canRedo ? "white" : "#666",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: 4,
                        cursor: canRedo ? "pointer" : "not-allowed",
                    }}
                >
                    ↪ Redo
                </button>

                <button
                    onClick={handleExport}
                    style={{ background: "#4361ee", color: "white", border: "none", padding: "6px 16px", borderRadius: 4, cursor: "pointer" }}
                >
                    Export HTML
                </button>

                <button
                    onClick={handleImport}
                    style={{ background: "#2ec4b6", color: "white", border: "none", padding: "6px 16px", borderRadius: 4, cursor: "pointer" }}
                >
                    Import HTML
                </button>

                <button
                    onClick={handleClear}
                    style={{ background: "#ef233c", color: "white", border: "none", padding: "6px 16px", borderRadius: 4, cursor: "pointer" }}
                >
                    Clear Canvas
                </button>

                <div style={{ width: 1, height: 24, background: "#555" }} />

                {
                    ["Desktop", "Tablet", "Mobile"].map((device) => {
                        return (<button
                            key={device}
                            onClick={() => handleDeviceChange(device)}
                            style={{
                                background: activeDevice === device ? "#4361ee" : "#555",
                                color: "white",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: 4,
                                cursor: "pointer",
                            }}
                        >
                            {device == "Desktop" ? "🖥️" : "📱"} {device}
                        </button>)
                    })
                }

                <div style={{ width: 1, height: 24, background: "#555" }} />

                <button
                    onClick={handleSave}
                    style={{ background: "#2a9d8f", color: "white", border: "none", padding: "6px 16px", borderRadius: 4, cursor: "pointer" }}
                >
                    💾 Save
                </button>

                <button
                    onClick={handleLoad}
                    style={{ background: "#e9c46a", color: "#333", border: "none", padding: "6px 16px", borderRadius: 4, cursor: "pointer" }}
                >
                    📂 Load
                </button>
            </div>

            {/* GrapesJS canvas */}
            <div
                ref={editorRef}
                style={{ flex: 1 }}
            />

        </div>
    );
};

export default Editor;