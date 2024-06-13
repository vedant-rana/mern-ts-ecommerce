import { confirmDialog } from "primereact/confirmdialog";

type confirmDialogType = {
  message: string;
  header: string;
  id?: string;
  acceptFunction: (id?: string) => void;
  rejectFunction?: () => void;
};

export const confirmDialogBox = ({
  message,
  header,
  id,
  acceptFunction,
  rejectFunction,
}: confirmDialogType) => {
  confirmDialog({
    message: message,
    header: header,
    icon: "pi pi-exclamation-triangle",
    acceptClassName: "p-button-danger",
    defaultFocus: "accept",
    accept: () => acceptFunction(id),
    reject: () => rejectFunction,
  });
};
