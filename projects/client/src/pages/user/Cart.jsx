import { isAuth } from "../../apis/userAPIs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  useEffect(() => {
    isAuth(navigate, true);
  }, []);
  return <div>Cart</div>;
}
