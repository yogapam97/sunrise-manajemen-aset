import type { Schema } from "express-validator";

import QRCode from "qrcode";

import ApiService from "./ApiService";
import FixedAssetService from "./FixedAssetService";

export default class GenerateQrService extends ApiService {
  public static generateQrValidationSchema: Schema = {
    fixed_assets: {
      isArray: {
        errorMessage: "fixed_assets should be an array",
      },
      custom: {
        options: (value, { req, location, path }) =>
          // Ensure each object in the array has a fixedAssetId
          value.every((item: any) => item.id),
        errorMessage: "Each item must include a id",
      },
    },
  };

  public static async generateQrs(fixedAssets: any[]) {
    // const ppi = 203;
    // // Dimensions in millimeters
    // const labelWidthMM = 105.82677165;
    // const labelHeightMM = 79.37007874;

    // // Convert millimeters to inches
    // const labelWidthInches = labelWidthMM / 25.4;
    // const labelHeightInches = labelHeightMM / 25.4;

    // // Convert inches to pixels
    // const labelWidthPixels = labelWidthInches * ppi;
    // const labelHeightPixels = labelHeightInches * ppi;

    const qrCodes = await Promise.all(
      fixedAssets.map(async (fixedAsset) => {
        // const labelCanvas = createCanvas(labelWidthPixels, labelHeightPixels);
        // const labelCtx = labelCanvas.getContext("2d");
        // labelCtx.fillStyle = "#fff";
        // labelCtx.fillRect(0, 0, labelWidthPixels, labelHeightPixels);
        // const qrCanvas = createCanvas(50, 50);
        // const qrSize = labelHeightPixels / 2; // Define QR size
        const currentFixedAsset = await FixedAssetService.getById(fixedAsset.id);
        const qr_code = await QRCode.toDataURL(currentFixedAsset.id);
        // await QRCode.toCanvas(qrCanvas, fixedAsset.id, {
        //   width: 50,
        //   color: {
        //     dark: "#000", // Black dots
        //     light: "#FFF", // White background
        //   },
        //   margin: 1,
        // });
        // Workspace Name
        // labelCtx.beginPath();
        // labelCtx.font = "36px Arial";
        // labelCtx.fillStyle = "#000";
        // labelCtx.drawImage(qrCanvas, labelWidthPixels / 5, labelHeightPixels / 5);
        // wrapText(
        //   labelCtx,
        //   currentFixedAsset?.workspace?.name,
        //   20,
        //   labelHeightPixels * 0.08,
        //   labelWidthPixels,
        //   labelHeightPixels / 16
        // );
        // labelCtx.closePath();
        // labelCtx.save();

        // // Stageholder Name
        // labelCtx.beginPath();
        // labelCtx.font = "48px Arial";
        // labelCtx.translate(labelWidthPixels * 0.09, labelHeightPixels * 0.65);
        // labelCtx.rotate(-Math.PI / 2);
        // labelCtx.fillText("Stageholder", 0, 0);
        // labelCtx.closePath();
        // labelCtx.restore();
        // labelCtx.beginPath();
        // labelCtx.save();

        // // Fixed Asset Name
        // labelCtx.beginPath();
        // labelCtx.font = "36px Arial";
        // labelCtx.translate(labelWidthPixels * 0.6, labelHeightPixels * 0.98);
        // labelCtx.rotate(-Math.PI / 2);
        // wrapText(
        //   labelCtx,
        //   currentFixedAsset?.name,
        //   labelHeightPixels * 0.15,
        //   labelWidthPixels * 0.08,
        //   labelWidthPixels / 2,
        //   labelHeightPixels / 14
        // );
        // labelCtx.closePath();
        // labelCtx.restore();
        // labelCtx.beginPath();
        // labelCtx.save();

        // // Fixed Asset Id
        // labelCtx.restore();
        // labelCtx.beginPath();
        // labelCtx.font = "36px Arial";
        // labelCtx.fillText(fixedAsset?.id, 20, labelHeightPixels * 0.9);
        // labelCtx.closePath();
        // Convert labelCanvas to Base64 using a template literal for data URL
        // const base64Image = labelCanvas.toDataURL("image/png");
        // return base64Image;
        // return labelCanvas;
        return { ...currentFixedAsset.toJSON(), qr_code };
      })
    );
    return qrCodes;
  }
}
