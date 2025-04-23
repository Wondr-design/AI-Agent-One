import React, { useEffect } from "react";
import callOpenAi from "@/api/Openai";
import { getCurrentWeather, getLocation } from "@/tools/tool";

//Goal - build an agent that can get the current weather at my current location
// and give me some localized ideas of activities I can do.
const Weather = () => {
  useEffect(() => {
    const getChat = async () => {
      try {
        const weather = await getCurrentWeather();
        const location = await getLocation();
        const messages = [
          // {
          //   role: "system",
          //   content: "You are an expert in car models",
          // },
          {
            role: "user",
            content: `Give me a list of activity ideas based on my current 
              location of ${location} and weather of ${weather}.`,
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
