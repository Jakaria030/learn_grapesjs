const stylePlugin = (editor, options) => {

    // Animations Sector
    editor.StyleManager.addSector("custom-animations", {
        name: "Animations",
        open: false,
        properties: [
            {
                id: "transition",
                label: "Transition",
                type: "text",
                defaults: "all 0.3s ease",
            },
            {
                id: "transform",
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
            },
        ],
    });

    // Effects Sector
    editor.StyleManager.addSector("custom-effects", {
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
                    { id: "screen", label: "Screen" },
                    { id: "overlay", label: "Overlay" },
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
        ],
    });

};

export default stylePlugin;