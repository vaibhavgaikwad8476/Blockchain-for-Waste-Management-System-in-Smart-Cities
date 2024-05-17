"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WasteAnalytics } from "./components/WasteAnalyticsCards";
import WasteRequestCard from "./components/WasteRequestCard";
import { useLocalStorage } from "../hooks";
import RecentRequestsTable from "./components/RecentRequests";
import { wasteCollectionApi } from "../api";
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [userDetails, setUserDetails] = useLocalStorage("userDetails", null);
  const [token, setToken] = useLocalStorage("token", null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState({ isRecentRequestsLoading: false });
  const [paginationConfig, setPaginationConfig] = useState({
    page: 1,
    limit: 10,
    count: null,
  });
  const fetchRecentRequests = async (page = 1, limit = 10, userId) => {
    try {
      setLoading({ ...loading, isRecentRequestsLoading: true });
      const response = await wasteCollectionApi.getAllWasteCollections({
        page,
        limit,
        userId,
      });
      if (response.status === 200) {
        setRequests(response.data.data);
        setPaginationConfig({
          page: response.data.page,
          limit: response.data.limit,
          count: response.data.count,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.message,
      });
      setLoading({ ...loading, isRecentRequestsLoading: false });
    } finally {
      setLoading({ ...loading, isRecentRequestsLoading: false });
    }
  };
  useEffect(() => {
    if (!router || !token) return;
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);
  const userData = JSON.parse(userDetails);

  useEffect(() => {
    if (!userData?.id || userData?.role !== "USER") return;
    fetchRecentRequests(
      paginationConfig.page,
      paginationConfig.limit,
      userData?.id
    );
  }, [userData?.id]);

  if (!userData?.role) {
    return <> </>;
  }

  return (
    <main className="container pt-6">
      <h1 className="text-center mb-6 font-bold text-xl">
        {userData?.role !== "USER" && "Waste Collection Analysis"}
      </h1>
      {userData?.role !== "USER" ? (
        <WasteAnalytics />
      ) : (
        <WasteRequestCard
          fetchRecentRequests={fetchRecentRequests}
          paginationConfig={paginationConfig}
          userId={userData?.id}
        />
      )}

      {userData?.role !== "USER" ? (
        " "
      ) : (
        <>
          <h1 className="mt-10">Your Recent Orders</h1>
          <RecentRequestsTable
            fetchRecentRequests={fetchRecentRequests}
            requests={requests}
            setRequests={setRequests}
            isRecentRequestsLoading={loading.isRecentRequestsLoading}
            paginationConfig={paginationConfig}
            setPaginationConfig={setPaginationConfig}
          />
        </>
      )}
    </main>
  );
};

export default Home;
