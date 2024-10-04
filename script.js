document.addEventListener('DOMContentLoaded', () => {
    const flipbook = $('#flipbook');
    const prevPage = $('#prevPage');
    const nextPage = $('#nextPage');

    const pdfUrl = '"C:\Users\laksh\Documents\flipbook\images\class12.pdf"'; // Update this to the correct path of your PDF

    let pdfDocument = null;

    // Load PDF document
    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
        pdfDocument = pdf;
        renderAllPages();
    });

    function renderAllPages() {
        const numPages = pdfDocument.numPages;

        for (let i = 1; i <= numPages; i++) {
            renderPage(i);
        }
    }

    function renderPage(pageNum) {
        pdfDocument.getPage(pageNum).then(page => {
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            page.render(renderContext).promise.then(() => {
                const img = document.createElement('img');
                img.src = canvas.toDataURL();
                const pageDiv = $('<div class="page"></div>').append(img);
                flipbook.append(pageDiv);
                [].push(pageDiv);

                // Initialize Turn.js after all pages are rendered
                if ([].length === pdfDocument.numPages) {
                    flipbook.turn({
                        width: 800,
                        height: 600,
                        autoCenter: true,
                        gradients: true,
                        elevation: 50
                    });

                    // Event listeners for buttons
                    prevPage.click(() => flipbook.turn('previous'));
                    nextPage.click(() => flipbook.turn('next'));

                    // Optional: Keyboard navigation
                    $(document).keydown(event => {
                        if (event.key === 'ArrowLeft') {
                            flipbook.turn('previous');
                        } else if (event.key === 'ArrowRight') {
                            flipbook.turn('next');
                        }
                    });
                }
            });
        });
    }
});
