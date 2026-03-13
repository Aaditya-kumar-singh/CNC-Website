export const categoryGroups = [
    {
        title: 'Main Categories',
        items: [
            { value: '2d-designs', label: '2D Designs', desc: 'High-quality 2D vector designs for laser cutting and CNC routing.' },
            { value: '2d-grill-designs', label: '2D Grill Designs', desc: 'Intricate 2D grill patterns and jali designs.' },
            { value: '3d-designs', label: '3D Designs', desc: 'Detailed 3D models and STL files for CNC carving.' },
            { value: '3d-traditional', label: '3D Traditional Designs', desc: 'Classic traditional 3D patterns and motifs.' },
            { value: 'temple-designs', label: 'Temple Designs', desc: 'Sacred temple architecture and deity carvings.' },
            { value: '3d-doors-design', label: '3D Doors Design', desc: 'Beautiful 3D door panel models.' },
            { value: 'other', label: 'Uncategorized', desc: 'Miscellaneous CNC files and general designs.' },
        ],
    },
    {
        title: '3D Design Subcategories',
        items: [
            { value: '3d-animals', label: '3D Animals', desc: 'Animal-themed 3D carving and modeling files.' },
            { value: '3d-bed', label: '3D Bed', desc: '3D bed design files and carved furniture components.' },
            { value: '3d-carnish', label: '3D Carnish', desc: 'Decorative cornice and trim carving files.' },
            { value: '3d-corners', label: '3D Corners', desc: 'Corner ornament and border carving designs.' },
            { value: '3d-crown', label: '3D Crown', desc: 'Crown-style decorative motifs and ornamental crests.' },
            { value: '3d-decor', label: '3D Decor', desc: 'Decorative 3D carvings for interior and furniture use.' },
            { value: '3d-frame', label: '3D Frame', desc: '3D frame and border carving designs.' },
            { value: '3d-god', label: '3D God', desc: 'Deity and spiritual carving files for CNC work.' },
            { value: '3d-grill', label: '3D Grill', desc: '3D grill and jali carving patterns.' },
            { value: '3d-leafs-flower-tree', label: '3D Leafs,Flower & Tree', desc: 'Nature-inspired floral, leaf, and tree carving files.' },
            { value: '3d-scenery', label: '3D Scenery', desc: 'Landscape and scenery-based 3D relief files.' },
            { value: '3d-sockets', label: '3D Sockets', desc: 'Socket, holder, and decorative fitting designs.' },
            { value: '3d-statue', label: '3D Statue', desc: 'Statue and sculpture-oriented CNC files.' },
            { value: '3d-table-chair', label: '3D Table/Chair', desc: 'Furniture carving files for tables and chairs.' },
            { value: '3d-texture-and-pallet', label: '3D Texture and Pallet', desc: 'Texture, background, and panel surface patterns.' },
            { value: '3d-wall-frame-composition', label: '3D Wall Frame Composition', desc: 'Composite wall frame layouts and ornamental sets.' },
            { value: '3d-wall-decor', label: '3D Wall Decor', desc: 'Wall decor carving files and decorative relief patterns.' },
            { value: '3d-wall-panel', label: '3D Wall Panel', desc: 'Wall panel carving files for interior installations.' },
            { value: 'other-3d-designs', label: 'Other 3D Designs', desc: 'Additional 3D designs that do not fit a specific subcategory.' },
        ],
    },
    {
        title: '3D Door Subcategories',
        items: [
            { value: '3d-modern-panel-doors', label: '3D Modern Panel Doors', desc: 'Contemporary minimalist 3D panel door designs.' },
            { value: '3d-latest-panel-door', label: '3D Latest Panel Door', desc: 'The newest trends in 3D panel door designs.' },
            { value: '3d-borderless-mdf-door', label: '3D Borderless MDF Door', desc: 'Seamless borderless door designs optimized for MDF.' },
            { value: '3d-traditional-panel-door', label: '3D Traditional Panel Door', desc: 'Classic vintage 3D panel door carvings.' },
            { value: '3d-unique-door', label: '3D Unique Door', desc: 'One-of-a-kind bespoke 3D door models.' },
        ],
    },
];

export const allCategories = categoryGroups.flatMap((group) => group.items);

export const categoryDetails = Object.fromEntries(
    allCategories.map((category) => [
        category.value,
        {
            title: category.label,
            desc: category.desc,
        },
    ])
);
