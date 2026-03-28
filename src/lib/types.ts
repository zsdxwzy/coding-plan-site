export interface Plan {
  name: string;
  price: number;
  priceLabel: string;
  firstMonth?: string;
  quota5h?: string;
  quotaWeek?: string;
  quotaMonth?: string;
  popular?: boolean;
  tags?: string[];
}

export interface Platform {
  id: string;
  name: string;
  region: "cn" | "intl";
  badge: string;
  badgeColor: "green" | "yellow" | "blue" | "purple" | "red";
  category: "plan" | "ide" | "agent";
  desc: string[];
  plans: Plan[];
  models: string[];
  tools: string[];
  contextWindow?: string;
  notice?: string;
  link: string;
  updatedAt: string;
}

export interface PlatformsData {
  updatedAt: string;
  platforms: Platform[];
}
