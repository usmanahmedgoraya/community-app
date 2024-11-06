"use client";

import Image from "next/image";
import loginIllustration from "../../../public/images/loginIllustreation.png";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Option, Select } from "@material-tailwind/react";
import Link from "next/link";
import { interestType, userType } from "@/types/basicTypes";
import axios from "axios";
import { backendUrl } from "@/constants";
import toast from "react-hot-toast";
import { setUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { stateType } from "@/types/stateTypes";
import Cookies from "js-cookie";

export default function SignUp() {
  const [pageHeight, setPageHeight] = useState(0);
  const [interests, setIneterests] = useState<interestType[]>([]);
  const [formData, setFormData] = useState<userType>({ interests: [""] });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const updateFormData = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const user = useSelector((state: stateType) => state.user);
  const userToken = Cookies.get("userToken");
  const dispatch = useDispatch();
  const checkLogin = async () => {
    await axios
      .get(backendUrl + "/auth-me", {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        dispatch(setUser(res.data.user));
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (
      userToken &&
      (JSON.stringify(user) === JSON.stringify({}) || user === null)
    ) {
      checkLogin();
    }
  }, []);

  const registerUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (confirmPassword === formData.password) {
      setSubmitting(true);
      console.log(formData);

      axios
        .post(`${backendUrl}/sign-up`, {
          ...formData,
          phone_number: Number(formData?.phone_number),
        })
        .then((res) => {
          console.log(res);

          dispatch(setUser(res.data.user));
          Cookies.set("userToken", res.data.token);
          // cookies().set('userToken', res.data.token, {expires : 1})
          router.push("/");
        })
        .catch((err) => {
          console.log(err);
          toast.error('error in sign up!')
        })
        .finally(() => setSubmitting(false));
    } else {
      toast.error("confirm password not matched!");
    }
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
      <div className="w-full flex lg:flex-row flex-col h-full">
        <div
          className={`lg:w-[45%] w-full bg-[#EEF1FF] flex items-center  lg:h-[${pageHeight}] p-10`}
        >
          <Image className="w-full" src={loginIllustration} alt="" />
        </div>
        <div className="lg:w-[55%] w-full   py-auto  h-full p-10">
          <div className="my-3">
            <h1 className="font-semibold md:text-4xl text-2xl my-3">
              Create your account
            </h1>
            <h3 className="font-normal md:text-2xl text-lg lg:w-3/4 w-full">
              Join a Community of Like-Minded Individuals and Reach Your Goals
              Together!
            </h3>
          </div>
          <div className="my-3 w-full flex flex-col gap-8 items-start">
            <form
              className="w-full flex flex-col gap-8"
              onSubmit={registerUser}
            >
              <div className="flex w-full xl:flex-row gap-8 flex-col">
                <div className=" w-full xl:w-[45%]">
                  <label className="md:text-lg text-md font-medium block">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData?.name}
                    onChange={updateFormData}
                    className="my-1 w-full py-4 px-2 rounded-md bg-[#F5F6F7]"
                    required
                  />
                </div>
                <div className=" w-full xl:w-[45%]">
                  <label className="md:text-lg text-md font-medium block">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email}
                    onChange={updateFormData}
                    className="my-1 w-full py-4 px-2 rounded-md bg-[#F5F6F7]"
                    required
                  />
                </div>
              </div>
              <div className="flex w-full xl:flex-row gap-8 flex-col">
                <div className=" w-full xl:w-[45%]">
                  <label className="md:text-lg text-md font-medium block">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData?.password}
                    onChange={updateFormData}
                    className="my-1 w-full py-4 px-2 rounded-md bg-[#F5F6F7]"
                    required
                  />
                </div>
                <div className=" w-full xl:w-[45%]">
                  <label className="md:text-lg text-md font-medium block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                    className="my-1 w-full py-4 px-2 rounded-md bg-[#F5F6F7]"
                    required
                  />
                </div>
              </div>
              <div className="flex w-full xl:flex-row gap-8 flex-col">
                <div className=" w-full xl:w-[45%]">
                  <label className="md:text-lg text-md font-medium block">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    name="phone_number"
                    value={formData?.phone_number}
                    onChange={updateFormData}
                    className="my-1 w-full py-4 px-2 rounded-md bg-[#F5F6F7]"
                    required
                  />
                </div>
                <div className=" w-full xl:w-[45%]">
                  <label className="md:text-lg text-md font-medium block">
                    Gender
                  </label>
                  <select
                    id="large"
                    name="gender"
                    value={formData?.gender}
                    onChange={(e) => {
                      setFormData({ ...formData, gender: e.target.value });
                    }}
                    className="block my-1 w-full focus:border-black focus:border-2 px-2 placeholder:text-gray-400 py-4 rounded-md bg-[#F5F6F7]"
                    required
                  >
                    <option selected disabled>
                      Select
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">other</option>
                  </select>
                </div>
              </div>
              <div className="flex w-full xl:flex-row gap-8 flex-col">
                <div className=" w-full xl:w-[95%]">
                  <label className="md:text-lg text-md font-medium block">
                    Lifestyle Goals
                  </label>
                  <select
                    id="large"
                    name="life_style_goals"
                    value={formData?.life_style_goals}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        life_style_goals: e.target.value,
                      });
                    }}
                    className="block my-1 w-full focus:border-black focus:border-2 px-2 placeholder:text-gray-400 py-4 rounded-md bg-[#F5F6F7]"
                    required
                  >
                    <option selected disabled>
                      Select
                    </option>
                    <option value="Career Growth">Career Growth</option>
                    <option value="Explore World">Explore World</option>
                    <option value="Earn Money">Earn Money</option>
                    <option value="Body Building">Body Building</option>
                  </select>
                </div>
              </div>
              <div className="flex w-full xl:flex-row gap-8 flex-col">
                <div className=" w-full xl:w-[95%]">
                  <label className="md:text-lg text-md font-medium block">
                    Interests
                  </label>
                  <select
                    id="large"
                    name="interests"
                    onChange={(e) => {
                      console.log(e.target.value);

                      setFormData({ ...formData, interests: [e.target.value] });
                    }}
                    required
                    className="block my-1 w-full focus:border-black focus:border-2 px-2 placeholder:text-gray-400 py-4 rounded-md bg-[#F5F6F7]"
                  >
                    <option selected disabled>
                      Select
                    </option>
                    {/* {interests?.map((interestObj: interestType) => (
                      <option value={interestObj._id}>
                        {interestObj.name}
                      </option>
                    ))} */}

                    <option value="cricket">Cricket</option>
                    <option value="coding">Coding</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <div className="checkbox">
                  <input
                    id="form-checkbox-1"
                    name="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                    }}
                    type="checkbox"
                    required
                  />
                  <label htmlFor="form-checkbox-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 200 200"
                    >
                      <mask fill="white" id="checkbox-mask">
                        <rect height="200" width="200"></rect>
                      </mask>
                      <rect
                        mask="url(#checkbox-mask)"
                        stroke-width="40"
                        height="200"
                        width="200"
                      ></rect>
                      <path
                        stroke-width="15"
                        d="M52 111.018L76.9867 136L149 64"
                      ></path>
                    </svg>
                    <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Yes, I understand and agree to GroupThnk’s{" "}
                      <a href="#" className="text-[#615EF0]">
                        term of services.
                      </a>
                      .
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex w-full xl:flex-row gap-8 flex-col">
                <div className=" w-full xl:w-[50%]">
                  <button
                    type="submit"
                    disabled={!agreed}
                    className={`text-center ${
                      agreed ? "cursor-pointer" : " cursor-not-allowed"
                    } w-full text-white rounded-md py-3 font-semibold text-lg bg-[#615EF0]`}
                  >
                    {" "}
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
                      "Ctreate Account"
                    )}
                  </button>
                  <p className="my-3 font-medium text-lg">
                    Already have an account? {"  "}{" "}
                    <Link className="text-[#615EF0]" href={"/login"}>
                      Log in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
