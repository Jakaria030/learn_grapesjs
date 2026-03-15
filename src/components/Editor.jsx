import { lazy, useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";

const Editor = () => {
    const editorRef = useRef(null);
    const gjsEditor = useRef(null);

    const [activeDevice, setActiveDevice] = useState("Desktop");

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

        // Add custom keyboard shortcut
        gjsEditor.current.Keymaps.add(
            "custom:clear-canvas",
            "ctrl+shift+d",
            "clear-canvas",
        );

        // Add shortut for export
        gjsEditor.current.Keymaps.add(
            "custom:export",
            "ctrl+e",
            (editor) => {
                const html = editor.getHtml();
                const css = editor.getCss();
                console.log("Exported via shortuct");
                console.log("HTML:", html);
                console.log("CSS:", css);
            }
        );

        // Remove default shortcut
        gjsEditor.current.Keymaps.remove("core:undo");
        gjsEditor.current.Keymaps.add(
            "custom:undo",
            "ctrl+z",
            (editor) => {
                editor.runCommand("core:undo");
                console.log("Undo triggered!");
            },
        );

        // Add a custom command
        gjsEditor.current.Commands.add("clear-canvas", {
            run(editor) {
                editor.getWrapper().components().reset();
                editor.setStyle("");
                console.log("Canvas cleared!");
            },
        });

        // Add a command that accepts options
        gjsEditor.current.Commands.add("add-text", {
            run(editor, sender, options) {
                const text = options?.text || "Default Text";
                const tag = options?.tag || "p";

                editor.getWrapper().append(
                    `<${tag}>${text}</${tag}>`
                );

                console.log(`Added ${tag}: ${text}`);
            }
        })

        gjsEditor.current.Components.addType("image", {

            model: {
                defaults: {

                    // keep existing traits + add new ones
                    traits: [
                        {
                            type: "text",
                            name: "src",
                            label: "Image URL",
                        },
                        {
                            type: "text",
                            name: "alt",
                            label: "Alt Text",
                        },
                        {
                            type: "text",
                            name: "title",
                            label: "Title",
                        },
                        {
                            type: "select",
                            name: "loading",
                            label: "Loading",
                            options: [
                                { id: "eager", label: "Eager" },
                                { id: "lazy", label: "Lazy" },
                            ],
                        },
                    ],

                },
            },

        });

        gjsEditor.current.Components.addType("video", {

            model: {
                defaults: {
                    traits: [
                        {
                            type: "text",
                            name: "src",
                            label: "Video URL",
                        },
                        {
                            type: "checkbox",
                            name: "controls",
                            label: "Show Controls",
                        },
                        {
                            type: "checkbox",
                            name: "autoplay",
                            label: "Autoplay",
                        },
                        {
                            type: "checkbox",
                            name: "loop",
                            label: "Loop",
                        },
                        {
                            type: "checkbox",
                            name: "muted",
                            label: "Muted",
                        },
                    ],
                },
            },

        });

        // Text blocks
        gjsEditor.current.BlockManager.add("text-block", {
            label: "Text",
            content: "<p>Type your text here...</p>",
            category: "Basic",

            media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5 4v1.5H13v15h-2v-15H5.5V4h13z"/>
            </svg>`,

        });

        // Image block
        gjsEditor.current.BlockManager.add("image-block", {
            label: "Image",
            category: "Basic",
            media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 3H3v18h18V3zm-1 17H4V4h16v16zM6.5 14l3-4 2.5 3 2-2 3 4H6.5z"/>
            </svg>`,
            content: `<img src="https://picsum.photos/300/200" alt="image"/>`,
        });

        // Button block
        gjsEditor.current.BlockManager.add("button-block", {
            label: "Button",
            category: "Basic",
            media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2zm0 8H5V9h14v6z"/>
            </svg>`,
            content: `<a href="#" class="btn">Click Me</a>`,
        });

        // Alert block — uses our custom component!
        gjsEditor.current.BlockManager.add("alert-block", {
            label: "Alert",
            category: "Basic",
            media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
            </svg>`,

            // Using our custom alert-box component type
            content: { type: "alert-box" },

        });

        // Hero Section block
        gjsEditor.current.BlockManager.add("hero-block", {
            label: "Hero",
            category: "Sections",
            media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z"/>
            </svg>`,

            // content only contains HTML string
            content: `
            <section class="hero-section">
                <h1 class="hero-title">Welcome</h1>
                <p class="hero-text">Hero description here</p>
            </section>
            
            <style>
                .hero-section {
                    background: #f8f9fa;
                    padding: 60px 20px;
                    text-align: center;
                }
                .hero-title {
                    font-size: 48px;
                    color: #333;
                }
                .hero-text {
                    color: #666;
                    margin-top: 16px;
                }
            </style>`,
        });

        // Two Column block
        gjsEditor.current.BlockManager.add("two-column-block", {
            label: "2 Columns",
            category: "Sections",
            media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h8v18H3V3zm10 0h8v18h-8V3z"/>
            </svg>`,

            content: `
            <div class="two-col">
                <div class="col">Column 1</div>
                <div class="col">Column 2</div>
            </div>

            <style>
                .two-col {
                    display: flex;
                    gap: 20px;
                    padding: 20px;
                }
                .col {
                    flex: 1;
                    padding: 20px;
                    background: #f8f9fa;
                    border: 1px dashed #ccc;
                    min-height: 100px;
                    text-align: center;
                }
            </style>`,
        });

        gjsEditor.current.BlockManager.add("youtube-block", {
            label: "YouTube",
            category: "Media",
            media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
  </svg>`,
            content: `
    <div class="youtube-embed">
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        frameborder="0"
        allowfullscreen
        style="width:100%; height:315px;"
      ></iframe>
    </div>

    <style>
      .youtube-embed {
        width: 100%;
        max-width: 640px;
        margin: 0 auto;
      }
    </style>
  `,
        });

        // Locked block
        gjsEditor.current.BlockManager.add("locked-hero", {
            label: "Locked Hero",
            category: "Sections",
            content: `
            <section class="locked-hero">
                <h1>This is a Locked Hero</h1>
                <p>You cannot move or delete me!</p>
            </section>

            <style>
            .locked-hero {
                background: #e9ecef;
                padding: 60px 20px;
                text-align: center;
            }
            </style>
        `,
        });

        gjsEditor.current.BlockManager.add("fixed-navbar", {
            label: "Navbar",
            category: "Sections",
            content: {

                // tagName of the root element
                tagName: "nav",

                // CSS classes
                attributes: { class: "navbar" },

                // behavior properties set directly
                draggable: true,
                removable: false,
                copyable: false,
                selectable: true,

                // inner content
                components: `
                <div class="nav-brand">MyBrand</div>
                <div class="nav-links">
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Contact</a>
                </div>`,

                // styles
                styles: `
                .navbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 32px;
                    background: #333;
                    color: white;
                }
                .nav-brand {
                    font-size: 20px;
                    font-weight: bold;
                    color: white;
                }
                .nav-links a {
                    color: white;
                    text-decoration: none;
                    margin-left: 24px;
                }`,

            },
        });

        // Add custom component
        gjsEditor.current.Components.addType("alert-box", {
            extend: 'text',

            isComponent: (el) => {
                return (
                    el.tagName === "DIV" && el.classList.contains("alert-box")
                );
            },

            model: {
                defaults: {
                    tagName: "div",
                    components: "This is an alert box",
                    styles: `
                    .alert-box {
                        background: #fff3cd;
                        border: 1px solid #ffc107;
                        padding: 12px 16px;
                        border-radius: 4px;
                        color: #856404;
                    }`,
                    attributes: { class: "alert-box" },
                    droppable: false,

                    traits: [
                        {
                            type: "text",
                            name: "alert-message",
                            label: "Message",
                            placeholder: "Enter alert message..",
                        },
                        {
                            type: "select",
                            name: "alert-type",
                            label: "Alert Type",
                            options: [
                                { id: "warning", label: "Warning" },
                                { id: "success", label: "Success" },
                                { id: "error", label: "Error" },
                                { id: "info", label: "Info" },
                            ],
                        },
                        {
                            type: "checkbox",
                            name: "dismissible",
                            label: "Dismissible",
                            valueTrue: "true",
                            valueFalse: "false",
                        }
                    ]
                },

                init() {
                    console.log("alert-box component created!", this);

                    this.on("change:attributes", this.handleTraitChange);
                },

                handleTraitChange() {

                    // Get current trait values
                    const alertType = this.getAttributes()["alert-type"];
                    const message = this.getAttributes()["alert-message"];

                    // Change background color based on alert type
                    const colors = {
                        warning: { bg: "#fff3cd", border: "#ffc107", color: "#856404" },
                        success: { bg: "#d4edda", border: "#28a745", color: "#155724" },
                        error: { bg: "#f8d7da", border: "#dc3545", color: "#721c24" },
                        info: { bg: "#d1ecf1", border: "#17a2b8", color: "#0c5460" },
                    };
                    const style = colors[alertType] || colors.warning;

                    // Update component styles
                    this.setStyle({
                        background: style.bg,
                        border: `1px solid ${style.border}`,
                        color: style.color,
                        padding: "12px 16px",
                        "border-radius": "4px",
                    });

                    // Update message if provided
                    if (message) {
                        this.components(`⚠️ ${message}`);
                    }

                },

                updated(property, value, previous) {
                    console.log("Property changed:", property);
                    console.log("New value:", value);
                    console.log("Old value:", previous);
                }
            },

            view: {
                onRender({ el }) {
                    console.log("alert-box rendered!", el);

                    el.innerHTML = "⚠️ " + el.innerHTML;
                },
            }
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

        // Add a custom sector to Style Manager
        gjsEditor.current.StyleManager.addSector("custom-animations", {
            name: "Animation",
            open: false,
            properties: [
                {
                    id: "transition",
                    label: "Transition",
                    type: "text",
                    defaults: "all 0.3s ease",
                },
                {
                    id: "transorfm",
                    label: "Transform",
                    type: "text",
                    defaults: "none",
                },
                {
                    id: "opacity",
                    label: "Opacity",
                    type: "slider",
                    defaults: 1,
                    min: 0,
                    max: 1,
                    step: 0.1,
                }
            ]
        });

        // Add custom property type
        gjsEditor.current.StyleManager.addSector("custom-effects", {
            name: "Effects",
            open: false,
            properties: [
                {
                    id: "mix-blend-mode",
                    label: "Blend Mode",
                    type: "select",
                    defaults: "normal",
                    options: [
                        { id: "normal", label: "Normal" },
                        { id: "multiply", label: "Multiply" },
                        { id: "screen", label: "Overlay" },
                        { id: "darken", label: "Darken" },
                        { id: "lighten", label: "Lighten" },
                    ],
                },
                {
                    id: "box-shadow-color",
                    label: "Shadow Color",
                    type: "color",
                    defaults: "transparent",
                },
                {
                    id: "z-index",
                    label: "Z-Index",
                    type: "number",
                    defaults: 0,
                    min: 0,
                    max: 999,
                    step: 1,
                },
            ]
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
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>

            {/* Top bar with export button */}
            <div style={{ background: "#333", padding: "8px 16px", display: "flex", gap: 8 }}>
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