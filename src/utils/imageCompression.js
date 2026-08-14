/**
 * Progressively compresses an image file to be under maxSizeBytes.
 * Supports JPEG, PNG, and WebP.
 * Converts PNG to JPEG if file size exceeds the target to allow compression.
 * 
 * @param {File} file - The uploaded image file.
 * @param {number} maxSizeBytes - Maximum size allowed in bytes (default 500 KB).
 * @returns {Promise<{file: File, previewUrl: string, originalSize: number, compressedSize: number}>}
 */
export const compressImage = (file, maxSizeBytes = 500 * 1024) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Downscale resolution if extremely large to maintain performance (max 1200px)
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Define output formats.
        // PNG is lossless and cannot be quality compressed. If it's too large, convert to image/jpeg.
        let outputMime = file.type;
        let outputName = file.name;
        if (file.type === 'image/png' && file.size > maxSizeBytes) {
          outputMime = 'image/jpeg';
          outputName = file.name.replace(/\.png$/i, '.jpg');
        }

        let quality = 0.9;
        const step = 0.08;

        const checkAndCompress = (currentQuality) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas compression failed'));
                return;
              }

              // Resolve if target size met or minimum quality reached
              if (blob.size <= maxSizeBytes || currentQuality <= 0.1) {
                const compressedFile = new File([blob], outputName, {
                  type: blob.type || outputMime,
                  lastModified: Date.now()
                });
                
                resolve({
                  file: compressedFile,
                  previewUrl: URL.createObjectURL(blob),
                  originalSize: file.size,
                  compressedSize: compressedFile.size
                });
              } else {
                checkAndCompress(currentQuality - step);
              }
            },
            outputMime,
            currentQuality
          );
        };

        checkAndCompress(quality);
      };
      img.onerror = () => reject(new Error('Failed to load image element'));
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
  });
};

/**
 * Converts page 1 of a PDF file to a high-resolution canvas and compresses it to a JPEG image file under maxSizeBytes (default 500 KB).
 * 
 * @param {File} pdfFile - The uploaded PDF file.
 * @param {number} maxSizeBytes - Target maximum size in bytes (default 500 KB).
 * @returns {Promise<{file: File, previewUrl: string, originalSize: number, compressedSize: number}>}
 */
export const compressPdfToImage = async (pdfFile, maxSizeBytes = 500 * 1024) => {
  return new Promise((resolve, reject) => {
    const loadScript = () => {
      if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
      return new Promise((res, rej) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            res(window.pdfjsLib);
          } else {
            rej(new Error('PDF.js failed to initialize'));
          }
        };
        script.onerror = () => rej(new Error('Failed to load PDF processor from CDN'));
        document.body.appendChild(script);
      });
    };

    loadScript()
      .then(async (pdfjsLib) => {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              reject(new Error('PDF rendering failed'));
              return;
            }
            const imageName = pdfFile.name.replace(/\.pdf$/i, '.jpg');
            const imageFile = new File([blob], imageName, { type: 'image/jpeg' });

            try {
              const compressedResult = await compressImage(imageFile, maxSizeBytes);
              resolve({
                file: compressedResult.file,
                previewUrl: compressedResult.previewUrl,
                originalSize: pdfFile.size,
                compressedSize: compressedResult.compressedSize
              });
            } catch (err) {
              reject(err);
            }
          },
          'image/jpeg',
          0.85
        );
      })
      .catch(reject);
  });
};
