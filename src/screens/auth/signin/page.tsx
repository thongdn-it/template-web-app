"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@components";
import { useI18n } from "@hooks";
import { formSchema } from "@constants";
import { useSigninPageController } from "./controller";

export default function Page() {
  const { signin } = useSigninPageController();
  const { t } = useI18n();

  const form = useForm<z.infer<typeof formSchema.signin>>({
    resolver: zodResolver(formSchema.signin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema.signin>) => {
    const { email, password } = data;
    await signin(email, password);
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="my-10 flex w-[30vw] flex-1 flex-col gap-4 justify-self-center"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("email_placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("password_placeholder", {
                      ns: "translation",
                    })}
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {t("signin", { ns: "buttons" })}
          </Button>
        </form>
      </Form>
    </div>
  );
}
