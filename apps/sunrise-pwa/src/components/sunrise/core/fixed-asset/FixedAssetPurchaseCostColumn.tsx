import CurrencyDisplay from "../../common/CurrencyDisplay";

type FixedAssetPurchaseCostColumnProps = {
  purchase_cost: number | undefined;
};

export default function FixedAssetPurchaseCostColumn({
  purchase_cost,
}: FixedAssetPurchaseCostColumnProps) {
  return (
    <CurrencyDisplay
      value={purchase_cost}
      color={Number(purchase_cost) > 0 ? "default" : "text.disabled"}
    />
  );
}
