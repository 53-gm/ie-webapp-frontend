import { getArticle } from "@/app/_services/getArticle";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import ArticleEditor from "../../_components/ArticleEditor";

type Props = {
  params: { slug: string; userId: string };
};

const ArticleDetailPage = async ({ params }: Props) => {
  const { slug, userId } = params;
  const article = await getArticle({ slug });

  const session = await auth();

  if (!session || !session.user) {
    notFound();
  }

  const isAuthor = article.author.user_id == session.user.profile.user_id;

  return (
    <>
      <ArticleEditor article={article} isAuthor={isAuthor} />
    </>
  );
};

export default ArticleDetailPage;
