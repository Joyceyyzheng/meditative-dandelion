import { pipeline } from "@huggingface/transformers";

class MyTranslationPipeline {
  static task = "translation";
  static model = "Xenova/nllb-200-distilled-600M";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}
// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
  // Retrieve the translation pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  let translator = await MyTranslationPipeline.getInstance((x) => {
    // We also add a progress callback to the pipeline so that we can
    // track model loading.
    self.postMessage(x);
  });

  // Actually perform the translation
  let output = await translator(event.data.text, {
    tgt_lang: event.data.tgt_lang,
    src_lang: event.data.src_lang,

    // Allows for partial output
    callback_function: (x) => {
      self.postMessage({
        status: "update",
        output: translator.tokenizer.decode(x[0].output_token_ids, {
          skip_special_tokens: true,
        }),
      });
    },
  });

  // Send the output back to the main thread
  self.postMessage({
    status: "complete",
    output: output,
  });
});
const onMessageReceived = (e) => {
  switch (e.data.status) {
    case "initiate":
      // Model file start load: add a new progress item to the list.
      setReady(false);
      setProgressItems((prev) => [...prev, e.data]);
      break;

    case "progress":
      // Model file progress: update one of the progress items.
      setProgressItems((prev) =>
        prev.map((item) => {
          if (item.file === e.data.file) {
            return { ...item, progress: e.data.progress };
          }
          return item;
        })
      );
      break;

    case "done":
      // Model file loaded: remove the progress item from the list.
      setProgressItems((prev) =>
        prev.filter((item) => item.file !== e.data.file)
      );
      break;

    case "ready":
      // Pipeline ready: the worker is ready to accept messages.
      setReady(true);
      break;

    case "update":
      // Generation update: update the output text.
      setOutput(e.data.output);
      break;

    case "complete":
      // Generation complete: re-enable the "Translate" button
      setDisabled(false);
      break;
  }
};
