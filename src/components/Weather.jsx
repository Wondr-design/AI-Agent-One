import React, { useEffect } from "react";
import callOpenAi from "@/api/Openai";
const Weather = () => {
  useEffect(() => {
    const getChat = async () => {
      try {
        const messages = [
          // {
          //   role: "system",
          //   content: "You are an expert in car models",
          // },
          {
            role: "user",
            content:
              "Give me a list of activity ideas based on my current location and weather",
          },
        ];
        const response = await callOpenAi({
          messages,
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getChat();
  }, []);

  return <div>Weather</div>;
};

export default Weather;
