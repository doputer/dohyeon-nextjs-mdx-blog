import { MDXProvider } from '@mdx-js/react';
import { graphql } from 'gatsby';

import Comment from '@/components/comment';
import SEO from '@/components/seo';
import typography from '@/components/typography';

interface PostPageProps {
  data: Queries.PageQuery;
  children: JSX.Element;
}

function PostPage({ data, children }: PostPageProps) {
  const { title, date } = data.mdx.frontmatter;

  return (
    <>
      <div className="mb-12 flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
        <time>{date}</time>
      </div>
      <article>
        <MDXProvider components={typography}>{children}</MDXProvider>
      </article>
      <div className="my-16">
        <Comment />
      </div>
    </>
  );
}

export default PostPage;

export const query = graphql`
  query Page($slug: String) {
    mdx(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date(formatString: "YYYY.MM.DD")
        description
      }
    }
  }
`;

export const Head = ({ data }: PostPageProps) => {
  const { title, description } = data.mdx.frontmatter;

  return <SEO title={title} description={description} />;
};