import React from "react";

import { ModalState } from "../admin/AdminContentList";

export interface FormModalProps {
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}
