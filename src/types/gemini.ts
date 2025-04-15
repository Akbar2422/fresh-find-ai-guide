
export type GeminiResponse = {
  Identification: {
    name: string;
    varieties: string;
  };
  QualityCheck: {
    rate: 'Good' | 'Average' | 'Bad';
    reason: string;
  };
  NutritionInfo: {
    calories: string;
    protein: string;
    carbohydrates: string;
    fats: string;
    fiber: string;
    waterContent: string;
  };
  RecipeSuggestions: Array<{
    name: string;
    steps: string;
    youtube_url: string;
  }>;
  StorageAdvice: {
    method: string;
    expiry_duration: string;
  };
  FridgeReminder: string;
  LeaderboardInfo: string;
  FunFact: string;
  ArtificialCoatingDetection: {
    signs: string;
    confidence: string;
  };
};

export type GeminiError = {
  error: string;
};
