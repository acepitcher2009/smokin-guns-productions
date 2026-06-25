export interface ResultsSource {
  label: string;
  /** Resolved Rodeo Results App URL. Never expose tinyurl as visible text (PRD §4.3). */
  destinationUrl: string;
  embedUrl?: string;
  mode: 'link' | 'embed';
}

export const results: ResultsSource = {
  label: 'View Series Points & Standings',
  // Owner-supplied series points & standings (Google Sheets).
  destinationUrl:
    'https://docs.google.com/spreadsheets/d/1GNkmU_AHOGaAfaNublPWzpQ58CfSSkzZ/edit?gid=626498948#gid=626498948',
  mode: 'link',
};
