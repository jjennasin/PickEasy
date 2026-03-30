export type DecisionCategory = 'food-dining' | 'activity-entertainment' | 'study-work';

export type DecisionOption = {
  id: string;
  label: string;
  votes: string[];
};

export type DecisionRecord = {
  uuid: string | null;
  join_code: string | null;
  name: string;
  category: DecisionCategory | null;
  options: DecisionOption[];
  result: string | null;
  created_at: string | null;
};
