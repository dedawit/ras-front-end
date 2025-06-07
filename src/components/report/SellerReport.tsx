import { FC, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useUser } from "../../context/UserContext";
import SideBarSeller from "../ui/SideBarSeller";
import Header from "../ui/Header";
import MobileHeader from "../ui/MobileHeader";
import { BidStateCount, rfqReportService } from "../../services/report";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SellerReport: FC = () => {
  const { id: sellerId } = useUser();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [bidStates, setBidStates] = useState<BidStateCount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!sellerId) return;
      try {
        setLoading(true);
        const states = await rfqReportService.getBidStateCounts(sellerId);
        setBidStates(states);
      } catch (error) {
        console.error("Error fetching seller report data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sellerId]);

  const getStatusColorHex = (status: string) => {
    switch (status.toLowerCase()) {
      case "awarded":
        return "#facc15";
      case "rejected":
        return "#f87171";
      default:
        return "#9ca3af";
    }
  };

  const barData = {
    labels: bidStates.map((item) => item.state),
    datasets: [
      {
        label: "Bid Count",
        data: bidStates.map((item) => item.count),
        backgroundColor: bidStates.map((item) => getStatusColorHex(item.state)),
        hoverBackgroundColor: bidStates.map((item) =>
          getStatusColorHex(item.state)
        ),
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="flex flex-1 overflow-hidden">
        <SideBarSeller />
        <div className="flex-1 flex flex-col overflow-y-auto custom-scroll">
          <MobileHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search Bids..."
          />

          <main className="flex-1 p-4 md:p-6 max-w-full w-full mx-auto overflow-x-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Bar Chart Section */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm max-w-2xl mt-8">
                  <h2 className="text-xl font-semibold mb-4 text-left">
                    Bid Status Summary
                  </h2>
                  <div className="relative h-[400px] w-full">
                    <Bar
                      data={barData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: { display: true, text: "Count" },
                          },
                          x: {
                            title: { display: true, text: "Bid Status" },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SellerReport;
