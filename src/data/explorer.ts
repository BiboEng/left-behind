// AI-assisted educational draft (Devin). Each explanation is tied to an existing NASA source.
// Human source review is still required; these questions do not change relic.verified.
export interface ExplorerQuestion {
  question: string;
  options: [string, string, string];
  answer: 0 | 1 | 2;
  explanation: string;
  sourceUrl: string;
}

export const explorerQuestions: Partial<Record<string, ExplorerQuestion>> = {
  "ranger-7": {
    question: "How could a spacecraft that crashed still help future explorers?",
    options: ["It sent close-up photos before impact", "It brought Moon rocks back to Earth", "It built a landing pad"],
    answer: 0,
    explanation: "Ranger 7 sent thousands of photos as it approached the Moon. A mission can succeed without surviving: its job was to show NASA the surface up close.",
    sourceUrl: "https://www.nasa.gov/history/60-years-ago-ranger-7-photographs-the-moon/",
  },
  "apollo-11-eagle": {
    question: "Why did Eagle leave its lower half on the Moon?",
    options: ["The astronauts forgot to attach it", "It became the launch pad for the upper half", "It drove away to collect rocks"],
    answer: 1,
    explanation: "The descent stage carried the landing legs. It stayed behind while the ascent stage lifted the astronauts back to lunar orbit.",
    sourceUrl: "https://www.nasa.gov/mission/apollo-11/",
  },
  "lcross": {
    question: "Why did NASA deliberately crash a rocket stage into a dark crater?",
    options: ["To light up the crater permanently", "To make room for a rover", "To throw up material that instruments could study"],
    answer: 2,
    explanation: "The impact lifted buried material into a plume. LCROSS flew through it and measured evidence of water in the permanently shadowed crater.",
    sourceUrl: "https://science.nasa.gov/mission/lcross/",
  },
  "spirit": {
    question: "What unexpected clue did Spirit's broken wheel uncover?",
    options: ["Bright soil pointing to past water activity", "A piece of another spacecraft", "Living plants below the sand"],
    answer: 0,
    explanation: "The dragging wheel exposed silica-rich soil. Scientists linked it to water processes, possibly hot springs or steam vents. Evidence of past water does not by itself prove life.",
    sourceUrl: "https://www.jpl.nasa.gov/news/mars-rover-spirit-unearths-surprise-evidence-of-wetter-past/",
  },
  "insight": {
    question: "How could InSight study inside Mars without driving anywhere?",
    options: ["It dug a tunnel to the core", "It measured shaking from marsquakes", "It photographed the core from orbit"],
    answer: 1,
    explanation: "InSight placed a seismometer on the surface. Waves from marsquakes traveled through the planet and helped scientists work out its internal structure.",
    sourceUrl: "https://science.nasa.gov/mission/insight/",
  },
  "ingenuity": {
    question: "What did Ingenuity demonstrate for the first time on another planet?",
    options: ["A flight with an astronaut", "A return journey to Earth", "Powered, controlled flight"],
    answer: 2,
    explanation: "Ingenuity flew in Mars's thin atmosphere under its own power. Its mission was a technology demonstration: testing a new way to explore.",
    sourceUrl: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/",
  },
};
