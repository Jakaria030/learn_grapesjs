const rtePlugin = (editor, options) => {

    // Wait for editor to fully load
    editor.on("load", () => {

        editor.RichTextEditor.add("h1", {
            order: 6,
            icon: "<b>H1</b>",
            attributes: { title: "Heading 1" },
            result: (rte, action) => {
                const selected = rte.selection();
                if (selected) {
                    rte.insertHTML(`<h1>${selected}</h1>`);
                }
            },
        });

        editor.RichTextEditor.add("h2", {
            order: 7,
            icon: "<b>H2</b>",
            attributes: { title: "Heading 2" },
            result: (rte, action) => {
                const selected = rte.selection();
                if (selected) {
                    rte.insertHTML(`<h2>${selected}</h2>`);
                }
            },
        });

        editor.RichTextEditor.add("h3", {
            order: 8,
            icon: "<b>H3</b>",
            attributes: { title: "Heading 3" },
            result: (rte, action) => {
                const selected = rte.selection();
                if (selected) {
                    rte.insertHTML(`<h3>${selected}</h3>`);
                };
            },
        });

        editor.RichTextEditor.add("clear-format", {
            order: 9,
            icon: "✕",
            attributes: { title: "Clear Formatting" },
            result: (rte, action) => {
                const selected = rte.selection();
                console.log(selected)
                if(selected){
                    const textNode = document.createTextNode(selected);
                    const range = editor.Canvas.getDocument().getSelection().getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(textNode);
                }
            },
        });

    });

};

export default rtePlugin;