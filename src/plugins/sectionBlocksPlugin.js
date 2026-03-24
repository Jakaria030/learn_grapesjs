const sectionBlocksPlugin = (editor, options) => {
    // Hero Section block
    editor.BlockManager.add("hero-block", {
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
    editor.BlockManager.add("two-column-block", {
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

    // Three Column Block
    editor.BlockManager.add("three-column-block", {
        label: "3 Columns",
        category: "Sections",
        media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3h5v18H3V3zm7 0h4v18h-4V3zm6 0h5v18h-5V3z"/>
    </svg>`,
        content: `
      <div class="three-col">
        <div class="col3">Column 1</div>
        <div class="col3">Column 2</div>
        <div class="col3">Column 3</div>
      </div>

      <style>
        .three-col {
          display: flex;
          gap: 20px;
          padding: 20px;
        }
        .col3 {
          flex: 1;
          padding: 20px;
          background: #f8f9fa;
          border: 1px dashed #ccc;
          min-height: 100px;
          text-align: center;
        }
      </style>
    `,
    });

    // Footer Block
    editor.BlockManager.add("footer-block", {
        label: "Footer",
        category: "Sections",
        media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17h18v4H3v-4zm0-7h18v5H3v-5zm0-7h18v5H3V3z"/>
    </svg>`,
        content: `
      <footer class="footer">
        <p class="footer-text">© 2024 My Website. All rights reserved.</p>
      </footer>

      <style>
        .footer {
          background: #333;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .footer-text {
          margin: 0;
          color: #aaa;
        }
      </style>
    `,
    });
};

export default sectionBlocksPlugin;