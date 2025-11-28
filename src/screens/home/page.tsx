"use client";

import { LogOut, Menu, Settings } from "lucide-react";
import Link from "next/link";

import {
  ClientPage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components";
import { Routes } from "@constants";
import { useI18n } from "@hooks";
import { useHomePageController } from "./controller";
import { WineItemView } from "./views/wine-item-view";

export default function Page() {
  const { data, isLoading, onWineItemClick, onSignOutClick } =
    useHomePageController();
  const { t } = useI18n();

  return (
    <ClientPage>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="mx-4 my-4">
                <Menu />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link
                    className="flex items-center gap-2"
                    href={Routes.setting.default}
                  >
                    <Settings /> {t("settings", { ns: "buttons" })}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div
                    className="flex cursor-pointer items-center gap-2"
                    onClick={onSignOutClick}
                  >
                    <LogOut />
                    {t("signout", { ns: "buttons" })}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {data?.map((wine) => (
              <WineItemView
                key={wine.id}
                wine={wine}
                onPress={onWineItemClick}
              />
            ))}
          </div>
        </div>
      )}
    </ClientPage>
  );
}
