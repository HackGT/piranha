import React from "react";

import { ModalState } from "../ManageContentList";

export interface FormModalProps {
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}
