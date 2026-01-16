import type { ChangeEvent } from "react";

import { useState } from "react";
import nProgress from "nprogress";
import { usePapaParse } from "react-papaparse";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Step,
  Paper,
  Stack,
  Table,
  Button,
  styled,
  Stepper,
  TableRow,
  StepLabel,
  TextField,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  StepContent,
  TableContainer,
} from "@mui/material";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const fixedAssetColumns = [
  {
    id: "name",
    label: "Name*",
  },
  {
    id: "code",
    label: "Code",
  },
  {
    id: "serial_number",
    label: "Serial Number",
  },
  {
    id: "type",
    label: "Type* (tangible/intangible)",
  },
  {
    id: "description",
    label: "Description",
  },
  {
    id: "purchase_cost",
    label: "Purchase Cost",
  },
  {
    id: "purchase_date",
    label: "Purchase Date",
  },
];

const ColumnMatch = ({ requiredColumns, csvColumns, onMatchColumn }: any) => {
  const handleMatchColumns = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const selectedColumn = e.target.value;
    onMatchColumn(index, selectedColumn);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fixed Asset Column</TableCell>
            <TableCell>CSV Column</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requiredColumns.map((column: any, index: number) => (
            <TableRow key={index}>
              <TableCell>{column.label}</TableCell>
              <TableCell>
                <TextField
                  select
                  size="small"
                  fullWidth
                  SelectProps={{ native: true }}
                  variant="outlined"
                  onChange={(e) => handleMatchColumns(e, index)}
                >
                  <option value="" />
                  {csvColumns.map((csvColumn: any, csvColumnIndex: number) => (
                    <option key={csvColumnIndex} value={csvColumn}>
                      {csvColumn}
                    </option>
                  ))}
                </TextField>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Create a mapping from id to label
const columnLabelMap: { [key: string]: string } = fixedAssetColumns.reduce(
  (acc, column) => {
    acc[column.id] = column.label;
    return acc;
  },
  {} as { [key: string]: string }
);

const DataPreview = ({ matchedData }: any) => (
  <Card>
    <TableContainer sx={{ position: "relative", overflow: "unset" }}>
      <Scrollbar sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Row</TableCell>
              {Object.keys(matchedData[0] || {}).map((key) => (
                <TableCell key={key}>{columnLabelMap[key] || key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {matchedData.map((row: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                {Object.values(row).map((value, cellIndex) => (
                  <TableCell key={cellIndex}>{value as string}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  </Card>
);

// Function to extract index from a string like "fixedAssets[4].purchase_cost"
const extractIndex = (path: string): number | null => {
  const match = path.match(/fixedAssets\[(\d+)\]/);
  return match && match[1] !== undefined ? parseInt(match[1], 10) + 1 : null;
};
const ImportErrorInfo = ({ importErrors }: any) => (
  <Card sx={{ width: 400 }}>
    <TableContainer sx={{ position: "relative", overflow: "unset" }}>
      <Scrollbar sx={{ maxHeight: 200 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Row</TableCell>
              <TableCell>Error</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {importErrors.map((error: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{extractIndex(error.field)}</TableCell>
                <TableCell>
                  <Typography variant="caption" color="error">
                    {error.message}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  </Card>
);

type FixedAssetImportStepProps = {
  onImport: (data: any[]) => void;
  importErrors: any[];
  importLoading: boolean;
  onReset: VoidFunction;
};

export default function FixedAssetImportStep({
  onImport,
  importErrors,
  importLoading,
  onReset,
}: FixedAssetImportStepProps) {
  const { readString } = usePapaParse();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [csvFileName, setCsvFileName] = useState<string>("");
  const [delimiter, setDelimiter] = useState<string>(";");
  const [currentCsvData, setCurrentCsvData] = useState<any>([]);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [matchingColumns, setMatchingColumns] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<{ [key: string]: string }>({});
  const [matchedData, setMatchedData] = useState<any[]>([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCSVUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedCSVData = e.target?.result as any;
        setCurrentCsvData(uploadedCSVData as any);
      };
      reader.readAsText(file);
    }
  };

  const handleParseCsv = () => {
    readString(currentCsvData as any, {
      header: true,
      delimiter,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data;
        setCsvData(parsedData); // Ensure csvData is an array
        const columns = Object.keys(parsedData[0] as any);
        setMatchingColumns(columns as any);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
    handleNext();
  };

  const handleMatchColumns = (index: number, selectedColumn: string) => {
    const columnId = fixedAssetColumns[index]?.id;
    setColumnMappings((prevMappings) => ({
      ...prevMappings,
      [String(columnId)]: selectedColumn,
    }));
  };

  const handleConfirmMatch = () => {
    setMatchedData([]);
    const newMappedData = csvData.map((row) => {
      const newRow: { [key: string]: any } = {};
      Object.entries(columnMappings).map(([requiredColumn, csvColumn]) => {
        newRow[requiredColumn] = row[csvColumn];
        return newRow;
      });
      return newRow;
    });
    setMatchedData(newMappedData);
    handleNext();
  };

  const handleResetMatch = () => {
    setMatchedData([]);
    setColumnMappings({});
    onReset();
    handleBack();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCsvFileName("");
    setDelimiter(";");
    setCsvData([]);
    setMatchingColumns([]);
    setColumnMappings({});
    setMatchedData([]);
    onReset();
  };

  return (
    <Card sx={{ p: 2 }}>
      <Box>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>Upload CSV File</StepLabel>
            <StepContent>
              <Stack spacing={2}>
                <Stack>
                  <Typography variant="subtitle2">Click to upload your CSV file</Typography>
                  <Box>
                    <Button
                      sx={{ mt: 1 }}
                      component="label"
                      variant="outlined"
                      startIcon={<Iconify icon="material-symbols:upload-file-outline" />}
                    >
                      Upload File
                      <VisuallyHiddenInput type="file" onChange={handleCSVUpload} />
                    </Button>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      size="small"
                      component="a"
                      href="/assets/import-template/import-fixed-assets-template.csv"
                      target="_blank"
                      onClick={(e) => {
                        e.stopPropagation();
                        nProgress.done();
                      }}
                    >
                      Download CSV Template
                    </Button>
                  </Box>
                </Stack>
                {csvFileName && (
                  <Box>
                    <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
                      Selected file:
                    </Typography>
                    <Typography variant="caption">{csvFileName}</Typography>
                  </Box>
                )}
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!csvFileName}
                    sx={{ mt: 1 }}
                  >
                    Continue
                  </Button>
                  {csvFileName && (
                    <Button onClick={handleReset} sx={{ mt: 1 }}>
                      Remove File
                    </Button>
                  )}
                </Stack>
              </Stack>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Configure CSV</StepLabel>
            <StepContent>
              <Stack sx={{ mt: 2 }} spacing={1}>
                <Box>
                  <TextField
                    label="Delimiter"
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value)}
                    size="small"
                  />
                </Box>
                <Typography variant="caption">*CSV file must have header</Typography>
              </Stack>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button variant="contained" onClick={handleParseCsv} sx={{ mt: 1, mr: 1 }}>
                    Continue
                  </Button>
                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Match Columns</StepLabel>
            <StepContent>
              <Typography variant="h6" style={{ marginTop: "20px" }}>
                Match Columns
              </Typography>
              <Box>
                <ColumnMatch
                  requiredColumns={fixedAssetColumns}
                  csvColumns={matchingColumns}
                  onMatchColumn={handleMatchColumns}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button variant="contained" onClick={handleConfirmMatch} sx={{ mt: 1, mr: 1 }}>
                    Continue
                  </Button>
                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Preview Matched Data</StepLabel>
            <StepContent>
              <Box>
                <DataPreview matchedData={matchedData} />
              </Box>
              {importErrors.length > 0 && (
                <Box sx={{ my: 2 }}>
                  <Typography sx={{ my: 2 }} variant="subtitle2" color="error">
                    Import error
                  </Typography>
                  <ImportErrorInfo importErrors={importErrors} />
                </Box>
              )}
              <Box sx={{ my: 2 }}>
                <Stack direction="row" spacing={1}>
                  {importErrors.length ? (
                    <Button variant="contained" onClick={handleReset}>
                      Start Over
                    </Button>
                  ) : (
                    <LoadingButton
                      variant="contained"
                      onClick={() => onImport(matchedData)}
                      loading={importLoading}
                    >
                      Import
                    </LoadingButton>
                  )}
                  <Button onClick={handleResetMatch}>Back</Button>
                </Stack>
              </Box>
            </StepContent>
          </Step>
        </Stepper>

        {activeStep === 4 && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>{`All steps completed - you're finished`}</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Box>
    </Card>
  );
}
