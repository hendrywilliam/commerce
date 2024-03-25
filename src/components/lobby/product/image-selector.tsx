"use client";

import Image from "next/image";
import { useState } from "react";
import { UploadData } from "@/types";
import { Button } from "@/components/ui/button";
import ImagePlaceholder from "@/components/image-placeholder";

interface ImageSliderProps {
  images: UploadData[];
}

export default function ImageSelector({ images }: ImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="h-fit w-full">
      <div
        className="relative h-[500px] w-full overflow-hidden rounded border sm:h-[700px]"
        id="bigger-preview"
      >
        {images.length > 0 ? (
          <Image
            src={images[currentImageIndex].url}
            fill
            alt="Product Image"
            className="h-full w-full rounded object-cover transition duration-300 ease-in-out hover:scale-105"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      {images.length > 0 && (
        <div className="my-4 grid h-max w-full grid-cols-3 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <div
              key={image.name}
              className="relative h-16 rounded border sm:h-24"
            >
              <Button
                className="h-full w-full rounded"
                variant="ghost"
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={image.url}
                  fill
                  alt="Product Image"
                  className="h-full w-full rounded object-cover"
                />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
