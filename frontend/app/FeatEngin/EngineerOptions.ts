export type OptionType = {
  icon: string;
  name: string;
  value: string;
  color?: string;
  description?: string;
};
export type OptionCategoryType = {
  icon: string;
  name: string;
  children: OptionType[];
};
export const Options: OptionCategoryType[] = [
  {
    icon: "view_column",
    name: "Column Ops",
    children: [
      {
        name: "Extract Datetime",
        value: "extract_datetime",
        icon: "event",
        color: "primary",
        description: "Parses string data into standardized ISO timestamps.",
      },
      {
        name: "Text Length",
        value: "text_length",
        icon: "straighten",
        color: "tertiary",
        description: "Computes integer character count for inputs.",
      },
      {
        name: "Word Count",
        value: "word_count",
        icon: "short_text",
        color: "primary",
        description: "Analyzes lexical density via whitespace tokenization.",
      },
      {
        name: "Text Sentiment",
        value: "text_sentiment",
        icon: "sentiment_satisfied",
        color: "tertiary",
        description: "Applies VADER analysis for polarity scoring (-1 to 1).",
      },
      {
        name: "Flag Missing",
        value: "flag_missing",
        icon: "flag",
        color: "error",
        description: "Categorizes null/empty states for downstream filtering.",
      },
    ],
  },
  {
    icon: "groups",
    name: "Group By",
    children: [
      { name: "Groupby Aggregate", value: "groupby_agg", icon: "functions" },
    ],
  },
  {
    icon: "data_object",
    name: "Custom Expression",
    children: [{ name: "Expression", value: "expression", icon: "code" }],
  },
];
