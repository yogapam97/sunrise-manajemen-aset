interface IErrorMessage {
  message: string;
  field: string;
}

export default function errorValidationHandler(errors: any[]): IErrorMessage[] {
  return errors.map((error) => ({
    message: error.msg,
    field: error.path,
  }));
}
