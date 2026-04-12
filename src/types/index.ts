// Represents a single job entity returned by the LLM
export interface Job {
  title: string;
  company: string;
  apply_url: string;
  match_reason: string;
}

// Represents the complete response from the backend API
export interface HuntResponse {
  market_analysis?: string;
  jobs?: Job[];
  error?: string;
}


export interface VibeData {
  osho_quote: string;
  cheesy_line: string;
}

// Update HuntResponse to include VibeData if the backend sends it together
export interface HuntResponse {
  market_analysis?: string;
  jobs?: Job[];
  vibe?: VibeData; // The new mystic addition
  error?: string;
}

export interface Job {
  title: string;
  company: string;
  apply_url: string;
  match_reason: string;
}

export interface HuntResponse {
  market_analysis?: string;
  jobs?: Job[];
  error?: string;
}
