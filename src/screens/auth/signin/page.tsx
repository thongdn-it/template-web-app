"use client";

import { Button } from "@components";
import { useSigninPageController } from "./controller";
import { useI18n } from "@src/hooks";

export default function Page() {
  const { signin } = useSigninPageController();
  const { t } = useI18n();

  return (
    <div>
      <Button onClick={signin}>{t("signin", { ns: "buttons" })}</Button>
    </div>
  );
}
