import { lazy, useEffect, useRef } from "react";
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
        <div
            ref={editorRef}
            style={{ width: "100%", height: "100%" }}
        />
    );
};

export default Editor;