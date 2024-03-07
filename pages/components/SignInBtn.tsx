import { FC } from "react";

const SignInBtn: FC = () => {
  return (
    <button className="login-btn-style" style={{ width: "120px" }}>
      <p className="login-text-style whitespace-nowrap">Sign-in</p>
    </button>
  );
};

export default SignInBtn;
