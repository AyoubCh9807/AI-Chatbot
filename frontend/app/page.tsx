"use client";
import { Header } from "./components/Header";
import { useState, useRef } from "react";
import axios from "axios";
import { IoIosSend } from "react-icons/io";
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm";

interface Message {
  text: string;
  sender: "user" | "bot";
  isError?: boolean;
}

export default function Home() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const userClassName =
    "bg-[#424242] text-[#f3f3f3] ml-auto mr-25 py-4 px-6 w-max max-w-[33vw] break-words font-sans rounded-xl my-2 mx-2";
  const botClassName =
    "bg-[#424242] mr-auto ml-25 py-4 px-6 w-max max-w-[33vw] break-words font-sans rounded-xl my-2 mx-2 text-[#f3f3f3]";
  const botErrClassName =
    "bg-[#424242] mr-auto ml-25 py-4 px-6 w-max max-w-[33vw] break-words font-sans rounded-xl my-2 mx-2 text-red-500";
  const botLoadingClassName =
    "bg-[#424242] text-[#f3f3f3] italic mr-auto ml-25 py-4 px-6 w-max max-w-[33vw] break-words font-sans rounded-xl my-2 mx-2 opacity-70 animate-pulse";

  const handleGen = async () => {
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { text: prompt, sender: "user" }]);
      const res = await axios.post("https://ai-chatbot-k6og.onrender.com/generate", {
        prompt: prompt,
      });
      if (res.data && res.data.generated) {
        setMessages((prev) => [
          ...prev,
          { text: res.data.generated, sender: "bot" },
        ]);
      }
    } catch (err) {
      console.log(`error: ${err}`);
      setMessages((prev) => [
        ...prev,
        { text: "Error while generating text", sender: "bot", isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#212121] min-h-[100vh] overflow-auto">
      <Header />
      <div className="flex flex-col align-center justify-evenly">
        <div className="flex flex-col justify-evenly align-center">
          {messages.map((message, index) => {
            return (
              <div
                key={index}
                className={
                  message.sender == "user"
                    ? userClassName
                    : message.isError
                    ? botErrClassName
                    : botClassName
                }
              >
                  <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  >{message.text}</ReactMarkdown>

              </div>
            );
          })}

          {isLoading && <div className={botLoadingClassName}>Typing...</div>}
        </div>

        <div className="grid place-items-center">
          <div className="relative w-[50vw]">
            <textarea
              ref={textareaRef}
              value={prompt}
              placeholder={isLoading ? "loading..." : "ask anything"}
              className=" bg-[#424242] text-[#f3f3f3] overflow-y-auto rounded-xl min-h-[20vh] resize-none w-full mt-10 font-sans text-2xl px-4 py-4 outline-none"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setPrompt(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            ></textarea>

            <div className="absolute bottom-5 right-5">
              <div
                className="bg-gray-200 rounded-full py-2 px-2 relative h-10 w-10 hover:cursor-pointer"
                onClick={() => {
                  if (!isLoading) {
                    if(!prompt.trim()) return;
                    handleGen();
                    setPrompt("");
                    if(textareaRef.current) {
                      textareaRef.current.style.height = "20vh"
                    }
                  }
                }}
              >
                <IoIosSend
                  size={25}
                  color="black"
                  className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
