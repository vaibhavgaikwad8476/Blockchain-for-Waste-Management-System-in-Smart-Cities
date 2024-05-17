"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Link from "next/link";
import { wasteCollectionApi } from "@/app/api";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
export const WasteAnalytics = () => {
  const toast = useToast();

  const [countAnalysis, setcountAnalysis] = useState({
    totalCount: null,
    pendingCount: null,
    completedCount: null,
  });
  const [wasteTypeDistribution, setWasteTypeDistribution] = useState([]);

  const [loading, setLoading] = useState({
    isWasteCountAnalysisLoading: false,
    isWasteTypeWiseDistLoading: false,
  });

  const fetchWasteCountAnalysis = async () => {
    try {
      setLoading({ ...loading, isWasteCountAnalysisLoading: true });
      const response =
        await wasteCollectionApi.getWasteCollectionCountAnalysis();
      if (response.status === 200) {
        setcountAnalysis(response.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.message,
      });
      setLoading({ ...loading, isWasteCountAnalysisLoading: false });
    } finally {
      setLoading({ ...loading, isWasteCountAnalysisLoading: false });
    }
  };

  function getRandomColor(saturation = 70, lightness = 50) {
    // Generate a random hue from 0 to 360
    let hue = Math.floor(Math.random() * 360);
    // Return the HSL color string
    return `hsl(${hue},${saturation}%,${lightness}%)`;
  }

  const getWasteTypeWiseDistribution = async () => {
    try {
      setLoading({ ...loading, isWasteTypeWiseDistLoading: true });
      const response = await wasteCollectionApi.getWasteTypeWiseDistribution();
      if (response.status === 200) {
        const data = response.data.map((ele) => {
          return { name: ele.name, count: ele.count };
        });

        setWasteTypeDistribution(data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error.message,
      });
      setLoading({ ...loading, isWasteTypeWiseDistLoading: false });
    } finally {
      setLoading({ ...loading, isWasteTypeWiseDistLoading: false });
    }
  };

  useEffect(() => {
    fetchWasteCountAnalysis();
    getWasteTypeWiseDistribution();
  }, []);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading.isWasteCountAnalysisLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                countAnalysis?.totalCount
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading.isWasteCountAnalysisLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                countAnalysis?.pendingCount
              )}
            </div>
            <p className="text-xs text-muted-foreground"></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Requests Completed
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading.isWasteCountAnalysisLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                countAnalysis?.completedCount
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <h1 className="text-center mt-14 font-bold text-xl">
        Total Waste Completed By Type
      </h1>
      <div className="flex justify-center mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wasteTypeDistribution.map((type, index) => {
              return (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell className="font-medium">{type.count}</TableCell>
                  <TableCell className="font-medium">
                    {countAnalysis?.completedCount > 0 ? (
                      (type.count * 100) /
                      countAnalysis?.completedCount
                    ).toFixed(2) : 0}{" "}
                    %
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
