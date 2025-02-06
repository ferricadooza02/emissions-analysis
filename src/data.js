// src/data.js
export const modelInfo = {
  "LLaMA-2-7B": {
    name: "LLaMA-2-7B",
    description:
      "LLaMA-2 is a family of open-access pretrained and fine-tuned LLMs released by Meta in July 2023. It is available in three sizes with 7B, 13B and 70B parameters, respectively. This project evaluates only the 7B-parameter configuration due to resource constraints. The model architecture is characterised by pre-normalisation, RoPE embeddings, SwiGLU activation and Grouped-Query Attention (GQA).",
  },
  "Mistral-7B": {
    name: "Mistral-7B",
    description:
      "Mistral 7B is a 7-billion parameter LLM released by Jiang et al. in October 2023. It was reported to outperform the 13B-parameter LLaMA-2 model across all evaluation benchmarks. The model architecture is characterised by Grouped-Query Attention (GQA), Sliding Window Attention, Rolling Buffer Cache, and Pre-fill and Chunking.",
  },
  "Gemma-2B": {
    name: "Gemma-2B",
    description:
      "Gemma is a family of open LLMs released by Google in February 2024. It is available in two sizes with 2 billion and 7 billion parameters, respectively. The 2B-parameter configuration is characterised by Multi-Query Attention (MQA), RoPE embeddings, GeGLU activation and RMSNorm normalisation.",
  },
  "Gemma-7B": {
    name: "Gemma-7B",
    description:
      "Gemma is a family of open LLMs released by Google in February 2024. It is available in two sizes with 2 billion and 7 billion parameters, respectively. The 7B-parameter configuration is characterised by RoPE embeddings, GeGLU activation and RMSNorm normalisation.",
  },
};

export const taskDescriptions = {
  "Question Answering": {
    name: "Question Answering",
    definition:
      "The task involves generating accurate answers to questions based on a given context or knowledge source. Question answering has useful applications in customer support, where responses to customer queries can be automated using knowledge bases. Virtual assistants like Alexa and Siri are also trained in QA.",
  },
  "Text Summarisation": {
    name: "Text Summarisation",
    definition:
      "The task involves producing a concise summary of a longer text, retaining the main points and essential information. Text summarisation can be useful for aggregating long news articles or reviewing lengthy legal documents to assist lawyers in quickly grasping key points.",
  },
  "Sentiment Analysis": {
    name: "Sentiment Analysis",
    definition:
      "The task involves identifying and classifying the emotional tone or sentiment expressed in a text, such as positive, negative, or neutral. This task is useful in market research to understand customer feedback and gauge their response to a product or brand.",
  },
};

export const gpuInfo = {
  T4: {
    name: "T4",
    description:
      "The NVIDIA T4 GPU is a mid-range accelerator designed for inference tasks, light training, and AI workloads. It is optimised for lower power consumption while still delivering good performance for models up to a few billion parameters. The T4 is widely used for cost-effective and energy-efficient workloads, especially in cloud environments like Google Colab, where emissions are often tied to regional data centre efficiency. Its lower computational power relative to the more advanced GPUs means that while it uses less energy and emits less CO₂ per second, it takes longer to complete fine-tuning tasks, potentially balancing out its overall emissions.",
  },
  L4: {
    name: "L4",
    description:
      "The NVIDIA L4 GPU, an evolution of the T4, provides enhanced AI and graphics capabilities, optimised for multi-modal workloads, including generative AI, video processing, and inferencing tasks. It offers better performance than the T4 but remains energy-efficient. The L4 strikes a balance between the cost-effectiveness of the T4 and the power of the A100, making it suitable for both training and inference tasks across various AI domains. This GPU is often used in enterprise settings where energy efficiency and scalability are important.",
  },
  A100: {
    name: "A100",
    description:
      "The NVIDIA A100 GPU is a high-performance model designed for deep learning training and inference on massive datasets. It offers significantly higher computational power, making it ideal for training large models like those in natural language processing. The A100 supports tensor cores that accelerate AI workloads, drastically reducing the time required for tasks like model fine-tuning. Despite its powerful performance, the A100 consumes more energy and emits more CO₂ per second, leading to higher emissions rates when compared to T4 and L4. However, its shorter runtime for completing tasks often offsets its higher per-second emissions.",
  },
};

export const emissionsData = {
  "LLaMA-2-7B": {
    "Question Answering": {
      T4: {
        energy: 0.139,
        emissions: 68.18,
        emissionsRate: "1.62 x 10^-2",
        duration: 70.02,
      },
      L4: {
        energy: 0.124,
        emissions: 58.57,
        emissionsRate: "1.74 x 10^-2",
        duration: 56.1,
      },
      A100: {
        energy: 0.121,
        emissions: 56.79,
        emissionsRate: "3.88 x 10^-2",
        duration: 24.41,
      },
    },
    "Text Summarisation": {
      T4: {
        energy: 0.176,
        emissions: 86.24,
        emissionsRate: "1.62 x 10^-2",
        duration: 88.94,
      },
      L4: {
        energy: 0.158,
        emissions: 55.04,
        emissionsRate: "1.29 x 10^-2",
        duration: 80.0,
      },
      A100: {
        energy: 0.143,
        emissions: 64.83,
        emissionsRate: "4.31 x 10^-2",
        duration: 25.04,
      },
    },
    "Sentiment Analysis": {
      T4: {
        energy: 0.175,
        emissions: 85.64,
        emissionsRate: "1.62 x 10^-2",
        duration: 88.09,
      },
      L4: {
        energy: 0.267,
        emissions: 125.64,
        emissionsRate: "1.76 x 10^-2",
        duration: 119.77,
      },
      A100: {
        energy: 0.257,
        emissions: 116.3,
        emissionsRate: "3.80 x 10^-2",
        duration: 52.38,
      },
    },
  },
  "Mistral-7B": {
    "Question Answering": {
      T4: {
        energy: 0.142,
        emissions: 50.15,
        emissionsRate: "1.19 x 10^-2",
        duration: 70.32,
      },
      L4: {
        energy: 0.132,
        emissions: 62.33,
        emissionsRate: "1.73 x 10^-2",
        duration: 59.89,
      },
      A100: {
        energy: 0.13,
        emissions: 58.67,
        emissionsRate: " 3.56 x 10^-2",
        duration: 27.5,
      },
    },
    "Text Summarisation": {
      T4: {
        energy: 0.206,
        emissions: 71.85,
        emissionsRate: "1.15 x 10^-2",
        duration: 103.75,
      },
      L4: {
        energy: 0.167,
        emissions: 78.48,
        emissionsRate: "1.74 x 10^-2",
        duration: 75.18,
      },
      A100: {
        energy: 0.161,
        emissions: 75.83,
        emissionsRate: "4.76 x 10^-2",
        duration: 26.58,
      },
    },
    "Sentiment Analysis": {
      T4: {
        energy: 0.174,
        emissions: 84.88,
        emissionsRate: "1.63 x 10^-2",
        duration: 87.04,
      },
      A100: {
        energy: 0.139,
        emissions: 63.04,
        emissionsRate: "3.64 x 10^-2",
        duration: 30.09,
      },
    },
  },
  "Gemma-2B": {
    "Question Answering": {
      T4: {
        energy: 0.052,
        emissions: 25.36,
        emissionsRate: "1.63 x 10^-2",
        duration: 25.95,
      },
      L4: {
        energy: 0.051,
        emissions: 23.97,
        emissionsRate: "1.72 x 10^-2",
        duration: 23.2,
      },
      A100: {
        energy: 0.071,
        emissions: 24.92,
        emissionsRate: "1.89 x 10^-2",
        duration: 21.95,
      },
    },
    "Text Summarisation": {
      T4: {
        energy: 0.08,
        emissions: 39.13,
        emissionsRate: "1.61 x 10^-2",
        duration: 39.13,
      },
      L4: {
        energy: 0.067,
        emissions: 31.62,
        emissionsRate: "1.74 x 10^-2",
        duration: 30.37,
      },
      A100: {
        energy: 0.065,
        emissions: 30.38,
        emissionsRate: "3.40 x 10^-2",
        duration: 14.9,
      },
    },
    "Sentiment Analysis": {
      T4: {
        energy: 0.06,
        emissions: 29.53,
        emissionsRate: "1.61 x 10^-2",
        duration: 29.53,
      },
      L4: {
        energy: 0.051,
        emissions: 24.12,
        emissionsRate: "1.77 x 10^-2",
        duration: 23.21,
      },
      A100: {
        energy: 0.06,
        emissions: 27.25,
        emissionsRate: "2.85 x 10^-2",
        duration: 16.47,
      },
    },
  },
  "Gemma-7B": {
    "Question Answering": {
      A100: {
        energy: 0.15,
        emissions: 70.48,
        emissionsRate: "3.64 x 10^-2",
        duration: 32.28,
      },
    },
    "Text Summarisation": {
      A100: {
        energy: 0.25,
        emissions: 117.93,
        emissionsRate: "5.14 x 10^-2",
        duration: 38.27,
      },
    },
    "Sentiment Analysis": {
      A100: {
        energy: 0.14,
        emissions: 63.37,
        emissionsRate: "4.19 x 10^-2",
        duration: 27.05,
      },
    },
  },
};

export const timePerBatchData = {
  "LLaMA-2-7B": {
    "Question Answering": {
      T4: 1.0503,
      L4: 0.8415,
      A100: 0.36615,
    },
    "Text Summarisation": {
      T4: 1.3341,
      L4: 1.2,
      A100: 0.3756,
    },
    "Sentiment Analysis": {
      T4: 1.32135,
      L4: 1.79655,
      A100: 0.7857,
    },
  },
  "Mistral-7B": {
    "Question Answering": {
      T4: 1.0548,
      L4: 0.89835,
      A100: 0.4125,
    },
    "Text Summarisation": {
      T4: 1.55625,
      L4: 1.1277,
      A100: 0.3987,
    },
    "Sentiment Analysis": {
      T4: 1.3056,
      L4: 1.013025,
      A100: 0.45135,
    },
  },
  "Gemma-2B": {
    "Question Answering": {
      T4: 0.38925,
      L4: 0.348,
      A100: 0.32925,
    },
    "Text Summarisation": {
      T4: 0.58695,
      L4: 0.45555,
      A100: 0.2235,
    },
    "Sentiment Analysis": {
      T4: 0.44295,
      L4: 0.34815,
      A100: 0.24705,
    },
  },
  "Gemma-7B": {
    "Question Answering": {
      A100: 0.4842,
    },
    "Text Summarisation": {
      A100: 0.57405,
    },
    "Sentiment Analysis": {
      A100: 0.40575,
    },
  },
};

export const powerData = {
  T4: 120.23,
  L4: 132.57,
  A100: 292.87,
};
