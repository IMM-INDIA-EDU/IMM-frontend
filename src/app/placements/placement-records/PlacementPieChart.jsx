"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { useState, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function PlacementPieChart() {
  const [activeFinalIndex, setActiveFinalIndex] = useState(0);
  const [activeInternIndex, setActiveInternIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Data for Final Placements chart
  // Data matched to the image "Sector-wise percentage break-up of Final Placements"
  const finalPlacementsData = [
    { name: "BFSI", value: 34, color: "hsl(190, 80%, 76%)" },      // Large light blue
    { name: "Consulting", value: 14, color: "hsl(195, 40%, 70%)" }, // Slightly deeper blue
    { name: "EdTech", value: 9, color: "hsl(220, 70%, 67%)" },      // Blue-violet
    { name: "FMCG", value: 6, color: "hsl(265, 48%, 60%)" },        // Light purple
    { name: "Hospitality", value: 4, color: "hsl(32, 80%, 69%)" },  // Light brown/yellow
    { name: "Logistics", value: 10, color: "hsl(140, 42%, 57%)" },  // Muted green
    { name: "Retail", value: 2, color: "hsl(255, 38%, 54%)" },      // Faded purple
    { name: "Manufacturing", value: 9, color: "hsl(340, 48%, 65%)" },// Magenta rose
    { name: "Media", value: 2, color: "hsl(280, 28%, 46%)" },       // Muted violet
    { name: "Real Estate", value: 2, color: "hsl(42, 100%, 70%)" }, // Yellow
    { name: "Others", value: 8, color: "hsl(29, 12%, 59%)" },       // Grayish taupe
  ];

  // Data for Summer Internships chart
  // Updated according to the image "Sector-wise percentage break up of Summer Internships (2024–2026)"
  const summerInternshipsData = [
    { name: "BFSI", value: 19, color: "hsl(190, 80%, 76%)" },           // light blue
    { name: "Media", value: 19, color: "hsl(340, 48%, 65%)" },          // magenta/rose
    { name: "Others", value: 9, color: "hsl(29, 12%, 59%)" },           // taupe/gray
    { name: "FMCG", value: 11, color: "hsl(220, 70%, 67%)" },           // blue-violet
    { name: "Consulting", value: 7, color: "hsl(195, 40%, 70%)" },      // purple/blue
    { name: "Logistics", value: 8, color: "hsl(140, 42%, 57%)" },       // muted green
    { name: "Manufacturing", value: 7, color: "hsl(265, 48%, 60%)" },   // light purple
    { name: "Retail", value: 5, color: "hsl(255, 38%, 54%)" },          // faded purple
    { name: "E-Commerce", value: 7, color: "hsl(42, 100%, 70%)" },      // yellow
    { name: "Analytics", value: 5, color: "hsl(32, 80%, 69%)" },        // light brown/yellow
    { name: "EdTech", value: 3, color: "hsl(220, 50%, 75%)" },          // pale blue
  ];

  // Create chart configs for shadcn ChartContainer
  const finalPlacementsConfig = finalPlacementsData.reduce((acc, item) => {
    acc[item.name.toLowerCase().replace(/\s+/g, "_")] = {
      label: item.name,
      color: item.color,
    };
    return acc;
  }, {});

  const summerInternshipsConfig = summerInternshipsData.reduce((acc, item) => {
    acc[item.name.toLowerCase().replace(/\s+/g, "_")] = {
      label: item.name,
      color: item.color,
    };
    return acc;
  }, {});

  // Active shape renderer for interactive pie chart
  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={-7}
          textAnchor="middle"
          fill="#333"
          className="text-lg bg-white font-medium"
          style={{ backgroundColor: "white" }}
        >
          {payload.name}
        </text>
        {/* <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#333" className="text-xl font-bold">
          {`${value}%`}
        </text> */}
        <text
          x={cx}
          y={cy}
          dy={30}
          textAnchor="middle"
          fill="#666"
          className="text-sm"
        >
          {/* {`(${(percent * 100).toFixed(1)}% of total)`} */}
          {`(${value}% of total)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 5}
          outerRadius={innerRadius - 2}
          fill={fill}
        />
      </g>
    );
  };

  const handleFinalPieEnter = useCallback((_, index) => {
    setActiveFinalIndex(index);
  }, []);

  const handleInternPieEnter = useCallback((_, index) => {
    setActiveInternIndex(index);
  }, []);

  const handleFinalLegendEnter = useCallback(
    (index) => {
      setActiveFinalIndex(index);
    },
    [setActiveFinalIndex]
  );

  const handleInternLegendEnter = useCallback(
    (index) => {
      setActiveInternIndex(index);
    },
    [setActiveInternIndex]
  );

  return (
    <div className="flex flex-col w-full  mx-auto max-w-7xl pt-4 sm:py-10">
      <div className="bg-gradient-to-r from-[#9c3353] to-[#b23f63] text-white p-6 mx-4 sm:mx-0 text-center mb-6 rounded-lg shadow-md">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
          IMM CORPORATE CONNECT HUB
        </h1>
        <p className="mt-2 text-white/80">
          Sector-wise placement and internship statistics
        </p>
      </div>

      <Tabs defaultValue="charts" className="w-full">
        <div className="flex justify-center mb-4">
          <TabsList>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="data">Data Tables</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-center text-[#9c3353]">
                  Final Placements
                </CardTitle>
                <CardDescription className="text-center">
                  Sector-wise percentage breakdown [2023-2025]
                </CardDescription>
                <Separator className="my-2" />
              </CardHeader>
              <CardContent className="pt-1">
                <div className="w-full h-[350px] sm:h-[350px]">
                  <ChartContainer
                    config={finalPlacementsConfig}
                    className="w-full h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          activeIndex={activeFinalIndex}
                          activeShape={renderActiveShape}
                          data={finalPlacementsData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={isMobile ? 90 : 100}
                          outerRadius={isMobile ? 150 : 150}
                          paddingAngle={2}
                          onMouseEnter={handleFinalPieEnter}
                          isAnimationActive={true}
                        >
                          {finalPlacementsData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {finalPlacementsData.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center gap-2 text-sm"
                      onMouseEnter={() => handleFinalLegendEnter(index)}
                    >
                      <div
                        className="w-3 h-3 min-w-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="truncate">{entry.name}</span>
                      <span className="font-medium">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-center text-[#9c3353]">
                  Summer Internships
                </CardTitle>
                <CardDescription className="text-center">
                  Sector-wise percentage breakdown [2024-2026]
                </CardDescription>
                <Separator className="my-2" />
              </CardHeader>
              <CardContent className="pt-1">
                <div className="w-full h-[350px] sm:h-[350px]">
                  <ChartContainer
                    config={summerInternshipsConfig}
                    className="w-full h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          activeIndex={activeInternIndex}
                          activeShape={renderActiveShape}
                          data={summerInternshipsData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={isMobile ? 90 : 100}
                          outerRadius={isMobile ? 150 : 150}
                          paddingAngle={2}
                          onMouseEnter={handleInternPieEnter}
                          isAnimationActive={true}
                        >
                          {summerInternshipsData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {summerInternshipsData.map((entry, index) => (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center gap-2 text-sm"
                      onMouseEnter={() => handleInternLegendEnter(index)}
                    >
                      <div
                        className="w-3 h-3 min-w-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="truncate">{entry.name}</span>
                      <span className="font-medium">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#9c3353]">
                  Final Placements Data [2022-2024]
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Sector</th>
                        <th className="text-right py-2 px-4">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finalPlacementsData.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4 flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            {item.name}
                          </td>
                          <td className="text-right py-2 px-4 font-medium">
                            {item.value}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#9c3353]">
                  Summer Internships Data [2024-2026]
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Sector</th>
                        <th className="text-right py-2 px-4">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summerInternshipsData.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4 flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            {item.name}
                          </td>
                          <td className="text-right py-2 px-4 font-medium">
                            {item.value}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
