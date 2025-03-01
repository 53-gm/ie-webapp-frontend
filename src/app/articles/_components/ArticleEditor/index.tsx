"use client";

import { getExtensions } from "@/app/_components/tiptap/extensions";
import {
  CustomBubbleMenu,
  LinkBubbleMenu,
} from "@/app/_components/tiptap/menus";
import { notitapEditorClass } from "@/app/_components/tiptap/proseClassString";
import "@/app/_components/tiptap/styles/tiptap.scss";
import { postArticle } from "@/app/_services/postArticle";
import { Article, CreateArticle } from "@/app/_services/type";
import { format } from "@formkit/tempo";
import { EditorContent, useEditor } from "@tiptap/react";
import { RotateCwIcon } from "@yamada-ui/lucide";
import {
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  Switch,
  Text,
  useBoolean,
  VStack,
  Wrap,
} from "@yamada-ui/react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type Props = {
  article: Article;
  isAuthor: boolean;
};

const ArticleEditor = ({ article, isAuthor }: Props) => {
  const [isAddingNewLink, setIsAddingNewLink] = useState(false);

  const openLinkModal = () => setIsAddingNewLink(true);

  const [isEditable, { toggle: toggleEditable }] = useBoolean(isAuthor);

  let content = "";

  if (article) {
    content = JSON.parse(article.content);
  }

  const editor = useEditor({
    extensions: getExtensions({ openLinkModal }),
    editable: isEditable,
    content: content,
    editorProps: {
      attributes: {
        class: `${notitapEditorClass} focus:outline-none w-full`,
        spellcheck: "false",
        suppressContentEditableWarning: "true",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) {
      return undefined;
    }

    editor.setEditable(isEditable);
  }, [isEditable]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateArticle>();

  const onSubmit: SubmitHandler<CreateArticle> = async (data) => {
    const editorJSON = editor?.getJSON();
    const editorContentStr = JSON.stringify(editorJSON);
    const submitData: CreateArticle = { ...data, content: editorContentStr };
    await postArticle({ payload: submitData });
  };

  const created = format(article.created_at, "short");
  const updated = format(article.updated_at, "short");

  console.log(created);

  return (
    editor &&
    (isAuthor ? (
      <VStack as="form" onSubmit={handleSubmit(onSubmit)} alignItems="center">
        <Button type="submit" w="xs" colorScheme="blue">
          記事の投稿・保存
        </Button>
        <HStack w="4xl" gap="md">
          <FormControl
            invalid={!!errors.title}
            errorMessage={errors.title ? errors.title.message : undefined}
          >
            <Input
              placeholder="タイトル"
              w="xl"
              {...register("title", {
                required: { value: true, message: "This is required." },
              })}
            />
          </FormControl>

          <VStack>
            <Controller
              name="is_public"
              control={control}
              render={({ field: { value, ...rest } }) => (
                <Switch w="md" checked={value} {...rest}>
                  公開する
                </Switch>
              )}
            />

            <Switch w="md" checked={isEditable} onChange={toggleEditable}>
              編集切り替え
            </Switch>
          </VStack>
        </HStack>

        <HStack>
          <VStack w="4xl">
            <EditorContent
              className="w-full flex justify-center"
              editor={editor}
            />

            <CustomBubbleMenu editor={editor} />

            <LinkBubbleMenu editor={editor} />
          </VStack>
        </HStack>
      </VStack>
    ) : (
      <VStack alignItems="center">
        <VStack alignItems="center">
          <Heading>{article?.title}</Heading>
          <HStack textColor="gray.400">
            <Text>{created}に公開</Text>

            <Wrap alignItems="center" gap="xs">
              <RotateCwIcon />
              <Text>{updated}</Text>
            </Wrap>
          </HStack>
        </VStack>

        <HStack>
          <VStack w="4xl">
            <EditorContent
              className="w-full flex justify-center"
              editor={editor}
            />

            <CustomBubbleMenu editor={editor} />

            <LinkBubbleMenu editor={editor} />
          </VStack>
        </HStack>
      </VStack>
    ))
  );
};

export default ArticleEditor;
