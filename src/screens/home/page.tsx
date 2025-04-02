"use client";

import Link from "next/link";
import { LogOut, Menu, Settings } from "lucide-react";

import {
  ClientPage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components";
import { useI18n } from "@hooks";
import { Routes } from "@configs";
import { useHomePageController } from "./controller";
import { CoffeeItemView } from "./views/coffee-item-view";

export default function Page() {
  const { data, isLoading, onCoffeeItemClick, onSignOutClick } =
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
          <div className="grid grid-cols-5 gap-2">
            {data?.map((coffee) => (
              <CoffeeItemView
                key={coffee.id}
                coffee={coffee}
                onPress={onCoffeeItemClick}
              />
            ))}
          </div>
        </div>
      )}
    </ClientPage>
  );
}
