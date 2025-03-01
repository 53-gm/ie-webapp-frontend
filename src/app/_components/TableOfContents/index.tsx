import React, { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  html: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ html }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // 一時的なDOMコンテナを作成して、html文字列をセット
    const container = document.createElement("div");
    container.innerHTML = html;

    // container内のすべてのh1～h6要素を抽出
    const headingElements = container.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    );
    const newHeadings = Array.from(headingElements).map((heading) => ({
      id: heading.id,
      text: heading.textContent || "",
      level: Number(heading.tagName.substring(1)),
    }));
    setHeadings(newHeadings);
  }, [html]);

  return (
    <nav className="toc">
      <ul>
        {headings.map((heading, index) => (
          <li key={index} style={{ marginLeft: (heading.level - 1) * 20 }}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
