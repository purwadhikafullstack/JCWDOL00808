export const loginAction = (data) => {
  console.log("data dari component: ", data);
  return {
    type: "Admin login success",
    payload: data,
  };
};

export const logoutAction = () => {
  localStorage.removeItem("admin_login");
  return {
    type: "Admin logout",
  };
};
