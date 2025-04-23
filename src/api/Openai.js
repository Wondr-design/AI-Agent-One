const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const callOpenAi = async ({
  messages,
  model = "gpt-3.5-turbo",
  temperature = 1,
  frequency_penalty = 0.5,
}) => {
  try {
    const serverResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          frequency_penalty,
        }),
      }
    );
    const dataFromServer = await serverResponse.json();
    if (serverResponse.ok) {
      console.log("openAi API connected");
    } else {
      console.error("OpenAI API error:", dataFromServer);
    }

    const resultFromServer = dataFromServer.choices?.[0]?.message?.content;
    // console.log(resultFromServer);
    return resultFromServer || "Open ai fetch error";
  } catch (error) {
    throw new Error("Open ai fetch error", error);
  }
};

export default callOpenAi;
