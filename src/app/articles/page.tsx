import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getAllArticles } from "../_services/getAllArticles";
import ArticleThumbnail from "./_components/ArticleThumbnail";

const ArticlesPage = async () => {
  const session = await auth();

  if (!session || !session.user) {
    notFound();
  }

  const articles = await getAllArticles();

  console.log(articles);

  return (
    <>
      {articles.map((article) => (
        <ArticleThumbnail article={article} />
      ))}
    </>
  );
};

export default ArticlesPage;
