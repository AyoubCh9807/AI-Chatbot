"use client";
import { Header } from "./components/Header";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [edited, setEdited] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const handleGen = async () => {
    try {
      setIsLoading(true)
      setEdited("");
      const res = await axios.post("http://localhost:8080/generate", {
        prompt: prompt,
        code: code,
      });
      if (res.data && res.data.generated) {
        setEdited(res.data.generated);
      }
    } catch (err) {
      console.log(`error: ${err}`);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 via-purple-900 to-black min-h-[100vh]">
      <Header />
      <div className="flex flex-col align-center justify-evenly">
        <div className="grid place-items-center">
          <textarea
            value={code}
            placeholder="Enter your code here"
            className="border-5 border-white rounded-xl h-[30vh] w-[50vw] mt-10 font-sans font-bold text-2xl px-4 py-2 focus:outline-none bg-gradient-to-tl from-pink-400 via-purple-400 to-white text-gray-900"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setCode(e.target.value)  
            }
            }
          ></textarea>
        </div>

        <div className="grid place-items-center">
          <div className="flex flex-row justify-evenly gap-[2em] my-10">
            <button
              className="text-xl hover:cursor-pointer hover:scale-105 transition-all duration-300 border-4 rounded-xl border-white bg-gradient-to-tl from-pink-400 via-purple-400 to-white text-gray-900 font-sans font-bold px-4 py-2"
              onClick={() => {
                setPrompt("optimize this:");
                handleGen();
                setCode('')
              }}
            >
              Optimize code
            </button>
            <button
              className="text-xl hover:cursor-pointer hover:scale-105 transition-all duration-300 border-4 rounded-xl border-white bg-gradient-to-tl from-pink-400 via-purple-400 to-white text-gray-900 font-sans font-bold px-4 py-2"
              onClick={() => {
                setPrompt("shorten this:");
                handleGen();
                setCode('')
              }}
            >
              Shorten code
            </button>
            <button
              className="text-xl hover:cursor-pointer hover:scale-105 transition-all duration-300 border-4 rounded-xl border-white bg-gradient-to-tl from-pink-400 via-purple-400 to-white text-gray-900 font-sans font-bold px-4 py-2"
              onClick={() => {
                setPrompt("remove unused vars:");
                handleGen();
                setCode('')
              }}
            >
              Remove unused vars
            </button>
            <button
              className="text-xl hover:cursor-pointer hover:scale-105 transition-all duration-300 border-4 rounded-xl border-white bg-gradient-to-tl from-pink-400 via-purple-400 to-white text-gray-900 font-sans font-bold px-4 py-2"
              onClick={() => {
                setPrompt("generate a summary:");
                handleGen();
                setCode('')
              }}
            >
              Generate summary
            </button>
          </div>
        </div>

        <div className="grid place-items-center">
          <textarea
            value={edited}
            readOnly
            name=""
            id=""
            placeholder={isLoading ? "loading..." : "Generated code will appear here"}
            className="border-5 border-white rounded-xl h-[30vh] w-[50vw] mt-10 font-sans font-bold text-2xl px-4 py-2 focus:outline-none bg-gradient-to-br mb-20 from-pink-400 via-purple-400 to-white text-gray-900"
          ></textarea>

        </div>
      </div>
    </div>
  );
}
