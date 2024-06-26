import NavBar from "@/components/NavBar";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Search } from "react-feather";
import RingLoader from "react-spinners/RingLoader";
import { toast } from "react-toastify";
import { bvnSearch } from "@/api/requests";

function BvnSearch() {
  const [showSearchLoading, setShowSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [bvnResults, setBvnResults] = useState(null);
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm();

  const submitForm = async (data) => {
    try {
      const { data: res } = await bvnSearch(data);
      console.log(res);
      setBvnResults(res);
      toast.success("BVN search successful");
    } catch (error) {
      toast.error(
        error?.data?.error ||
          error?.response?.error ||
          "Something went wrong, please try again later"
      );
      console.error(error);
    }
  };
  const nonNumericRegex = /\D/;

  useEffect(() => {
    if (showSearchLoading) {
      setTimeout(() => {
        console.log(4090);
        setShowSearchLoading(false);
        setShowSearchResults(true);
      }, 3000);
    }
  }, [showSearchLoading]);
  return (
    <>
      <NavBar />
      <main className="p-12">
        <div className="text-center space-y-8">
          <h1 className="text-2xl font-bold">BVN Eligibility Search</h1>
          <p className="text-slate-500">
            Please enter your BVN (Bank Verification Number) to see your credit
            score.
          </p>
          <form
            action="#"
            onSubmit={handleSubmit(submitForm)}
            className="relative w-4/5 md:max-w-[400px] mx-auto space-y-1"
          >
            <div className="relative">
              <input
                type="text"
                className={`w-full rounded-lg border-gray-200 ${
                  errors.bvn?.message
                    ? "outline-red-500 border border-red-500"
                    : "outline-green-500"
                } p-4 pe-12 text-sm shadow-sm`}
                maxlength="11"
                {...register("number", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(
                      nonNumericRegex,
                      ""
                    );
                  },
                  validate: (value) =>
                    value.length == 11 ||
                    "BVN must be exactly 11 characters long",
                })}
                placeholder="BVN"
              />
              <button
                type="submit"
                className="absolute bg-green-500 text-white rounded-e-lg inset-y-0 end-0 grid place-content-center px-4"
                disabled={isSubmitting}
              >
                <Search
                  className=""
                  size={20}
                  // onClick={() => {
                  //   setShowSearchLoading(true);
                  //   setShowSearchResults(false);
                  // }}
                />
              </button>
            </div>
            <p className="text-red-500 text-small text-start">
              {errors.number?.message}
            </p>
          </form>
        </div>
        {isSubmitting && (
          <div className="h-[200px] flex items-center justify-center flex-col">
            <RingLoader color="green" />
            <p className="text-green-500">Please wait...</p>
          </div>
        )}
        {bvnResults && (
          <div className="h-[200px] flex items-center justify-center flex-col">
            <p>{`${bvnResults}`}</p>
          </div>
        )}
      </main>
    </>
  );
}

export default BvnSearch;
