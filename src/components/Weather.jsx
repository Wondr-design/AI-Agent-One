import React, { useState } from "react";
import callOpenAi from "@/api/Openai";
import { getCurrentWeather, getLocation } from "@/tools/tool";
import systemPrompt from "@/data/systemPrompt";

const Weather = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const availableActions = {
    getCurrentWeather,
    getLocation,
  };
  //   const availableFunctions = {
  //     "getCurrentWeather": getCurrentWeather,
  //     "getLocation": getLocation
  // }

  const agent = async (userQuery) => {
    const MAX_ITERATIONS = 5;
    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userQuery,
      },
    ];
    /**
        PLAN[main]:
        1. Design a well-written ReAct prompt
        2. Build a loop for my agent to run in.
        3. Parse any actions that the LLM determines are necessary
        4. End condition - final Answer is given
 
 */
    /**
     * PLAN:
     * 1. Split the string on the newline character \n
     * 2. Search through the array of strings for one that has "Action:"
     * 3. Parse the action (function and parameter) from the string
     * 4. Calling the function
     * 5. Add an "Obversation" message with the results of the function call
     */

    /**
     * CHALLENGE:
     * 1. Split the string on the newline character ("\n")
     * 2. Search through the array of strings for one that has "Action:"
     *      regex to use:
     *      const actionRegex = /^Action: (\w+): (.*)$/
     * 3. Parse the action (function and parameter) from the string
     */
    const actionRegex = /^\s*Action: (\w+): (.*)$/;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      console.log(`Iteration #${i + 1}`);

      try {
        const responseFromAi = await callOpenAi({
          messages,
        });
        setResponse(responseFromAi || "No response.");
        messages.push({
          role: "assistant",
          content: responseFromAi,
        });
        const responseLines = responseFromAi.split("\n");
        console.log(responseLines);

        const foundActionStr = responseLines.find((str) => {
          return actionRegex.test(str);
        });
        if (foundActionStr) {
          const actions = actionRegex.exec(foundActionStr);
          console.log("Action found:", actions);
          if (actions && actions.length === 3) {
            const [_, action, actionArg] = actions;
            if (
              !availableActions.hasOwnProperty.call(availableActions, action)
            ) {
              throw new Error(`Unknown action: ${action}: ${actionArg} `);
            }
            console.log(
              `Calling function ${action} with argument ${actionArg}`
            );
            const observation = await availableActions[action](actionArg);
            messages.push({
              role: "assistant",
              content: `Observation: ${observation}`,
            });
            console.log("Observation:", observation);
          }
        } else {
          console.log("Agent finished with task");
          return responseFromAi;
        }
      } catch (error) {
        console.error(error);
        setResponse("Error occurred while fetching AI response.");
      }
    }
  };

  return (
    <>
      <input
        id="query"
        value={query}
        type="text"
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={() => agent(query)}>Submit</button>
      <div>{response}</div>
    </>
  );
};

export default Weather;
