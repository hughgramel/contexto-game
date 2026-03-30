export type {
  ReaderDocument,
  ReaderPage,
  ReaderParagraph,
  ReaderSentence,
  ReaderToken,
} from "@/lib/content/types";

export type MediaKind = "reader" | "video" | "other";

export type MediaSourceType = "sample" | "upload";

export type WordStatus = "learning" | "known";

export type WordEntry = {
  normalized: string;
  surfaceForms: string[];
  status: WordStatus;
  updatedAt: string;
};

export type MediaRecord = {
  id: string;
  title: string;
  kind: MediaKind;
  sourceType: MediaSourceType;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string | null;
  coverUrl: string | null;
};

export type ReaderProgress = {
  mediaId: string;
  pageIndex: number;
  progressPercent: number;
  scrollTop: number;
  knownAtPageStart: number;
  knownAtPageEnd: number;
  wordsReadOnPage: number;
  updatedAt: string;
};

export type ReaderVisibleWindow = {
  previousPageIndex: number | null;
  activePageIndex: number;
  nextPageIndex: number | null;
};

export type SentenceSelection = {
  mediaId: string;
  pageIndex: number;
  startTokenId: string;
  endTokenId: string;
  text: string;
};

export type WordModalState = {
  mediaId: string;
  pageIndex: number;
  tokenId: string;
  normalized: string;
  surface: string;
  isOpen: boolean;
};

export type ReaderUiState = {
  activeMediaId: string | null;
  activePageIndex: number;
  currentPageWordIds: string[];
  visibleWindow: ReaderVisibleWindow;
  selectedSentence: SentenceSelection | null;
  wordModal: WordModalState | null;
  knownAtPageStart: number;
  knownAtPageEnd: number;
  pendingGestureDirection: "next" | "previous" | null;
};

export type PageReadSnapshot = {
  mediaId: string;
  pageId: string;
  pageIndex: number;
  wordsRead: number;
  knownAtPageStart: number;
  knownAtPageEnd: number;
  gainedKnownWords: number;
  progressPercent: number;
  createdAt: string;
};

export type MediaStats = {
  mediaId: string;
  wordsRead: number;
  pagesCompleted: number;
  currentProgressPercent: number;
  knownTokenCount: number;
  totalTokenCount: number;
  lastReadAt: string | null;
};

export type UserProfile = {
  id: string;
  displayName: string;
  nativeLanguage: string;
  targetLanguage: string;
  updatedAt: string;
};

export type ReaderPreferences = {
  preferredReaderMode: "auto" | "web" | "mobile";
  useSafeAreaInsets: boolean;
};

export type ComprehensionAnalysis = {
  totalTokens: number;
  knownTokens: number;
  learningTokens: number;
  unknownTokens: number;
  comprehensionPercent: number;
};
