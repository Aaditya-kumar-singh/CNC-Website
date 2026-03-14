const { getDesignFormatFromFileKey } = require('./designFormat');

const serializeDesign = (design) => {
    if (!design) {
        return design;
    }

    const plainDesign = typeof design.toObject === 'function' ? design.toObject() : { ...design };

    return {
        ...plainDesign,
        format: getDesignFormatFromFileKey(plainDesign.fileKey),
        fileKey: undefined,
    };
};

module.exports = serializeDesign;
