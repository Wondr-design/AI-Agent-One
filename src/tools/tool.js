export const getCurrentWeather = async () => {
  const weather = {
    temperature: 2,
    wind: 10,
    unit: "F",
    pressure: 1020,
    forecast: "snowy",
    humidity: 50,
  };
  return JSON.stringify(weather);
};
export const getLocation = async () => {
  return "Salt Lake City, UT";
};
