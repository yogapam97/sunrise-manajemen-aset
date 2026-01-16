import { useFindDepreciation } from "../../hook/useDepreciations";
import DepreciationDetailTable from "../../core/depreciation/DepreciationDetailTable";

type FixedAssetDepreciationContaierProps = {
  workspaceId: string;
  fixedAssetId: string;
};
export default function FixedAssetDepreciationContaier({
  workspaceId,
  fixedAssetId,
}: FixedAssetDepreciationContaierProps) {
  const { data } = useFindDepreciation(workspaceId, fixedAssetId);
  return <DepreciationDetailTable depreciation={data?.data} />;
}
