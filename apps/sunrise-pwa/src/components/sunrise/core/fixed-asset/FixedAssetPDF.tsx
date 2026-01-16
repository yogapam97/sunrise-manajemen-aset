import { Page, View, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";

// ----------------------------------------------------------------------

// Font.register({
//   family: 'Roboto',
//   fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
// });

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 10,
  },
  label: {
    margin: 10,
    padding: 10,
    border: "1px solid #000",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  fixedAssetWorkspaceName: {
    fontWeight: "heavy",
    fontSize: "4px",
    color: "#000000de",
    marginBottom: 2,
  },
  fixedAssetName: {
    fontSize: "4px",
    color: "#000000de",
    marginBottom: 1,
  },
  fixedAssetCode: {
    color: "#0000008a",
    fontSize: "3px",
    marginBottom: 1,
  },
  fixedAssetSerialNumber: {
    color: "#000000de",
    fontSize: "3px",
  },
  qrCode: {
    width: 35,
    height: 35,
  },
});

// Create Document Component
const FixedAssetLabel = ({ fixedAsset }: any) => (
  <Page size={{ width: 100, height: 35 }}>
    <View style={{ display: "flex", flexDirection: "row" }}>
      <View>
        <Image style={styles.qrCode} src={fixedAsset?.qr_code} />
      </View>
      <View style={{ width: 60, marginTop: 4 }}>
        <Text style={styles.fixedAssetWorkspaceName}>{fixedAsset?.workspace?.name}</Text>
        <Text style={styles.fixedAssetName}>{fixedAsset?.name}</Text>
        <Text style={styles.fixedAssetCode}>{fixedAsset?.code}</Text>
        <Text
          style={styles.fixedAssetSerialNumber}
        >{`S/N: ${fixedAsset?.serial_number || ""}`}</Text>
      </View>
    </View>
  </Page>
);

type Props = {
  fixedAssets: any[];
};

export default function FixedAssetPDF({ fixedAssets }: Props) {
  return (
    <Document>
      {fixedAssets.map((fixedAsset, index) => (
        <FixedAssetLabel key={index} fixedAsset={fixedAsset} />
      ))}
    </Document>
  );
}
