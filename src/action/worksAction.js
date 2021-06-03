import { fetchWithToken } from "../helpers/fetchWithOutToken";
import { types } from "../types/types";

import Swal from "sweetalert2";
import { convertDate } from "../helpers/convertDateWork";
import axios from "axios";

export const getAllWorks = () => {
  return async (dispatch) => {
    try {
      const works = await fetchWithToken("works");
      const body = await works.json();
      const worksOk = convertDate(body.works);
      console.log(worksOk);
      // return 1;
      if (body.ok) {
        dispatch(setWorks(worksOk));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const getOneWork = (workId) => {
  return async (dispatch) => {
    try {
      const work = await fetchWithToken(`works/${workId}`);
      const body = await work.json();
      console.log(body.work);
      if (body.ok) {
        dispatch(setWorkOne(body.work));
      } else {
        Swal.fire(
          "error",
          "Hubo un error en la consula intente de nuevo",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("error", error, "error");
    }
  };
};

export const createWork = (work, files) => {
  return async (dispatch) => {
    console.log(files);

    try {
      const resp = await fetchWithToken("works", work, "POST");
      const body = await resp.json();
      console.log(body);
      if (body.ok) {
        if (files) {
          let formData = new FormData();
          for (let index = 0; index < files.length; index++) {
            formData.append("files", files[index]);
          }
          const resp1 = await axios.post(
            `${process.env.REACT_APP_URL}works/uploadFileWork`,
            formData,
            {
              Headers: {
                // "Content-Type": "multipart/form-data",
              },
            }
          );

          const body1 = await resp1.data;
          console.log(body1);

          if (body1.ok) {
            body.work.images = body1.imagenFormat;
            console.log(body);

            const resp2 = await fetchWithToken(
              `works/${body.work._id}`,
              body.work,
              "PUT"
            );
            const body2 = await resp2.json();
            console.log(body2);
            if (body2.ok) {
              // Toast.fire("Agregar Cliente", "existo...", "success");
            }
          }
          // values.file = body.fileName;
        }
        Swal.fire("success", "Se agregó correctamente el trabajo", "success");
      } else {
        Swal.fire("error", "Hubo un fallo al hacer la petition!!!", "error");
      }
      console.log(body);
    } catch (error) {
      console.log(error);
      Swal.fire("error", "Hubo un fallo al hacer la petition...", "error");
    }
  };
};

export const startEditWork = (work, workId) => {
  return async (dispatch) => {
    try {
      const resp = await fetchWithToken(`works/${workId}`, work, "PUT");
      const body = await resp.json();
      //   const worksEditOk = convertDate(body.updateWork);
      console.log(body.updateWork);
      if (body.ok) {
        dispatch(setWorkOne(body.updateWork));
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Trabajo editado con exito!!!",
          showConfirmButton: false,
          timer: 2500,
        });
      } else {
        Swal.fire(
          "error",
          "Hubo un error en la consula intente de nuevo",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("error", error, "error");
    }
  };
};

export const filterWorksState = (estado, works) => {
  return (dispatch) => {
    console.log(estado);
    dispatch(filterState(estado, works));
  };
};

const filterState = (estado, works) => ({
  type: types.filterWorksState,
  payload: {
    estado,
    works,
  },
});

const setWorks = (works) => ({
  type: types.getAllWorks,
  payload: works,
});
const setWorkOne = (work) => ({
  type: types.setOneWork,
  payload: work,
});
