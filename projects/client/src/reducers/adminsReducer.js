const INITIAL_STATE = {
  id: 0,
  email: "",
  full_name: "",
  is_verified: 1,
  phone_number: "",
  role: "",
  profile_picture: "",
  createdAt: "",
  updatedAt: "",
};

export const adminsReducer = (state = INITIAL_STATE, action) => {
  // console.log("data dari action: ", action);
  switch (action.type) {
    case "Admin login success":
      return { ...state, ...action.payload };
    case "Admin logout":
      return INITIAL_STATE;
    default:
      return state;
  }
};
