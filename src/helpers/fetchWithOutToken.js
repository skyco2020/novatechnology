export const fetchWithOutToken = (endpoint, data, method = "GET") => {
  let url = `${process.env.REACT_APP_URL}${endpoint}`;
  //   console.log(url);
  if (method === "GET") {
    return fetch(url);
  } else {
    return fetch(url, {
      method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
};
export const fetchWithToken = (endpoint, data, method = "GET") => {
  let url = `${process.env.REACT_APP_URL}${endpoint}`;

  // get the token form the localstorage
  const token = localStorage.getItem("token") || "";

  if (method === "GET") {
    return fetch(url, {
      headers: {
        "x-token": token,
      },
    });
  } else {
    return fetch(url, {
      method,
      headers: {
        "content-type": "application/json",
        "x-token": token,
      },
      body: JSON.stringify(data),
    });
  }
};
