"use client";
import Image from "next/image";
import loginIllustration from "../../../public/images/loginIllustreation.png";
import loginBluryImg from "../../../public/images/loginBluryImg.png";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Option, Select } from "@material-tailwind/react";
import Link from "next/link";
import { loginDataType } from "@/types/basicTypes";
import axios from "axios";
import { backendUrl } from "@/constants";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { stateType } from "@/types/stateTypes";
import Cookies from 'js-cookie';
import { setUser } from "@/redux/slices/userSlice";
import toast from "react-hot-toast";

export default function LogIn() {
  const [pageHeight, setPageHeight] = useState(0);
  const [formData, setFormData] = useState<loginDataType>({});
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const stateUser = useSelector((state : stateType) => state.user)
  const updateFormData = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const user = useSelector((state: stateType) => state.user);
  const userToken = Cookies.get('userToken');
  const checkLogin = async () =>  {
    await axios
    .get(backendUrl + "/auth-me", {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },
    })
    .then((res) => {
      dispatch(setUser(res.data));
      router.push("/");
    })
    .catch((err) => {
      console.log(err);
      toast.error('Invalid credentials')
    });
  }

  useEffect(()=>{
    if (userToken && (JSON.stringify(user) === JSON.stringify({}) || user === null)) {
      checkLogin()
    }  
  }, [])
  const dispatch = useDispatch()
  const loginUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    axios
      .post(`${backendUrl}/log-in`, formData)
      .then((res) => {
        console.log(res);
        console.log(res.data.user);
        dispatch(setUser(res.data.user))
        Cookies.set('userToken', res.data.token, {expires : 2})
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error('Wrong Credentials')
      })
      .finally(() => setSubmitting(false));
  };

  useEffect(() => {
    const updateHeight = () => {
      const height = document.documentElement.scrollHeight;
      setPageHeight(height);
    };

    // Update height on mount
    updateHeight();

    // Optionally update height on resize
    window.addEventListener("resize", updateHeight);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);
  return (
    <>
      <div className="w-full flex lg:flex-row flex-col h-full z-10">
        <div
          className={`lg:w-[45%] w-full bg-[#EEF1FF] flex items-center  lg:h-[${pageHeight}] p-10`}
        >
          <Image className="w-full" src={loginIllustration} alt="" />
        </div>
        <div className="lg:w-[55%] w-full flex flex-col justify-center py-auto  h-full p-10 pb-0">
          <h1 className="font-semibold md:text-4xl text-center text-2xl my-3">
            Welcome to GroupThynk
          </h1>
          <h3 className="font-normal md:text-2xl text-center text-lg lg:w-3/4 mx-auto w-full">
            Join a Community of Like-Minded Individuals and Reach Your Goals
            Together!
          </h3>
          <div className="my-3 lg:w-[65%] mx-auto">
            <div className="my-8">
              <form onSubmit={loginUser}>
                <div className=" w-full my-4">
                  <label className="md:text-lg text-md font-medium block">
                    Email
                  </label>
                  <input
                    name="email"
                    value={formData?.email}
                    onChange={updateFormData}
                    type="email"
                    className="my-1 w-full py-4 px-2 rounded-md bg-[#F5F6F7]"
                  />
                </div>
                <div className=" w-full my-4">
                  <label className="md:text-lg text-md font-medium block">
                    Password
                  </label>
                  <input
                    name="password"
                    value={formData?.password}
                    onChange={updateFormData}
                    type="password"
                    className="my-1 w-full py-4 px-2 rounded-md bg-[#F5F6F7]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    formData?.email?.length === 0 ||
                    formData?.password?.length === 0
                  }
                  className={`text-center ${
                    formData?.email?.length === 0 ||
                    formData?.password?.length === 0
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  } my-4 w-full text-white rounded-md py-3 font-semibold text-lg bg-[#615EF0]`}
                >
                  {submitting ? (
                    <div
                      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white text-white border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                  ) : (
                    "Log in"
                  )}
                </button>
              </form>
              <p className="my-3 font-medium text-lg">
                Don’t have an account yet? {"  "}{" "}
                <Link className="text-[#615EF0]" href={"/signup"}>
                  Create your account now
                </Link>
              </p>
            </div>
          </div>
          <Image src={loginBluryImg} className="w-[80%] mx-auto" alt="Image" />
        </div>
      </div>
    </>
  );
}
