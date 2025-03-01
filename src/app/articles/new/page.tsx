"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import "tippy.js/animations/shift-toward-subtle.css";

import { getExtensions } from "@/app/_components/tiptap/extensions";
import {
  CustomBubbleMenu,
  LinkBubbleMenu,
} from "@/app/_components/tiptap/menus";
import { notitapEditorClass } from "@/app/_components/tiptap/proseClassString";
import "@/app/_components/tiptap/styles/tiptap.scss";
import { postArticle } from "@/app/_services/postArticle";
import { CreateArticle } from "@/app/_services/type";
import {
  Button,
  FormControl,
  HStack,
  Input,
  Switch,
  useBoolean,
  VStack,
} from "@yamada-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const ArticleEditorPage = () => {
  const [isAddingNewLink, setIsAddingNewLink] = useState(false);

  const openLinkModal = () => setIsAddingNewLink(true);

  const [isEditable, { toggle: toggleEditable }] = useBoolean(true);

  const editor = useEditor({
    extensions: getExtensions({ openLinkModal }),
    editable: isEditable,
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

  return (
    editor && (
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
    )
  );
};

export default ArticleEditorPage;
