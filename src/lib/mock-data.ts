export type Article = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  wordsCount: number;
  pages: string[];
};

export type Language = {
  code: string;
  label: string;
  flag: string;
};

export const LANGUAGES: Language[] = [
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "fr", label: "French", flag: "🇫🇷" },
];

export const CATEGORIES = ["Latest", "Society", "Story", "Slang", "Culture", "Tech"];

export const MOCK_ARTICLES: Article[] = [
  {
    id: "shanghai-coffee",
    title: "Shanghai: The Coffee Capital of the World",
    subtitle: "How Shanghai became the city with the most coffee shops globally",
    category: "Society",
    date: "03/30/26",
    wordsCount: 320,
    pages: [
      "Shanghai has more coffee shops than any other city in the world. With over 8,000 cafes, it has surpassed traditional coffee capitals like London and New York. The city's coffee culture has exploded in recent years, driven by young professionals and a growing appreciation for specialty brews.",
      "Local chains like Manner Coffee have challenged international giants by offering quality espresso at a fraction of the price. A latte at Manner costs around 15 yuan, compared to 35 yuan at Starbucks. This pricing strategy has made specialty coffee accessible to a broader audience.",
      "The phenomenon reflects broader changes in Chinese consumer culture. Young urbanites see coffee shops not just as places to drink coffee, but as social spaces, remote offices, and lifestyle statements. Many shops feature distinctive design elements that make them popular on social media.",
      "Industry analysts predict the trend will continue growing. With coffee consumption per capita still far below Western countries, the potential market is enormous. Shanghai is just the beginning of China's coffee revolution.",
    ],
  },
  {
    id: "posture-corrector",
    title: "The Return of China's Posture Corrector",
    subtitle: "From childhood nightmare to adult obsession",
    category: "Society",
    date: "03/29/26",
    wordsCount: 280,
    pages: [
      "Remember the posture corrector your parents forced you to wear as a kid? It's back, and this time adults are buying them voluntarily. The devices, once associated with strict parenting, have become a wellness trend among office workers.",
      "Sales of posture correctors have tripled in the past year on major e-commerce platforms. Young professionals cite long hours at desks and chronic back pain as primary motivators. Social media influencers have helped rebrand the devices from punishment to self-care.",
      "Medical professionals have mixed opinions. While good posture is important, some worry that reliance on external devices could weaken core muscles. They recommend combining corrector use with regular exercise and ergonomic workspace setups.",
    ],
  },
  {
    id: "egg-party",
    title: "The Digital Playground Revolution",
    subtitle: "How Egg Party became Gen Alpha's social hub",
    category: "Tech",
    date: "03/28/26",
    wordsCount: 350,
    pages: [
      "Egg Party, a casual multiplayer game, has become the go-to social platform for China's youngest generation. With over 100 million users, many under 14, the game has created a virtual playground where kids hang out, make friends, and express themselves.",
      "Unlike traditional games focused on competition, Egg Party emphasizes social interaction and creativity. Players customize egg-shaped avatars, participate in mini-games, and create their own virtual spaces. The low-pressure environment has made it particularly popular among younger users.",
      "Parents and educators are watching closely. While the game provides social opportunities, concerns about screen time and age-appropriate content remain. The developers have implemented strict time limits and content moderation systems.",
      "The success of Egg Party signals a shift in how the next generation socializes. For many kids, online spaces are as real and important as physical playgrounds. Understanding this trend is crucial for parents and educators alike.",
    ],
  },
  {
    id: "trading-cards",
    title: "The Nostalgic Hunt for Trading Cards in Snack Bags",
    subtitle: "Why adults are buying children's snacks for the collectibles inside",
    category: "Culture",
    date: "03/27/26",
    wordsCount: 260,
    pages: [
      "A bag of instant noodle snacks costs 2 yuan. But the trading card inside might be worth hundreds. Across China, adults are rediscovering the joy of collecting cards from snack packaging, driving a nostalgia-fueled secondary market.",
      "The trend started with Water Margin cards from Xiao Huan Xiong brand snacks. Complete sets from the 1990s now sell for thousands of yuan. Modern versions have adopted features like holographic finishes and limited editions to drive collectibility.",
      "For many collectors, it's not about the money. Opening a snack bag and finding a rare card triggers the same excitement they felt as children. In a fast-paced world, these simple pleasures offer a welcome connection to simpler times.",
    ],
  },
  {
    id: "competition-culture",
    title: "When Does Chinese-Style Competition Begin?",
    subtitle: "The phenomenon of 'Other People's Children'",
    category: "Society",
    date: "03/26/26",
    wordsCount: 300,
    pages: [
      "In Chinese culture, 'other people's children' is a well-known phrase referring to the seemingly perfect kids that parents constantly compare their own children to. This comparison culture starts earlier than most people realize.",
      "Research shows competitive pressure begins as early as kindergarten, with parents signing children up for multiple enrichment classes. By elementary school, many children attend tutoring centers, music lessons, and sports training several times a week.",
      "The pressure has real consequences. Child psychologists report increasing cases of anxiety and burnout among young students. The government's 'double reduction' policy aimed to address this, but many families have simply moved activities underground.",
      "Some parents are pushing back. A growing counter-movement advocates for 'slow parenting' — letting children develop at their own pace and prioritizing happiness over achievement. Whether this movement can overcome deeply ingrained cultural norms remains to be seen.",
    ],
  },
  {
    id: "frozen-pears",
    title: "Why Northerners Freeze Their Pears",
    subtitle: "The traditional winter treat that's gone viral",
    category: "Culture",
    date: "03/25/26",
    wordsCount: 240,
    pages: [
      "Every winter, a peculiar sight appears in markets across northeast China: rock-hard, blackened pears. These frozen pears, or dong li, are a traditional delicacy that has recently captured the imagination of people across the country thanks to social media.",
      "The process is simple: leave pears outside in sub-zero temperatures until they freeze solid and turn dark. To eat them, soak in cold water until partially thawed. The result is a slushy, intensely sweet treat unlike anything else.",
      "Tourism boards in Harbin and other northeastern cities have embraced frozen pears as a cultural symbol. During the annual ice festival, vendors sell them alongside other traditional winter foods, introducing the delicacy to millions of visitors from warmer regions.",
    ],
  },
];

export function getArticleById(id: string): Article | undefined {
  return MOCK_ARTICLES.find((a) => a.id === id);
}

export function getArticlesByCategory(category: string): Article[] {
  if (category === "Latest") return MOCK_ARTICLES;
  return MOCK_ARTICLES.filter((a) => a.category === category);
}
