export const loginAction = (data) => {
  console.log("data dari component: ", data);
  return {
    type: "Admin login success",
    payload: data,
  };
};

export const getAdminsAction = (data) => {
  return {
      type: "GET_ADMINS",
      payload: data
  }
}

export const logoutAction = () => {
  localStorage.removeItem("admin_login");
  return {
    type: "Admin logout",
  };
};
