import { RefetchFunction } from "axios-hooks";
import React from "react";

export type ModalState = {
  open: boolean;
  initialValues: any;
  hiddenValues?: any;
};

export interface FormModalProps {
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
  refetch: RefetchFunction<any, any>;
}
