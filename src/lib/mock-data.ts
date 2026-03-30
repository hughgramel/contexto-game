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
  { code: "zh", label: "Chinese", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "es", label: "Spanish", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "ja", label: "Japanese", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "ko", label: "Korean", flag: "\u{1F1F0}\u{1F1F7}" },
  { code: "fr", label: "French", flag: "\u{1F1EB}\u{1F1F7}" },
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
      "Shanghai has more coffee shops than any other city in the world. With over 8,000 cafes, it has surpassed traditional coffee capitals like London and New York. The city's coffee culture has exploded in recent years, driven by young professionals and a growing appreciation for specialty brews. Local chains like Manner Coffee have challenged international giants by offering quality espresso at a fraction of the price. A latte at Manner costs around 15 yuan, compared to 35 yuan at Starbucks. This pricing strategy has made specialty coffee accessible to a much broader audience across the city.",
      "The phenomenon reflects broader changes in Chinese consumer culture. Young urbanites see coffee shops not just as places to drink coffee, but as social spaces, remote offices, and lifestyle statements. Many shops feature distinctive design elements that make them popular on social media, drawing visitors from across the country. Industry analysts predict the trend will continue growing. With coffee consumption per capita still far below Western countries, the potential market is enormous. Shanghai is just the beginning of China's coffee revolution, and other major cities are quickly following suit.",
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
      "Remember the posture corrector your parents forced you to wear as a kid? It's back, and this time adults are buying them voluntarily. The devices, once associated with strict parenting, have become a wellness trend among office workers. Sales of posture correctors have tripled in the past year on major e-commerce platforms. Young professionals cite long hours at desks and chronic back pain as primary motivators. Social media influencers have helped rebrand the devices from punishment to self-care, featuring them in their daily wellness routines.",
      "Medical professionals have mixed opinions about the trend. While good posture is certainly important for long-term health, some worry that reliance on external devices could actually weaken core muscles over time. They recommend combining corrector use with regular exercise and ergonomic workspace setups. Despite these concerns, the market continues to grow rapidly, with new designs targeting younger consumers who want posture support that looks stylish enough to wear in public.",
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
      "Egg Party, a casual multiplayer game, has become the go-to social platform for China's youngest generation. With over 100 million users, many under 14, the game has created a virtual playground where kids hang out, make friends, and express themselves. Unlike traditional games focused on competition, Egg Party emphasizes social interaction and creativity. Players customize egg-shaped avatars, participate in mini-games, and create their own virtual spaces. The low-pressure environment has made it particularly popular among younger users who find other games too intense or competitive.",
      "Parents and educators are watching closely. While the game provides valuable social opportunities for children, concerns about screen time and age-appropriate content remain significant. The developers have implemented strict time limits and content moderation systems to address these worries. The success of Egg Party signals a fundamental shift in how the next generation socializes. For many kids growing up today, online spaces are as real and important as physical playgrounds. Understanding this trend is crucial for parents and educators who want to stay connected with children's social lives.",
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
      "A bag of instant noodle snacks costs 2 yuan. But the trading card inside might be worth hundreds. Across China, adults are rediscovering the joy of collecting cards from snack packaging, driving a nostalgia-fueled secondary market that has surprised even industry analysts. The trend started with Water Margin character cards from Xiao Huan Xiong brand snacks. Complete sets from the 1990s now sell for thousands of yuan on collector platforms. Modern versions have adopted features like holographic finishes and limited editions to drive collectibility among both old and new fans.",
      "For many collectors, it's not really about the money at all. Opening a snack bag and finding a rare card triggers the same rush of excitement they felt as children in the schoolyard. In a fast-paced, high-pressure world, these simple pleasures offer a welcome connection to simpler times. The phenomenon has spawned entire communities online where collectors trade tips, show off rare finds, and organize meetups to swap cards over bowls of instant noodles.",
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
      "In Chinese culture, 'other people's children' is a well-known phrase referring to the seemingly perfect kids that parents constantly compare their own children to. This comparison culture starts earlier than most people realize, shaping children's experiences from their very first years. Research shows competitive pressure begins as early as kindergarten, with parents signing children up for multiple enrichment classes. By elementary school, many children attend tutoring centers, music lessons, and sports training several times a week, leaving little room for unstructured play.",
      "The pressure has real consequences that are becoming harder to ignore. Child psychologists report increasing cases of anxiety and burnout among young students. The government's 'double reduction' policy aimed to address this by limiting homework and banning for-profit tutoring, but many families have simply moved activities underground or found creative workarounds. Some parents are now pushing back against the system entirely. A growing counter-movement advocates for 'slow parenting' \u2014 letting children develop at their own pace and prioritizing happiness over achievement. Whether this movement can overcome deeply ingrained cultural norms remains to be seen.",
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
      "Every winter, a peculiar sight appears in markets across northeast China: rock-hard, blackened pears. These frozen pears, or dong li, are a traditional delicacy that has recently captured the imagination of people across the country thanks to social media. The process is beautifully simple: leave pears outside in sub-zero temperatures until they freeze completely solid and turn dark. To eat them, soak in cold water until partially thawed. The result is a slushy, intensely sweet treat unlike anything else you have ever tasted.",
      "Tourism boards in Harbin and other northeastern cities have embraced frozen pears as a cultural symbol and marketing tool. During the annual ice festival, vendors sell them alongside other traditional winter foods like candied hawthorn and roasted sweet potatoes, introducing the delicacy to millions of visitors from warmer southern regions. The trend has even spread online, with southern Chinese residents attempting to freeze their own pears in home freezers \u2014 though purists insist that only the natural outdoor freeze of the northeast produces the authentic texture and flavor.",
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
