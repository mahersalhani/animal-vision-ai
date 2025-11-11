"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ImageClassifier() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    prediction: string;
    confidence: number;
    feature_map: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult(null);

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert base64 to blob for sending
      const base64Response = await fetch(selectedImage);
      const blob = await base64Response.blob();

      // Create form data
      const formData = new FormData();
      formData.append("file", blob);

      // Send to prediction API
      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get prediction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Image Classifier</CardTitle>
          <CardDescription>
            Upload an image or take a photo to classify it
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsContent value="upload" className="pt-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <label
                  htmlFor="image-upload"
                  className="w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {selectedImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={selectedImage || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Prediction Result</h3>
                <span className="text-sm text-gray-500">
                  Confidence: {(result.confidence * 100).toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center justify-center bg-white p-4 rounded-md">
                <h2 className="text-3xl font-bold capitalize text-center">
                  {result.prediction}
                </h2>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!selectedImage || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Classify Image"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
