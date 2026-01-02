export type FormDataType = {
  ledgerName: string;
  ledgerAlias: string;
  toB: string;
  acholderName: string;
  acNumber: string;
  ifsCode: string;
  bankName: string;
  checkBooks: string;
  checkPrintConfig: string;
  inventoryValue: string;
  ledgerType: string;
  mailName: string;
  mailAddress: string;
  mailCountry: string;
  mailState: string;
  mailPinCode: string;
  mailBankDetails: string;
  bankBranch: string;
  panItNO: string;
};
export type FormChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement
>;
