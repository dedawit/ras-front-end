import { FC } from "react";
import RFQCard from "./RFQCard";
import { RFQ } from "@/types";

const mockRFQs: RFQ[] = [
  {
    id: "1",
    title: "Advanced Microphones for Studio",
    quantity: 150,
    date: "2024-11-26",
    category: "Electronics and Electrical Equipment",
    quotes: 99,
  },
  {
    id: "2",
    title: "Rice",
    quantity: 2900,
    date: "2024-10-26",
    category: "Agriculture and Food Products",
    quotes: 99,
  },
];

const RFQList: FC = () => {
  return (
    <div className="space-y-4">
      {mockRFQs.map((rfq) => (
        <RFQCard key={rfq.id} rfq={rfq} />
      ))}
    </div>
  );
};

export default RFQList;
