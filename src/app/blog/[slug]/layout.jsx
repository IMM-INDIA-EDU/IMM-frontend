import { Metadata } from "next";

// This function generates metadata for each blog post
export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    // First try to get the post with potential AIOSEO meta fields
    const response = await fetch(
      `https://stealthlearn.in/immblog/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      return {
        title: "Post Not Found | IMM India",
        description: "The requested blog post could not be found.",
      };
    }

    const posts = await response.json();

    if (posts.length === 0) {
      return {
        title: "Post Not Found | IMM India",
        description: "The requested blog post could not be found.",
      };
    }

    const post = posts[0];

    // Try to get meta description from All in One SEO plugin
    let metaDescription = "";
    
    try {
      // Try All in One SEO API first (since it's the plugin being used)
      const aioseoResponse = await fetch(
        `https://stealthlearn.in/immblog/wp-json/aioseo/v1/head?url=https://stealthlearn.in/immblog/${slug}/`
      );
      if (aioseoResponse.ok) {
        const aioseoData = await aioseoResponse.json();
        metaDescription = aioseoData?.head?.description || aioseoData?.description || "";
      }
    } catch (error) {
      console.log("All in One SEO API not available, trying alternative methods");
    }

    // If no meta description from AIOSEO API, try custom meta fields
    if (!metaDescription) {
      try {
        // Check if post has AIOSEO meta fields in the response
        const aioseoMeta = post.meta?._aioseo_description || post.meta?.aioseo_description;
        if (aioseoMeta) {
          metaDescription = aioseoMeta;
        }
      } catch (error) {
        console.log("AIOSEO meta fields not found in post data");
      }
    }

    // If still no meta description, try scraping the actual page
    if (!metaDescription) {
      try {
        const pageResponse = await fetch(`https://stealthlearn.in/immblog/${slug}/`);
        const pageHtml = await pageResponse.text();
        
        // Extract meta description from HTML
        const metaDescMatch = pageHtml.match(/<meta name="description" content="([^"]*)"[^>]*>/i);
        if (metaDescMatch) {
          metaDescription = metaDescMatch[1];
        }
      } catch (error) {
        console.log("Could not scrape page for meta description");
      }
    }

    // Fallback to excerpt if no SEO meta description found
    if (!metaDescription) {
      metaDescription = post.excerpt.rendered
        .replace(/<[^>]+>/g, "")
        .slice(0, 160);
    } else {
      // Clean and truncate the meta description
      metaDescription = metaDescription
        .replace(/<[^>]+>/g, "")
        .slice(0, 160);
    }

    const canonicalUrl = `https://immindia.edu.in/blog/${slug}`;
    const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

    return {
      title: `${post.title.rendered} | IMM India`,
      description: metaDescription,
      keywords:
        post._embedded?.["wp:term"]?.[0]?.map((term) => term.name).join(", ") ||
        "",
      authors: [{ name: "blogimmadmin" }],
      creator: "IMM India",
      publisher: "IMM India",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL("https://immindia.edu.in"),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: post.title.rendered,
        description: metaDescription,
        url: canonicalUrl,
        siteName: "IMM India",
        images: featuredImage
          ? [
              {
                url: featuredImage,
                width: 1200,
                height: 630,
                alt: post.title.rendered,
              },
            ]
          : [],
        locale: "en_US",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: post.title.rendered,
        description: metaDescription,
        images: featuredImage ? [featuredImage] : [],
      },
      other: {
        "article:published_time": post.date,
        "article:modified_time": post.modified,
        "article:author": "blogimmadmin",
        "article:section": "Blog",
        "article:tag":
          post._embedded?.["wp:term"]?.[0]
            ?.map((term) => term.name)
            .join(", ") || "",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post | IMM India",
      description: "Read the latest insights and articles from IMM India.",
    };
  }
}

export default function BlogLayout({ children }) {
  return children;
}
