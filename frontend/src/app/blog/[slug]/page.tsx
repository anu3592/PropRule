import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // In Next.js 15, params is a Promise
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // In a real app, you would fetch the blog post data using the slug
  // const post = await getBlogPost(slug);

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl min-h-screen">
      <Link href="/blog" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8 font-medium">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>
      
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md">
        <div className="flex items-center gap-4 text-sm font-medium mb-6">
          <span className="bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full border border-blue-500/20">Article</span>
          <span className="text-gray-400 flex items-center gap-1"><Calendar className="h-4 w-4" /> Oct 24, 2026</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
          Viewing article: {slug.replace(/-/g, ' ')}
        </h1>
        
        <div className="flex items-center gap-3 mb-12 pb-8 border-b border-white/10">
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <div className="text-white font-medium">PropRules Editorial</div>
            <div className="text-gray-500 text-sm">Staff Writer</div>
          </div>
        </div>
        
        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            This is a placeholder page for the blog post: <strong>{slug}</strong>. In a fully connected application, this page would fetch the markdown or HTML content for this specific slug from the database and render it here.
          </p>
          <p>
            You can set up a rich text editor in your admin dashboard to create and publish these articles directly to your MongoDB database using the <code>BlogPost</code> collection we defined earlier in the schema!
          </p>
          
          <div className="my-12 p-8 bg-blue-900/20 border border-blue-500/20 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Want to read more?</h3>
            <p className="mb-0 text-gray-300">Join our newsletter to get weekly updates on prop firm reviews, interviews, and industry news.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
