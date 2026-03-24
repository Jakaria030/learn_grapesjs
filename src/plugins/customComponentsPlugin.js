const customComponentsPlugin = (editor, options) => {
    // Add custom component
    editor.Components.addType("alert-box", {
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

    // Alert block — uses our custom component!
    editor.BlockManager.add("alert-block", {
        label: "Alert",
        category: "Basic",
        media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
            </svg>`,

        // Using our custom alert-box component type
        content: { type: "alert-box" },

    });
};

export default customComponentsPlugin;