import React from "react";
import ManutencaoItensAdd from "./manutencao_itens_add";
import ContainerAdaptative from "../../components/container-adaptative";

function ManutencaoItensModal({ modal, closeModal }) {
  let body;
  switch (modal.type) {
    case ManutencaoItensModal.modal.ADD_ITEM:
      body = (
        <ManutencaoItensAdd category={modal.data} closeModal={closeModal} />
      );
      break;
    default:
      break;
  }
  return (
    <ContainerAdaptative sx={{ minHeight: "50vh" }}>{body}</ContainerAdaptative>
  );
}

ManutencaoItensModal.modal = {
  ADD_ITEM: "ADD_ITEM",
};

export default ManutencaoItensModal;
