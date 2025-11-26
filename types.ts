export interface FormData {
  fullName: string;
  dob: string;
  age: string;
  height: string;
  zodiacSign: string;
  favoriteColor: string;
  needsToForgive: string;
  needsToBeForgiven: string;
  drawDate: string;
}

export interface GenerationResult {
  luckyNumbers: number[];
  explanation: string;
}

export interface SavedPrediction {
  id: string;
  timestamp: string;
  formData: FormData;
  result: GenerationResult;
}