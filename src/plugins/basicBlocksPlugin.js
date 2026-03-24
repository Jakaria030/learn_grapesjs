
const basicBlocksPlugin = (editor, options) => {

    // Text blocks
    editor.BlockManager.add("text-block", {
        label: "Text",
        content: "<p>Type your text here...</p>",
        category: "Basic",

        media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5 4v1.5H13v15h-2v-15H5.5V4h13z"/>
            </svg>`,

    });

    // Image block
    editor.BlockManager.add("image-block", {
        label: "Image",
        category: "Basic",
        media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 3H3v18h18V3zm-1 17H4V4h16v16zM6.5 14l3-4 2.5 3 2-2 3 4H6.5z"/>
            </svg>`,
        content: `<img src="https://picsum.photos/300/200" alt="image"/>`,
    });

    // Button block
    editor.BlockManager.add("button-block", {
        label: "Button",
        category: "Basic",
        media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2zm0 8H5V9h14v6z"/>
            </svg>`,
        content: `<a href="#" class="btn">Click Me</a>`,
    });

    // Divider Block
    editor.BlockManager.add("divider-block", {
        label: "Divider",
        category: "Basic",
        media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12h18v1H3z"/>
    </svg>`,
        content: `
      <hr class="divider"/>
      <style>
        .divider {
          border: none;
          border-top: 2px solid #eee;
          margin: 20px 0;
        }
      </style>
    `,
    });

};

export default basicBlocksPlugin;