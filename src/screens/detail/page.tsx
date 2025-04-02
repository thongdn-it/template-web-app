"use client";

import { useParams } from "next/navigation";

import { useDetailPageController } from "./controller";
import { CoffeeItemView } from "../home/views/coffee-item-view";

export default function Page() {
  const { id } = useParams();
  const { data } = useDetailPageController(parseInt(id as string));
  return (
    <div>
      {data == undefined ? "Loading..." : <CoffeeItemView coffee={data} />}
    </div>
  );
}
