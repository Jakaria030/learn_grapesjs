const mediaBlocksPlugin = (editor, options) => {
    // Extend Image Component
    editor.Components.addType("image", {
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

    // Extend Video Component
    editor.Components.addType("video", {
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

    // YouTube Block
    editor.BlockManager.add("youtube-block", {
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

    // Video Block
    editor.BlockManager.add("video-block", {
        label: "Video",
        category: "Media",
        media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
    </svg>`,
        content: `
      <video class="video-block" controls>
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"/>
      </video>

      <style>
        .video-block {
          width: 100%;
          max-width: 640px;
          display: block;
          margin: 0 auto;
        }
      </style>
    `,
    });
};

export default mediaBlocksPlugin;