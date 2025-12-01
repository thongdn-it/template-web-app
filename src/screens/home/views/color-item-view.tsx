import { ColorModel } from "@data";
import { useI18n } from "@hooks";

export const ColorItemView = ({
  color,
  isCopied,
  onPress,
}: {
  isCopied?: boolean;
  color: ColorModel;
  onPress?: (_color: ColorModel) => void;
}) => {
  const { t } = useI18n();
  return (
    <div
      className="relative flex cursor-pointer flex-col items-center gap-3 px-2 py-3"
      onClick={() => onPress?.(color)}
    >
      <div
        className="h-24 w-24 rounded-lg border border-gray-100 shadow-md"
        style={{ backgroundColor: color.hex }}
        aria-label={color.name}
      />

      {isCopied && (
        <div className="absolute top-2 left-1/2 flex -translate-x-1/2 transform items-center rounded-full bg-black/70 px-3 py-1 text-xs text-white">
          {t("copied")}
        </div>
      )}

      <div className="flex flex-col items-center">
        <span className="text-center text-sm font-semibold md:text-base">
          {color.name}
        </span>
        <span className="text-sm text-gray-600">{color.hex}</span>
      </div>
    </div>
  );
};
