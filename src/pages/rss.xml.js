import rss from '@astrojs/rss';

// Step 1: Load the Markdown files as async functions
const postImports = import.meta.glob('/src/pages/posts/**/*.md');

export async function GET(context) {
  // Step 2: Resolve all Markdown files
  const posts = await Promise.all(
    Object.values(postImports).map(fn => fn())
  );

  // Step 3: Convert to RSS items manually
  const items = posts
    .filter(post => post.frontmatter?.pubDate) // Optional: filter out missing dates
    .sort((a, b) => new Date(b.frontmatter.pubDate) - new Date(a.frontmatter.pubDate))
    .map(post => ({
      title: post.frontmatter.title,
      pubDate: post.frontmatter.pubDate,
      description: post.frontmatter.description,
      link: `${post.frontmatter.slug || post.url}`, // adjust as needed
    }));

  return rss({
    title: 'Left Feed',
    description: 'RSS for Left Feed Theme',
    site: context.site,
    items,
  });
}
