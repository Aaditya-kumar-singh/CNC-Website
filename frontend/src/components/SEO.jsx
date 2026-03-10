import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description = "High-quality CNC designs, SVGs, and 3D STL models for professionals and hobbyists. Browse thousands of premium and free digital cutting files.",
    name = "CNC Marketplace",
    type = "website",
    url = "https://cnc-designs.com",
    image = "https://cnc-designs.com/og-image.jpg"
}) => {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title ? `${title} | ${name}` : name}</title>
            <meta name='description' content={description} />

            {/* OpenGraph tags (for Facebook, LinkedIn, Discord etc.) */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title ? `${title} | ${name}` : name} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={name} />

            {/* Twitter cards */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type === 'article' ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={title ? `${title} | ${name}` : name} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}

export default SEO;
