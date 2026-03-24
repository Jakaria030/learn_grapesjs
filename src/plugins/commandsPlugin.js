const commandsPlugin = (editor, options) => {

    // Add a custom command
    editor.Commands.add("clear-canvas", {
        run(editor) {
            editor.getWrapper().components().reset();
            editor.setStyle("");
            console.log("Canvas cleared!");
        },
    });

    // Add custom keyboard shortcut
    editor.Keymaps.add(
        "custom:clear-canvas",
        "ctrl+shift+d",
        "clear-canvas",
    );

    // Add shortut for export
    editor.Keymaps.add(
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
    editor.Keymaps.remove("core:undo");
    editor.Keymaps.add(
        "custom:undo",
        "ctrl+z",
        (editor) => {
            editor.runCommand("core:undo");
            console.log("Undo triggered!");
        },
    );

};

export default commandsPlugin;