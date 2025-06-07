import { FC, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useUser } from "../../context/UserContext";
import Sidebar from "../ui/SideBar";
import Header from "../ui/Header";
import MobileHeader from "../ui/MobileHeader";
import { handleApiError } from "../../utils/errorHandler";
import { RFQ, rfqReportService, RFQSummary } from "../../services/report";

ChartJS.register(ArcElement, Tooltip, Legend);

const BuyerReport: FC = () => {
  const { id: buyerId } = useUser();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [rfqHistory, setRfqHistory] = useState<RFQ[]>([]);
  const [rfqSummary, setRfqSummary] = useState<RFQSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!buyerId) return;
      try {
        setLoading(true);
        const history = await rfqReportService.getRFQHistory(buyerId);
        const summary = await rfqReportService.getRFQSummary(buyerId);
        setRfqHistory(history);
        setRfqSummary(summary);
      } catch (error) {
        console.error("Error fetching buyer report data:", error);
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [buyerId]);

  const getStatusColorHex = (status: string) => {
    switch (status.toLowerCase()) {
      case "opened":
        return "#22c55e";
      case "closed":
        return "#ef4444";
      case "awarded":
        return "#facc15";
      default:
        return "#9ca3af";
    }
  };

  const pieData = {
    labels: rfqSummary.map((item) => item.name),
    datasets: [
      {
        data: rfqSummary.map((item) => item.value),
        backgroundColor: rfqSummary.map((item) => getStatusColorHex(item.name)),
        hoverBackgroundColor: rfqSummary.map((item) =>
          getStatusColorHex(item.name)
        ),
      },
    ],
  };

  console.log("pieData", pieData);

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="flex flex-1 ">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-y-auto scrollbar-none space-y-4 custom-scroll max-h-[1200px]">
          {/* <Header
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search RFQ..."
          /> */}
          <MobileHeader showSearchIcon={false} />
          <main className="flex-1 p-4 md:p-6 ">
            {/* <h1 className="text-3xl font-bold mb-4">Buyer Report</h1> */}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Pie Chart */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">
                    RFQ Status Summary
                  </h2>
                  <div className="flex justify-center">
                    <div className="w-72 sm:w-80 md:w-96">
                      <Pie data={pieData} options={{ responsive: true }} />
                    </div>
                  </div>
                </div>

                {/* RFQ History Table */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">RFQ History</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            #
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Deadline
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Winning Bid (ETB)
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transaction ID
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {rfqHistory
                          .filter((rfq) =>
                            rfq.title
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((rfq, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                                {rfq.title}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                                {rfq.projectName}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                                {rfq.quantity}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                                {rfq.category}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                                {rfq.deadline
                                  ? new Date(rfq.deadline).toLocaleDateString(
                                      "en-GB"
                                    )
                                  : "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                                {rfq.winningBidPrice !== undefined &&
                                rfq.winningBidPrice !== null
                                  ? rfq.winningBidPrice.toLocaleString(
                                      "en-ET",
                                      {
                                        style: "currency",
                                        currency: "ETB",
                                      }
                                    )
                                  : "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                                {rfq.transactionId || "N/A"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
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

export default BuyerReport;
