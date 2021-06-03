import { fetchWithToken } from "../helpers/fetchWithOutToken";
import { types } from "../types/types";
import Swal from "sweetalert2";
import axios from "axios";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const startGettingAllClient = () => {
  return async (dispatch) => {
    try {
      const resp = await fetchWithToken("clients");
      const clients = await resp.json();
      if (clients.ok) {
        dispatch(getClients(clients.clients));
      }
      //   console.log(clients.clients);
    } catch (error) {
      console.log(error);
    }
  };
};

export const startGettingOneClient = (clientId) => {
  return async (dispatch) => {
    try {
      const resp = await fetchWithToken(`clients/${clientId}`);
      const client = await resp.json();
      if (client.ok) {
        dispatch(setOneClient(client.client));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const startCreatingClient = (client, file) => {
  return async (dispatch) => {
    try {
      console.log(client);
      const resp = await fetchWithToken("clients", client, "POST");
      const clientCreated = await resp.json();

      if (clientCreated.ok) {
        if (file) {
          console.log(file);
          const formData = new FormData();
          formData.append("file", file);
          const token = localStorage.getItem("token") || "";
          const resp1 = await axios.post(
            `${process.env.REACT_APP_URL}clients/uploadFile`,
            formData,
            {
              Headers: {
                "Content-Type": "multipart/form-data",
                // "x-token": token,
              },
            }
          );
          const body1 = await resp1.data;
          console.log(body1);
          console.log(clientCreated);
          if (body1.ok) {
            clientCreated.pathImg = body1.fileName;
            const resp2 = await fetchWithToken(
              `clients/${clientCreated.client._id}`,
              clientCreated,
              "PUT"
            );
            const body2 = await resp2.json();
            console.log(body2);
            if (body2.ok) {
              Toast.fire("Agregar Cliente", clientCreated.msg, "success");
            }
          }
          // values.file = body.fileName;
        }

        // const resp = await fetchWithToken(
        //   `clients/${client._id}`,
        //   client,
        //   "PUT"
        // );
        // const body = await resp.json();
        // console.log(body);
      } else {
        Toast.fire("error", clientCreated.msg, "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        position: "center-top",
        width: 100,
        icon: "error",
        title: error,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
};

const updateClientAvatar = (client) => {
  return async (dispatch) => {
    const resp = await fetchWithToken(`clients/${client._id}`, client, "PUT");
    const body = await resp.json();
    console.log(body);
  };
};

export const getWorksClient = (idClient) => {
  return async (dispatch) => {
    try {
      const resp = await fetchWithToken(`works/client/${idClient}`);
      const works = await resp.json();
      if (works.ok) {
        dispatch(setClientWorks(works.works));
      } else {
        dispatch(resetWorksClient());
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const getClientSearch = (clients) => {
  return (dispatch) => {
    console.log(clients);
    dispatch(setClientsSearch(clients));
  };
};

const setClientsSearch = (clients) => ({
  type: types.filtrarClient,
  payload: clients,
});

const resetWorksClient = () => ({
  type: types.resetWorksClient,
});

const setClientWorks = (works) => ({
  type: types.setWorksClient,
  payload: works,
});

const setOneClient = (client) => ({
  type: types.setOneClient,
  payload: client,
});

const getClients = (clts) => ({
  type: types.getAllClients,
  payload: clts,
});
