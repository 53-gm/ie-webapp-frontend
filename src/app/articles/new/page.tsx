"use client";
import { createArticle } from "@/actions";
import { getExtensions } from "@/lib/tiptap/extensions";
import { CustomBubbleMenu, LinkBubbleMenu } from "@/lib/tiptap/menus";
import { CreateArticleInput } from "@/types/api";
import { unwrap } from "@/utils/unwrap";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  Button,
  FormControl,
  HStack,
  Input,
  Switch,
  useBoolean,
  VStack,
} from "@yamada-ui/react";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const ArticleEditorPage = () => {
  const [isEditable, { toggle: toggleEditable }] = useBoolean(true);

  const editor = useEditor({
    extensions: getExtensions(),
    editable: isEditable,
    editorProps: {
      attributes: {
        class: `focus:outline-none w-full`,
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
  } = useForm<CreateArticleInput>();

  const onSubmit: SubmitHandler<CreateArticleInput> = async (data) => {
    const editorJSON = editor?.getJSON();
    const editorContentStr = JSON.stringify(editorJSON);
    const submitData: CreateArticleInput = {
      ...data,
      content: editorContentStr,
    };
    unwrap(await createArticle(submitData));
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
