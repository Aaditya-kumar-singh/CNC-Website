const getDesignFormat = (design) => {
    if (design?.format) {
        return design.format;
    }

    if (!design?.fileKey) {
        return 'DXF';
    }

    const ext = design.fileKey.split('.').pop().toUpperCase();
    return ['STL', 'DXF', 'SVG'].includes(ext) ? ext : 'DXF';
};

export default getDesignFormat;
