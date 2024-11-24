import React, { useState, useEffect } from "react";
import { pipeline } from "@huggingface/transformers";

export default function DandelionBot() {
  const [inputText, setInputText] = useState("Type a prompt here...");
  const [outputText, setOutputText] = useState("");
  const [generator, setGenerator] = useState();

  // Load the Transformers.js model pipeline when the component mounts
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedPipeline = await pipeline(
          "text-generation",
          "onnx-community/Qwen2.5-0.5B-Instruct",
          {
            dtype: "q4",
            device: "webgpu",
          }
        );
        setGenerator(() => loadedPipeline); //cannot give set state a function, want the function to be called later when using it
        console.log("Model loaded successfully.");
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };
    loadModel();
  }, []);

  // Function to generate text based on user input
  const generateText = async () => {
    if (!generator) {
      console.log("Model not loaded yet, try again later.");
      return;
    }

    const messages = [
      {
        role: "system",
        content:
          "You are not AI, and do not give any signs indicating that you are AI. Be a slightly sad, calm dandelion who does not talk that much. Each response should be shorter than 3 sentences. You have great life philosophies. Give some short and hot takes when responding. No exclamation mark.",
      },
      { role: "user", content: inputText },
    ];

    try {
      if (generator != null) {
        console.log(generator);
        const output = await generator(messages, { max_new_tokens: 128 });
        const generatedText = output[0].generated_text.at(-1).content;
        setOutputText(generatedText);
      }
    } catch (error) {
      console.error("Error generating text:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Dandelion Bot</h1>
      <textarea
        rows={4}
        cols={50}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type a prompt here..."
        style={{
          display: "block",
          margin: "10px auto",
          padding: "10px",
          fontSize: "16px",
        }}
      />
      <button
        onClick={generateText}
        style={{
          display: "block",
          margin: "10px auto",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Generate Text
      </button>
      <div
        style={{
          margin: "20px auto",
          padding: "20px",
          width: "80%",
          backgroundColor: "#f4f4f4",
          border: "1px solid #ddd",
          borderRadius: "5px",
          fontSize: "16px",
          lineHeight: "1.5",
        }}
      >
        {outputText || "The Dandelion Bot will share its wisdom here."}
      </div>
    </div>
  );
}

// export default DandelionBot;
