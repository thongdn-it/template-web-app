import Image from "next/image";

import { useI18n } from "@hooks";
import { CoffeeModel } from "@data";

export const CoffeeItemView = ({
  coffee,
  onPress,
}: {
  coffee: CoffeeModel;
  onPress?: (coffee: CoffeeModel) => void;
}) => {
  const { t } = useI18n();

  return (
    <div
      className="cursor-pointer flex flex-col items-center"
      onClick={() => onPress?.(coffee)}
    >
      <Image
        src={coffee.image}
        alt="coffee-image"
        width={60}
        height={60}
        className="w-[10vw] aspect-square h-auto rounded-lg"
      />
      <div className="flex justify-between gap-4">
        <span className="font-bold">{coffee.title}</span>
        <span>{t("price", { price: coffee.price })}</span>
      </div>
    </div>
  );
};
