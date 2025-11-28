import Image from "next/image";

import { WineModel } from "@data";

export const WineItemView = ({
  wine,
  onPress,
}: {
  wine: WineModel;
  onPress?: (_wine: WineModel) => void;
}) => {
  return (
    <div
      className="flex cursor-pointer flex-col items-center gap-2"
      onClick={() => onPress?.(wine)}
    >
      <Image
        src={wine.image}
        alt="wine-image"
        width={60}
        height={60}
        className="aspect-square h-auto w-[10vw] rounded-lg"
        unoptimized
      />
      <div className="flex flex-col items-center">
        <span className="text-center font-bold">{wine.wine}</span>
        <span className="text-sm text-gray-600">{wine.winery}</span>
        <span className="text-xs text-gray-500">{wine.location}</span>
        <span className="text-sm font-semibold">
          Rating: {wine.rating.average}
        </span>
      </div>
    </div>
  );
};
