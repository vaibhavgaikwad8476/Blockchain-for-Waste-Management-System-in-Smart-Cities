"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useEffect } from "react";
import { useLocalStorage } from "../hooks";
import { userApi, wasteCollectionApi } from "../api";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import trashGreen from "@/public/trashgreen.svg";
import trashYellow from "@/public/trashyellow.svg";
import trashRed from "@/public/trashred.svg";
import trashBlack from "@/public/trashblack.svg";

import Image from "next/image";
import dayjs from "dayjs";

const MapPage = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/custom/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
  const { toast } = useToast();
  const router = useRouter();
  const [token, setToken] = useLocalStorage("token", null);

  useEffect(() => {
    if (!router || !token) return;
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const [requests, setRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState({
    isRecentRequestsLoading: false,
    isUpdateWasteLoading: false,
  });
  const [paginationConfig, setPaginationConfig] = useState({
    page: 1,
    limit: 10000,
    count: null,
  });

  const fetchRecentRequests = async (page = 1, limit = 10) => {
    try {
      setLoading({ ...loading, isRecentRequestsLoading: true });
      const response = await wasteCollectionApi.getAllWasteCollections({
        page,
        limit,
        status: "PENDING",
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

  const getAllUsers = async (page = 1, limit = 10) => {
    try {
      setLoading({ ...loading, isRecentRequestsLoading: true });
      const response = await userApi.getAll();
      if (response.status === 200) {
        setAllUsers(response.data);
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
    getAllUsers();
  }, []);

  const updateWasteCollection = async (id, payload) => {
    try {
      setLoading({ ...loading, isUpdateWasteLoading: true });
      const response = await wasteCollectionApi.updateWasteCollection(
        id,
        payload
      );
      if (response.status === 200) {
        getAllUsers();
        alert("Order completed successfully");
      }
    } catch (error) {
      setLoading({ ...loading, isUpdateWasteLoading: false });
      toast({
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setLoading({ ...loading, isUpdateWasteLoading: false });
    }
  };

  const markerPositions = allUsers.map((user) => {
    let amount = 0;
    user.wasteCollections.forEach((req) => {
      amount += req.amount;
    });
    const wasteCollectionId = user.wasteCollections[0]?.id;
    const wasteCollection = user.wasteCollections;

    return {
      tooltipContent: (
        <>
          {wasteCollection.length > 0 && (
            <h2 className="text-center">
              {" "}
              status: {wasteCollection[0]?.status}
            </h2>
          )}
          <div className="flex justify-center">
            {(wasteCollection.length === 0 || amount <= 50) && (
              <Image src={trashGreen} alt="trash-can" />
            )}

            {amount >= 50 && amount <= 80 && (
              <Image src={trashYellow} alt="trash-can" />
            )}

            {amount >= 80 && <Image src={trashRed} alt="trash-can" />}
          </div>
          <div className="flex justify-center">{amount || 0} %</div>

          {wasteCollection.length === 0 ? (
            <strong> No recent orders by - {user.name}</strong>
          ) : (
            <strong>{`${user.wasteCollections[0]?.wasteType?.name} waste order by - ${user.name}`}</strong>
          )}
          <h1>{`${user.address}`}</h1>
          <p>
            {amount <= 15 && (
              <span>
                Expected time for the dustbin to be full{" "}
                <strong> {dayjs().add(7, "day").format("DD MMM YYYY")}</strong>
              </span>
            )}
            {amount > 15 && amount <= 30 && (
              <span>
                Expected time for the dustbin to be full{" "}
                <strong> {dayjs().add(5, "day").format("DD MMM YYYY")}</strong>
              </span>
            )}
            {amount > 30 && amount <= 50 && (
              <span>
                Expected time for the dustbin to be full{" "}
                <strong> {dayjs().add(3, "day").format("DD MMM YYYY")}</strong>
              </span>
            )}
            {amount > 50 && amount <= 75 && (
              <span>
                Expected time for the dustbin to be full{" "}
                <strong> {dayjs().add(2, "day").format("DD MMM YYYY")}</strong>
              </span>
            )}
            {amount > 75 && amount <= 90 && (
              <span>Dustbin is almost full </span>
            )}
            {amount > 90 && <span>Dustbin is full </span>}
          </p>
        </>
      ),
      position: [user.locationCoordinates[1], user.locationCoordinates[0]],
      popupContent: (
        <>
          <input
            placeholder="Enter vol. of garbage in dustbin"
            type="number"
            style={{
              border: "2px solid black",
              padding: "0.5rem",
            }}
            id={wasteCollectionId}
          />

          <button
            disabled={loading.isUpdateWasteLoading}
            style={{
              marginTop: "0.5rem",
              border: "2px solid black",
              borderRadius: "4px",
              padding: "0.5rem",
              background: "#000",
              color: "#fff",
            }}
            onClick={(e) => {
              const wasteInput = document.getElementById(wasteCollectionId);
              if (!wasteInput.value) return;
              updateWasteCollection(wasteCollectionId, {
                status: "COMPLETED",
                collectionDate: new Date().toISOString(),
                amount: Number(wasteInput.value),
              });
            }}
          >
            Mark as complete
          </button>
        </>
      ),
    };
  });

  return (
    <>
      <Map
        zoom={10}
        position={markerPositions[0]?.position || [18.523, 73.856]}
        markerPositions={markerPositions}
      />
    </>
  );
};

export default MapPage;
