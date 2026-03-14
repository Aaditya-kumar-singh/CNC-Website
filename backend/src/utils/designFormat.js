const path = require('path');

const getDesignFormatFromFileKey = (fileKey) => {
    const extension = path.extname(fileKey || '').replace('.', '').toUpperCase();

    if (['STL', 'DXF', 'SVG'].includes(extension)) {
        return extension;
    }

    return 'DXF';
};

module.exports = {
    getDesignFormatFromFileKey,
};
